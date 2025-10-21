/* sw.js */

const CACHE_NAME = 'nexuscreative-v1';
// Fișierele statice de bază care trebuie puse în cache
const urlsToCache = [
    '/',
    '/index.html',
    '/css/global.css',
    '/css/home.css',
    '/css/about.css',
    '/css/services.css',
    '/css/portfolio.css',
    '/css/reviews.css',
    '/css/contact.css',
    '/js/script.js',
    '/js/home.js',
    '/js/services.js',
    '/js/portfolio.js',
    '/js/contact.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' // Cache și CDN
];

// Evenimentul 'install': Se deschide cache-ul și se adaugă fișierele
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evenimentul 'fetch': Interceptează cererile de rețea
self.addEventListener('fetch', event => {
    event.respondWith(
        // Încearcă să găsească resursa în cache
        caches.match(event.request)
            .then(response => {
                // Dacă o găsește, o returnează din cache
                if (response) {
                    return response;
                }
                
                // Dacă nu, încearcă să o ia din rețea
                return fetch(event.request);
            })
    );
});
