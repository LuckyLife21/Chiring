import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chiring_cookies'

export default function CookieBanner() {
  // Inicializar visible según si ya hay preferencia guardada (así el banner aparece en el primer paint si hace falta)
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return true
    }
  })

  function choose(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch (_) {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(10, 37, 64, 0.98)',
        color: 'white',
        padding: '16px 20px 20px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
          Usamos cookies para mejorar la web y tu experiencia. Puedes aceptar todas, solo las esenciales o rechazar las no necesarias.
          <a href="/cookies" style={{ color: '#7FDBFF', marginLeft: 6, textDecoration: 'none', fontWeight: 600 }}>Más información</a>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button
            onClick={() => choose('all')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg,#00B4D8,#0077B6)',
              color: 'white',
              border: 'none',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Aceptar todas
          </button>
          <button
            onClick={() => choose('essential')}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Solo esenciales
          </button>
          <button
            onClick={() => choose('reject')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.8)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  )
}
