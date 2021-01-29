const timeout = 4000;
// Name our cache
const CACHE_NAME = 'fusion-pwa-cache';
const version = 'v1::';

const precacheConfig = [
  ['./manifest.json'],
  ['./icon.png'],
  ['/siteicon.ico'],
  ['/spinner.svg']
];

// Delete old caches that are not our current one!
self.addEventListener('activate', (event) => {
  /* Just like with the install event, event.waitUntil blocks activate on a promise.
     Activation will fail unless the promise is fulfilled.
  */
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
      /* This method returns a promise which will resolve to an array of available
         cache keys.
      */
      .keys()
      .then((keys) => {
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keys
            .filter((key) => {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(version);
            })
            .map((key) => {
              /* Return a promise that's fulfilled
                 when each outdated cache is deleted.
              */
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('WORKER: activate completed.');
      })
  );
});

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', (event) => {
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    /* The caches built-in is a promise-based API that helps you cache responses,
       as well as finding and deleting them.
    */
    caches
      /* You can open a cache by name, and this method returns a promise. We use
         a versioned cache name here so that we can remove old cache entries in
         one fell swoop later, when phasing out an older service worker.
      */
      .open(version + CACHE_NAME)
      .then((cache) => {
        /* After the cache is opened, we can fill it with the offline fundamentals.
           The method below will add all resources we've indicated to the cache,
           after making HTTP requests for each of them.
        */
        return cache.addAll([...precacheConfig]);
      })
      .then(() => {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fromNetwork(event.request, timeout).catch((err) => {
      console.log(`Error: ${err} network`);
      return fromCache(event.request);
    })
  );
});

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
  return new Promise((fulfill, reject) => {
    if (/^chrome-extension/.test(request.url)) {
      fetch(request).then(fulfill, reject);
      return;
    }
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      const clone = response.clone();
      caches.open(version + CACHE_NAME).then((cache) => {
        if (request.method !== 'GET') {
          return;
        }
        cache.put(request, clone);
      });
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  if (request.method !== 'POST') {
    return caches
      .open(version + CACHE_NAME)
      .then((cache) => cache
        .match(request)
        .then((matching) => matching || Promise.reject(new Error('no-match'))));
  }
  return null;
}

self.addEventListener('beforeinstallprompt', (e) => {
  let deferredPrompt;
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  });
});
