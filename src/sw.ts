/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';


// Precache files
precacheAndRoute(self.__WB_MANIFEST);
console.log(`[SW] Service Worker has been loaded.`);


self.addEventListener('push', (event) => {
  console.log('[SW] Push Received.');
  
  // ดึงข้อมูล title และ body จาก payload ที่ส่งมาจาก backend
  const { title, body, icon, badge } = event.data?.json() || { title: 'No Title', body: 'No Body' };
  
  const options = {
    body: body,
    icon: icon || '/pwa-192x192.png', // ไอคอนที่จะแสดงบน notification
    badge: badge || '/pwa-192x192.png', // ไอคอนเล็กๆ บน status bar (Android)
  };
  
  // แสดง notification
  event.waitUntil(self.registration.showNotification(title, options));
});

// (Optional) เพิ่ม event listener อื่นๆ ได้ตามต้องการ เช่น 'notificationclick'
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click Received.');
  event.notification.close();

  // add logic to handle notification click
  // event.waitUntil(clients.openWindow('/some-url'));
});

