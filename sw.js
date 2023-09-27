console.log("SERVICEWORKER");

self.addEventListener("install", (e)=>{
    console.log("Instalado");
});

self.addEventListener("activate", (e)=>{
    console.log("Activado");
});

self.addEventListener("fetch", (e)=>{
    console.log(e.request);
    if (e.request.url.includes("car1.jpg")) {
        e.respondWith(fetch("img/car2.jpg"));
    }
    else e.respondWith(fetch(e.request));
});

self.addEventListener("push", (e)=>{
    console.log("Notificación Push");
});

self.addEventListener("sync", (e)=>{
    console.log("Sync event");
});
