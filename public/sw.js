const CACHE_NAME = 'plot-amiga-v2';

// Install event - cache local assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app assets');
        // Only cache local files (not CDN)
        const urls = [
          '/',
          '/index.html',
          '/stylesheets/style.css',
          '/libraries/mappa.js',
          '/libraries/utmconv.js',
          '/javascripts/sketch.js',
          '/javascripts/tank.js',
          '/javascripts/umd.js',
          '/sw.js'
        ];
        
        return Promise.allSettled(
          urls.map(url => 
            fetch(url, { mode: 'cors' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(() => {})
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (like Mapbox tiles)
  if (!event.request.url.startsWith(self.location.origin)) {
    // Let Mapbox tiles pass through (browser cache handles them)
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Return empty response for failed resource requests
            return new Response('', { status: 503, statusText: 'Offline' });
          });
      })
  );
});
