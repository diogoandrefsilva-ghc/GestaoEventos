/* GestaoEventos service worker — app-shell cache; dados (GitHub) sempre da rede */
const CACHE = 'ge-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Nunca cachear dados nem chamadas à API do GitHub
  if (u.hostname.includes('github')) return;
  if (u.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
      }).catch(() => caches.match('./index.html')))
    );
  } else {
    // CDNs (Chart.js, Google Fonts): stale-while-revalidate
    e.respondWith(
      caches.match(e.request).then(r => {
        const f = fetch(e.request).then(resp => {
          const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
        }).catch(() => r);
        return r || f;
      })
    );
  }
});
