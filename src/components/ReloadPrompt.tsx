import { useRegisterSW } from 'virtual:pwa-register/react'
import { X, RefreshCw } from 'lucide-react';
  
type ToastProps = {
  title: string;
  confirmText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const Toast = ({ title, confirmText = 'Reload', onConfirm, onClose }: ToastProps) => (
    <div
      className="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5"
      role="alert"
    >
      <div className="flex items-start">
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex">
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          {confirmText}
        </button>
      </div>
    </div>
  )


  if (offlineReady) {
    return (
      <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
        PWA ของท่านพร้อมใช้งานแล้ว
        <button className="ml-4 font-bold" onClick={() => setOfflineReady(false)}>
          ตกลง
        </button>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <Toast
        title="PWA ของท่านมีการอัปเดต"
        confirmText="โหลดแอพใหม่"
        onConfirm={() => updateServiceWorker(true)}
        onClose={close}
      />
    );
  }

  return null
}

export default ReloadPrompt