import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const isMobile = () => window.innerWidth < 768

function IconoHamaca({ size = 28, color = '#0A2540' }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
      <path d="M4 2v16M28 2v16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 14.5 Q16 5 26 14.5" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [mobile, setMobile] = useState(isMobile())
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })
  const [formEnviado, setFormEnviado] = useState(false)
  const [formCargando, setFormCargando] = useState(false)
  const [formError, setFormError] = useState('')
  const [partnerModal, setPartnerModal] = useState(false)
  const [partnerLogin, setPartnerLogin] = useState({ email: '', password: '' })
  const [partnerError, setPartnerError] = useState('')
  const [partnerCargando, setPartnerCargando] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setMobile(isMobile())
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  const navBg = scrollY > 50 || menuOpen

  async function enviarContacto() {
    if (!formData.nombre || !formData.email || !formData.mensaje) return
    setFormCargando(true)
    setFormError('')
    try {
      const { data, error } = await supabase.functions.invoke('enviar-contacto', {
        body: { nombre: formData.nombre, email: formData.email, mensaje: formData.mensaje }
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      setFormEnviado(true)
    } catch (e) {
      setFormError(e?.message || 'No se pudo enviar. Inténtalo de nuevo o escribe a appchiring@gmail.com')
    }
    setFormCargando(false)
  }

  async function loginPartner() {
    if (!partnerLogin.email || !partnerLogin.password) {
      setPartnerError('Rellena todos los campos')
      return
    }
    setPartnerCargando(true)
    setPartnerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: partnerLogin.email,
      password: partnerLogin.password,
    })
    if (error) {
      setPartnerError('Email o contraseña incorrectos')
      setPartnerCargando(false)
    } else {
      window.location.href = '/partner'
    }
  }

  const faqs = [
    { q: '¿Necesito instalar alguna app?', r: 'No. Ni tú ni tus clientes necesitáis instalar nada. Todo funciona desde el navegador del móvil.' },
    { q: '¿Cómo recibo el dinero de los pedidos?', r: 'A través de Stripe, directamente en tu cuenta bancaria. El dinero llega en 2-7 días hábiles.' },
    { q: '¿Qué pasa si el cliente no tiene tarjeta?', r: 'De momento solo aceptamos pago con tarjeta. Es la forma más rápida y segura para ti y para el cliente.' },
    { q: '¿Cuántas hamacas puedo tener?', r: 'Las que necesites. Puedes añadir tantas hamacas como tenga tu chiringuito, sin límite.' },
    { q: '¿Puedo cambiar el menú cuando quiera?', r: 'Sí, desde el panel puedes añadir, editar o desactivar productos en cualquier momento, al instante.' },
    { q: '¿Hay permanencia o contrato?', r: 'No. Sin permanencia, sin cuota mensual. Solo pagas el 15% cuando procesas un pedido.' },
  ]

  const testimonios = [
    { nombre: 'Carlos M.', lugar: 'Chiringuito La Brisa · Marbella', texto: 'Desde que usamos Chiring los clientes piden el doble. Ya no hay que ir mesa por mesa, el pedido llega solo al panel.', estrellas: 5 },
    { nombre: 'Marta L.', lugar: 'Beach Club Playa Bella · Almería', texto: 'Lo que más me gusta es que el cobro es automático. Sin cambio, sin olvidarse de pagar. Perfecto para el verano.', estrellas: 5 },
    { nombre: 'Paco R.', lugar: 'Chiringuito El Ancla · Torrevieja', texto: 'En 15 minutos lo teníamos todo configurado. Los clientes flipan cuando ven que pueden pedir desde la hamaca.', estrellas: 5 },
    { nombre: 'Lucía F.', lugar: 'La Palmera Beach · Benidorm', texto: 'Antes perdíamos ventas porque los clientes no se levantaban a pedir. Ahora piden desde la hamaca sin pensárselo.', estrellas: 5 },
    { nombre: 'Javi S.', lugar: 'Chiringuito Marea Alta · Cádiz', texto: 'El panel en tiempo real es una pasada. Escuchas el sonido del pedido y ya sabes lo que tienes que preparar.', estrellas: 5 },
    { nombre: 'Ana P.', lugar: 'Sol y Sal Beach Bar · Málaga', texto: 'Hemos aumentado el ticket medio un 30%. La gente pide más cuando ve el menú completo en el móvil.', estrellas: 5 },
    { nombre: 'Rafa G.', lugar: 'Chiringuito Poniente · Huelva', texto: 'Sin cuota mensual y solo pagamos cuando vendemos. Para un chiringuito de temporada es perfecto.', estrellas: 5 },
    { nombre: 'Elena T.', lugar: 'La Ola Beach Club · Valencia', texto: 'El soporte es muy rápido. Tuvimos una duda el primer día y nos la resolvieron en minutos. Muy recomendable.', estrellas: 5 },
  ]

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', background: '#fff', margin: 0, padding: 0, width: '100%' }}>

      {/* MODAL PARTNER LOGIN */}
      {partnerModal && (
        <div onClick={() => setPartnerModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: 36, maxWidth: 420, width: '100%', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🤝</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0A2540', marginBottom: 4 }}>Chiring Partners</h2>
              <p style={{ fontSize: 13, color: '#888' }}>Inicia sesión en tu panel de partner</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>📧 Email</label>
                <input style={inputStyle} type="email" placeholder="tu@email.com" value={partnerLogin.email} onChange={e => { setPartnerLogin(f => ({ ...f, email: e.target.value })); setPartnerError('') }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>🔒 Contraseña</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={partnerLogin.password} onChange={e => { setPartnerLogin(f => ({ ...f, password: e.target.value })); setPartnerError('') }} onKeyDown={e => e.key === 'Enter' && loginPartner()} />
              </div>

              {partnerError && (
                <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>
                  ⚠️ {partnerError}
                </div>
              )}

              <button onClick={loginPartner} disabled={partnerCargando} style={{ padding: '14px', background: partnerCargando ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: partnerCargando ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                {partnerCargando ? 'Entrando...' : 'Entrar al panel'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#888', lineHeight: 1.8 }}>
                ¿No tienes cuenta?{' '}
                <a href="/partner" style={{ color: '#0077B6', fontWeight: 700, textDecoration: 'none' }}>Regístrate como partner</a>
                <br />
                <a href="/partner?reset=1" style={{ color: '#aaa', fontSize: 12, textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, width: '100%',
        background: navBg ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: navBg ? 'blur(12px)' : 'none',
        boxShadow: navBg ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: navBg ? '#0A2540' : 'white', letterSpacing: -1 }}>
            🌊 chiringapp
          </div>
          {!mobile && (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              {['#como-funciona|Cómo funciona', '#precios|Precios', '#testimonios|Opiniones', '#faq|FAQ', '#contacto|Contacto'].map(item => {
                const [href, label] = item.split('|')
                return <a key={href} href={href} style={{ color: navBg ? '#555' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>{label}</a>
              })}
              <button onClick={() => setPartnerModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: navBg ? '#555' : 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif', padding: 0 }}>Partners</button>
              <a href="/panel" style={{ color: navBg ? '#0077B6' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Iniciar sesión</a>
              <a href="/registro" style={{
                background: navBg ? 'linear-gradient(135deg,#00B4D8,#0077B6)' : 'white',
                color: navBg ? 'white' : '#0077B6',
                padding: '10px 22px', borderRadius: 50, textDecoration: 'none', fontSize: 13, fontWeight: 700,
                boxShadow: navBg ? 'none' : '0 4px 15px rgba(0,0,0,0.15)',
              }}>Registrarse gratis</a>
            </div>
          )}
          {mobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: navBg ? '#0A2540' : 'white', fontSize: 24, padding: 4 }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
        {mobile && menuOpen && (
          <div style={{ background: 'white', padding: '16px 20px 24px', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['#como-funciona|Cómo funciona', '#precios|Precios', '#testimonios|Opiniones', '#colabora|Partners', '#faq|FAQ', '#contacto|Contacto'].map(item => {
              const [href, label] = item.split('|')
              return <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>{label}</a>
            })}
            <button onClick={() => { setMenuOpen(false); setPartnerModal(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0077B6', fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif', textAlign: 'left', padding: 0 }}>Acceso Partners</button>
            <a href="/panel" onClick={() => setMenuOpen(false)} style={{ color: '#0077B6', textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>Iniciar sesión</a>
            <a href="/registro" onClick={() => setMenuOpen(false)} style={{ background: 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', padding: '14px', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700, textAlign: 'center' }}>Registrarse gratis</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh', width: '100%',
        background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 55%, #00B4D8 100%)',
        position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden',
        padding: mobile ? '100px 24px 80px' : '0 40px',
        boxSizing: 'border-box',
      }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -150, right: -150 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -100, left: -100 }} />
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: mobile ? 50 : 80 }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 60, alignItems: 'center' }}>
          <div style={{ textAlign: mobile ? 'center' : 'left' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 20 }}>
              🏖️ La app para chiringuitos de playa
            </div>
            <h1 style={{ fontSize: mobile ? 40 : 58, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: -2 }}>
              Pedidos desde<br />
              <span style={{ color: '#7FDBFF' }}>la hamaca.</span><br />
              Sin esperas.
            </h1>
            <p style={{ fontSize: mobile ? 15 : 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 32 }}>
              Tus clientes escanean el QR de su hamaca, piden y pagan desde el móvil. Tú recibes el pedido al instante.
            </p>
            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 12 }}>
              <a href="/registro" style={{ background: 'white', color: '#0077B6', padding: '15px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                🚀 Quiero Chiring en mi chiringuito
              </a>
              <a href="#como-funciona" style={{ background: 'transparent', color: 'white', padding: '15px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700, border: '2px solid rgba(255,255,255,0.5)', textAlign: 'center' }}>
                Ver cómo funciona
              </a>
            </div>
            <div style={{ display: 'flex', gap: mobile ? 20 : 32, marginTop: 40, justifyContent: mobile ? 'center' : 'flex-start' }}>
              {[['🏖️', '+50', 'Chiringuitos'], ['📱', '+2.000', 'Pedidos/mes'], ['⭐', '4.9', 'Valoración']].map(([icon, num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: mobile ? 18 : 20, fontWeight: 900, color: 'white' }}>{icon} {num}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: mobile ? 210 : 265, height: mobile ? 420 : 530, background: '#0A2540', borderRadius: 36, border: '7px solid rgba(255,255,255,0.15)', boxShadow: '0 30px 70px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg,#00B4D8,#0077B6)', padding: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>🌊 Chiring</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Chiringuito Playa Sol · 🪑 14B</div>
              </div>
              <div style={{ background: '#F0F8FF', padding: 12 }}>
                {[
                  { icon: '🍺', name: 'Cerveza Estrella', desc: 'Bien fresquita', price: '3,50€' },
                  { icon: '🥪', name: 'Bocadillo Calamares', desc: 'Con alioli', price: '5,50€' },
                  { icon: '🥤', name: 'Mojito', desc: 'Con hierbabuena', price: '7,00€' },
                ].map(p => (
                  <div key={p.name} style={{ background: 'white', borderRadius: 12, padding: 10, marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ fontSize: 22 }}>{p.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 11, color: '#0A2540' }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: '#aaa' }}>{p.desc}</div>
                      </div>
                      <div style={{ fontWeight: 900, color: '#00B4D8', fontSize: 11 }}>{p.price}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: 'linear-gradient(135deg,#00B4D8,#0077B6)', borderRadius: 12, padding: 11, textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 12 }}>🛒 Ver carrito · 16,00€</div>
                </div>
              </div>
            </div>
            {!mobile && (
              <div style={{ position: 'absolute', top: 50, right: -10, background: 'white', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', fontSize: 12, fontWeight: 700, color: '#0A2540' }}>
                🔔 ¡Nuevo pedido!<br />
                <span style={{ color: '#00B4D8', fontSize: 11 }}>Hamaca 14B · 16,00€</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div id="como-funciona" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'white', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Así de simple</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 12 }}>Cómo funciona Chiring</h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 480, margin: '0 auto' }}>En 3 pasos tu chiringuito empieza a recibir pedidos sin que nadie se levante</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 20 }}>
            {[
              { num: '01', icon: '📱', title: 'Escanea el QR', desc: 'Cada hamaca tiene su propio QR. El cliente lo escanea y accede al menú al instante desde el móvil.', color: '#E0F8FF' },
              { num: '02', icon: '🛒', title: 'Pide y paga', desc: 'Elige, añade al carrito y paga con tarjeta directamente desde el móvil. Sin colas, sin camarero.', color: '#FFF5E0' },
              { num: '03', icon: '🏖️', title: 'Tú lo llevas', desc: 'Recibes el pedido en tu panel en tiempo real con alerta de sonido. Lo preparas y lo llevas a la hamaca.', color: '#E8FFE8' },
            ].map(s => (
              <div key={s.num} style={{ background: s.color, borderRadius: 22, padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 60, fontWeight: 900, color: 'rgba(0,0,0,0.05)', position: 'absolute', top: -8, right: 12, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 38, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFICIOS */}
      <div style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>¿Por qué Chiring?</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1 }}>Más ventas. Menos trabajo.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            {[
              { icon: '💰', title: 'Aumenta tu ticket medio', desc: 'Los clientes piden más cuando ven el menú completo con precios. Sin vergüenza de llamar al camarero.' },
              { icon: '⚡', title: 'Gestión en tiempo real', desc: 'Panel en directo con todos los pedidos, alerta de sonido y estadísticas de ventas.' },
              { icon: '📊', title: 'Control total', desc: 'Productos, precios, hamacas... todo lo gestionas tú mismo desde el panel sin ayuda.' },
              { icon: '💳', title: 'Cobros automáticos', desc: 'El cliente paga al pedir. Sin cambio, sin olvidarse. El dinero llega directo a tu cuenta.' },
            ].map(b => (
              <div key={b.title} style={{ background: 'white', borderRadius: 18, padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 26, background: '#F0F8FF', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0A2540', fontSize: 15, marginBottom: 5 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 14, marginTop: 24 }}>
            {[
              { icon: 'hamaca', num: '∞', label: 'hamacas (las que necesites)' },
              { icon: '📱', num: '2 min', label: 'para instalar' },
              { icon: '💶', num: '15%', label: 'solo si vendes' },
              { icon: '🔔', num: '24/7', label: 'soporte' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: 18, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon === 'hamaca' ? <IconoHamaca size={32} /> : s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#0A2540', letterSpacing: -1 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIOS */}
      <div id="testimonios" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'white', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Opiniones</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 12 }}>Lo que dicen nuestros clientes</h2>
            <p style={{ fontSize: 15, color: '#666' }}>Chiringuitos que ya usan Chiring cada día</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr 1fr', gap: 18 }}>
            {testimonios.map((t, i) => (
              <div key={i} style={{ background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)', borderRadius: 22, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 16, marginBottom: 12, color: '#FFB800' }}>{'★'.repeat(t.estrellas)}</div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>"{t.texto}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#00B4D8,#0077B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 800, flexShrink: 0 }}>
                    {t.nombre[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: '#0A2540' }}>{t.nombre}</div>
                    <div style={{ fontSize: 10, color: '#888' }}>{t.lugar}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRECIOS */}
      <div id="precios" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Sin sorpresas</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 10 }}>Solo pagas cuando vendes</h2>
            <p style={{ fontSize: 15, color: '#666' }}>15% por pedido procesado. Sin cuotas fijas. Sin letras pequeñas.</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#0A2540,#0077B6)', borderRadius: 24, padding: mobile ? 28 : 40, boxShadow: '0 20px 50px rgba(0,119,182,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Precio único</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: 'white', lineHeight: 1 }}>15%</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32, marginTop: 8 }}>por pedido procesado · sin cuota mensual</div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 32, textAlign: 'left' }}>
              {['Hamacas ilimitadas', 'Menú digital ilimitado', 'Panel en tiempo real', 'Estadísticas completas', 'Soporte prioritario 24/7', 'Sin permanencia'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#7FDBFF', fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="/registro" style={{ display: 'inline-block', background: 'white', color: '#0077B6', padding: '16px 40px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>
              Empezar gratis →
            </a>
          </div>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#aaa' }}>
            ¿Tienes varios chiringuitos? <a href="#contacto" style={{ color: '#00B4D8', fontWeight: 700 }}>Contacta para precio especial</a>
          </div>
        </div>
      </div>

      {/* COLABORA CON NOSOTROS */}
      <div id="colabora" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'white', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Colabora con nosotros</div>
            <h2 style={{ fontSize: mobile ? 30 : 42, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 14 }}>¿Conoces chiringuitos?<br />Gana comisión por cada uno.</h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Conviértete en Chiring Partner, consigue tu link único y gana el <strong>1% de cada pedido</strong> de los chiringuitos que traigas. Sin límite.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 24, marginBottom: 56 }}>
            {[
              { icon: '🔗', title: 'Tu link único', desc: 'Recibes un link personalizado para compartir con chiringuitos. Cada registro con tu link se asocia automáticamente a ti.', color: '#E0F8FF' },
              { icon: '💰', title: '1% de comisión', desc: 'Ganas el 1% de cada pedido procesado por los chiringuitos que hayas traído. Sin techo, sin caducidad.', color: '#FFF5E0' },
              { icon: '📊', title: 'Panel de seguimiento', desc: 'Accede a tu panel personal para ver tus chiringuitos, pedidos generados y comisiones acumuladas en tiempo real.', color: '#E8FFE8' },
            ].map(c => (
              <div key={c.title} style={{ background: c.color, borderRadius: 22, padding: 28, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0A2540', marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg,#0A2540,#0077B6)', borderRadius: 24, padding: mobile ? 28 : 48, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,119,182,0.2)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
            <h3 style={{ fontSize: mobile ? 24 : 32, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 12 }}>
              ¿Listo para ser Chiring Partner?
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
              Regístrate gratis, recibe tu link único y empieza a ganar comisiones desde el primer chiringuito.
            </p>
            <a href="/partner" style={{
              display: 'inline-block', background: 'white', color: '#0077B6',
              padding: '18px 44px', borderRadius: 50, textDecoration: 'none',
              fontSize: 16, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}>
              🤝 Conviértete en Chiring Partner
            </a>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
              Gratis · Sin permanencia · Comisiones de por vida
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 12 }}>Preguntas frecuentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1.5px solid #E0E8F0', borderRadius: 16, overflow: 'hidden', background: 'white' }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width: '100%', padding: '18px 20px', background: faqOpen === i ? '#F0F8FF' : 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: '#0A2540', textAlign: 'left',
                }}>
                  {faq.q}
                  <span style={{ fontSize: 20, color: '#00B4D8', marginLeft: 10, flexShrink: 0 }}>{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 14, color: '#555', lineHeight: 1.7, background: '#F0F8FF' }}>
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 60%, #00B4D8 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🏖️</div>
          <h2 style={{ fontSize: mobile ? 28 : 40, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 12 }}>¿Listo para empezar?</h2>
          <p style={{ fontSize: mobile ? 14 : 16, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            Configura tu chiringuito en 2 minutos. Solo pagas cuando vendes.
          </p>
          <a href="/registro" style={{ display: 'inline-block', background: 'white', color: '#0077B6', padding: '18px 40px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            🚀 Crear mi cuenta gratis
          </a>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>
            ¿Ya tienes cuenta? <a href="/panel" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>Inicia sesión aquí</a>
          </div>
        </div>
      </div>

      {/* CONTACTO */}
      <div id="contacto" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: '#F8FAFF', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Contacto</div>
            <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 10 }}>¿Tienes preguntas?</h2>
            <p style={{ fontSize: 14, color: '#666' }}>Te respondemos en menos de 24 horas</p>
          </div>
          {formEnviado ? (
            <div style={{ background: 'white', borderRadius: 22, padding: 40, textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0A2540', marginBottom: 8 }}>¡Mensaje enviado!</h3>
              <p style={{ fontSize: 14, color: '#666' }}>Te responderemos en menos de 24 horas en <strong>{formData.email}</strong></p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 22, padding: mobile ? 24 : 40, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>Nombre *</label>
                    <input style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} placeholder="Tu nombre" value={formData.nombre} onChange={e => setFormData(f => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>Email *</label>
                    <input style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} type="email" placeholder="tu@email.com" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>Mensaje *</label>
                  <textarea style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540', resize: 'vertical', minHeight: 120 }} placeholder="¿En qué podemos ayudarte?" value={formData.mensaje} onChange={e => setFormData(f => ({ ...f, mensaje: e.target.value }))} />
                </div>
                {formError && (
                  <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>
                    ⚠️ {formError}
                  </div>
                )}
                <button onClick={enviarContacto} disabled={formCargando || !formData.nombre || !formData.email || !formData.mensaje} style={{ padding: '14px', background: (!formData.nombre || !formData.email || !formData.mensaje) ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: (!formData.nombre || !formData.email || !formData.mensaje) ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  {formCargando ? 'Enviando...' : '📧 Enviar mensaje'}
                </button>
                <div style={{ textAlign: 'center', fontSize: 13, color: '#aaa' }}>
                  O escríbenos directamente a <a href="mailto:appchiring@gmail.com" style={{ color: '#00B4D8', fontWeight: 700 }}>appchiring@gmail.com</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0A2540', padding: mobile ? '40px 24px' : '50px 40px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 12 }}>🌊 chiringapp</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 260 }}>
                La app de pedidos para chiringuitos de playa. Sin esperas, sin colas, sin camareros.
              </p>
              <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                📧 <a href="mailto:appchiring@gmail.com" style={{ color: '#00B4D8', textDecoration: 'none' }}>appchiring@gmail.com</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Producto</div>
              {['#como-funciona|Cómo funciona', '#precios|Precios', '#faq|FAQ', '/registro|Registrarse gratis'].map(item => {
                const [href, label] = item.split('|')
                return <div key={href} style={{ marginBottom: 8 }}><a href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{label}</a></div>
              })}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Cuenta</div>
              {['/panel|Iniciar sesión', '/registro|Crear cuenta', '#contacto|Soporte', '/partner|Ser Partner'].map(item => {
                const [href, label] = item.split('|')
                return <div key={href} style={{ marginBottom: 8 }}><a href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{label}</a></div>
              })}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Legal</div>
              {['/privacidad|Política de privacidad', '/terminos|Términos de uso', '/cookies|Cookies'].map(item => {
                const [href, label] = item.split('|')
                return <div key={label} style={{ marginBottom: 8 }}><a href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{label}</a></div>
              })}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 ChiringApp · Todos los derechos reservados</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Hecho con ❤️ para los chiringuitos de España</div>
          </div>
        </div>
      </footer>
    </div>
  )
}