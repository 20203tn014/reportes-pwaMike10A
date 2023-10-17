console.log("SERVICEWORKER");
const STATIC = "staticv1";
const STATIC_LIMIT = 15;
const INMUTABLE = "inmutableV1";
const DYNAMIC = "dynamicv1";
const DYNAMIC_LIMIT = 30;

// Todos aquellos recursos propios de la aplicación
const APP_SHELL = [
  "/",
  "index.html",
  "css/styles.css",
  "img/car1.jpg",
  "js/app.js",
  "pages/offline.html",
  "pages/page2.html",
];

// Todos aquellos recursos que nunca cambian
const APP_SHELL_INMUTABLE = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
];

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
  //   const source = cache.match(e.request).then((res) => {
  //         if (res) return res;
  //         return fetch(e.request).then(resFetch => {
  //             caches.open(DYNAMIC).then((cache) =>{
  //                 cache.put(e.request, resFetch);
  //             });
  //             return resFetch.clone();
  //         });
  //     });
  //     e.respondWith(source);

  // 3) Network with cache fallback
  // Siempre actualizada cuando hay internet
  const source = fetch(e.request)
    .then((res) => {
      if (!res) throw Error("Not found");
      caches.open(DYNAMIC).then((cache) => {
        cache.put(e.request, res.clone());
      });
      return res.clone();
    })
    .catch(() => {
      let regex = /\/pages/g;
      if (regex.test(e.request.url)) {
        return caches.match("/pages/offline.html");
      } else {
        return caches.match(e.request);
      }
    });
  e.respondWith(source);

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
  // if (e.request.url.includes('bootstrap'))
  //     return e.respondWith(caches.match(e.request));
  // const source = caches.open(STATIC).then(cache => {
  //     fetch(e.request).then(res => {
  //         cache.put(e.request, res);
  //     })
  //     return cache.match(e.request);
  // });
  // e.respondWith(source);

  // 5) Cache and network race
  //   const source = new Promise((resolve, reject) => {
  //     let rejected = false;
  //     const failsOnce = () => {
  //       if (e.request.url.includes("pages/page2.html")) {
  //         e.respondWith(fetch("pages/offline.html"));
  //       } else e.respondWith(fetch(e.request));
  //     };
  //     fetch(e.request)
  //       .then((res) => {
  //         res.ok ? resolve(res) : failsOnce();
  //       })
  //       .catch(failsOnce());
  //     caches
  //       .match(e.request.url)
  //       .then((cacheRes) => {
  //         cacheRes.ok ? resolve(cacheRes) : failsOnce();
  //       })
  //       .catch(failsOnce);
  //     e.respondWith(source);
  //   });
});

/*self.addEventListener("push", (e)=>{
    console.log("Notificación Push");
});*/

/*self.addEventListener("sync", (e)=>{
    console.log("Sync event");
});*/
