const CACHE_NAME = "version-1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/settings.html",
  "/friends.html",
  "/css/master.css",
  "/css/all.min.css",
  "/css/framework.css",
  "/css/normalize.css",
];

// Task 3: Implement Static Caching on Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});

// Task 4: Clean Up Old Caches on Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// Task 5: Intercept Network Requests for Offline Fallback

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request);
      })
  );
});