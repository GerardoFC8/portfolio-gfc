import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { Technologies } from "@/components/sections/technologies"
import { AISkills } from "@/components/sections/ai-skills"
import { Experience } from "@/components/sections/experience"
import { Contact } from "@/components/sections/contact"
import { Services, type ServiceData } from "@/components/sections/services"
import { Process } from "@/components/sections/process"
import { OpenSourceTools } from "@/components/sections/open-source"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import MatrixRain from "@/components/matrix-rain"
import type { SupabaseClient } from "@supabase/supabase-js"

type Language = "es" | "en"

interface HeroData {
  greeting: string
  title: string
  headline: string
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
  category: "client" | "open_source"
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
  featured: boolean
}

interface AISkillData {
  id: string
  name: string
  logo_url: string
}

interface FooterData {
  id: string
  name: string
  icon: string
  href: string
}

type HeroRow = Record<`greeting_${Language}` | `headline_${Language}` | `subtitle_${Language}`, string> & {
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
  category: "client" | "open_source"
} & Record<`title_${Language}` | `description_${Language}`, string>
type ServiceRow = {
  id: string
  icon: string
  featured: boolean
} & Record<`title_${Language}` | `description_${Language}`, string> &
  Record<`items_${Language}`, string[]>
type ExperienceRow = {
  id: string
  company: string
  technologies: string[]
} & Record<`position_${Language}` | `period_${Language}`, string> &
  Record<`description_items_${Language}`, string[]>
type AISkillRow = {
  id: string
  name: string
  logo_url: string
}
type SocialLinkRow = {
  id: string
  name: string
  url: string
  icon_key: string
} & Record<`display_text_${Language}`, string>

async function getPageContent(supabase: SupabaseClient, lang: Language) {
  const langKey = lang

  const [
    heroRes,
    projectsRes,
    experienceRes,
    technologiesRes,
    aiSkillsRes,
    footerRes,
    servicesRes,
  ] = await Promise.all([
    supabase
      .from("hero")
      .select(`greeting_${langKey}, title, headline_${langKey}, subtitle_${langKey}, cv_url`)
      .limit(1)
      .single()
      .returns<HeroRow>(),
    supabase
      .from("projects")
      .select(
        `id, title_${langKey}, description_${langKey}, image_url, gallery_urls, tech, live_url, github_url, category`
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
      .select(`id, name, logo_url, category, featured`)
      .order("order", { ascending: true })
      .returns<TechnologyData[]>(),
    supabase
      .from("ai_skills")
      .select(`id, name, logo_url`)
      .order("order", { ascending: true })
      .returns<AISkillRow[]>(),
    supabase
      .from("social_links")
      .select(`id, name, display_text_${langKey}, url, icon_key`)
      .returns<SocialLinkRow[]>(),
    supabase
      .from("services")
      .select(
        `id, icon, featured, title_${langKey}, description_${langKey}, items_${langKey}`
      )
      .order("order", { ascending: true })
      .returns<ServiceRow[]>(),
  ])

  const heroData: HeroData | null = heroRes.data
    ? {
        greeting: heroRes.data[`greeting_${langKey}`],
        title: heroRes.data.title,
        headline: heroRes.data[`headline_${langKey}`] ?? "",
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
    category: p.category ?? "client",
  }))

  const servicesData: ServiceData[] = (servicesRes.data ?? []).map((s) => ({
    id: s.id,
    icon: s.icon,
    featured: s.featured,
    title: s[`title_${langKey}`],
    description: s[`description_${langKey}`],
    items: s[`items_${langKey}`] ?? [],
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

  const aiSkillsData: AISkillData[] = aiSkillsRes.data ?? []

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
    aiSkillsRes.error ||
    footerRes.error ||
    servicesRes.error
  ) {
    console.error("Error fetching page content. Logging non-null errors:")
    if (heroRes.error) console.error("Hero Error:", heroRes.error)
    if (projectsRes.error) console.error("Projects Error:", projectsRes.error)
    if (experienceRes.error)
      console.error("Experience Error:", experienceRes.error)
    if (technologiesRes.error)
      console.error("Technologies Error:", technologiesRes.error)
    if (aiSkillsRes.error)
      console.error("AI Skills Error:", aiSkillsRes.error)
    if (footerRes.error) console.error("Footer Error:", footerRes.error)
    if (servicesRes.error) console.error("Services Error:", servicesRes.error)
  }

  return {
    heroData,
    projectsData,
    experienceData,
    technologiesData,
    aiSkillsData,
    footerData,
    servicesData,
  }
}

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = await createClient()

  // 1. Leer la cookie de idioma
  const lang = (cookieStore.get("lang")?.value || "es") as Language

  // 2. Cargar todo el contenido de la página en el servidor
  const {
    heroData,
    projectsData,
    experienceData,
    technologiesData,
    aiSkillsData,
    footerData,
    servicesData,
  } = await getPageContent(supabase, lang)

  // Client work up top; developer tools get their own compact section.
  const clientProjects = projectsData.filter((p) => p.category !== "open_source")
  const tools = projectsData.filter((p) => p.category === "open_source")

  return (
    <main className="min-h-screen bg-background text-foreground relative z-0">
      <MatrixRain />

      <Navbar />
      <div className="pt-16">
        <Hero heroData={heroData} />
        <Projects projectsData={clientProjects} />
        <Services servicesData={servicesData} />
        <Process />
        <Experience experienceData={experienceData} />
        <AISkills aiSkillsData={aiSkillsData} />
        <OpenSourceTools toolsData={tools} />
        <Technologies technologiesData={technologiesData} />
        <Contact />
      </div>
      <Footer footerData={footerData} />
    </main>
  )
}