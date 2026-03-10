import { useState } from 'react'
import Landing from './Landing'

export default function ComingSoon() {
  const [input, setInput] = useState('')
  const [desbloqueado, setDesbloqueado] = useState(false)
  const [error, setError] = useState(false)

  function comprobar() {
    if (input === '723495') {
      setDesbloqueado(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (desbloqueado) return <Landing />

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 55%, #00B4D8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif", padding: 20,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -150, right: -150 }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -80, left: -80 }} />

      <div style={{ textAlign: 'center', position: 'relative', maxWidth: 440, width: '100%' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🌊</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 8 }}>
          chiringapp
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.6 }}>
          Estamos preparando algo increíble.<br />Muy pronto disponible.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 22, padding: 28, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
            🔒 Acceso privado
          </div>
          <input
            type="password"
            placeholder="Introduce la contraseña"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && comprobar()}
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 14, boxSizing: 'border-box',
              border: error ? '2px solid #ff6b6b' : '1.5px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.1)', color: 'white',
              fontSize: 16, fontFamily: 'Poppins, sans-serif', outline: 'none',
              marginBottom: 12, textAlign: 'center', letterSpacing: 4
            }}
          />
          {error && (
            <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
              Contraseña incorrecta
            </div>
          )}
          <button
            onClick={comprobar}
            style={{
              width: '100%', padding: '14px', background: 'white',
              color: '#0077B6', border: 'none', borderRadius: 50,
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
          >
            Entrar →
          </button>
        </div>
      </div>
    </div>
  )
}
