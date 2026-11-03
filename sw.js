/* Increment VERSION for each published release; never cache private PDF files. */
const VERSION = 'pdf-ocr-pwa-v1';
const APP_CACHE = VERSION + '-app';
const EXT_CACHE = VERSION + '-external';
const SHELL = ['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
const EXTERNAL = [
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'
];
self.addEventListener('install', event => {
 event.waitUntil((async () => {
  const app = await caches.open(APP_CACHE);
  await app.addAll(SHELL);
  const external = await caches.open(EXT_CACHE);
  await Promise.allSettled(EXTERNAL.map(url => external.add(new Request(url,{mode:'no-cors'}))));
 })());
});
self.addEventListener('activate', event => event.waitUntil((async () => {
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('pdf-ocr-pwa-') && ![APP_CACHE,EXT_CACHE].includes(k)).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('message', event => {if(event.data?.type === 'SKIP_WAITING') self.skipWaiting()});
self.addEventListener('fetch', event => {
 const request=event.request;
 if(request.method!=='GET') return;
 const url=new URL(request.url);
 if(url.origin===self.location.origin){
  if(request.mode==='navigate'){
   event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(APP_CACHE).then(c=>c.put(request,copy)))}return response}).catch(async()=> (await caches.match(request)) || (await caches.match('./index.html'))));
  } else {
   event.respondWith(caches.match(request).then(cached=>cached || fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(APP_CACHE).then(c=>c.put(request,copy)))}return response})));
  }
 } else if(url.protocol==='https:' && (url.hostname==='cdnjs.cloudflare.com'||url.hostname==='cdn.jsdelivr.net')){
  event.respondWith(caches.open(EXT_CACHE).then(async cache=>{
   const cached=await cache.match(request);
   if(cached) return cached;
   const response=await fetch(request);
   if(response.ok || response.type==='opaque') event.waitUntil(cache.put(request,response.clone()));
   return response;
  }));
 }
});
