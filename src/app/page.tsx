import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { Technologies } from "@/components/sections/technologies"
import { Experience } from "@/components/sections/experience"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import MatrixRain from "@/components/matrix-rain" // Importamos el nuevo componente

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

// --- Función para Cargar TODO el contenido de la página ---
async function getPageContent(supabase: any, lang: Language) {
  const langKey = lang

  // Usamos Promise.all para cargar todo en paralelo
  const [heroRes, projectsRes, experienceRes, technologiesRes] =
    await Promise.all([
      // 1. Fetch Hero
      supabase
        .from("hero")
        .select(`greeting_${langKey}, title, subtitle_${langKey}, cv_url`)
        .limit(1)
        .single(),
      // 2. Fetch Projects
      supabase
        .from("projects")
        .select(
          `id, title_${langKey}, description_${langKey}, image_url, gallery_urls, tech, live_url, github_url`
        )
        .order("order", { ascending: true }),
      // 3. Fetch Experience
      supabase
        .from("experience")
        .select(
          `id, position_${langKey}, company, period_${langKey}, description_items_${langKey}, technologies`
        )
        .order("order", { ascending: true }),
      // 4. Fetch Technologies
      supabase
        .from("technologies")
        .select(`id, name, logo_url, category`)
        .order("order", { ascending: true }),
    ])

  // Manejo de datos y errores (simple)
  const heroData: HeroData = heroRes.data
    ? {
        greeting: heroRes.data[`greeting_${langKey}`],
        title: heroRes.data.title,
        subtitle: heroRes.data[`subtitle_${langKey}`],
        cv_url: heroRes.data.cv_url,
      }
    : (null as any) // Deberías manejar el caso nulo

  const projectsData: ProjectData[] = projectsRes.data
    ? projectsRes.data.map((p: any) => ({
        id: p.id,
        title: p[`title_${langKey}`],
        description: p[`description_${langKey}`],
        image_url: p.image_url,
        gallery_urls: p.gallery_urls,
        tech: p.tech,
        live_url: p.live_url,
        github_url: p.github_url,
      }))
    : []

  const experienceData: ExperienceData[] = experienceRes.data
    ? experienceRes.data.map((e: any) => ({
        id: e.id,
        position: e[`position_${langKey}`],
        company: e.company,
        period: e[`period_${langKey}`],
        description_items: e[`description_items_${langKey}`],
        technologies: e.technologies,
      }))
    : []

  const technologiesData: TechnologyData[] = technologiesRes.data || []

  if (
    heroRes.error ||
    projectsRes.error ||
    experienceRes.error ||
    technologiesRes.error
  ) {
    console.error("Error fetching page content. Logging non-null errors:")
    if (heroRes.error) console.error("Hero Error:", heroRes.error)
    if (projectsRes.error) console.error("Projects Error:", projectsRes.error)
    if (experienceRes.error)
      console.error("Experience Error:", experienceRes.error)
    if (technologiesRes.error)
      console.error("Technologies Error:", technologiesRes.error)
  }

  return { heroData, projectsData, experienceData, technologiesData }
}

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = await createClient()

  // 1. Leer la cookie de idioma
  const lang = (cookieStore.get("lang")?.value || "es") as Language

  // 2. Cargar todo el contenido de la página en el servidor
  const { heroData, projectsData, experienceData, technologiesData } =
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
      <Footer />
    </main>
  )
}