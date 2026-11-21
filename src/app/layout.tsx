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

type Language = "es" | "en"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.gfcode.dev"

const SEO: Record<Language, { title: string; description: string; locale: string }> = {
  es: {
    title: "Gerardo Franco | Desarrollador Full-Stack e IA",
    description:
      "Desarrollador full-stack: productos web, apps de escritorio y soluciones con IA. Laravel, Next.js, Rust y agentes de IA.",
    locale: "es_PE",
  },
  en: {
    title: "Gerardo Franco | Full-Stack & AI Developer",
    description:
      "Full-stack developer building web products, desktop apps and AI solutions. Laravel, Next.js, Rust and AI agents.",
    locale: "en_US",
  },
}

// The language lives in a cookie, so the metadata follows it like the page does.
// The share image comes from src/app/opengraph-image.png.
export async function generateMetadata(): Promise<Metadata> {
  const lang = ((await cookies()).get("lang")?.value || "es") as Language
  const seo = SEO[lang] ?? SEO.es
  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Gerardo Franco",
      title: seo.title,
      description: seo.description,
      locale: seo.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  }
}

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