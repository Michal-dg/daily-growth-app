// Zmieniaj tę nazwę przy każdej aktualizacji kodu aplikacji, np. na 'v5.0'
const CACHE_NAME = 'daily-growth-v4.3'; 

const urlsToCache = [
  '/',
  '/index.html'
];

// Instalacja i natychmiastowa aktywacja
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); 
});

// Aktywacja i czyszczenie starych wersji pamięci podręcznej
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategia "Stale-While-Revalidate"
self.addEventListener('fetch', event => {
  // Ignoruj zapytania, które nie są typu GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Sprawdź, czy odpowiedź jest już w cache
      const cachedResponse = await cache.match(event.request);
      
      // 2. W tle zaktualizuj cache
      const fetchedResponsePromise = fetch(event.request).then(networkResponse => {
        // Jeśli pobranie z sieci się udało, zaktualizuj cache
        if (networkResponse) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => {
        // W razie błędu sieciowego, nic nie rób (pozostaw stary cache)
        console.warn('Fetch failed; returning cached response instead.', err);
      });

      // 3. Zwróć odpowiedź: z cache'u (jeśli jest) lub poczekaj na odpowiedź z sieci
      return cachedResponse || fetchedResponsePromise;
    })
  );
});