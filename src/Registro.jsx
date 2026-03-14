import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const isMobile = () => window.innerWidth < 768

export default function Registro() {
  const [mobile, setMobile] = useState(isMobile())
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    email2: '',
    password: '',
    password2: '',
    telefono: '',
    ciudad: '',
    pin: '',
    pin2: '',
  })

  const [refColaborador, setRefColaborador] = useState('')

  useEffect(() => { document.title = 'Registrarse · ChiringApp' }, [])

  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref') || ''
    if (ref) setRefColaborador(ref.trim())
  }, [])

  function cambiar(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
    setError('')
  }

  const COOLDOWN_REGISTRO_MS = 90000 // 1,5 min entre intentos de registro

  async function registrar() {
    const last = parseInt(sessionStorage.getItem('registro_last_attempt') || '0', 10)
    if (Date.now() - last < COOLDOWN_REGISTRO_MS) {
      setError('Espera un minuto y medio antes de intentar de nuevo (límite anti-spam).')
      return
    }
    if (!form.nombre || !form.email || !form.email2 || !form.password || !form.telefono || !form.ciudad) {
      setError('Por favor rellena todos los campos obligatorios')
      return
    }
    if (form.email !== form.email2) {
      setError('Los emails no coinciden')
      return
    }
    const p = form.password
    if (p.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (!/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/\d/.test(p)) {
      setError('La contraseña debe incluir mayúscula, minúscula y número')
      return
    }
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.pin.length !== 4 || !/^\d{4}$/.test(form.pin)) {
      setError('El PIN de manager debe tener exactamente 4 dígitos')
      return
    }
    if (form.pin !== form.pin2) {
      setError('Los PINs no coinciden')
      return
    }

    setCargando(true)
    setError('')
    sessionStorage.setItem('registro_last_attempt', String(Date.now()))

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nombre: form.nombre,
            telefono: form.telefono,
            ciudad: form.ciudad,
            pin_manager: form.pin,
            ref_colaborador: refColaborador || null,
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email ya está registrado. ¿Quieres iniciar sesión?')
        } else {
          setError('Error al crear la cuenta: ' + authError.message)
        }
        setCargando(false)
        return
      }

      setPaso(2)
    } catch (e) {
      setError('Error inesperado. Inténtalo de nuevo.')
    }

    setCargando(false)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: '1.5px solid #E0E8F0', background: '#F8FAFF',
    fontSize: 15, fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#0A2540',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block'
  }

  if (paso === 2) {
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
          <div style={{ fontSize: 72, marginBottom: 20 }}>📧</div>
          <h1 style={{ fontSize: mobile ? 28 : 36, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 16 }}>
            Revisa tu email
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 12 }}>
            Te hemos enviado un email de confirmación a:
          </p>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 20px', marginBottom: 32, border: '1px solid rgba(255,255,255,0.2)' }}>
            <p style={{ fontSize: 16, color: 'white', margin: 0, fontWeight: 700 }}>
              {form.email}
            </p>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>
            Haz click en el botón del email para activar tu cuenta. Sin confirmar el email no podrás acceder al panel.
          </p>
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Poppins', sans-serif" }}>

      <div style={{
        background: 'linear-gradient(135deg, #0A2540, #0077B6)',
        padding: mobile ? '20px' : '24px 40px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 900, color: 'white', textDecoration: 'none', letterSpacing: -1 }}>
            🌊 chiringapp
          </a>
          <a href="/panel" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 600 }}>
            ¿Ya tienes cuenta? <span style={{ color: 'white', textDecoration: 'underline' }}>Inicia sesión</span>
          </a>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #0A2540, #0077B6)',
        padding: mobile ? '32px 20px 60px' : '40px 40px 70px',
        textAlign: 'center',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            Empieza hoy
          </div>
          <h1 style={{ fontSize: mobile ? 28 : 38, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 10 }}>
            Registra tu chiringuito
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 420, margin: '0 auto' }}>
            Configura tu menú, añade tus hamacas y empieza a recibir pedidos en minutos.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: mobile ? '-30px 20px 40px' : '-40px auto 60px', position: 'relative' }}>
        <div style={{
          background: 'white', borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          padding: mobile ? 24 : 40,
        }}>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#00B4D8,#0077B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white' }}>1</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0077B6' }}>Datos básicos</span>
            </div>
            <div style={{ flex: 1, height: 2, background: '#E0E8F0', borderRadius: 2 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E0E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#aaa' }}>2</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#aaa' }}>Datos fiscales</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <label style={labelStyle}>🏖️ Nombre del chiringuito *</label>
              <input
                style={inputStyle}
                placeholder="Ej: Chiringuito Playa Sol"
                value={form.nombre}
                onChange={e => cambiar('nombre', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>📧 Email *</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={e => cambiar('email', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>📧 Repetir email *</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email2}
                  onChange={e => cambiar('email2', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>🔒 Contraseña *</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Mín. 8 caracteres, mayúscula, minúscula y número"
                  value={form.password}
                  onChange={e => cambiar('password', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>🔒 Repetir contraseña *</label>
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Repite la contraseña"
                  value={form.password2}
                  onChange={e => cambiar('password2', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>📱 Teléfono *</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="600 000 000"
                  value={form.telefono}
                  onChange={e => cambiar('telefono', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>📍 Ciudad *</label>
                <input
                  style={inputStyle}
                  placeholder="Ej: Málaga"
                  value={form.ciudad}
                  onChange={e => cambiar('ciudad', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>🔐 PIN de manager * <span style={{fontSize:11, color:'#aaa', fontWeight:500}}>(4 dígitos)</span></label>
                <input
                  style={{...inputStyle, textAlign:'center', fontSize: 24, letterSpacing: 10}}
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={form.pin}
                  onChange={e => cambiar('pin', e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div>
                <label style={labelStyle}>🔐 Repetir PIN *</label>
                <input
                  style={{...inputStyle, textAlign:'center', fontSize: 24, letterSpacing: 10}}
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={form.pin2}
                  onChange={e => cambiar('pin2', e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={registrar}
              disabled={cargando}
              style={{
                padding: '16px', background: cargando ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)',
                color: 'white', border: 'none', borderRadius: 50,
                fontSize: 16, fontWeight: 800, cursor: cargando ? 'default' : 'pointer',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: cargando ? 'none' : '0 8px 24px rgba(0,119,182,0.3)',
                marginTop: 4,
              }}
            >
              {cargando ? 'Creando cuenta...' : '🚀 Crear mi cuenta gratis'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', lineHeight: 1.6 }}>
              Al registrarte aceptas nuestros <a href="/terminos" style={{ color: '#00B4D8' }}>Términos de uso</a> y <a href="/privacidad" style={{ color: '#00B4D8' }}>Política de privacidad</a>.<br />
              Solo pagas cuando vendes — 15% por pedido procesado.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
          {[
            { icon: '⚡', text: 'Configuración en 2 minutos' },
            { icon: '💶', text: 'Solo pagas cuando vendes' },
            { icon: '🔒', text: 'Datos seguros con Stripe' },
          ].map(i => (
            <div key={i.text} style={{ background: 'white', borderRadius: 14, padding: '14px 12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{i.icon}</div>
              <div style={{ fontSize: 11, color: '#666', fontWeight: 600, lineHeight: 1.4 }}>{i.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}