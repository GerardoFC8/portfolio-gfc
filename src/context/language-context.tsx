"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { setCookie } from "cookies-next"

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
  generalText,
  initialLang,
}: {
  children: React.ReactNode
  generalText: GeneralTextData
  initialLang: Language
}) {
  const [lang, setLangState] = useState<Language>(initialLang)
  const router = useRouter()

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    setCookie("lang", newLang, { maxAge: 60 * 60 * 24 * 30 })
    router.refresh()
  }

  const t = (key: string): string => generalText[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
