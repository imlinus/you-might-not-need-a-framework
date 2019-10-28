const static = [
  './',
  './css/style.css',
  './js/app.js'
]

self.addEventListener('install', async event => {
  const cache = await caches.open('static-cache')
  cache.addAll(static)
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)

  url.origin === location.url
    ? event.respondWith(cacheFirst(request))
    : event.respondWith(networkFirst(request))
})

const cacheFirst = async request => {
  const cachedResponse = caches.match(request)
  return cachedResponse || fetch(request)
}

const networkFirst = async request => {
  const cache = await caches.open('dynamic-cache')

  try {
    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    return await cache.match(request)
  }
}
