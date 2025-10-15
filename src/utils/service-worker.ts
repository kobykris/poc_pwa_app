import { urlBase64ToUint8Array } from "."

// Get existing subscription object
export const pushManagerGetSubscription = async () => {
  if (!('serviceWorker' in navigator)) throw new Error('Service Worker is not supported in this browser.')
  if (!('PushManager' in window)) throw new Error('Push API is not supported in this browser.')
  
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

// Subscribe to push manager
export const pushManagerSubscribe = async (publicKey: string) => {
  if (!('serviceWorker' in navigator)) throw new Error('Service Worker is not supported in this browser.')
  if (!('PushManager' in window)) throw new Error('Push API is not supported in this browser.')
  if (!navigator.onLine) throw new Error('No internet connection.')
  
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });
}