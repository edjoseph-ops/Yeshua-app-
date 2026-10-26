// Service worker : Yeshua fonctionne sans Internet.
// - "yeshua-shell-*" : l'application elle-même (renouvelé à chaque version)
// - "yeshua-bibles"  : les textes bibliques (conservé d'une version à l'autre, rempli par l'application)
const SHELL_CACHE = "yeshua-shell-v10", BIBLE_CACHE = "yeshua-bibles";
const SHELL = ["./", "index.html", "styles.css", "app.js", "config.js", "manifest.webmanifest",
  "data/books.js", "data/versions.js", "data/teachings.js", "data/booksinfo.js", "data/meditation.js",
  "voice.js", "music.js", "meditation.js", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(Promise.all([
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)),
    caches.open(BIBLE_CACHE).then((c) => c.add("data/bibles/index.json").catch(() => {}))
  ]).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== SHELL_CACHE && k !== BIBLE_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const path = url.pathname;
  // Liste des versions : on répond vite avec le cache et on rafraîchit en arrière-plan
  if (path.endsWith("/data/bibles/index.json")) {
    e.respondWith(caches.open(BIBLE_CACHE).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response("", { status: 503 });
    }));
    return;
  }
  // Textes bibliques : cache d'abord (jamais retéléchargés), sinon réseau puis mémorisation
  if (path.indexOf("/data/bibles/") >= 0) {
    e.respondWith(caches.open(BIBLE_CACHE).then(async (c) => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r;
    }));
    return;
  }
  // Pages : l'application d'abord, repli sur index.html hors ligne
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html", { ignoreSearch: true }).then((hit) => hit || fetch(req)).catch(() => caches.match("index.html")));
    return;
  }
  // Le reste de l'application : cache d'abord
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const cp = r.clone(); caches.open(SHELL_CACHE).then((c) => c.put(req, cp)); } return r; })));
});
