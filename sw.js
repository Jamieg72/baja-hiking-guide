const CACHE='baja-hikes-loop-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./loop-track.json','./loop-stops.json'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.startsWith('baja-hikes-')).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
event.respondWith((async()=>{const cache=await caches.open(CACHE);
try{const response=await fetch(req);if(response.ok)cache.put(req,response.clone());return response}
catch(e){const saved=await cache.match(req);if(saved)return saved;throw e}})())});
