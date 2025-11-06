"use client"

import type React from "react"
import { LanguageProvider } from "@/context/language-context"
import { ThemeProvider } from "@/components/theme-provider"

type Language = "es" | "en"
interface GeneralTextData {
  [key: string]: string
}

export default function ClientLayout({
  children,
  generalText,
  initialLang,
}: Readonly<{
  children: React.ReactNode
  generalText: GeneralTextData
  initialLang: Language
}>) {
  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider
            generalText={generalText}
            initialLang={initialLang}
          >
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}