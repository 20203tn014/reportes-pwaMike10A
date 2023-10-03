console.log("SERVICEWORKER");
const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutableV1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;

// Todos aquellos recursos propios de la aplicación
const APP_SHELL = [
    '/',
    'index.html',
    'css/styles.css',
    'img/car1.jpg',
    'js/app.js',
];

// Todos aquellos recursos que nunca cambian
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
]

self.addEventListener("install", (e) => {
    //e.skipWaiting();
    const staticCache = caches.open(STATIC).then((cache) => {
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache) => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
    console.log("Instalado");
});

self.addEventListener("activate", (e) => {
    console.log("Activado");
});

self.addEventListener("fetch", (e) => {
    // 1) Cache Only
    //e.respondWith(caches.match(e.request));


    // 2) Cache with network fallback (si no hay caché, se va a la internet)
    /*const source = cache.match(e.request).then((res) => {
        if (res) return res;
        return fetch(e.request).then(resFetch => {
            caches.open(DYNAMIC).then((cache) =>{
                cache.put(e.request, resFetch);
            });
            return resFetch.clone();
        });
    });
    e.respondWith(source);*/


    // 3) Network with cache fallback
    /*const source = fetch(e.request)
    .then(res=>{
        if(!res) throw Error('NotFound');
        // Checar si el recurso ya existe en algún cache
        caches.open(DYNAMIC).then(cache=>{
            cache.put(e.request, res);
        });
        return res.clone();
    })
    .catch((err)=>{
        return caches.match(e.request);
    });
    e.respondWith(source);*/


    // 4) Cache with network update
    // Rendimiento crítico, si el rendimiento es bajo utilizar esta estrategia
    // Desventaja: Toda nuestra aplicación está un paso atrás
    if (e.request.url.includes('bootstrap'))
        return e.respondWith(caches.match(e.request));
    const source = caches.open(STATIC).then(cache => {
        fetch(e.request).then(res => {
            cache.put(e.request, res);
        })
        return cache.match(e.request);
    });
    e.respondWith(source);

    
    // console.log(e.request);
    // if (e.request.url.includes("car1.jpg")) {
    //     e.respondWith(fetch("img/car2.jpg"));
    // }
    // else e.respondWith(fetch(e.request));
});

/*self.addEventListener("push", (e)=>{
    console.log("Notificación Push");
});*/

/*self.addEventListener("sync", (e)=>{
    console.log("Sync event");
});*/
