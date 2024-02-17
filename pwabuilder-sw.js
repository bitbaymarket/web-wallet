// This is the "Offline page" service worker

importScripts('./workbox-sw.js');

const CACHE_NAME = "pwabuilder-page";
const cacheAll = true;
var urlsToCache = [
    "./index.html",
    "./mainSW.js",
    "./sw.js",
    "./pwabuilder-sw.js",
    "./pwaupdate",
    "./workbox-sw.js",
    "./assets/js/errors.js",
    "./js/jquery-3.5.1.min.js",
    "./assets/js/purify/purify.js",
    "./assets/js/purify/jpurify.js",
    "./js/moment.min.js",
    "./js/transition.js",
    "./js/collapse.js",
    "./js/bootstrap.min.js",
    "./js/bootstrap-datetimepicker.min.js",
    "./assets/js/bootstrap-dialog.js",
    "./js/aes-js.js",
    "./js/crypto-min.js",
    "./js/crypto-sha256.js",
    "./js/crypto-sha256-hmac.js",
    "./js/sha512.js",
    "./js/ripemd160.js",
    "./js/aes.js",
    "./js/qrcode.js",
    "./assets/js/html5-qrcode.min.js",
    "./js/jsbn.js",
    "./js/ellipticcurve.js",
    "./assets/js/nanobar.js",
    "./js/bip39.js",
    "./js/coin.js?v=1.135",
    "./js/coinbin.js?v=1.135",
    "./assets/js/bootstrap-select.min.js",
    "./assets/js/html5storage/HTML5.sessionStorage.js",
    "./assets/js/custom.js?v=1.14",
    "./assets/js/pnotify.custom.min.js",
    "./manifest.json",
    "./assets/images/favicon/favicon.ico",
    "./assets/images/favicon/favicon.ico",
    "./assets/images/favicon/favicon-192.png",
    "./assets/images/favicon/favicon-160.png",
    "./assets/images/favicon/favicon-96.png",
    "./assets/images/favicon/favicon-64.png",
    "./assets/images/favicon/favicon-32.png",
    "./assets/images/favicon/favicon-16.png",
    "./assets/images/favicon/favicon-57.png",
    "./assets/images/favicon/favicon-114.png",
    "./assets/images/favicon/favicon-72.png",
    "./assets/images/favicon/favicon-144.png",
    "./assets/images/favicon/favicon-60.png",
    "./assets/images/favicon/favicon-120.png",
    "./assets/images/favicon/favicon-76.png",
    "./assets/images/favicon/favicon-152.png",
    "./assets/images/favicon/favicon-180.png",
    "./assets/images/favicon/favicon-114.png",
    "./assets/images/favicon/browserconfig.xml",
    "./assets/css/themes/Cerulean/bootstrap.min.css",
    "./assets/css/icons/bootstrap-icons_v1.83.css",
    "./assets/css/bootstrap-datetimepicker.min.css",
    "./assets/css/bootstrap-dialog.css",
    "./assets/css/pnotify.custom.min.css",
    "./assets/css/animate.min.css",
    "./assets/css/style.css?v=1.13"
];

var urlsNotToCache = [
  // Urls that don't need to be cached can be added here explicitly
];

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Install Event
self.addEventListener('install', function(event) {
  console.log("[SW] install event: ",event);
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(
      function(cache) {
        console.log('[SW] Opened cache: ',cache);
        return cache.addAll(urlsToCache);
      }
    )
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Fetch Event
self.addEventListener('fetch', function(event) {
  console.log("[SW] fetch event: ",event);
  event.respondWith(
    caches.match(event.request).then(
      function(response) {
        // Cache hit - return response
        if (response) return response;
        // What cache strategy should be used? => cacheAll (boolean flag)
        else if (!cacheAll || urlsNotToCache.indexOf(event.request) !== -1) return fetch(event.request);
        else {
          fetch(event.request).then(
            // Try to cache new requests directly 
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') return response;
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
              caches.open(CACHE_NAME).then(
                function(cache) {
                  cache.put(event.request, responseToCache);
                }
              );
              return response;
            }
          );
        }
      }
    )
  );
});
});
