import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Bell } from 'lucide-react';

const NotificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const title = searchParams.get('title');
  const body = searchParams.get('body');
  const sent = searchParams.get('sent');
  // console.log({ title, body, sent })

  const sentDate = useMemo(() => {
    if ( sent ) {
      const ts = parseInt(sent, 10)
      if ( !isNaN(ts) ) return new Date(ts).toLocaleString('th-TH')
    }
    return null
  }, [sent])

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="text-blue-500" size={28}/>
        <h1 className="text-2xl font-bold">Push Notification</h1>
      </div>
      <div className="space-y-3">
        <div>
          <h2 className="font-semibold text-blue-500">เรื่อง:</h2>
          <p className="text-lg text-gray-800 indent-2">{title || '-'}</p>
        </div>
        <div>
          <h2 className="font-semibold text-blue-500">รายละเอียด:</h2>
          <p className="text-gray-700 indent-2">{body || '-'}</p>
        </div>
        <div>
          <h2 className="font-semibold text-blue-500">ส่งเมื่อ:</h2>
          <p className="text-sm text-gray-500 indent-2">{sentDate}</p>
        </div>
      </div>
    </div>
  )
}

export default NotificationPage