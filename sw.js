// Version 3: alt ligger på siden selv. Netværk først (uden browser-cache), cache når offline.
const V = 'crafting-v8';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  const isTex = url.pathname.includes('/tex/');
  e.respondWith(caches.open(V).then(async c => {
    if (isTex) { const hit = await c.match(e.request); if (hit) return hit; }
    try {
      const res = await fetch(e.request, isTex ? undefined : { cache: 'no-cache' });
      if (res.ok) c.put(e.request, res.clone());
      return res;
    } catch { return (await c.match(e.request)) || Response.error(); }
  }));
});
