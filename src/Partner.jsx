import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const isMobile = () => window.innerWidth < 768

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZXpueWN2aGlmbnh2cWpmY2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTQ3MDksImV4cCI6MjA1NzAzMDcwOX0.hfBLjGXbnWPMqA3xjkpNO853YBfSAYSVrCMDwwKFaAA"

export default function Partner() {
  const [mobile, setMobile] = useState(isMobile())
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [codigoGuardado, setCodigoGuardado] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    email2: '',
    password: '',
    password2: '',
    telefono: '',
    ciudad: '',
    chiringuitos_conocidos: '',
  })

  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function cambiar(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
    setError('')
  }

  function generarCodigo(nombre) {
    const base = nombre.trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '')
    const num = Math.floor(100 + Math.random() * 900)
    return base + num
  }

  async function enviarEmail(email, nombre, codigo_ref) {
    await fetch("https://rleznycvhifnxvqjfcex.supabase.co/functions/v1/enviar-partner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ANON_KEY
      },
      body: JSON.stringify({ email, nombre, codigo_ref })
    })
  }

  async function registrar() {
    if (!form.nombre || !form.email || !form.email2 || !form.password || !form.password2 || !form.telefono || !form.ciudad) {
      setError('Por favor rellena todos los campos obligatorios')
      return
    }
    if (form.email !== form.email2) {
      setError('Los emails no coinciden')
      return
    }
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    setError('')

    try {
      const codigo_ref = generarCodigo(form.nombre)

      // Crear cuenta en Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nombre: form.nombre, rol: 'partner', codigo_ref } }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email ya está registrado. Inicia sesión desde el menú.')
        } else {
          setError('Error al crear la cuenta. Inténtalo de nuevo.')
        }
        setCargando(false)
        return
      }

      // Guardar en tabla colaboradores
      const { error: dbError } = await supabase
        .from('colaboradores')
        .insert({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          ciudad: form.ciudad,
          chiringuitos_conocidos: form.chiringuitos_conocidos,
          codigo_ref,
        })

      if (dbError && dbError.message.includes('unique')) {
        const codigo_ref2 = generarCodigo(form.nombre)
        await supabase.from('colaboradores').insert({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          ciudad: form.ciudad,
          chiringuitos_conocidos: form.chiringuitos_conocidos,
          codigo_ref: codigo_ref2,
        })
        setCodigoGuardado(codigo_ref2)
        await enviarEmail(form.email, form.nombre, codigo_ref2)
      } else {
        setCodigoGuardado(codigo_ref)
        await enviarEmail(form.email, form.nombre, codigo_ref)
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

        <div style={{ textAlign: 'center', maxWidth: 520, position: 'relative', width: '100%' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: mobile ? 28 : 36, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 16 }}>
            ¡Bienvenido a Chiring Partners!
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 28 }}>
            Ya eres Chiring Partner. Este es tu link único para compartir:
          </p>

          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: '18px 20px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 600 }}>Tu link de referido</div>
            <div style={{ fontSize: mobile ? 13 : 15, color: 'white', fontWeight: 800, wordBreak: 'break-all' }}>
              chiringapp.com/registro?ref=<span style={{ color: '#7FDBFF' }}>{codigoGuardado}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', marginBottom: 12, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            📧 Te hemos enviado un email con tu link y todos los detalles a <strong style={{ color: 'white' }}>{form.email}</strong>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            ✅ Confirma tu email para poder iniciar sesión en tu panel
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
            {[
              { icon: '🔗', label: 'Tu link único', desc: 'Compártelo con chiringuitos' },
              { icon: '💰', label: '1% comisión', desc: 'Por cada pedido de tus referidos' },
              { icon: '♾️', label: 'Sin límite', desc: 'Cuantos más traigas, más ganas' },
            ].map(i => (
              <div key={i.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{i.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'white', marginBottom: 3 }}>{i.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{i.desc}</div>
              </div>
            ))}
          </div>

          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Poppins', sans-serif" }}>

      <div style={{ background: 'linear-gradient(135deg, #0A2540, #0077B6)', padding: mobile ? '20px' : '24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 900, color: 'white', textDecoration: 'none', letterSpacing: -1 }}>
            🌊 chiringapp
          </a>
          <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 600 }}>
            ← Volver al inicio
          </a>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0A2540, #0077B6)', padding: mobile ? '32px 20px 60px' : '40px 40px 70px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          Chiring Partners
        </div>
        <h1 style={{ fontSize: mobile ? 28 : 38, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 12 }}>
          Gana comisión recomendando Chiring
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 460, margin: '0 auto 24px' }}>
          Consigue tu link único, compártelo con chiringuitos y gana el <strong style={{ color: 'white' }}>1% de cada pedido</strong> de los que se registren con él.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: mobile ? 16 : 32, flexWrap: 'wrap' }}>
          {[['🔗', 'Link único'], ['💰', '1% comisión'], ['♾️', 'Sin límite'], ['📊', 'Panel propio']].map(([icon, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 50, padding: '8px 16px', fontSize: 13, color: 'white', fontWeight: 700 }}>
              {icon} {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: mobile ? '-30px 20px 40px' : '-40px auto 60px', position: 'relative' }}>
        <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', padding: mobile ? 24 : 40 }}>

          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0A2540', marginBottom: 6 }}>Regístrate como Partner</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>Rellena el formulario y recibe tu link único al instante</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <label style={labelStyle}>👤 Nombre completo *</label>
              <input style={inputStyle} placeholder="Tu nombre y apellidos" value={form.nombre} onChange={e => cambiar('nombre', e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>📧 Email *</label>
              <input style={inputStyle} type="email" placeholder="tu@email.com" value={form.email} onChange={e => cambiar('email', e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>📧 Confirma tu email *</label>
              <input style={{ ...inputStyle, borderColor: form.email2 && form.email !== form.email2 ? '#ffb3b3' : '#E0E8F0' }} type="email" placeholder="tu@email.com" value={form.email2} onChange={e => cambiar('email2', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>🔒 Contraseña *</label>
                <input style={inputStyle} type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => cambiar('password', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>🔒 Repite la contraseña *</label>
                <input style={{ ...inputStyle, borderColor: form.password2 && form.password !== form.password2 ? '#ffb3b3' : '#E0E8F0' }} type="password" placeholder="Repite la contraseña" value={form.password2} onChange={e => cambiar('password2', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>📱 Teléfono *</label>
                <input style={inputStyle} type="tel" placeholder="600 000 000" value={form.telefono} onChange={e => cambiar('telefono', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>📍 Ciudad *</label>
                <input style={inputStyle} placeholder="Ej: Murcia, Valencia..." value={form.ciudad} onChange={e => cambiar('ciudad', e.target.value)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>🏖️ ¿Cuántos chiringuitos conoces aproximadamente? <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>(opcional)</span></label>
              <input style={inputStyle} placeholder="Ej: 5-10 chiringuitos en la zona" value={form.chiringuitos_conocidos} onChange={e => cambiar('chiringuitos_conocidos', e.target.value)} />
            </div>

            {error && (
              <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={registrar} disabled={cargando} style={{ padding: '16px', background: cargando ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 800, cursor: cargando ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: cargando ? 'none' : '0 8px 24px rgba(0,119,182,0.3)' }}>
              {cargando ? 'Registrando...' : '🤝 Quiero ser Chiring Partner'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', lineHeight: 1.6 }}>
              Gratis · Sin permanencia · Comisiones de por vida
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
          {[
            { icon: '⚡', text: 'Link al instante' },
            { icon: '💶', text: '1% de cada pedido' },
            { icon: '♾️', text: 'Sin límite de referidos' },
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