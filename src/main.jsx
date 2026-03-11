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

const path = window.location.pathname
const hash = window.location.hash
const isPanel = path === '/panel'
const isQR = path === '/qr'
const isHamaca = path.startsWith('/hamaca/')
const isRegistro = path === '/registro'
const isBienvenida = path === '/bienvenida' || hash.includes('access_token')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPanel ? <Panel /> : isQR ? <QRGenerator /> : isHamaca ? <App /> : isRegistro ? <Registro /> : isBienvenida ? <Bienvenida /> : <ComingSoon />}
  </StrictMode>,
)