# Plan 004: Unificar frescura de service worker y localStorage

> Primero: `git status --short -- public/sw.js public/javascripts/sketch.js public/index.html test`; STOP ante cambios locales no identificados. Drift check: `git diff --stat 838d84b..HEAD -- public/sw.js public/javascripts/sketch.js public/index.html test`; validar cambios esperados de 001/003.

## Estado

- **Estado**: COMPLETADO
- **Prioridad**: P1
- **Esfuerzo**: M
- **Riesgo**: MEDIO
- **Depende de**: 001, 003
- **Categoría**: bug / arquitectura
- **Planificado en**: `838d84b`, 2026-07-23
- **Implementado en**: `65fa721`, 2026-07-23

## Por qué

El service worker aplica cache-first a todo GET same-origin (`sw.js:64-84`). Una
vez cacheados, `data.csv` y `lastUpdate.txt` no vuelven a red; incluso el refresh
de localStorage recibe la copia vieja. `navigator.onLine` tampoco prueba que el
servidor sea alcanzable, y el preload online no cae al cache local.

## Alcance

**Modificar**: `public/sw.js`, capa de carga en `sketch.js`, registro SW en
`index.html`, tests de service worker/carga.

**No modificar**: cache de tiles cross-origin, downloader backend, motor del mapa
o UI general.

## Pasos

### 1. Definir política por clase de recurso

- Shell versionado: cache-first (`index.html` preferentemente network-first para
  evitar HTML viejo que referencia assets nuevos).
- `csv/data.csv`, `csv/lastUpdate.txt`, `csv/snapshot.json`: network-only en el
  service worker; el loader guarda en localStorage únicamente el snapshot completo
  después de validar manifest y hash.
- `/api/mapbox-key`: network-only con `cache: 'no-store'`; nunca Cache Storage.
- Otros `/api/*`: network-only salvo política futura específica y testeada.
- Navegación: network-first y fallback a shell.
- Mapbox/tiles cross-origin: dejar al proveedor/browser; no cachear sin revisar
  términos y CORS.

```javascript
const DYNAMIC_PATHS = new Set([
  '/csv/data.csv',
  '/csv/lastUpdate.txt',
  '/csv/snapshot.json'
]);

async function networkOnly(request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}
```

Mantener solo el cache del shell; el activate no debe borrar caches ajenos a esta
app por un filtro demasiado amplio.

El loader debe leer `snapshot.json`, luego CSV, luego el manifest otra vez. Solo
aceptar/persistir si ambas versiones son idénticas y SHA-256 del CSV coincide; si
cambió durante lectura, reintentar una vez. Así no se combina CSV viejo con fecha
nueva durante una publicación concurrente.

**Verificar**: tests muestran que dos requests online al CSV llegan a red, ningún
recurso dinámico entra en Cache Storage y offline obtiene de localStorage el
último snapshot completo validado.

### 2. Crear un único loader de snapshot

No descargar el CSV una vez con p5 y otra con `fetch`. Obtener texto una vez,
validarlo suficientemente para cache local, persistirlo y parsearlo para la app.
Si la red falla, probar localStorage independientemente de `navigator.onLine`.

```javascript
async function loadSnapshot() {
  try {
    const fresh = await fetchSnapshot();
    saveSnapshot(fresh);
    return { ...fresh, source: 'network' };
  } catch (networkError) {
    const cached = readSnapshot();
    if (cached) return { ...cached, source: 'cache' };
    throw networkError;
  }
}
```

Como p5 `preload()` no espera promesas arbitrarias de forma simple, cargar datos
antes de crear entidades en `setup` o crear un estado loading/error y continuar
al resolver. Para minimizar alcance, envolver `loadTable` sobre un Blob URL en
una Promise y revocarlo en éxito/error:

```javascript
function parseP5Table(csvText) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([csvText], { type: 'text/csv' }));
    loadTable(url, 'csv', 'header',
      (parsed) => { URL.revokeObjectURL(url); resolve(parsed); },
      (error) => { URL.revokeObjectURL(url); reject(error); });
  });
}
```

No mezclar callbacks p5 con una segunda descarga silenciosa. Plan 007 puede
reemplazar después esta frontera por parser/modelo puro.

**Verificar**: casos red OK, `navigator.onLine=true` con red caída, offline con
cache y offline sin cache.

### 3. Versionar y comunicar frescura

Guardar CSV y timestamp en un solo objeto localStorage versionado; no persistir
el token Mapbox como parte del snapshot. Mostrar "datos locales" cuando el origen
sea cache, aunque `navigator.onLine` sea true.

```javascript
localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({
  schemaVersion: 1,
  csv,
  updatedAt
}));
```

Escuchar `online` para intentar refresh, no para asumir éxito. Incrementar caches
solo cuando cambien assets/política.

**Verificar**: un snapshot de versión desconocida se ignora con error controlado;
la UI distingue network/cache.

## Criterios de terminado

- [x] `node --check public/sw.js` y `node --check public/javascripts/sketch.js` terminan en 0. No hay `npm run check` configurado.
- [x] CSV y timestamp nunca usan cache-first.
- [x] No hay descarga doble del CSV en cold load.
- [x] Red caída con `navigator.onLine=true` usa el último snapshot válido.
- [x] Offline sin snapshot falla antes de mostrar una fecha inválida.
- [x] El service worker no intenta cachear tiles Mapbox.

## STOP

- Si la firma real de `loadTable` 1.9 no permite el wrapper anterior, marcar 004
  `BLOCKED` y reportar la necesidad de elegir un parser RFC 4180 apto para browser;
  no inventar parsing con `split(',')`, agregar otra descarga ni dejar Blob URLs
  sin revocación.
- Si una política requiere almacenar respuestas de `/api/mapbox-key`, detenerse:
  el token público debe recuperarse de red o configuración del bundle, no quedar
  congelado por el SW.

## Mantenimiento

Actualizar la versión del shell cuando cambie la lista de assets. Las pruebas
deben cubrir actualización, no solo el primer funcionamiento offline.
