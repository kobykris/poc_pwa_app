import { useEffect, useState } from 'react'
import { urlBase64ToUint8Array } from '../utils'
import ReloadPrompt from './ReloadPrompt';

const PWATest = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL

  // Get existing subscription object
  const pushManagerGetSubscription = async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker is not supported in this browser.')
    if (!('PushManager' in window)) throw new Error('Push API is not supported in this browser.')
    
    const registration = await navigator.serviceWorker.ready
    return registration.pushManager.getSubscription()
  }
  // Subscribe to push manager
  const pushManagerSubscribe = async (publicKey: string) => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker is not supported in this browser.')
    if (!('PushManager' in window)) throw new Error('Push API is not supported in this browser.')
    if (!navigator.onLine) throw new Error('No internet connection.')
    
    const registration = await navigator.serviceWorker.ready
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });
  }

  // Fetch public key from server
  const getPublicKey = async () => {
    const response = await fetch(`${baseUrl}/vapid-public-key`)
    const { publicKey } = await response.json()
    return publicKey
  }
  // Post subscription to server
  const postSubscription = async (subscription: PushSubscription) => {
    const response = await fetch(`${baseUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json()
  }
  // Post unsubscription from server
  const postUnsubscription = async (endpoint: string) => {
    const response = await fetch(`${baseUrl}/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    })
    return response.json()
  }

  // Button Handlers
  const handleCheckPublicKey = async () => {
    try {
      const publicKey = await getPublicKey()
      setPublicKey(publicKey)
    } catch (error) {
      console.error('Error fetching public key:', error)
    }
  }
  const handleSubscribe = async () => {
    try {
      const publicKey = await getPublicKey()
      if ( !publicKey ) throw new Error('No public key available')
      const subscription = await pushManagerSubscribe(publicKey)
      console.log('Push Subscription:', subscription)
      setSubscription(subscription)
    } catch (error) {
      console.error('Error subscribing to push manager:', error)
      if (error instanceof Error && error.name === 'NetworkError') {
        alert('Subscription failed due to a network error. Please try again when you are online.');
      } else {
        alert('An error occurred while subscribing. Please try again.');
      }
      return
    }
  }
  const handleUnSubscribe = async () => {
    try {
      const subscription = await pushManagerGetSubscription()
      if (subscription) {
        const resp = await subscription.unsubscribe()
        if (resp) console.log('Unsubscribed!!')
      }
      setSubscription(null)
    } catch (error) {
      console.error('Error unsubscribing:', error)
    }
  }
  const handleServerSubscribe = async () => {

    try {
      const publicKey = await getPublicKey()
      if ( !publicKey ) throw new Error('No public key available')
      const subscription = await pushManagerSubscribe(publicKey)
      if ( !subscription ) throw new Error('No subscription available')

      const resp = await postSubscription(subscription)
      console.log('Server subscription response:', resp)
      if ( !resp.success ) throw new Error(resp.message)
      setSubscription(subscription)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      if (error instanceof Error && error.name === 'NetworkError') {
        alert('Subscription failed due to a network error. Please try again when you are online.');
      } else {
        alert('An error occurred while subscribing. Please try again.');
      }
      return
    }
  }
  const handleServerUnSubscribe = async () => {

    try {
      const subscription = await pushManagerGetSubscription()
      if (subscription) {
        const { endpoint } = subscription
        console.log('endpoint', endpoint)
        if (endpoint) {
          const response = await postUnsubscription(endpoint)
          console.log('Server unsubscription response:', response)
          if ( !response.success ) throw new Error(response.message)
        }
        const resp = await subscription.unsubscribe()
        if (resp) console.log('Unsubscribed!!')
      }
      setSubscription(null)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      if (error instanceof Error && error.name === 'NetworkError') {
        alert('Subscription failed due to a network error. Please try again when you are online.');
      } else {
        alert('An error occurred while subscribing. Please try again.');
      }
      return
    }
  }

  // Check if the user is already subscribed
  const checkSubscription = async () => {
    const sub = await pushManagerGetSubscription()
    setSubscription(sub)
  }

  useEffect(() => {
    checkSubscription()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='p-10'>

      <h1 className='text-5xl font-bold'>PWA POC DEBUGGER</h1>
      
      <div className='py-5'>
        <button 
          className='bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-orange-300 transition-colors duration-200' 
          onClick={handleCheckPublicKey}
          disabled={!!publicKey}
        >
          Get Public Key
        </button>

        <pre className='py-5 break-words whitespace-pre-wrap max-full overflow-auto max-h-100'>
          {
            JSON.stringify({ 
              publicKey: publicKey,
              Uint8Array: publicKey ? urlBase64ToUint8Array(publicKey) : null
            }, null, 2)
          }
        </pre>
      </div>
      
      <div className='py-5'>
        <div className="flex gap-3">
          <button
            className='bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-cyan-700 disabled:bg-cyan-300 transition-colors duration-200'
            onClick={handleSubscribe}
            disabled={!!subscription}
          >
            Client Only Subscribe
          </button>

          <button
            className='bg-pink-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 disabled:bg-pink-300 transition-colors duration-200'
            onClick={handleUnSubscribe}
            disabled={!subscription}
          >
            Client Only Unsubscribe
          </button>

          <button
            className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200'
            onClick={handleServerSubscribe}
            disabled={!!subscription}
          >
            Server {subscription ? 'Subscribed' : 'Subscribe'}
          </button>

          <button
            className='bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300 transition-colors duration-200'
            onClick={handleServerUnSubscribe}
            disabled={!subscription}
          >
            Server Unsubscribe
          </button>

        </div>

        <pre className='py-5 break-words whitespace-pre-wrap max-full overflow-auto max-h-100'>
          {
            JSON.stringify({
              subscription: subscription 
            }, null, 2)
          }
        </pre>
      </div>

      <ReloadPrompt />

    </div>
  )
}

export default PWATest