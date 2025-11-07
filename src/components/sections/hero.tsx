"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"
import { TypingAnimation } from "../ui/typing-animation"
import { AuroraText } from "../ui/aurora-text"

// --- Tipo de Datos (debe coincidir con page.tsx) ---
interface HeroData {
  greeting: string
  title: string
  subtitle: string
  cv_url: string
}

// --- Recibe 'heroData' como prop ---
export function Hero({ heroData }: { heroData: HeroData | null }) {
  // 't' viene del contexto, para textos de botones
  const { t } = useLanguage()

  const handleDownloadCV = () => {
    if (!heroData?.cv_url) return
    const link = document.createElement("a")
    link.href = heroData.cv_url
    link.download = "Gerardo_Franco_CV.pdf"
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.click()
  }

  const scrollToProjects = () => {
    const element = document.querySelector("#projects")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Muestra un loader si los datos (de props) aún no están
  if (!heroData) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-background/60">
      <div className="max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          <div className="mb-8">
            <img src="/generate_full_code.gif" alt="Foto de perfil de Gerardo Franco" className="w-32 h-32 lg:w-56 lg:h-56 rounded-full mx-auto ring-4 ring-white dark:ring-gray-800 shadow-lg"/>
          </div>
          {/* Greeting */}
          <div className="space-y-4">
            <p className="text-primary font-semibold text-lg animate-fade-in">
              {heroData.greeting}
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              <AuroraText colors={["#007BFF", "#7B68EE", "#00C0FF"]} speed={2}>
                {heroData.title}
              </AuroraText>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl text-pretty">
            <TypingAnimation className="leading-0" duration={40}>{heroData.subtitle}</TypingAnimation>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("hero_projects")}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownloadCV}
              size="lg"
              variant="outline"
              className="gap-2 border-border hover:bg-muted bg-transparent hover:text-black dark:hover:text-white dark:hover:bg-gray-600 dark:border-blue-700"
              disabled={!heroData.cv_url}
            >
              <Download className="w-4 h-4" />
              {t("hero_cv")}
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center pt-12">
            <div className="animate-bounce flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</p>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}