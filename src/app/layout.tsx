import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import ClientLayout from "@/app/client-layout"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Portafolio | Gerardo Franco | Desarrollador Full-Stack",
  description: "Desarrollador Full-Stack que construye soluciones a medida",
}

type Language = "es" | "en"

type GeneralTextRow = { key: string } & Record<`text_${Language}`, string>

async function getGeneralText(langKey: Language): Promise<Record<string, string>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("general_text")
    .select(`key, text_${langKey}`)
    .returns<GeneralTextRow[]>()

  if (error) {
    console.error("Error fetching general_text:", error)
    return {}
  }

  return (data ?? []).reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item[`text_${langKey}`]
    return acc
  }, {})
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langKey = (cookieStore.get("lang")?.value || "es") as Language

  const generalTranslations = await getGeneralText(langKey)

  return (
    <ClientLayout
      initialLang={langKey}
      generalText={generalTranslations}
      fontVariables={`${geistSans.variable} ${geistMono.variable}`}
    >
      {children}
      <Analytics/>
      <SpeedInsights />
    </ClientLayout>
  )
}