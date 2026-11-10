const CACHE = 'sudo-survey-v1';

function fetchAndCache(request, cacheKey = request) {
  return fetch(request).then((response) => {
    // Clone before returning the original response to the page. The page may
    // start consuming its body immediately after respondWith resolves.
    const cacheWrite = response.ok
      ? caches.open(CACHE).then((cache) => cache.put(cacheKey, response.clone()))
      : Promise.resolve();

    return { response, cacheWrite };
  });
}

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
    const result = fetchAndCache(request, '/');
    event.respondWith(
      result
        .then(({ response }) => response)
        .catch(async () => (await caches.match('/')) ?? Response.error())
    );
    event.waitUntil(result.then(({ cacheWrite }) => cacheWrite).catch(() => undefined));
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/')) {
    // Network-first: keeps Next.js dev/HMR from getting stuck on stale assets.
    const result = fetchAndCache(request);
    event.respondWith(
      result
        .then(({ response }) => response)
        .catch(async () => (await caches.match(request)) ?? Response.error())
    );
    event.waitUntil(result.then(({ cacheWrite }) => cacheWrite).catch(() => undefined));
    return;
  }

  if (url.origin === self.location.origin) {
    // Cache-first for stable assets (icons, manifest, etc.).
    const result = caches.match(request).then((cached) =>
      cached
        ? { response: cached, cacheWrite: Promise.resolve() }
        : fetchAndCache(request)
    );
    event.respondWith(result.then(({ response }) => response).catch(() => Response.error()));
    event.waitUntil(result.then(({ cacheWrite }) => cacheWrite).catch(() => undefined));
    return;
  }

  // Cross-origin: network only.
  event.respondWith(fetch(request).catch(() => Response.error()));
});
