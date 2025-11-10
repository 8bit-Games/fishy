// Fishy Service Worker - PWA Offline Support
// Version: 1.0.0

const CACHE_VERSION = 'fishy-v1.0.0';
const RUNTIME_CACHE = 'fishy-runtime-v1.0.0';
const ASSET_CACHE = 'fishy-assets-v1.0.0';

// Core files to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/fishy.js',
  '/fishy_bg.wasm',
];

// Asset patterns to cache on first access
const CACHE_PATTERNS = {
  assets: /^\/assets\//,
  images: /\.(png|jpg|jpeg|gif|webp|svg)$/,
  audio: /\.(ogg|mp3|wav)$/,
  fonts: /\.(woff|woff2|ttf|otf)$/,
};

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Fishy SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[Fishy SW] Caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Fishy SW] Core assets cached');
        // Activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Fishy SW] Failed to cache core assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Fishy SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old cache versions
              return cacheName.startsWith('fishy-') &&
                     cacheName !== CACHE_VERSION &&
                     cacheName !== RUNTIME_CACHE &&
                     cacheName !== ASSET_CACHE;
            })
            .map((cacheName) => {
              console.log('[Fishy SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Fishy SW] Service worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    handleFetch(request)
  );
});

async function handleFetch(request) {
  const url = new URL(request.url);

  // Strategy 1: Network-first for HTML (to get updates)
  if (request.headers.get('accept').includes('text/html')) {
    return networkFirst(request);
  }

  // Strategy 2: Cache-first for WASM and JS (critical resources)
  if (url.pathname.endsWith('.wasm') || url.pathname.endsWith('.js')) {
    return cacheFirst(request, CACHE_VERSION);
  }

  // Strategy 3: Cache-first for assets (images, audio, fonts)
  if (matchesCachePattern(url.pathname)) {
    return cacheFirst(request, ASSET_CACHE);
  }

  // Strategy 4: Network-first with cache fallback for everything else
  return networkFirst(request);
}

// Network-first strategy (good for HTML and API calls)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Only cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[Fishy SW] Serving from cache (offline):', request.url);
      return cachedResponse;
    }

    // No cache, return offline page or error
    return new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    });
  }
}

// Cache-first strategy (good for static assets)
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached version
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    // Cache the new resource
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Fishy SW] Failed to fetch:', request.url, error);

    // Could return a fallback image/audio here
    return new Response('Resource not available offline', {
      status: 404,
      statusText: 'Not Found',
    });
  }
}

// Check if URL matches any cache pattern
function matchesCachePattern(pathname) {
  return Object.values(CACHE_PATTERNS).some((pattern) => pattern.test(pathname));
}

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Fishy SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[Fishy SW] Clearing all caches...');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Background sync for future features (tournament results, etc.)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  // Placeholder for syncing game data when back online
  console.log('[Fishy SW] Syncing game data...');
  // This could sync tournament results, player stats, etc.
}

// Periodic background sync (for checking updates)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  console.log('[Fishy SW] Checking for updates...');
  // Could check for new game version or content
}

console.log('[Fishy SW] Service worker loaded successfully');
