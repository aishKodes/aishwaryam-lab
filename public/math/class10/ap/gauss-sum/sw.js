/* This worker controls only the Gauss lesson; no student or API data is cached. */
const CACHE = "gauss-classroom-v1";
const ROOT = "/math/class10/ap/gauss-sum";
const isLesson = path => path === ROOT || path === ROOT + "/" || path === ROOT + "/print";
const isAsset = path => path.startsWith("/_next/static/");

self.addEventListener("install", event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("gauss-classroom-") && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener("message", event => {
  if (event.data?.type !== "SAVE_LESSON") return;
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      const urls = [...new Set(event.data.urls)].filter(value => {
        const url = new URL(value, self.location.origin);
        return url.origin === self.location.origin && !url.search && (isLesson(url.pathname) || isAsset(url.pathname));
      });
      for (const url of urls) {
        const response = await fetch(url, { cache: "reload" });
        if (!response.ok) throw new Error("Download failed");
        await cache.put(url, response);
      }
      event.ports[0]?.postMessage({ ok: true });
    } catch { event.ports[0]?.postMessage({ ok: false }); }
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.search || (!isLesson(url.pathname) && !isAsset(url.pathname))) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isAsset(url.pathname)) {
      const saved = await cache.match(request);
      if (saved) return saved;
    }
    try {
      const response = await fetch(request);
      if (response.ok && (isAsset(url.pathname) || request.mode === "navigate")) await cache.put(request, response.clone());
      return response;
    } catch {
      const saved = await cache.match(request) || (request.mode === "navigate" && isLesson(url.pathname) ? await cache.match(url.origin + (url.pathname.endsWith("/print") ? ROOT + "/print" : ROOT)) : undefined);
      return saved || new Response("This lesson has not been saved offline. Reconnect, open the lesson and use Save lesson offline in Teacher Notes.", { status: 503, headers: { "Content-Type": "text/plain" } });
    }
  })());
});
