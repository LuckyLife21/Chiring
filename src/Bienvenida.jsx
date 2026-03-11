import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Bienvenida() {
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    async function completarRegistro() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setEstado('error'); return }

        const meta = user.user_metadata

        const { error: dbError } = await supabase
          .from('chiringuitos')
          .insert({
            email: user.email,
            email_notificaciones: user.email,
            nombre: meta.nombre,
            telefono: meta.telefono,
            ciudad: meta.ciudad,
            pin_manager: meta.pin_manager || Math.floor(1000 + Math.random() * 9000).toString(),
            verificado: false,
          })

        if (dbError && !dbError.message.includes('duplicate')) {
          setEstado('error'); return
        }

        await supabase.functions.invoke('enviar-bienvenida', {
          body: { email: user.email, nombre: meta.nombre }
        })

        setEstado('ok')
      } catch (e) {
        setEstado('error')
      }
    }
    completarRegistro()
  }, [])

  if (estado === 'cargando') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 55%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Activando tu cuenta... 🌊</div>
    </div>
  )

  if (estado === 'error') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 55%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Ha ocurrido un error. <a href="/registro" style={{ color: '#7FDBFF' }}>Inténtalo de nuevo</a></div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 55%, #00B4D8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif", padding: 20,
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -150, right: -150 }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -80, left: -80 }} />

      <div style={{ textAlign: 'center', maxWidth: 480, position: 'relative' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 16 }}>
          ¡Bienvenido/a a Chiring!
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 32 }}>
          Tu cuenta está activada. Ya puedes empezar a configurar tu chiringuito.
        </p>
        <a href="/panel" style={{
          display: 'block', background: 'white', color: '#0077B6',
          padding: '16px 32px', borderRadius: 50, textDecoration: 'none',
          fontSize: 16, fontWeight: 800, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          marginBottom: 16
        }}>
          Ir al panel →
        </a>
      </div>
    </div>
  )
}