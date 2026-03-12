import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const isMobile = () => window.innerWidth < 768

export default function Partner() {
  const [mobile, setMobile] = useState(isMobile())
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [codigoGuardado, setCodigoGuardado] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    email: '',
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

  async function registrar() {
    if (!form.nombre || !form.email || !form.telefono || !form.ciudad) {
      setError('Por favor rellena todos los campos obligatorios')
      return
    }

    setCargando(true)
    setError('')

    try {
      const codigo_ref = generarCodigo(form.nombre)

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

      if (dbError) {
        if (dbError.message.includes('duplicate') || dbError.message.includes('unique')) {
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
          await fetch("https://rleznycvhifnxvqjfcex.supabase.co/functions/v1/enviar-partner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, nombre: form.nombre, codigo_ref: codigo_ref2 })
          })
          setPaso(2)
        } else {
          setError('Error al registrarte. Inténtalo de nuevo.')
          setCargando(false)
          return
        }
      } else {
        setCodigoGuardado(codigo_ref)
        await fetch("https://rleznycvhifnxvqjfcex.supabase.co/functions/v1/enviar-partner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, nombre: form.nombre, codigo_ref })
        })
        setPaso(2)
      }
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

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            📧 Te hemos enviado un email con tu link y todos los detalles a <strong style={{ color: 'white' }}>{form.email}</strong>
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
          <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>Rellena el formulario y en menos de 24h recibes tu link único</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>👤 Nombre completo *</label>
              <input style={inputStyle} placeholder="Tu nombre y apellidos" value={form.nombre} onChange={e => cambiar('nombre', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>📧 Email *</label>
                <input style={inputStyle} type="email" placeholder="tu@email.com" value={form.email} onChange={e => cambiar('email', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>📱 Teléfono *</label>
                <input style={inputStyle} type="tel" placeholder="600 000 000" value={form.telefono} onChange={e => cambiar('telefono', e.target.value)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>📍 Ciudad o zona donde operas *</label>
              <input style={inputStyle} placeholder="Ej: Costa del Sol, Murcia, Valencia..." value={form.ciudad} onChange={e => cambiar('ciudad', e.target.value)} />
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
            { icon: '⚡', text: 'Link listo en 24h' },
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