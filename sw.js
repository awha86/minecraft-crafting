// App-filer caches ved installation; billeder fra wikien caches første gang de vises
const V = 'crafting-v1';
const SHELL = ['./', 'index.html', 'data.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.endsWith('minecraft.wiki') && url.pathname.includes('Special:FilePath')) {
    e.respondWith(caches.open('wiki-img').then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok || res.type === 'opaque') c.put(e.request, res.clone());
      return res;
    }));
  } else if (url.origin === location.origin) {
    // netværk først, så opdateringer slår igennem; cache når offline
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(V).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request)));
  }
});
