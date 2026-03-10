import { useState, useEffect } from 'react'

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', background: '#fff' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(12px)' : 'none',
        boxShadow: scrollY > 50 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 40px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: scrollY > 50 ? '#0A2540' : 'white', letterSpacing: -1 }}>
            🌊 chiringapp
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#como-funciona" style={{ color: scrollY > 50 ? '#555' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Cómo funciona</a>
            <a href="#precios" style={{ color: scrollY > 50 ? '#555' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Precios</a>
            <a href="#contacto" style={{ color: scrollY > 50 ? '#555' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Contacto</a>
            <a href="/panel" style={{
              background: scrollY > 50 ? 'linear-gradient(135deg,#00B4D8,#0077B6)' : 'rgba(255,255,255,0.2)',
              border: scrollY > 50 ? 'none' : '2px solid rgba(255,255,255,0.6)',
              color: 'white', padding: '10px 24px', borderRadius: 50,
              textDecoration: 'none', fontSize: 14, fontWeight: 700,
              transition: 'all 0.2s'
            }}>Acceder al panel</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 50%, #00B4D8 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -50, left: -100 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,180,216,0.2)', top: '30%', right: '20%' }} />

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 120 }}>
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', paddingTop: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 50, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 24
            }}>
              🏖️ La app para chiringuitos de playa
            </div>
            <h1 style={{
              fontSize: 58, fontWeight: 900, color: 'white', lineHeight: 1.1,
              marginBottom: 24, letterSpacing: -2
            }}>
              Pedidos desde<br />
              <span style={{ color: '#7FDBFF' }}>la hamaca.</span><br />
              Sin esperas.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Tus clientes escanean el QR de su hamaca, piden y pagan desde el móvil. Tú recibes el pedido al instante en el panel.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#registro" style={{
                background: 'white', color: '#0077B6', padding: '16px 36px',
                borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 800,
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
              }}>
                🚀 Quiero Chiring en mi chiringuito
              </a>
              <a href="#como-funciona" style={{
                background: 'transparent', color: 'white', padding: '16px 36px',
                borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.5)',
              }}>
                Ver cómo funciona
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {[['🏖️', '+50', 'Chiringuitos'], ['📱', '+2.000', 'Pedidos/mes'], ['⭐', '4.9', 'Valoración']].map(([icon, num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{icon} {num}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              width: 280, height: 560, background: '#0A2540',
              borderRadius: 40, border: '8px solid rgba(255,255,255,0.15)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
              overflow: 'hidden', position: 'relative'
            }}>
              {/* Phone screen */}
              <div style={{ background: 'linear-gradient(135deg,#00B4D8,#0077B6)', padding: 20, paddingBottom: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>🌊 Chiring</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Chiringuito Playa Sol</div>
              </div>
              <div style={{ background: '#F0F8FF', padding: 16, height: '100%' }}>
                <div style={{ background: 'white', borderRadius: 16, padding: 14, marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontSize: 28 }}>🍺</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0A2540' }}>Cerveza Estrella</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>Bien fresquita</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#00B4D8', fontSize: 14 }}>3,50€</div>
                  </div>
                </div>
                <div style={{ background: 'white', borderRadius: 16, padding: 14, marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontSize: 28 }}>🥪</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0A2540' }}>Bocadillo Calamares</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>Con alioli</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#00B4D8', fontSize: 14 }}>5,50€</div>
                  </div>
                </div>
                <div style={{ background: 'linear-gradient(135deg,#00B4D8,#0077B6)', borderRadius: 16, padding: 14, textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>🛒 Ver carrito (2)</div>
                </div>
                {/* QR hint */}
                <div style={{ textAlign: 'center', marginTop: 16, padding: '10px', background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#aaa', fontWeight: 600 }}>🪑 Hamaca 14B · Escanea el QR</div>
                </div>
              </div>
            </div>
            {/* Floating notification */}
            <div style={{
              position: 'absolute', top: 60, right: -20,
              background: 'white', borderRadius: 16, padding: '12px 16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              fontSize: 12, fontWeight: 700, color: '#0A2540',
              animation: 'none'
            }}>
              🔔 ¡Nuevo pedido!<br />
              <span style={{ color: '#00B4D8', fontSize: 11 }}>Hamaca 14B · 9,00€</span>
            </div>
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div id="como-funciona" style={{ padding: '100px 40px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Así de simple</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 16 }}>Cómo funciona Chiring</h2>
            <p style={{ fontSize: 18, color: '#666', maxWidth: 500, margin: '0 auto' }}>En 3 pasos tu chiringuito empieza a recibir pedidos sin que nadie se levante de la hamaca</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
            {[
              { num: '01', icon: '📱', title: 'El cliente escanea el QR', desc: 'Cada hamaca tiene su propio código QR. El cliente lo escanea con el móvil y accede al menú de tu chiringuito al instante.', color: '#E0F8FF' },
              { num: '02', icon: '🛒', title: 'Pide y paga', desc: 'Elige lo que quiere, añade al carrito y paga directamente desde el móvil con tarjeta. Sin esperas, sin llamar al camarero.', color: '#FFF0E0' },
              { num: '03', icon: '🏖️', title: 'Tú lo llevas a la hamaca', desc: 'Recibes el pedido en tu panel en tiempo real con sonido de alerta. Preparas y llevas el pedido a la hamaca indicada.', color: '#E8FFE8' },
            ].map(step => (
              <div key={step.num} style={{
                background: step.color, borderRadius: 24, padding: 36,
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ fontSize: 72, fontWeight: 900, color: 'rgba(0,0,0,0.05)', position: 'absolute', top: -10, right: 16, lineHeight: 1 }}>{step.num}</div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFICIOS */}
      <div style={{ padding: '100px 40px', background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>¿Por qué Chiring?</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 32 }}>Más ventas.<br />Menos trabajo.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: '💰', title: 'Aumenta tu ticket medio', desc: 'Los clientes piden más cuando ven el menú completo con fotos y precios. Sin vergüenza de llamar al camarero.' },
                { icon: '⚡', title: 'Gestión en tiempo real', desc: 'Panel en directo con todos los pedidos, sonido de alerta y estadísticas de ventas por día, semana o mes.' },
                { icon: '📊', title: 'Control total de tu negocio', desc: 'Productos, categorías, precios, hamacas... todo lo gestionas tú mismo desde el panel sin necesitar ayuda.' },
                { icon: '💳', title: 'Cobros automáticos', desc: 'El cliente paga con tarjeta al pedir. Sin cambio, sin olvidarse de pagar. El dinero llega directamente a tu cuenta.' },
              ].map(b => (
                <div key={b.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 28, background: 'white', borderRadius: 14, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>{b.icon}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0A2540', fontSize: 16, marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🪑', num: '30', label: 'hamacas max por chiringuito', color: '#E0F8FF' },
              { icon: '📱', num: '2 min', label: 'para instalar en tu chiringuito', color: '#FFF0E0' },
              { icon: '💶', num: '0%', label: 'comisión por pedido', color: '#E8FFE8' },
              { icon: '🔔', num: '24/7', label: 'soporte para tu negocio', color: '#F0E8FF' },
            ].map(s => (
              <div key={s.label} style={{ background: s.color, borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#0A2540', letterSpacing: -1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRECIOS */}
      <div id="precios" style={{ padding: '100px 40px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Sin sorpresas</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 16 }}>Un precio simple y justo</h2>
            <p style={{ fontSize: 18, color: '#666' }}>Sin comisiones por pedido. Sin letras pequeñas.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              {
                plan: 'Básico', precio: '29', periodo: 'mes', color: '#F8FAFF',
                border: '2px solid #E0E8FF', badge: null,
                features: ['Hasta 20 hamacas', 'Menú digital ilimitado', 'Panel en tiempo real', 'Estadísticas básicas', 'Soporte por email'],
                btn: { bg: 'white', color: '#0077B6', border: '2px solid #0077B6' }
              },
              {
                plan: 'Pro', precio: '49', periodo: 'mes', color: 'linear-gradient(135deg,#0A2540,#0077B6)',
                border: 'none', badge: '⭐ Más popular',
                features: ['Hamacas ilimitadas', 'Menú digital ilimitado', 'Panel en tiempo real', 'Estadísticas avanzadas', 'Soporte prioritario 24/7', 'Personalización del menú'],
                btn: { bg: 'white', color: '#0077B6', border: 'none' }
              },
            ].map(p => (
              <div key={p.plan} style={{
                background: p.color, border: p.border, borderRadius: 28,
                padding: 40, width: 320, position: 'relative',
                boxShadow: p.badge ? '0 20px 60px rgba(0,119,182,0.3)' : '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                    background: '#FFD700', color: '#0A2540', padding: '6px 20px',
                    borderRadius: 50, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap'
                  }}>{p.badge}</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 800, color: p.badge ? 'rgba(255,255,255,0.7)' : '#666', marginBottom: 8 }}>{p.plan}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 56, fontWeight: 900, color: p.badge ? 'white' : '#0A2540', lineHeight: 1 }}>{p.precio}€</span>
                  <span style={{ fontSize: 16, color: p.badge ? 'rgba(255,255,255,0.6)' : '#aaa' }}>/{p.periodo}</span>
                </div>
                <div style={{ fontSize: 13, color: p.badge ? 'rgba(255,255,255,0.5)' : '#aaa', marginBottom: 28 }}>+ IVA · Sin permanencia</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ color: p.badge ? '#7FDBFF' : '#00B4D8', fontWeight: 800, fontSize: 16 }}>✓</span>
                      <span style={{ fontSize: 14, color: p.badge ? 'rgba(255,255,255,0.85)' : '#444' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#registro" style={{
                  display: 'block', textAlign: 'center',
                  background: p.btn.bg, color: p.btn.color, border: p.btn.border,
                  padding: '14px', borderRadius: 50,
                  textDecoration: 'none', fontSize: 15, fontWeight: 800,
                }}>
                  Empezar ahora →
                </a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#aaa' }}>
            ¿Tienes varios chiringuitos? <a href="#contacto" style={{ color: '#00B4D8', fontWeight: 700 }}>Contacta para un plan personalizado</a>
          </div>
        </div>
      </div>

      {/* REGISTRO CTA */}
      <div id="registro" style={{
        padding: '100px 40px',
        background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 60%, #00B4D8 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🏖️</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 16 }}>
            ¿Listo para empezar?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 48, lineHeight: 1.7 }}>
            Únete a los chiringuitos que ya usan Chiring. Configuración en menos de 10 minutos. Sin contrato de permanencia.
          </p>
          <RegistroForm />
        </div>
      </div>

      {/* CONTACTO */}
      <div id="contacto" style={{ padding: '80px 40px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0A2540', marginBottom: 12 }}>¿Tienes preguntas?</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>Escríbenos y te respondemos en menos de 24 horas</p>
          <a href="mailto:hola@chiringapp.com" style={{
            display: 'inline-block', background: 'linear-gradient(135deg,#00B4D8,#0077B6)',
            color: 'white', padding: '16px 40px', borderRadius: 50,
            textDecoration: 'none', fontSize: 16, fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,119,182,0.3)'
          }}>
            📧 hola@chiringapp.com
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0A2540', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>🌊 chiringapp</div>
          <div style={{ fontSize: 13 }}>© 2026 ChiringApp · Todos los derechos reservados</div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacidad</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Términos</a>
            <a href="/panel" style={{ color: '#00B4D8', textDecoration: 'none', fontWeight: 700 }}>Panel</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function RegistroForm() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit() {
    if (!nombre || !email) return
    setEnviando(true)
    // Simulamos envío - aquí conectaremos con Supabase o email
    await new Promise(r => setTimeout(r, 1000))
    setEnviado(true)
    setEnviando(false)
  }

  if (enviado) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: 40, backdropFilter: 'blur(10px)' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 8 }}>¡Solicitud recibida!</div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>Te contactaremos en menos de 24 horas para configurar tu chiringuito.</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 24, padding: 40, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          style={{ padding: '16px 20px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 15, fontFamily: 'Poppins, sans-serif', outline: 'none' }}
          placeholder="Nombre de tu chiringuito"
          value={nombre} onChange={e => setNombre(e.target.value)}
        />
        <input
          style={{ padding: '16px 20px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 15, fontFamily: 'Poppins, sans-serif', outline: 'none' }}
          placeholder="Tu email"
          type="email"
          value={email} onChange={e => setEmail(e.target.value)}
        />
        <input
          style={{ padding: '16px 20px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 15, fontFamily: 'Poppins, sans-serif', outline: 'none' }}
          placeholder="Teléfono (opcional)"
          value={telefono} onChange={e => setTelefono(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={enviando || !nombre || !email}
          style={{
            padding: '16px', background: enviando ? 'rgba(255,255,255,0.5)' : 'white',
            color: '#0077B6', border: 'none', borderRadius: 50,
            fontSize: 16, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          {enviando ? 'Enviando...' : '🚀 Quiero empezar gratis 30 días'}
        </button>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>
        Sin permanencia · Primer mes gratis · Configuración incluida
      </div>
    </div>
  )
}
