import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import { StrictMode } from 'react'
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

const path = window.location.pathname
const hash = window.location.hash
const isPanel = path === '/panel'
const isQR = path === '/qr'
const isHamaca = path.startsWith('/hamaca/')
const isRegistro = path === '/registro'
const isBienvenida = path === '/bienvenida' || hash.includes('access_token')
const isPartner = path === '/partner'
const isPrivacidad = path === '/privacidad'
const isTerminos = path === '/terminos'
const isCookies = path === '/cookies'

const Pagina = isPanel ? <Panel />
  : isQR ? <QRGenerator />
  : isHamaca ? <App />
  : isRegistro ? <Registro />
  : isPartner ? <Partner />
  : isBienvenida ? <Bienvenida />
  : isPrivacidad ? <Privacidad />
  : isTerminos ? <Terminos />
  : isCookies ? <Cookies />
  : <ComingSoon />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {Pagina}
    <CookieBanner />
  </StrictMode>,
)