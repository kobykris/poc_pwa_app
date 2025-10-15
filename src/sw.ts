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
    data: { title, body, sent: Date.now() }
  };
  
  // แสดง notification
  event.waitUntil( self.registration.showNotification(title, options) );
});

// (Optional) เพิ่ม event listener อื่นๆ ได้ตามต้องการ เช่น 'notificationclick'
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click Received.');
  event.notification.close();
  // add logic to handle notification click
  // event.waitUntil(clients.openWindow('/some-url'));

  const notificationData = event.notification.data || {};
  const title = encodeURIComponent(notificationData.title || '');
  const body = encodeURIComponent(notificationData.body || '');
  const sent = encodeURIComponent(notificationData.sent || '');

  // สร้าง URL ไปยังหน้าที่เราต้องการ
  const urlToOpen = new URL(`/notification?title=${title}&body=${body}&sent=${sent}`, self.location.origin).href;
  console.log('[SW] notification url:', urlToOpen)
  
  // ค้นหาว่ามี tab ของเว็บเราเปิดอยู่แล้วหรือไม่
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      console.log('[SW] navigating to notification url:', urlToOpen)
      // ถ้ามี tab เปิดอยู่แล้ว ให้ focus ไปที่ tab นั้นแล้ว navigate
      if (clientList.length > 0) {
        // const clients = clientList.filter( item => item.focused )
        // console.log('[SW] focused clients:', {clientList, clients})

        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus().then(cli => cli.navigate(urlToOpen));
      }
      // ถ้าไม่มี tab ไหนเปิดอยู่ ให้เปิดหน้าต่างใหม่
      return self.clients.openWindow(urlToOpen);
    })
  );

});

self.addEventListener('message', (event) => {
  console.log('[SW] Message detected.', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // activate new version of service worker
    self.skipWaiting();
  }
});
