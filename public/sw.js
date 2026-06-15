// Service worker del panel IMPERIUM Admin (PWA).
// Estrategia NETWORK-FIRST: siempre intenta la red primero (datos frescos de
// Supabase), y solo usa la copia en caché si el dispositivo está sin conexión.
// Así la app instalable nunca muestra contenido viejo cuando hay internet.
// No intercepta otros orígenes (p. ej. Supabase API) ni peticiones que no sean GET.

const CACHE = "imperium-admin-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Limpia versiones de caché antiguas.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Solo GET del mismo origen (ignora POST/Server Actions y APIs externas como Supabase).
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(req);
        // Guarda una copia para usarla offline (solo respuestas propias correctas).
        if (fresh && fresh.status === 200 && fresh.type === "basic") {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        // Sin conexión: intenta servir lo último que se vio.
        const cached = await caches.match(req);
        if (cached) return cached;
        throw new Error("offline");
      }
    })()
  );
});
