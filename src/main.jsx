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

const path = window.location.pathname
const isPanel = path === '/panel'
const isQR = path === '/qr'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPanel ? <Panel /> : isQR ? <QRGenerator /> : <App />}
  </StrictMode>,
)