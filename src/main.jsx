import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Panel from './Panel.jsx'
import QRGenerator from './QRGenerator.jsx'
import ComingSoon from './ComingSoon.jsx'
import Registro from './Registro.jsx'
import Bienvenida from './Bienvenida.jsx'
import Partner from './Partner.jsx'
import Privacidad from './Privacidad.jsx'
import Terminos from './Terminos.jsx'
import Cookies from './Cookies.jsx'
import CookieBanner from './CookieBanner.jsx'
import Landing from './Landing.jsx'
import NotFound from './NotFound.jsx'
import ErrorFallback from './ErrorFallback.jsx'
import { LanguageProvider } from './LanguageContext.jsx'

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
  componentDidCatch(err, info) { console.error(err, info) }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback resetError={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        {Pagina}
      </LanguageProvider>
      {/* CookieBanner fuera de LanguageProvider para que no dependa del contexto y siempre se muestre si no hay preferencia guardada */}
      <CookieBanner />
    </ErrorBoundary>
  </StrictMode>,
)