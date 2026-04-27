import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { Technologies } from "@/components/sections/technologies"
import { Experience } from "@/components/sections/experience"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import MatrixRain from "@/components/matrix-rain"
import type { SupabaseClient } from "@supabase/supabase-js"

type Language = "es" | "en"

interface HeroData {
  greeting: string
  title: string
  subtitle: string
  cv_url: string
}
interface ProjectData {
  id: string
  title: string
  description: string
  image_url: string
  gallery_urls: string[]
  tech: string[]
  live_url?: string
  github_url?: string
}
interface ExperienceData {
  id: string
  position: string
  company: string
  period: string
  description_items: string[]
  technologies: string[]
}
interface TechnologyData {
  id: string
  name: string
  logo_url: string
  category: "dominant" | "knowledge"
}

interface FooterData {
  id: string
  name: string
  icon: string
  href: string
}

type HeroRow = Record<`greeting_${Language}` | `subtitle_${Language}`, string> & {
  title: string
  cv_url: string
}
type ProjectRow = {
  id: string
  image_url: string
  gallery_urls: string[]
  tech: string[]
  live_url?: string
  github_url?: string
} & Record<`title_${Language}` | `description_${Language}`, string>
type ExperienceRow = {
  id: string
  company: string
  technologies: string[]
} & Record<`position_${Language}` | `period_${Language}`, string> &
  Record<`description_items_${Language}`, string[]>
type SocialLinkRow = {
  id: string
  name: string
  url: string
  icon_key: string
} & Record<`display_text_${Language}`, string>

async function getPageContent(supabase: SupabaseClient, lang: Language) {
  const langKey = lang

  const [heroRes, projectsRes, experienceRes, technologiesRes, footerRes] =
    await Promise.all([
      supabase
        .from("hero")
        .select(`greeting_${langKey}, title, subtitle_${langKey}, cv_url`)
        .limit(1)
        .single()
        .returns<HeroRow>(),
      supabase
        .from("projects")
        .select(
          `id, title_${langKey}, description_${langKey}, image_url, gallery_urls, tech, live_url, github_url`
        )
        .order("order", { ascending: true })
        .returns<ProjectRow[]>(),
      supabase
        .from("experience")
        .select(
          `id, position_${langKey}, company, period_${langKey}, description_items_${langKey}, technologies`
        )
        .order("order", { ascending: true })
        .returns<ExperienceRow[]>(),
      supabase
        .from("technologies")
        .select(`id, name, logo_url, category`)
        .order("order", { ascending: true })
        .returns<TechnologyData[]>(),
      supabase
        .from("social_links")
        .select(`id, name, display_text_${langKey}, url, icon_key`)
        .returns<SocialLinkRow[]>(),
    ])

  const heroData: HeroData | null = heroRes.data
    ? {
        greeting: heroRes.data[`greeting_${langKey}`],
        title: heroRes.data.title,
        subtitle: heroRes.data[`subtitle_${langKey}`],
        cv_url: heroRes.data.cv_url,
      }
    : null

  const projectsData: ProjectData[] = (projectsRes.data ?? []).map((p) => ({
    id: p.id,
    title: p[`title_${langKey}`],
    description: p[`description_${langKey}`],
    image_url: p.image_url,
    gallery_urls: p.gallery_urls,
    tech: p.tech,
    live_url: p.live_url,
    github_url: p.github_url,
  }))

  const experienceData: ExperienceData[] = (experienceRes.data ?? []).map((e) => ({
    id: e.id,
    position: e[`position_${langKey}`],
    company: e.company,
    period: e[`period_${langKey}`],
    description_items: e[`description_items_${langKey}`],
    technologies: e.technologies,
  }))

  const technologiesData: TechnologyData[] = technologiesRes.data ?? []

  const footerData: FooterData[] = (footerRes.data ?? []).map((link) => ({
    id: link.id,
    name: link[`display_text_${langKey}`] || link.name,
    icon: link.icon_key,
    href: link.url,
  }))

  if (
    heroRes.error ||
    projectsRes.error ||
    experienceRes.error ||
    technologiesRes.error ||
    footerRes.error
  ) {
    console.error("Error fetching page content. Logging non-null errors:")
    if (heroRes.error) console.error("Hero Error:", heroRes.error)
    if (projectsRes.error) console.error("Projects Error:", projectsRes.error)
    if (experienceRes.error)
      console.error("Experience Error:", experienceRes.error)
    if (technologiesRes.error)
      console.error("Technologies Error:", technologiesRes.error)
    if (footerRes.error) console.error("Footer Error:", footerRes.error)
  }

  return { heroData, projectsData, experienceData, technologiesData, footerData }
}

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = await createClient()

  // 1. Leer la cookie de idioma
  const lang = (cookieStore.get("lang")?.value || "es") as Language

  // 2. Cargar todo el contenido de la página en el servidor
  const { heroData, projectsData, experienceData, technologiesData, footerData } =
    await getPageContent(supabase, lang)

  return (
    <main className="min-h-screen bg-background text-foreground relative z-0">
      <MatrixRain />

      <Navbar />
      <div className="pt-16">
        <Hero heroData={heroData} />
        <Projects projectsData={projectsData} />
        <Technologies technologiesData={technologiesData} />
        <Experience experienceData={experienceData} />
        <Contact />
      </div>
      {/* Ahora footerData es un array, lo cual es correcto para .map() */}
      <Footer footerData={footerData} />
    </main>
  )
}