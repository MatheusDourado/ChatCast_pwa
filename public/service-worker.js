const CACHE_NAME = 'chatcast-cache-v1';  // Uma versão para o cache.
const urlsToCache = [  // Lista de arquivos que deseja armazenar em cache.
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    // ... outros recursos estáticos
];

// Evento 'install': Cacheia os recursos estáticos durante a instalação do service worker.
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Evento 'fetch': Serve os recursos do cache ou da rede.
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {  // Se o recurso estiver no cache, sirva-o.
                return response;
            }
            // Caso contrário, pegue da rede.
            return fetch(event.request).then(
                function(response) {
                    // Se a resposta não for válida, retorne.
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Caso contrário, coloque a resposta no cache para uso posterior.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }
            );
        })
    );
});

// Evento 'activate': Limpa caches antigos após a atualização do service worker.
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];  // Mantenha a versão atual do cache.

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);  // Delete caches antigos.
                    }
                })
            );
        })
    );
});
