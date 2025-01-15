self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                ".",
                "./shipping.html",
                "./css/style.css",
                "./css/mobile.css",
                "./css/shipping.css",
                "./js/shipping.js",
                "./js/script.js",
                "./js/scroll.js",
                "./img/logo.png"
            ]);
        }
    ))
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response =>{
            return response || fetch(e.request);
        })
    )
});