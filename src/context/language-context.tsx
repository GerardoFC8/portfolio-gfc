"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react"
import { useRouter } from "next/navigation"
import { setCookie, getCookie } from "cookies-next"

type Language = "es" | "en"

interface GeneralTextData {
  [key: string]: string
}

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  generalText, // Recibe los textos desde el Server Component
  initialLang, // Recibe el idioma inicial desde el Server Component
}: {
  children: React.ReactNode
  generalText: GeneralTextData
  initialLang: Language
}) {
  const [lang, setLangState] = useState<Language>(initialLang)
  const router = useRouter()

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    try {
      setCookie("lang", newLang, { maxAge: 60 * 60 * 24 * 30 }) // 30 días
      router.refresh()
    } catch (e) {
      console.error("Failed to set language cookie or refresh", e)
    }
  }

  // La función 't' (translate) ahora usa los textos recibidos por props
  const t = useCallback(
    (key: string): string => {
      return generalText[key] || key
    },
    [generalText] // Se recalcula solo si los textos cambian
  )

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, t] // setLang es estable
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}