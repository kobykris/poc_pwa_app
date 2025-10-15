// src/pages/HomePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { BellRing, Vibrate, VibrateOff } from 'lucide-react';
import * as $sw from '../utils/service-worker'
import type { SubscriptionStatus } from "../services/subscription.service";
import { statusProps, getPublicKey, postSubscription, postUnsubscription } from "../services/subscription.service";

const HomePage: React.FC = () => {
  const [notificationStatus, setNotificationStatus] = useState<SubscriptionStatus>('PENDING');

  // Check subscription status
  const checkSubscription = async () => {
    try {
      const subscription = await $sw.pushManagerGetSubscription()
      if (subscription) {
        setNotificationStatus('SUBSCRIBED');
      } else {
        setNotificationStatus('UNSUBSCRIBED');
      }
    } catch (error: unknown) {
      console.error('[ERR] checking subscription failed:', error);
      if (error instanceof Error) {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          setNotificationStatus('UNSUPPORTED');
        }
      }
    }
  }

  const handleSubscribe = async () => {
    try {
      const publicKey = await getPublicKey()
      if ( !publicKey ) throw new Error('No public key available')

      const subscription = await $sw.pushManagerSubscribe(publicKey)
      if ( !subscription ) throw new Error('No subscription available')

      const { success, message } = await postSubscription(subscription)
      if ( !success ) throw new Error(message)
      setNotificationStatus('SUBSCRIBED');

    } catch (error: unknown) {
      console.error('[ERR] subscribing failed:', error);
      if (error instanceof Error) {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          setNotificationStatus('UNSUPPORTED');
        }

        if ( error.name === 'NetworkError' ) {
          alert('Subscription failed due to a network error. Please try again when you are online.');
        } else {
          alert(`An error occurred while subscribing: ${error.message}. Please try again.`);
        }
      }
    }
  }

  const handleUnsubscribe = async () => {
    try {
      const subscription = await $sw.pushManagerGetSubscription()
      if ( !subscription ) throw new Error('No subscription available')
      const { endpoint } = subscription
      if ( !endpoint ) throw new Error('No endpoint available')

      // Unsubscribe from push service
      const resp = await subscription.unsubscribe()
      if ( !resp ) throw new Error('Unsubscribe push service failed')

      // Unsubscribe from notification server
      const { success, message } = await postUnsubscription(endpoint)
      if ( !success ) throw new Error(message)
      setNotificationStatus('UNSUBSCRIBED');

    } catch (error: unknown) {
      console.error('[ERR] subscribing failed:', error);
      if (error instanceof Error) {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          setNotificationStatus('UNSUPPORTED');
        }

        if ( error.name === 'NetworkError' ) {
          alert('Subscription failed due to a network error. Please try again when you are online.');
        } else {
          alert(`An error occurred while subscribing: ${error.message}. Please try again.`);
        }
      }
    }
  }

  
  useEffect( () => {
    checkSubscription()
  }, []);

  const isSubscribed = useMemo(() => notificationStatus === 'SUBSCRIBED', [notificationStatus]);
  const isUnsubscribed = useMemo(() => notificationStatus === 'UNSUBSCRIBED', [notificationStatus]);
  const statusMessage = useMemo(() => statusProps[notificationStatus].text || '', [notificationStatus]);
  const statusClass = useMemo(() => statusProps[notificationStatus].class || '', [notificationStatus]);
  // const isUnsupported = useMemo(() => notificationStatus === 'UNSUPPORTED', [notificationStatus]);

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-md py-10">

      <div className='flex justify-center p-5 rounded-full bg-purple-100 w-35 h-35 mx-auto mb-5'>
        <BellRing size={100} color="purple" />
      </div>

      <h1 className="text-2xl font-bold mb-2 text-gray-800">Push Notification Demo</h1>

      <p className="text-gray-600 mb-6">ทดสอบการรับแจ้งเตือนผ่าน Push Notification</p>

      <div className='flex justify-between p-5'>

        <p className="text-gray-700 font-bold">สถานะ:</p>

        <span 
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
        >
          {statusMessage}
        </span>

      </div>

      <div className="flex flex-col items-center gap-4 my-3">

        {isSubscribed && (
          <button
            onClick={handleUnsubscribe}
            className="flex justify-center gap-3 items-center w-full max-w-xs px-4 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
          >
            <VibrateOff size={30} /> ยกเลิกการแจ้งเตือน
          </button>
        )}

        {isUnsubscribed && (
          <button
            onClick={handleSubscribe}
            className="flex justify-center gap-3 items-center w-full max-w-xs px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors"
          >
            <Vibrate size={30} /> รับการแจ้งเตือน
          </button>
        )}

      </div>
    </div>
  );
};

export default HomePage;