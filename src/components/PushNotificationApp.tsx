import { useState, useEffect } from 'react';
import { Bell, BellOff, Send, AlertCircle, CheckCircle } from 'lucide-react';

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationApp() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [serverUrl, setServerUrl] = useState('http://localhost:3000');
  const [vapidPublicKey, setVapidPublicKey] = useState('');
  const [testNotificationTitle, setTestNotificationTitle] = useState('Test Notification');
  const [testNotificationBody, setTestNotificationBody] = useState('This is a test push notification');

  useEffect(() => {
    // Check if browser supports notifications and service workers
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  interface Message {
    type: 'success' | 'error' | '';
    text: string;
  }

  const showMessage = (type: Message['type'], text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      showMessage('error', 'Notification permission denied');
      return false;
    }
    return true;
  };

  const subscribeToNotifications = async () => {
    if (!vapidPublicKey) {
      showMessage('error', 'Please enter VAPID public key');
      return;
    }

    setLoading(true);
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      // const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
      });

      // Send subscription to your server
      const response = await fetch(`${serverUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub)
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setSubscription(sub);
      showMessage('success', 'Successfully subscribed to notifications!');
    } catch (error) {
      console.error('Error subscribing:', error);
      showMessage('error', `Subscription failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    setLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server about unsubscription
        await fetch(`${serverUrl}/api/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        });

        setSubscription(null);
        showMessage('success', 'Successfully unsubscribed from notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      showMessage('error', `Unsubscription failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    if (!subscription) {
      showMessage('error', 'Please subscribe first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          notification: {
            title: testNotificationTitle,
            body: testNotificationBody,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      showMessage('success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending notification:', error);
      showMessage('error', `Failed to send: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Not Supported
          </h2>
          <p className="text-gray-600 text-center">
            Your browser doesn't support push notifications.
            Please try using Chrome, Firefox, or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <Bell className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              PWA Push Notification PoC
            </h1>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Server URL
              </label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="http://localhost:3000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VAPID Public Key
              </label>
              <textarea
                value={vapidPublicKey}
                onChange={(e) => setVapidPublicKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter your VAPID public key here"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              {!subscription ? (
                <button
                  onClick={subscribeToNotifications}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  {loading ? 'Subscribing...' : 'Subscribe to Notifications'}
                </button>
              ) : (
                <button
                  onClick={unsubscribeFromNotifications}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <BellOff className="w-5 h-5 mr-2" />
                  {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>
              )}
            </div>

            {subscription && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Test Notification
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={testNotificationTitle}
                      onChange={(e) => setTestNotificationTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body
                    </label>
                    <textarea
                      value={testNotificationBody}
                      onChange={(e) => setTestNotificationBody(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={sendTestNotification}
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? 'Sending...' : 'Send Test Notification'}
                  </button>
                </div>
              </div>
            )}

            {subscription && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Subscription Status
                </h3>
                <p className="text-sm text-green-600 font-medium">
                  ✓ Subscribed and ready to receive notifications
                </p>
                <details className="mt-2">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                    View subscription details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                    {JSON.stringify(subscription.toJSON(), null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📋 Server API Requirements
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="bg-blue-50 p-3 rounded">
              <strong>POST /api/subscribe</strong>
              <p className="mt-1">Save push subscription to database</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>POST /api/unsubscribe</strong>
              <p className="mt-1">Remove subscription from database</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>POST /api/send-notification</strong>
              <p className="mt-1">Send push notification to subscriber</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}