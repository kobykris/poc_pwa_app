// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { BellRing, Vibrate, VibrateOff } from 'lucide-react';

// คุณสามารถย้าย Logic การ subscribe/unsubscribe มาไว้ที่นี่
// หรือสร้างเป็น Custom Hook เพื่อใช้ซ้ำได้
const HomePage: React.FC = () => {
  // สมมติว่ามี state และ function เหล่านี้
  const [isSubscribed, setIsSubscribed] = useState(false);
  const handleSubscribe = () => console.log('Subscribe clicked');
  const handleUnsubscribe = () => console.log('Unsubscribe clicked');

  // ใส่ Logic การ check subscription จริงๆ ที่นี่
  useEffect(() => {
    // ... check with registration.pushManager.getSubscription() ...
    setIsSubscribed(true)
  }, []);

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
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${isSubscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {isSubscribed ? 'รับแจ้งเตือน' : 'ไม่รับแจ้งเตือน'}
        </span>

      </div>

      <div className="flex flex-col items-center gap-4 my-3">
        {isSubscribed ? (
          <button
            onClick={handleUnsubscribe}
            className="flex justify-center gap-3 items-center w-full max-w-xs px-4 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
          >
            <VibrateOff size={30} /> ยกเลิกการแจ้งเตือน
          </button>
        ) : (
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