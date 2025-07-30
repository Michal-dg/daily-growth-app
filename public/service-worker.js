const CACHE_NAME = 'daily-growth-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html'
    // Możesz tu dodać ścieżki do plików CSS i innych JS, jeśli kiedyś je oddzielisz
];

// 1. Instalacja Service Workera i zapisanie plików w cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// 2. Przechwytywanie zapytań i serwowanie z cache'u
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jeśli plik jest w cache, zwróć go. W przeciwnym razie, pobierz z sieci.
                return response || fetch(event.request);
            })
    );
});