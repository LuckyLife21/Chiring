import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useLanguage } from './LanguageContext.jsx'

const isMobile = () => window.innerWidth < 768

// Icono tipo Just Eat: silueta usuario/cuenta (cabeza + hombros)
function LogoLoginIcon({ size = 48, color = '#0077B6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="18" r="7" stroke={color} strokeWidth="2.2" fill="none" />
      <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function Landing() {
  const { lang, setLang, t } = useLanguage()
  const [scrollY, setScrollY] = useState(0)
  const [mobile, setMobile] = useState(isMobile())
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })
  const [formEnviado, setFormEnviado] = useState(false)
  const [formCargando, setFormCargando] = useState(false)
  const [formError, setFormError] = useState('')
  const [partnerModal, setPartnerModal] = useState(false)
  const [chiringuitoModal, setChiringuitoModal] = useState(false)
  const [registroModal, setRegistroModal] = useState(false)
  const [partnerLogin, setPartnerLogin] = useState({ email: '', password: '' })
  const [partnerError, setPartnerError] = useState('')
  const [partnerCargando, setPartnerCargando] = useState(false)
  const [chiringuitoLogin, setChiringuitoLogin] = useState({ email: '', password: '' })
  const [chiringuitoError, setChiringuitoError] = useState('')
  const [chiringuitoCargando, setChiringuitoCargando] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onResize = () => setMobile(isMobile())
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    if (!langDropdownOpen) return
    const close = () => setLangDropdownOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [langDropdownOpen])

  const navBg = scrollY > 50 || menuOpen

  const COOLDOWN_CONTACTO_MS = 60000 // 1 minuto entre envíos

  async function enviarContacto() {
    if (!formData.nombre || !formData.email || !formData.mensaje) return
    const last = parseInt(sessionStorage.getItem('contact_last_sent') || '0', 10)
    if (Date.now() - last < COOLDOWN_CONTACTO_MS) {
      setFormError('Espera un minuto antes de enviar otro mensaje.')
      return
    }
    setFormCargando(true)
    setFormError('')
    try {
      const { data, error } = await supabase.functions.invoke('enviar-contacto', {
        body: { nombre: formData.nombre, email: formData.email, mensaje: formData.mensaje }
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      sessionStorage.setItem('contact_last_sent', String(Date.now()))
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

  async function loginChiringuito() {
    if (!chiringuitoLogin.email || !chiringuitoLogin.password) {
      setChiringuitoError('Rellena todos los campos')
      return
    }
    setChiringuitoCargando(true)
    setChiringuitoError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: chiringuitoLogin.email,
      password: chiringuitoLogin.password,
    })
    if (error) {
      setChiringuitoError('Email o contraseña incorrectos')
      setChiringuitoCargando(false)
    } else {
      window.location.href = '/panel'
    }
  }

  const faqs = [
    { q: t('faq_0_q'), r: t('faq_0_r') },
    { q: t('faq_1_q'), r: t('faq_1_r') },
    { q: t('faq_2_q'), r: t('faq_2_r') },
    { q: t('faq_3_q'), r: t('faq_3_r') },
    { q: t('faq_4_q'), r: t('faq_4_r') },
    { q: t('faq_5_q'), r: t('faq_5_r') },
    { q: t('faq_6_q'), r: t('faq_6_r') },
    { q: t('faq_7_q'), r: t('faq_7_r') },
    { q: t('faq_8_q'), r: t('faq_8_r') },
    { q: t('faq_9_q'), r: t('faq_9_r') },
    { q: t('faq_10_q'), r: t('faq_10_r') },
    { q: t('faq_11_q'), r: t('faq_11_r') },
    { q: t('faq_12_q'), r: t('faq_12_r') },
    { q: t('faq_13_q'), r: t('faq_13_r') },
    { q: t('faq_14_q'), r: t('faq_14_r') },
    { q: t('faq_15_q'), r: t('faq_15_r') },
    { q: t('faq_16_q'), r: t('faq_16_r') },
  ]

  const testimonios = [
    { nombre: t('t1_nombre'), lugar: t('t1_lugar'), texto: t('t1_texto'), estrellas: 5 },
    { nombre: t('t2_nombre'), lugar: t('t2_lugar'), texto: t('t2_texto'), estrellas: 5 },
    { nombre: t('t3_nombre'), lugar: t('t3_lugar'), texto: t('t3_texto'), estrellas: 5 },
    { nombre: t('t4_nombre'), lugar: t('t4_lugar'), texto: t('t4_texto'), estrellas: 5 },
    { nombre: t('t5_nombre'), lugar: t('t5_lugar'), texto: t('t5_texto'), estrellas: 5 },
    { nombre: t('t6_nombre'), lugar: t('t6_lugar'), texto: t('t6_texto'), estrellas: 5 },
    { nombre: t('t7_nombre'), lugar: t('t7_lugar'), texto: t('t7_texto'), estrellas: 5 },
    { nombre: t('t8_nombre'), lugar: t('t8_lugar'), texto: t('t8_texto'), estrellas: 5 },
  ]

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', background: '#fff', margin: 0, padding: 0, width: '100%' }}>

      {/* MODAL CHIRINGUITOS LOGIN (misma página, como Partners) */}
      {chiringuitoModal && (
        <div onClick={() => setChiringuitoModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: 36, maxWidth: 420, width: '100%', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 8 }}><LogoLoginIcon size={56} color="#0077B6" /></div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0A2540', marginBottom: 4 }}>Chiring</h2>
              <p style={{ fontSize: 13, color: '#888' }}>{t('panel_subtitle')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>📧 {t('modal_partner_email')}</label>
                <input style={inputStyle} type="email" placeholder="tu@email.com" value={chiringuitoLogin.email} onChange={e => { setChiringuitoLogin(c => ({ ...c, email: e.target.value })); setChiringuitoError('') }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>🔒 {t('modal_partner_password')}</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={chiringuitoLogin.password} onChange={e => { setChiringuitoLogin(c => ({ ...c, password: e.target.value })); setChiringuitoError('') }} onKeyDown={e => e.key === 'Enter' && loginChiringuito()} />
              </div>
              {chiringuitoError && (
                <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>⚠️ {chiringuitoError}</div>
              )}
              <button onClick={loginChiringuito} disabled={chiringuitoCargando} style={{ padding: '14px', background: chiringuitoCargando ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: chiringuitoCargando ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                {chiringuitoCargando ? t('modal_partner_entering') : t('panel_enter')}
              </button>
              <div style={{ textAlign: 'center', fontSize: 13, color: '#888' }}>
                <a href="/panel" onClick={() => setChiringuitoModal(false)} style={{ color: '#0077B6', fontWeight: 700, textDecoration: 'none' }}>{t('modal_partner_forgot')}</a>
                <br />
                {t('modal_partner_noAccount')}{' '}
                <a href="/registro" onClick={() => setChiringuitoModal(false)} style={{ color: '#0077B6', fontWeight: 700, textDecoration: 'none' }}>{t('nav_registerFree')}</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARTNER LOGIN */}
      {partnerModal && (
        <div onClick={() => setPartnerModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: 36, maxWidth: 420, width: '100%', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 8 }}><LogoLoginIcon size={56} color="#E6A800" /></div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0A2540', marginBottom: 4 }}>{t('modal_partner_title')}</h2>
              <p style={{ fontSize: 13, color: '#888' }}>{t('modal_partner_subtitle')}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>📧 {t('modal_partner_email')}</label>
                <input style={inputStyle} type="email" placeholder="tu@email.com" value={partnerLogin.email} onChange={e => { setPartnerLogin(f => ({ ...f, email: e.target.value })); setPartnerError('') }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>🔒 {t('modal_partner_password')}</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={partnerLogin.password} onChange={e => { setPartnerLogin(f => ({ ...f, password: e.target.value })); setPartnerError('') }} onKeyDown={e => e.key === 'Enter' && loginPartner()} />
              </div>

              {partnerError && (
                <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>
                  ⚠️ {partnerError}
                </div>
              )}

              <button onClick={loginPartner} disabled={partnerCargando} style={{ padding: '14px', background: partnerCargando ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: partnerCargando ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                {partnerCargando ? t('modal_partner_entering') : t('modal_partner_enter')}
              </button>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#888', lineHeight: 1.8 }}>
                {t('modal_partner_noAccount')}{' '}
                <a href="/partner" style={{ color: '#0077B6', fontWeight: 700, textDecoration: 'none' }}>{t('modal_partner_registerLink')}</a>
                <br />
                <a href="/partner?reset=1" style={{ color: '#aaa', fontSize: 12, textDecoration: 'none' }}>{t('modal_partner_forgot')}</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ¿Registrarte como chiringuito o como partner? */}
      {registroModal && (
        <div onClick={() => setRegistroModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', background: 'white', borderRadius: 24, padding: 36, maxWidth: 420, width: '100%', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
            <button type="button" onClick={() => setRegistroModal(false)} aria-label="Cerrar" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, color: '#888', cursor: 'pointer', padding: 4, lineHeight: 1 }}>×</button>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 8 }}><LogoLoginIcon size={44} color="#0077B6" /></div>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0A2540', marginBottom: 8, textAlign: 'center', paddingRight: 24 }}>{t('modal_register_title')}</h2>
            <p style={{ fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 24 }}>{t('modal_register_subtitle')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="/registro" onClick={() => setRegistroModal(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#F0F8FF', border: '2px solid #00B4D8', borderRadius: 16, textDecoration: 'none', color: '#0A2540', fontWeight: 800, fontSize: 15, fontFamily: 'Poppins, sans-serif' }}>
                <span style={{ fontSize: 28 }}>🏖️</span>
                <span>{t('modal_register_chiringuito')}</span>
              </a>
              <a href="/partner" onClick={() => setRegistroModal(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#FFF8F0', border: '2px solid #E6A800', borderRadius: 16, textDecoration: 'none', color: '#0A2540', fontWeight: 800, fontSize: 15, fontFamily: 'Poppins, sans-serif' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoLoginIcon size={28} color="#E6A800" /></span>
                <span>{t('modal_register_partner')}</span>
              </a>
            </div>
            <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 16 }}>{t('modal_register_haveAccount')} <a href="/panel" style={{ color: '#0077B6', fontWeight: 700 }}>{t('nav_chiringuitos')}</a> · <button type="button" onClick={() => { setRegistroModal(false); setPartnerModal(true) }} style={{ background: 'none', border: 'none', color: '#0077B6', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 12 }}>{t('nav_partners')}</button></p>
          </div>
        </div>
      )}

      {/* Panel lateral estilo Just Eat: Mi cuenta + beneficios + CTA */}
      {!mobile && panelOpen && (
        <>
          <div role="presentation" onClick={() => setPanelOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 198 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(380px, 92vw)', background: '#FAFBFC', zIndex: 199, boxShadow: '-12px 0 40px rgba(0,0,0,0.15)', overflowY: 'auto', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ padding: '24px 24px 32px', borderBottom: '1px solid #eee', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0A2540', margin: 0 }}>{t('menu_myAccount')}</h2>
                <button type="button" aria-label="Cerrar" onClick={() => setPanelOpen(false)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', border: 'none', borderRadius: '50%', fontSize: 18, color: '#555', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #E8F4FC 0%, #F0F8FF 100%)', borderRadius: 16, padding: 20, border: '1px solid rgba(0,180,216,0.2)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0A2540', marginBottom: 14, marginTop: 0 }}>{t('menu_joinBenefits')}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0' }}>
                  {[t('menu_benefit1'), t('menu_benefit2'), t('menu_benefit3'), t('menu_benefit4')].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, fontSize: 13, color: '#444' }}>
                      <span style={{ color: '#0077B6', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => { setPanelOpen(false); setRegistroModal(true) }} style={{ width: '100%', padding: '14px 20px', background: 'linear-gradient(135deg,#E6A800,#D49400)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 4px 14px rgba(230,168,0,0.35)' }}>
                  {t('menu_loginOrRegister')}
                </button>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>{t('footer_account')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button type="button" onClick={() => { setPanelOpen(false); setChiringuitoModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 16px', background: 'white', border: '1px solid #eee', borderRadius: 12, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 700, color: '#0A2540', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <LogoLoginIcon size={24} color="#0077B6" />
                  {t('nav_chiringuitos')}
                </button>
                <button type="button" onClick={() => { setPanelOpen(false); setPartnerModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 16px', background: 'white', border: '1.5px solid rgba(230,168,0,0.5)', borderRadius: 12, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 700, color: '#0A2540', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <LogoLoginIcon size={24} color="#E6A800" />
                  {t('nav_partners')}
                </button>
              </div>
              <button type="button" onClick={() => { setPanelOpen(false); setRegistroModal(true) }} style={{ width: '100%', marginTop: 20, padding: '16px', background: 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', boxShadow: '0 6px 20px rgba(0,119,182,0.3)' }}>
                {t('nav_registerFree')}
              </button>
            </div>
            <div style={{ padding: '20px 24px 28px', borderTop: '1px solid #eee', background: 'white' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>{t('lang_label')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['es', 'en', 'it', 'fr'].map(l => (
                  <button key={l} type="button" onClick={() => setLang(l)} style={{ padding: '10px 16px', borderRadius: 10, border: lang === l ? '2px solid #0077B6' : '1px solid #ddd', background: lang === l ? '#F0F8FF' : '#f8f8f8', color: lang === l ? '#0077B6' : '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>{t(`lang_${l}`)}</button>
                ))}
              </div>
            </div>
          </div>
        </>
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
          <a href="/" aria-label="ChiringApp - Ir al inicio" style={{ fontSize: 22, fontWeight: 900, color: navBg ? '#0A2540' : 'white', letterSpacing: -1, textDecoration: 'none', cursor: 'pointer' }}>
            🌊 chiringapp
          </a>
          {!mobile && (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              {[['#como-funciona', 'nav_howItWorks'], ['#precios', 'nav_prices'], ['#testimonios', 'nav_reviews'], ['#faq', 'nav_faq'], ['#contacto', 'nav_contact']].map(([href, key]) => (
                <a key={href} href={href} style={{ color: navBg ? '#555' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>{t(key)}</a>
              ))}
              <button type="button" onClick={() => setChiringuitoModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: '1.5px solid ' + (navBg ? '#0077B6' : 'rgba(255,255,255,0.7)'), background: navBg ? 'rgba(0,119,182,0.12)' : 'rgba(255,255,255,0.15)', color: navBg ? '#0077B6' : 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                <LogoLoginIcon size={18} color={navBg ? '#0077B6' : 'rgba(255,255,255,0.95)'} />
                {t('nav_chiringuitos')}
              </button>
              <button type="button" aria-label="Ver información para Partners" onClick={() => setPartnerModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: '1.5px solid ' + (navBg ? '#E6A800' : 'rgba(230,168,0,0.8)'), background: navBg ? 'rgba(230,168,0,0.12)' : 'rgba(230,168,0,0.2)', color: navBg ? '#B8860B' : 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                <LogoLoginIcon size={18} color={navBg ? '#B8860B' : 'rgba(255,255,255,0.95)'} />
                {t('nav_partners')}
              </button>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={e => { e.stopPropagation(); setLangDropdownOpen(!langDropdownOpen) }} aria-label="Idioma" aria-expanded={langDropdownOpen} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, border: '1px solid ' + (navBg ? '#ddd' : 'rgba(255,255,255,0.5)'), background: navBg ? '#fff' : 'rgba(255,255,255,0.2)', color: navBg ? '#333' : 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  {t('lang_' + lang)}
                  <span style={{ fontSize: 10, opacity: 0.9 }}>▼</span>
                </button>
                {langDropdownOpen && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'white', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid #eee', minWidth: 140, zIndex: 110, overflow: 'hidden' }}>
                    {['es', 'en', 'it', 'fr'].map(l => (
                      <button key={l} type="button" onClick={() => { setLang(l); setLangDropdownOpen(false) }} style={{ display: 'block', width: '100%', padding: '10px 14px', border: 'none', background: lang === l ? '#F0F8FF' : 'white', color: lang === l ? '#0077B6' : '#333', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>{t('lang_' + l)}</button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" aria-label="Menú" onClick={() => setPanelOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: navBg ? '#0A2540' : 'white', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
              </button>
              <button type="button" onClick={() => setRegistroModal(true)} style={{
                background: navBg ? 'linear-gradient(135deg,#00B4D8,#0077B6)' : 'white',
                color: navBg ? 'white' : '#0077B6',
                padding: '10px 22px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 700,
                boxShadow: navBg ? 'none' : '0 4px 15px rgba(0,0,0,0.15)', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              }}>{t('nav_registerFree')}</button>
            </div>
          )}
          {mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={e => { e.stopPropagation(); setLangDropdownOpen(!langDropdownOpen) }} aria-label="Idioma" aria-expanded={langDropdownOpen} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 8, border: '1px solid ' + (navBg ? '#ddd' : 'rgba(255,255,255,0.5)'), background: navBg ? '#fff' : 'rgba(255,255,255,0.2)', color: navBg ? '#333' : 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  {t('lang_' + lang)}
                  <span style={{ fontSize: 10, opacity: 0.9 }}>▼</span>
                </button>
                {langDropdownOpen && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'white', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid #eee', minWidth: 140, zIndex: 110, overflow: 'hidden' }}>
                    {['es', 'en', 'it', 'fr'].map(l => (
                      <button key={l} type="button" onClick={() => { setLang(l); setLangDropdownOpen(false) }} style={{ display: 'block', width: '100%', padding: '10px 14px', border: 'none', background: lang === l ? '#F0F8FF' : 'white', color: lang === l ? '#0077B6' : '#333', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>{t('lang_' + l)}</button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: navBg ? '#0A2540' : 'white', fontSize: 24, padding: 4 }}>
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          )}
        </div>
        {mobile && menuOpen && (
          <div style={{ background: 'white', padding: '16px 20px 24px', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg,#F0F8FF,#E8F4FF)', borderRadius: 16, padding: 20, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0A2540', marginBottom: 12 }}>{t('menu_joinBenefits')}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#555' }}>
                {[t('menu_benefit1'), t('menu_benefit2'), t('menu_benefit3'), t('menu_benefit4')].map((text, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#00B4D8', fontWeight: 800 }}>✓</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {[['#como-funciona', 'nav_howItWorks'], ['#precios', 'nav_prices'], ['#testimonios', 'nav_reviews'], ['#colabora', 'nav_partners'], ['#faq', 'nav_faq'], ['#contacto', 'nav_contact']].map(([href, key]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ color: '#333', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>{t(key)}</a>
            ))}
            <button type="button" onClick={() => { setMenuOpen(false); setChiringuitoModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 20, border: '1.5px solid #0077B6', background: 'rgba(0,119,182,0.12)', color: '#0077B6', fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif', textAlign: 'left', cursor: 'pointer' }}>
              <LogoLoginIcon size={22} color="#0077B6" />
              {t('nav_chiringuitos')}
            </button>
            <button onClick={() => { setMenuOpen(false); setPartnerModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 20, border: '1.5px solid #E6A800', background: 'rgba(230,168,0,0.12)', color: '#B8860B', fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif', textAlign: 'left', cursor: 'pointer' }}>
              <LogoLoginIcon size={22} color="#E6A800" />
              {t('nav_partnersAccess')}
            </button>
            <button type="button" onClick={() => { setMenuOpen(false); setRegistroModal(true) }} style={{ background: 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', padding: '14px', borderRadius: 50, border: 'none', fontSize: 15, fontWeight: 700, textAlign: 'center', width: '100%', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>{t('nav_registerFree')}</button>
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
              🏖️ {t('hero_badge')}
            </div>
            <h1 style={{ fontSize: mobile ? 40 : 58, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: -2 }}>
              {t('hero_title1')}<br />
              <span style={{ color: '#7FDBFF' }}>{t('hero_title2')}</span><br />
              {t('hero_title3')}
            </h1>
            <p style={{ fontSize: mobile ? 15 : 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 32 }}>
              {t('hero_subtitle')}
            </p>
            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 12 }}>
              <a href="/registro" style={{ background: 'white', color: '#0077B6', padding: '15px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                🚀 {t('hero_cta1')}
              </a>
              <a href="#como-funciona" style={{ background: 'transparent', color: 'white', padding: '15px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 15, fontWeight: 700, border: '2px solid rgba(255,255,255,0.5)', textAlign: 'center' }}>
                {t('hero_cta2')}
              </a>
            </div>
            <div style={{ display: 'flex', gap: mobile ? 20 : 32, marginTop: 40, justifyContent: mobile ? 'center' : 'flex-start' }}>
              {[['🏖️', '+50', t('hero_stat1')], ['📱', '+2.000', t('hero_stat2')], ['⭐', '4.9', t('hero_stat3')]].map(([icon, num, label]) => (
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
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 12 }}>🛒 {t('mockup_view_cart')}</div>
                </div>
              </div>
            </div>
            {!mobile && (
              <div style={{ position: 'absolute', top: 50, right: -10, background: 'white', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', fontSize: 12, fontWeight: 700, color: '#0A2540' }}>
                🔔 {t('mockup_new_order')}<br />
                <span style={{ color: '#00B4D8', fontSize: 11 }}>{t('mockup_hamaca_price')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div id="como-funciona" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'white', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('section_howSimple')}</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 12 }}>{t('section_howItWorks')}</h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 480, margin: '0 auto' }}>{t('section_howDesc')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 20 }}>
            {[
              { num: '01', icon: '📱', title: t('step1_title'), desc: t('step1_desc'), color: '#E0F8FF' },
              { num: '02', icon: '🛒', title: t('step2_title'), desc: t('step2_desc'), color: '#FFF5E0' },
              { num: '03', icon: '🏖️', title: t('step3_title'), desc: t('step3_desc'), color: '#E8FFE8' },
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
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('section_whyChiring')}</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1 }}>{t('section_moreSales')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            {[
              { icon: '💰', title: t('benefit1_title'), desc: t('benefit1_desc') },
              { icon: '⚡', title: t('benefit2_title'), desc: t('benefit2_desc') },
              { icon: '📊', title: t('benefit3_title'), desc: t('benefit3_desc') },
              { icon: '💳', title: t('benefit4_title'), desc: t('benefit4_desc') },
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
              { icon: '🪑', num: '∞', label: t('stat_hamacas') },
              { icon: '📱', num: '2 min', label: t('stat_install') },
              { icon: '💶', num: '15%', label: t('stat_sell') },
              { icon: '🔔', num: '24/7', label: t('stat_support') },
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

      {/* TESTIMONIOS */}
      <div id="testimonios" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'white', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('section_reviews')}</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 12 }}>{t('section_reviewsTitle')}</h2>
            <p style={{ fontSize: 15, color: '#666' }}>{t('section_reviewsSub')}</p>
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
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('section_noSurprises')}</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 10 }}>{t('section_prices')}</h2>
            <p style={{ fontSize: 15, color: '#666' }}>{t('section_pricesDesc')}</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#0A2540,#0077B6)', borderRadius: 24, padding: mobile ? 28 : 40, boxShadow: '0 20px 50px rgba(0,119,182,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{t('price_unique')}</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: 'white', lineHeight: 1 }}>15%</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32, marginTop: 8 }}>{t('price_per_order')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 32, textAlign: 'left' }}>
              {[t('price_f1'), t('price_f2'), t('price_f3'), t('price_f4'), t('price_f5'), t('price_f6')].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#7FDBFF', fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="/registro" style={{ display: 'inline-block', background: 'white', color: '#0077B6', padding: '16px 40px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>
              {t('btn_empezarGratis')} →
            </a>
          </div>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#aaa' }}>
            {t('footer_haveSeveral')} <a href="#contacto" style={{ color: '#00B4D8', fontWeight: 700 }}>{t('footer_contactSpecial')}</a>
          </div>
        </div>
      </div>

      {/* CTA — Registro chiringuito (antes que Partner en el scroll) */}
      <div style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'linear-gradient(160deg, #0A2540 0%, #0077B6 60%, #00B4D8 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🏖️</div>
          <h2 style={{ fontSize: mobile ? 28 : 40, fontWeight: 900, color: 'white', letterSpacing: -1, marginBottom: 12 }}>{t('cta_ready')}</h2>
          <p style={{ fontSize: mobile ? 14 : 16, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            {t('cta_desc')}
          </p>
          <button type="button" onClick={() => setRegistroModal(true)} style={{ display: 'inline-block', background: 'white', color: '#0077B6', padding: '18px 40px', borderRadius: 50, border: 'none', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            🚀 {t('cta_createAccount')}
          </button>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>
            {t('modal_register_haveAccount')} <a href="/panel" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{t('nav_chiringuitos')}</a> · <button type="button" onClick={() => setPartnerModal(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>{t('nav_partners')}</button>
          </div>
        </div>
      </div>

      {/* COLABORA CON NOSOTROS */}
      <div id="colabora" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'white', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('colabora_label')}</div>
            <h2 style={{ fontSize: mobile ? 30 : 42, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 14 }}>{t('colabora_title')}<br />{t('colabora_title2')}</h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              {t('colabora_desc')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 24, marginBottom: 56 }}>
            {[
              { icon: '🔗', title: t('partner_c1_title'), desc: t('partner_c1_desc'), color: '#E0F8FF' },
              { icon: '💰', title: t('partner_c2_title'), desc: t('partner_c2_desc'), color: '#FFF5E0' },
              { icon: '📊', title: t('partner_c3_title'), desc: t('partner_c3_desc'), color: '#E8FFE8' },
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
              {t('partner_cta_title')}
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
              {t('partner_cta_desc')}
            </p>
            <a href="/partner" style={{
              display: 'inline-block', background: 'white', color: '#0077B6',
              padding: '18px 44px', borderRadius: 50, textDecoration: 'none',
              fontSize: 16, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}>
              🤝 {t('partner_cta_btn')}
            </a>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
              {t('partner_footer')}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: 'linear-gradient(160deg,#F0F8FF,#E8F4FF)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('nav_faq')}</div>
            <h2 style={{ fontSize: mobile ? 30 : 40, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 12 }}>{t('section_faq')}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1.5px solid #E0E8F0', borderRadius: 16, overflow: 'hidden', background: 'white' }}>
                <button type="button" aria-expanded={faqOpen === i} aria-controls={`faq-answer-${i}`} id={`faq-q-${i}`} onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width: '100%', padding: '18px 20px', background: faqOpen === i ? '#F0F8FF' : 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: '#0A2540', textAlign: 'left',
                }}>
                  {faq.q}
                  <span style={{ fontSize: 20, color: '#00B4D8', marginLeft: 10, flexShrink: 0 }}>{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-q-${i}`} style={{ padding: '0 20px 18px', fontSize: 14, color: '#555', lineHeight: 1.7, background: '#F0F8FF' }}>
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACTO */}
      <div id="contacto" style={{ padding: mobile ? '60px 24px' : '100px 40px', background: '#F8FAFF', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00B4D8', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>{t('section_contact')}</div>
            <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 900, color: '#0A2540', letterSpacing: -1, marginBottom: 10 }}>{t('section_contactTitle')}</h2>
            <p style={{ fontSize: 14, color: '#666' }}>{t('contact_24h')}</p>
          </div>
          {formEnviado ? (
            <div style={{ background: 'white', borderRadius: 22, padding: 40, textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0A2540', marginBottom: 8 }}>{t('contact_success')}</h3>
              <p style={{ fontSize: 14, color: '#666' }}>{t('contact_successDesc')} <strong>{formData.email}</strong></p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 22, padding: mobile ? 24 : 40, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>{t('contact_name')} *</label>
                    <input style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} placeholder={t('contact_placeholder_name')} value={formData.nombre} onChange={e => setFormData(f => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>{t('contact_email')} *</label>
                    <input style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540' }} type="email" placeholder={t('contact_placeholder_email')} value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>{t('contact_message')} *</label>
                  <textarea style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E0E8F0', background: '#F8FAFF', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0A2540', resize: 'vertical', minHeight: 120 }} placeholder={t('contact_placeholder_msg')} value={formData.mensaje} onChange={e => setFormData(f => ({ ...f, mensaje: e.target.value }))} />
                </div>
                {formError && (
                  <div style={{ background: '#FFF0F0', border: '1.5px solid #ffb3b3', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#cc0000', fontWeight: 600 }}>
                    ⚠️ {formError}
                  </div>
                )}
                <button onClick={enviarContacto} disabled={formCargando || !formData.nombre || !formData.email || !formData.mensaje} style={{ padding: '14px', background: (!formData.nombre || !formData.email || !formData.mensaje) ? '#ccc' : 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: (!formData.nombre || !formData.email || !formData.mensaje) ? 'default' : 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  {formCargando ? t('contact_sending') : '📧 ' + t('contact_send')}
                </button>
                <div style={{ textAlign: 'center', fontSize: 13, color: '#aaa' }}>
                  {t('contact_orEmail')} <a href="mailto:appchiring@gmail.com" style={{ color: '#00B4D8', fontWeight: 700 }}>appchiring@gmail.com</a>
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
                {t('footer_tagline')}
              </p>
              <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                📧 <a href="mailto:appchiring@gmail.com" style={{ color: '#00B4D8', textDecoration: 'none' }}>appchiring@gmail.com</a>
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{t('footer_follow')}</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <a href="https://instagram.com/chiringapp" target="_blank" rel="noopener noreferrer" aria-label="Instagram de ChiringApp" style={{ display: 'inline-flex', color: 'rgba(255,255,255,0.85)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com/chiringapp" target="_blank" rel="noopener noreferrer" aria-label="Facebook de ChiringApp" style={{ display: 'inline-flex', color: 'rgba(255,255,255,0.85)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/chiringapp" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter) de ChiringApp" style={{ display: 'inline-flex', color: 'rgba(255,255,255,0.85)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>Instagram · Facebook · X</p>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>{t('footer_product')}</div>
              {[['#como-funciona', 'nav_howItWorks'], ['#precios', 'nav_prices'], ['#faq', 'nav_faq'], ['/registro', 'nav_registerFree']].map(([href, key]) => (
                <div key={href} style={{ marginBottom: 8 }}><a href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{t(key)}</a></div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>{t('footer_account')}</div>
              {[['/panel', 'nav_chiringuitos'], ['/registro', 'footer_createAccount'], ['#contacto', 'footer_support'], ['/partner', 'footer_bePartner']].map(([href, key]) => (
                <div key={href} style={{ marginBottom: 8 }}><a href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{t(key)}</a></div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>{t('footer_legal')}</div>
              {[['/privacidad', 'footer_privacy'], ['/terminos', 'footer_terms'], ['/cookies', 'footer_cookies']].map(([href, key]) => (
                <div key={key} style={{ marginBottom: 8 }}><a href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{t(key)}</a></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 ChiringApp · {t('footer_rights')}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t('footer_made')}</div>
          </div>
        </div>
      </footer>

      {/* Botón flotante CTA */}
      {scrollY > 300 && (
        <button
          type="button"
          onClick={() => setRegistroModal(true)}
          aria-label={t('nav_registerFree')}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 99,
            background: 'linear-gradient(135deg,#00B4D8,#0077B6)', color: 'white', padding: '14px 24px',
            borderRadius: 50, fontSize: 14, fontWeight: 800, border: 'none',
            boxShadow: '0 6px 24px rgba(0,180,216,0.45)', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {t('btn_probarGratis')} →
        </button>
      )}
    </div>
  )
}