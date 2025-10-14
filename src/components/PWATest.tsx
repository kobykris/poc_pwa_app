import { useEffect, useState } from 'react'

const PWATest = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      console.log('checkSubscription:', {sub})
      // setIsSubscribed(!sub)
      setIsSubscribed(!!sub)
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

    
  }

  useEffect(() => {
    console.log({navigator, window})
    checkSubscription()
  }, [])

  return (
    <div className='flex flex-col h-screen bg-gray-100 items-center justify-center'>

      <h1 className='text-5xl font-bold p-5'>PWA POC</h1>
      
      <div className='py-5'>
        <button 
          className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200' 
          onClick={handleSubscribe} 
          disabled={isSubscribed}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      <pre className='py-5'>
        {isSubscribed ? JSON.stringify({ is: isSubscribed, data: null }, null, 2) : 'No data yet'}
      </pre>

    </div>
  )
}

export default PWATest