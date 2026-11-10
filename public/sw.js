const CACHE = 'sudo-survey-v1';

self.addEventListener('install', (event) => {
  const precache = async () => {
    for (const url of ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']) {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (res && (res.ok || res.type === 'opaque')) await caches.put(url, res);
      } catch { /* one failure must not break install */ }
    }
  };
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith('sudo-survey-') && k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => Response.error()));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put('/', res.clone()));
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/')) {
    // Network-first: keeps Next.js dev/HMR from getting stuck on stale assets.
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // Cache-first for stable assets (icons, manifest, etc.).
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(request, res.clone()));
            return res;
          })
      )
    );
    return;
  }

  // Cross-origin: network only.
  event.respondWith(fetch(request).catch(() => Response.error()));
});
