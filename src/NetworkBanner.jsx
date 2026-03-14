import { useState, useEffect } from 'react'

export default function NetworkBanner() {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)

  useEffect(() => {
    const onOffline = () => setOffline(true)
    const onOnline = () => setOffline(false)
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  if (!offline) return null
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#B22222',
        color: 'white',
        padding: '12px 24px',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Poppins', sans-serif",
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      📡 Sin conexión. Inténtalo en unos minutos.
    </div>
  )
}
