import { createContext, useContext, useState, useEffect } from 'react'
import { translations, langCodes } from './translations'

const STORAGE_KEY = 'chiring_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return langCodes.includes(saved) ? saved : 'es'
    } catch {
      return 'es'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (_) {}
  }, [lang])

  const setLang = (l) => {
    if (langCodes.includes(l)) setLangState(l)
  }

  const t = (key) => {
    const strings = translations[lang] || translations.es
    return strings[key] ?? translations.es[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, langCodes }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) return { lang: 'es', setLang: () => {}, t: (k) => k, langCodes }
  return ctx
}
