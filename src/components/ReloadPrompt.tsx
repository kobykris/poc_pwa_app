import { useRegisterSW } from 'virtual:pwa-register/react'
  
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

  if (offlineReady) {
    return (
      <div className="pwa-toast">
        App ready to work offline
        <button onClick={() => setOfflineReady(false)}>Close</button>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="pwa-toast">
        New content available, click on reload button to update.
        <button onClick={() => updateServiceWorker(true)}>Reload</button>
        <button onClick={close}>Close</button>
      </div>
    );
  }

  return null
}

export default ReloadPrompt