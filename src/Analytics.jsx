import { useEffect } from 'react'

/**
 * Analytics placeholder. Para activar Google Analytics 4:
 * 1. Crea un archivo .env en la raíz con: VITE_GA_ID=G-XXXXXXXXXX
 * 2. Rebuild (npm run build). En dev no se carga a menos que definas la variable.
 */
const GA_ID = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_ID

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID)
  }, [])
  return null
}
