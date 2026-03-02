const CACHE_NAME = 'rota-cache-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'rota.csv',
  'manifest.json'
];

// Install Service Worker and Cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serve Cached Content when Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});