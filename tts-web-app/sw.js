const CACHE_NAME = 'voxwave-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Do not intercept or cache external API calls
    if (event.request.url.includes('api.streamelements.com') || event.request.url.includes('translate.google.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Otherwise, fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Cache dynamic font files (woff2) from Google Fonts
                if (event.request.url.includes('fonts.gstatic.com')) {
                    const clonedResponse = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If network fails and it's not cached, there's not much we can do
                // But the app shell is cached, so the app will still load.
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});
