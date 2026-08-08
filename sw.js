// sw.js - ইউজারদের ডিভাইসে পুরোনো পেজ ক্যাশ হয়ে থাকা রোধ করতে
const CACHE_NAME = 'allalo-tools-v1.0.2'; // প্রতিটি বড় আপডেটে এই ভার্সন পরিবর্তন করবেন[cite: 12]

// যেসব ফাইল অফলাইনে কাজ করার জন্য ক্যাশ রাখা নিরাপদ
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/about.html',
    '/blog.html',
    '/toolspro.html',
    '/privacy-policy.html',
    '/terms.html',
    '/favicon.png',
    '/manifest.json'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); //[cite: 12]
});

// Activate Event (পুরোনো ক্যাশ মুছে ফেলার জন্য)[cite: 12]
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key); // পুরোনো ভার্সনের ক্যাশ সাথে সাথে ডিলিট হবে[cite: 12]
                    }
                })
            );
        })
    );
    self.clients.claim(); //[cite: 12]
});

// Fetch Event (Network-First Strategy with Safety Checks)
self.addEventListener('fetch', event => {
    // শুধুমাত্র GET রিকোয়েস্ট এবং HTTP/HTTPS ইউআরএল ক্যাশ প্রসেস করবে
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // ইন্টারনেট থাকলে নতুন ফাইল সার্ভ করবে এবং ক্যাশ আপডেট করবে[cite: 12]
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => caches.match(event.request)) // অফলাইনে থাকলে ক্যাশ থেকে দেখাবে[cite: 12]
    );
});