// public/service-worker.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  const { request } = event;
  // para requisições de navegação (index.html), tenta sempre a rede primeiro
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          // opcional: atualize o cache do HTML
          const copy = res.clone();
          caches.open('html-cache').then(cache => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  // para outros assets, deixa o cache normal via Vite fingerprint
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
