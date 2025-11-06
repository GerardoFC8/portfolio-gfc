import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import ClientLayout from "@/app/client-layout"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portafolio | Gerardo Franco | Desarrollador Full-Stack",
  description: "Desarrollador Full-Stack que construye soluciones a medida",
}

type Language = "es" | "en"

async function getGeneralText(langKey: Language, cookieStore: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("general_text")
    .select(`key, text_${langKey}`)

  if (error) {
    console.error("Error fetching general_text:", error)
    return {}
  }

  const translations = (data || []).reduce((acc: any, item: any) => {
    acc[item.key] = item[`text_${langKey}`]
    return acc
  }, {})

  return translations
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langKey = (cookieStore.get("lang")?.value || "es") as Language

  const generalTranslations = await getGeneralText(langKey, cookieStore)

  return (
    <ClientLayout initialLang={langKey} generalText={generalTranslations}>
      {children}
      <Analytics/>
      <SpeedInsights />
    </ClientLayout>
  )
}