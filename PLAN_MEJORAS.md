# Plan de Mejoras - plot_AMIGA

## 1. Stack Tecnológico

### Frontend - Librerías

| Componente | Estado | Alternativas |
|------------|--------|--------------|
| p5.js | ✅ Actualizado a 1.9.0 | - |
| Mapbox GL | ⏳ Pendiente (v8 deprecated) | Requiere API key nueva |
| mappa.js | ⏳ Pending evaluation | Mapbox GL directo o Leaflet |
| dat.gui | ✅ Reemplazado por lil-gui | - |
| quicksettings | ⏳ Evaluar uso | Eliminar si no se usa |

### Backend

| Componente | Estado |
|------------|--------|
| Express | ✅ Actualizado a 4.21.0 |
| node-fetch | ✅ Reemplazado por fetch nativo |
| dotenv | ✅ OK |
| cors | ✅ OK |

---

## 2. Arquitectura y Código

### Estructura de archivos

**Problema**: `sketch.js` tiene 1035 líneas - difícil de mantener

**Opciones**:
```
Opción A: Modularizar por funcionalidad
├── js/
│   ├── sketch.js        (solo setup/draw)
│   ├── map/
│   │   ├── mapConfig.js
│   │   └── mapStyles.js
│   ├── entities/
│   │   ├── Tank.js
│   │   └── UMD.js
│   ├── data/
│   │   └── dataLoader.js
│   ├── ui/
│   │   └── gui.js
│   └── utils/
│       ├── utm.js
│       └── date.js

Opción B: TypeScript progresivo
- Agregar JSDoc primero
- Migrar archivos uno por uno a .ts
- Beneficio: tipado estático sin reescribir todo
```

### TypeScript

| Opción | Pros | Contras |
|--------|------|---------|
| Migración completa | Tipado completo, mejor DX | Mucho trabajo inicial |
| Solo JSDoc | Rápido, mantiene JS | Menos potente |
| Mantener JS con ESLint | Rápido, solo linting | Sin tipos |

**Recomendación**: JSDoc + ESLint como primer paso

---

## 3. Funcionalidades

### Mejoras existentes

| Funcionalidad | Estado |
|---------------|--------|
| Fix resize canvas | ❌ Pendiente |
| Fix múltiples instancias map | ✅ Completado |
| Zoom suave (polling) | ✅ Completado |
| Animación scale en UMDs | ✅ Completado |
| Panel de búsqueda HTML | ✅ Completado |
| Panel de seleccionados HTML | ✅ Completado |
| Hit detection adaptativo | ✅ Completado |
| UI HTML overlays | ✅ Completado |

### Nuevas funcionalidades

| Funcionalidad | Prioridad |
|---------------|----------|
| Modo offline/PWA | Media |
| Selector de fecha | Baja |
| Exportar a PDF | Baja |
| Móvil responsive | Alta |
| Panel de búsqueda | ✅ Completado |
| Panel de búsqueda | Buscar SD por nombre/ID | Media |
| Historial de cambios | Trackear cambios en el tiempo | Baja |

---

## 4. UI/UX

### Diseño visual

| Área | Problema | Solución |
|------|----------|----------|
| GUI | dat.gui antique | lil-gui con custom styling |
| Leyenda | Fija en esquina | Arrastrable, recolorable |
| Popup info | Básica | Más datos, mejor formato |
| Colores | Paleta hardcodeada | CSS variables, tema |

### Accesibilidad

- Alto contraste
- Keyboard navigation
- Screen reader support (baja prioridad)

---

## 5. Performance

| Área | Problema | Solución |
|------|----------|----------|
| Redibujado | redraw constante | Optimizar, solo redraw en cambios |
| Datos | CSV grande | Cargar solo visible, paginación |
| Map tiles | Many requests | Cacheo agresivo |
| Memory | data array crece | Limitar historial |

---

## 6. DevOps / Developer Experience

### build/dev

- **Ahora**: `node app.js` + browser refresh
- **Opciones**:
  - Vite (frontend only, HMR)
  - Webpack/parcel
  - Mantener simple (Express + static)

### Testing

| Nivel | Herramienta | Cobertura objetivo |
|-------|-------------|-------------------|
| Unit | Jest / Vitest | Utilidades, parsing |
| E2E | Playwright / Cypress | Flujos críticos |
| Visual | Chromatic | Regresiones UI |

### CI/CD

- GitHub Actions para lint + test + build
- Deploy automático a producción

---

## 7. Prioridades Sugeridas

### Fase 1 - Estabilidad (alta)
1. Fix bugs conocidos (resize, satellite)
2. Actualizar dependencias peligrosas (Mapbox v8 → v3)
3. Agregar ESLint

### Fase 2 - Mantenibilidad (media)
1. JSDoc en funciones principales
2. Modularizar sketch.js
3. GUI moderna (lil-gui)

### Fase 3 - Features (baja)
1. Modo offline/PWA
2. Búsqueda
3. Responsive mobile

---

## Preguntas para vos

1. ¿Tenés presupuesto para API key de Mapbox nueva?
2. ¿Querés mantener Node 16 o actualizar a 20+?
3. ¿Cuánto tiempo/dedicación estimás para este update?
4. ¿Hay otra persona trabajando en el código?

---

*Documento vivo - actualizar según decisiones*
