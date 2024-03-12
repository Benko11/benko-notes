"use strict";
self.addEventListener("install", function (e) {
    // @ts-ignore
    self.skipWaiting();
});
self.addEventListener("activate", function (e) {
    // @ts-ignore
    return self.clients.claim();
});
self.addEventListener("fetch", function (e) { });
