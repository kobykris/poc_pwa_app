import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotificationPage from './pages/NotificationPage'
import TestPage from './pages/TestPage'
import ReloadPrompt from './components/ReloadPrompt'
import './App.css'
// import pwaLogo from '/pwa-192x192.png'
// import pwaLogo512 from '/pwa-512x512.png'


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="debug" element={<TestPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
      <ReloadPrompt />
    </>
  )
}

export default App
