import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CookieBanner from './CookieBanner.jsx'
import ErrorFallback from './ErrorFallback.jsx'
import NetworkBanner from './NetworkBanner.jsx'
import Analytics from './Analytics.jsx'
import { LanguageProvider } from './LanguageContext.jsx'

const App = lazy(() => import('./App.jsx'))
const Panel = lazy(() => import('./Panel.jsx'))
const QRGenerator = lazy(() => import('./QRGenerator.jsx'))
const ComingSoon = lazy(() => import('./ComingSoon.jsx'))
const Registro = lazy(() => import('./Registro.jsx'))
const Bienvenida = lazy(() => import('./Bienvenida.jsx'))
const Partner = lazy(() => import('./Partner.jsx'))
const Privacidad = lazy(() => import('./Privacidad.jsx'))
const Terminos = lazy(() => import('./Terminos.jsx'))
const Cookies = lazy(() => import('./Cookies.jsx'))
const Landing = lazy(() => import('./Landing.jsx'))
const NotFound = lazy(() => import('./NotFound.jsx'))

const path = window.location.pathname
const hash = window.location.hash
const isPanel = path === '/panel'
const isQR = path === '/qr'
const isHamaca = path.startsWith('/hamaca/')
const isRegistro = path === '/registro'
const isBienvenida = path === '/bienvenida' || hash.includes('access_token')
const isPartner = path === '/partner'
const isRecoveryOnRoot = (path === '/' || path === '') && hash.includes('type=recovery')
const isPrivacidad = path === '/privacidad'
const isTerminos = path === '/terminos'
const isCookies = path === '/cookies'
const isLanding = path === '/' || path === ''

// Al entrar en la raíz (chiringapp.com) se muestra primero ComingSoon (código de acceso); tras introducir el código se ve la Landing.
const Pagina = isPanel ? <Panel />
  : isQR ? <QRGenerator />
  : isHamaca ? <App />
  : isRegistro ? <Registro />
  : isPartner || isRecoveryOnRoot ? <Partner />
  : isBienvenida ? <Bienvenida />
  : isLanding ? <ComingSoon />
  : isPrivacidad ? <Privacidad />
  : isTerminos ? <Terminos />
  : isCookies ? <Cookies />
  : <NotFound />

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err, info) { this.setState({ error: err }); console.error(err, info) }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetError={() => this.setState({ hasError: false, error: null })} />
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <>
        <Analytics />
        <NetworkBanner />
        <LanguageProvider>
          <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #F0F8FF, #E8F4FF)', fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: '#0077B6' }}>
              Cargando… 🌊
            </div>
          }>
            {Pagina}
          </Suspense>
        </LanguageProvider>
        <CookieBanner />
      </>
    </ErrorBoundary>
  </StrictMode>,
)