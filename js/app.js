console.log("APPJS");
const url = window.location.href;
const API = "http://localhost:3000/api";
let swLocation = "/reportes/sw.js";
if (navigator.serviceWorker) {
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
        swLocation = "/sw.js";
    }
    window.addEventListener("load", () => {
        // navigator.serviceWorker.register('sw.js');
        navigator.serviceWorker.register(swLocation).then((reg)=>{
            //code
        })
    });
    // navigator.serviceWorker.register(swLocation);
}