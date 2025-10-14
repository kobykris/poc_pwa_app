import { useEffect, useState } from 'react'
import { urlBase64ToUint8Array } from '../utils'

const PWATest = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL

  // Check if the user is already subscribed
  const checkSubscription = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      console.log('checkSubscription:', {sub})
      // setIsSubscribed(!sub)
      setIsSubscribed(!!sub)
    }
  }

  const getPublicKey = async () => {
    const response = await fetch(`${baseUrl}/vapid-public-key`)
    const { publicKey } = await response.json()
    return publicKey
  }

  const handleCheckPublicKey = async () => {
    try {
      const publicKey = await getPublicKey()
      setPublicKey(publicKey)
    } catch (error) {
      console.error('Error fetching public key:', error)
    }
  }
  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator)) {
      alert('Service Worker is not supported in this browser.')
      return
    }

    if (!('PushManager' in window)) {
      alert('Push API is not supported in this browser.')
      return
    }

    console.log('Registering service worker...')
    try {
      const registration = await navigator.serviceWorker.ready
      console.log('Service Worker registered:', registration)

    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return
    }
    
  }

  useEffect(() => {
    // console.log({navigator, window})
    checkSubscription()
  }, [])

  return (
    <div className='p-10'>

      <h1 className='text-5xl font-bold'>PWA POC DEBUGGER</h1>
      
      <div className='py-5'>
        <button 
          className='bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-orange-300 transition-colors duration-200' 
          onClick={handleCheckPublicKey}
          disabled={publicKey !== null}
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
        <button 
          className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200' 
          onClick={handleSubscribe} 
          disabled={isSubscribed}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>

        <pre className='py-5 break-words whitespace-pre-wrap max-full overflow-auto max-h-100'>
          {
            JSON.stringify({ 
              is: isSubscribed, 
              data: null 
            }, null, 2)
          }
        </pre>
      </div>

      

    </div>
  )
}

export default PWATest