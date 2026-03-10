import { useState, useEffect } from 'react'

const isMobile = () => window.innerWidth < 768

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [mobile, setMobile] = useState(isMobile())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setMobile(isMobile())
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  const navBg = scrollY > 50 || menuOpen

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', background: '#fff', margin: 0, padding: 0 }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: navBg ? 'blur(12px)' : 'none',
        boxShadow: navBg ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: navBg ? '#0A2540' : 'white', letterSpacing: -1 }}>
            🌊 chiringapp
          </div>

          {/* Desktop nav */}
          {!mobile && (
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {['#como-funciona|Cómo funciona', '#precios|Precios', '#contacto|Contacto'].map(item => {
                const [href, label] = item.split('|')
                return <a key={href} href={href} style={{ color: navBg ? '#555' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{label}</a>
              })}
              <a href="/panel" style={{
                background: navBg ? 'linear-gradient(135deg,#00B4D8,#0077B6)' : 'rgba(255,255,255,0.2)',
                border: navBg ? 'none' : '2px solid rgba(255,255,255,0.6)',
                color: 'white', padding: '10px 22px', borderRadius: 50,
                textDecoration: 'none', fontSize: 14, fontWeight: 700,
              }}>Acceder al panel</a>
            </div>
          )}

          {/* Mobile hamburger */}
          {mobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: navBg ? '#0A2540' : 'white', fontSize: 24, padding: 4
            }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {/* Mobile menu dropdown */}
        {mobile && menuOpen && (
          <div style={{ background: 'white', padding: '16px 20px 24px', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['#como-funciona|Cómo funciona', '#precios|Precios', '#contacto|Contacto'].map(item => {
              const [href, label] = item.split('|')
              return <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>{label}</a>
            })}
            <a href="/panel" onClick={() => setMenuOpen(false)} style={{
              background: 'linear-gradient(135deg,#00B4D8,#0077B6)',
              color: 'white', padding: '14px', borderRadius: 50,
              textDecoration: 'none', fontSize: 15, fontWeight: 700, textAlign: 'center'
            }}>Acceder al panel</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 55%, #00B4D8 100%)',
        position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden',
        padding: mobile ? '100px 20px 80px' : '0 40px',
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 0, left: -80 }} />
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: mobile ? 50 : 80 }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 60, alignItems: 'center' }}>
          <div style={{ textAlign: mobile ? 'center' : 'left' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 20
            }}>🏖️ La app para chiringuitos de playa</div>

            <h1 style={{ fontSize: mobile ? 40 : 56, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: -2 }}>
              Pedidos desde<br />
              <span style={{ color: '#7FDBFF' }}>la hamaca.</span><br />
              Sin esperas.
            </h1>

            <p style={{ fontSize: mobile ? 15 : 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 32 }}>
              Tus clientes escanean el QR de su hamaca, piden y pagan desde el móvil. Tú recibes el pedido al instante.
            </p>

            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 12 }}>
              <a href="#registro" style={{
                background: 'white', color: '#0077B6', padding: '15px 28px',
                borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 800,
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center',
              }}>🚀 Quiero Chiring en mi chiringuito</a>
              <a href="#como-funciona" style={{
                background: 'transparent', color: 'white', padding: '15px 28px',
                borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.5)', textAlign: 'center',
              }}>Ver cómo funciona</a>
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

          {/* Phone mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              width: mobile ? 210 : 265, height: mobile ? 420 : 530,
              background: '#0A2540', borderRadius: 36,
              border: '7px solid rgba(255,255,255,0.15)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}>
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
              <div style={{
                position: 'absolute', top: 50, right: -10,
                background: 'white', borderRadius: 14, padding: '10px 14px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                fontSize: 12, fontWeight: 700, color: '#0A2540',
              }}>
                🔔 ¡Nuevo pedido!<br />
                <span style={{ color: '#00B4D8', fontSize: 11 }}>Hamaca 14B · 16,00€</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div id="como-funciona" style={{ padding: mobile ? '60px 20px' : '100px 40px', background: 'white' }}>
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
      <div style={{ padding: mobile ? '60px 20px' : '100px 40px', background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)' }}>
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
              { icon: '🪑', num: '30', label: 'hamacas máx.' },
              { icon: '📱', num: '2 min', label: 'para instalar' },
              { icon: '💶', num: '0%', label: 'comisión' },
              { icon: '🔔', num: '24/7', label: 'soporte' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: 18, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#0A2540', letterSpacing: -1 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRECIOS */}
      <div id="precios" style={{ padding: mobile ? '60px 20px' : '100px 40px', background: 'white' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Sin sorpresas</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 10 }}>Un precio simple y justo</h2>
            <p style={{ fontSize: 15, color: '#666' }}>Sin comisiones por pedido. Sin letras pequeñas.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            {[
              { plan: 'Básico', precio: '29', badge: null, dark: false, features: ['Hasta 20 hamacas', 'Menú digital ilimitado', 'Panel en tiempo real', 'Estadísticas básicas', 'Soporte por email'] },
              { plan: 'Pro', precio: '49', badge: '⭐ Más popular', dark: true, features: ['Hamacas ilimitadas', 'Menú digital ilimitado', 'Panel en tiempo real', 'Estadísticas avanzadas', 'Soporte prioritario 24/7', 'Personalización del menú'] },
            ].map(p => (
              <div key={p.plan} style={{
                background: p.dark ? 'linear-gradient(135deg,#0A2540,#0077B6)' : '#F8FAFF',
                border: p.dark ? 'none' : '2px solid #E0E8FF',
                borderRadius: 24, padding: 28, position: 'relative',
                boxShadow: p.dark ? '0 20px 50px rgba(0,119,182,0.3)' : '0 4px 16px rgba(0,0,0,0.04)',
                marginTop: p.badge ? 16 : 0,
              }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: '#FFD700', color: '#0A2540', padding: '5px 18px', borderRadius: 50, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>{p.badge}</div>
                )}
                <div style={{ fontSize: 15, fontWeight: 800, color: p.dark ? 'rgba(255,255,255,0.7)' : '#666', marginBottom: 6 }}>{p.plan}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: p.dark ? 'white' : '#0A2540', lineHeight: 1 }}>{p.precio}€</span>
                  <span style={{ fontSize: 14, color: p.dark ? 'rgba(255,255,255,0.5)' : '#aaa' }}>/mes</span>
                </div>
                <div style={{ fontSize: 12, color: p.dark ? 'rgba(255,255,255,0.4)' : '#bbb', marginBottom: 22 }}>+ IVA · Sin permanencia</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ color: p.dark ? '#7FDBFF' : '#00B4D8', fontWeight: 800 }}>✓</span>
                      <span style={{ fontSize: 13, color: p.dark ? 'rgba(255,255,255,0.85)' : '#444' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#registro" style={{ display: 'block', textAlign: 'center', background: p.dark ? 'white' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: p.dark ? '#0077B6' : 'white', padding: '13px', borderRadius: 50, textDecoration: 'none', fontSize: 14, fontWeight: 800 }}>Empezar ahora →</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#aaa' }}>
            ¿Tienes varios chiringuitos? <a href="#contacto" style={{ color: '#00B4D8', fontWeight: 700 }}>Contacta para precio especial</a>
          </div>
        </div>
      </div>

      {/* REGISTRO */}
      <div id="registro" style={{
        padding: mobile ? '60px 20px' : '100px 40px',
        background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 60%, #00B4D8 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🏖️</div>
          <h2 style={{ fontSize: mobile ? 28 : 40, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 12 }}>¿Listo para empezar?</h2>
          <p style={{ fontSize: mobile ? 14 : 16, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            Primer mes gratis. Configuración incluida. Sin permanencia.
          </p>
          <RegistroForm mobile={mobile} />
        </div>
      </div>

      {/* CONTACTO */}
      <div id="contacto" style={{ padding: mobile ? '50px 20px' : '80px 40px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: mobile ? 24 : 30, fontWeight: 900, color: '#0A2540', marginBottom: 10 }}>¿Tienes preguntas?</h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 26 }}>Te respondemos en menos de 24 horas</p>
          <a href="mailto:hola@chiringapp.com" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', padding: '14px 34px', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,119,182,0.25)' }}>
            📧 hola@chiringapp.com
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0A2540', padding: mobile ? '28px 20px' : '36px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>🌊 chiringapp</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2026 ChiringApp · Todos los derechos reservados</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacidad</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Términos</a>
            <a href="/panel" style={{ color: '#00B4D8', textDecoration: 'none', fontWeight: 700 }}>Panel ↗</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function RegistroForm({ mobile }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit() {
    if (!nombre || !email) return
    setEnviando(true)
    await new Promise(r => setTimeout(r, 1000))
    setEnviado(true)
    setEnviando(false)
  }

  if (enviado) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 22, padding: 28, backdropFilter: 'blur(10px)' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 8 }}>¡Solicitud recibida!</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Te contactamos en menos de 24 horas para configurar tu chiringuito.</div>
      </div>
    )
  }

  const inputStyle = {
    padding: '14px 18px', borderRadius: 14,
    border: '1.5px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.1)', color: 'white',
    fontSize: 15, fontFamily: 'Poppins, sans-serif',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 22, padding: mobile ? 22 : 32, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input style={inputStyle} placeholder="Nombre de tu chiringuito" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input style={inputStyle} placeholder="Tu email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} placeholder="Teléfono (opcional)" value={telefono} onChange={e => setTelefono(e.target.value)} />
        <button
          onClick={handleSubmit}
          disabled={enviando || !nombre || !email}
          style={{
            padding: '15px', background: (enviando || !nombre || !email) ? 'rgba(255,255,255,0.4)' : 'white',
            color: '#0077B6', border: 'none', borderRadius: 50,
            fontSize: 15, fontWeight: 800, cursor: nombre && email ? 'pointer' : 'default',
            fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >{enviando ? 'Enviando...' : '🚀 Quiero empezar — primer mes gratis'}</button>
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>
        Sin permanencia · Primer mes gratis · Configuración incluida
      </div>
    </div>
  )
}
