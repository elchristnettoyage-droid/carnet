/* Carnet — service worker.
   Stratégie « réseau d'abord » : toujours la dernière version quand tu es en
   ligne (plus de page figée en cache), et une copie de secours pour l'usage
   hors-ligne. */
var CACHE = 'carnet-cache-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(function (res) {
      try {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      } catch (_) {}
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match('index.html'); });
    })
  );
});
