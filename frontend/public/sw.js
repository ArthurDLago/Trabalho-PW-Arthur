// Service worker: guarda o "casco" do app para abrir offline e instalar como PWA.
// Chamadas à API nunca passam pelo cache (dados sempre atualizados).
const CACHE = 'oficina-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/index.html', '/manifest.json'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navegação: tenta a rede, cai para o index em cache se estiver offline (SPA).
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }
  // Demais arquivos estáticos: cache primeiro, atualizando em segundo plano.
  e.respondWith(
    caches.match(req).then((hit) => {
      const rede = fetch(req).then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia));
        return res;
      });
      return hit || rede;
    })
  );
});
