"use client"

import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, MessageCircle } from "lucide-react"
import { AuroraText } from "../ui/aurora-text"

// --- Tipo de Datos (debe coincidir con page.tsx) ---
interface HeroData {
  greeting: string
  title: string
  headline: string
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

  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" })
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
    // pt-28 clears the fixed 64px navbar; no min-h-screen, so at 1440x900
    // the start of the next section is already in view.
    <section className="flex items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-20 bg-background/60">
      <div className="max-w-6xl mx-auto w-full grid items-center gap-10 lg:gap-16 lg:grid-cols-[1fr_auto]">
        {/* Avatar: first and centered on mobile, right column on desktop */}
        <div className="lg:order-last">
          {/* A looping MP4 is ~46x lighter than the original 6.3 MB GIF.
              The poster paints at once and stays put under reduced motion. */}
          <video
            src="/avatar.mp4"
            poster="/avatar-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Avatar pixel art de Gerardo Franco"
            className="w-32 h-32 sm:w-40 sm:h-40 lg:w-72 lg:h-72 rounded-full mx-auto object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg motion-reduce:hidden"
          />
          <Image
            src="/avatar-poster.webp"
            alt="Avatar pixel art de Gerardo Franco"
            width={288}
            height={288}
            priority
            className="hidden motion-reduce:block w-32 h-32 sm:w-40 sm:h-40 lg:w-72 lg:h-72 rounded-full mx-auto object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
          />
        </div>

        {/* Text column: no entrance animation, so it reads on first paint */}
        <div className="space-y-6 text-center lg:text-left">
          {heroData.headline ? (
            // The headline says what the client gets; the name supports it.
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl font-semibold text-foreground">
                {heroData.greeting}{" "}
                <AuroraText colors={["#007BFF", "#7B68EE", "#00C0FF"]} speed={2}>
                  {heroData.title}
                </AuroraText>
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                {heroData.headline}
              </h1>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-primary font-semibold text-lg">
                {heroData.greeting}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                <AuroraText colors={["#007BFF", "#7B68EE", "#00C0FF"]} speed={2}>
                  {heroData.title}
                </AuroraText>
              </h1>
            </div>
          )}

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 text-pretty">
            {heroData.subtitle}
          </p>

          {/* CTA Buttons: see the work, or start a conversation */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
            <Button
              onClick={() => scrollTo("#projects")}
              size="lg"
              className="gap-2 min-h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("hero_cases")}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => scrollTo("#contact")}
              size="lg"
              variant="outline"
              className="gap-2 min-h-11 border-border hover:bg-muted bg-transparent hover:text-black dark:hover:text-white dark:hover:bg-gray-600 dark:border-blue-700"
            >
              <MessageCircle className="w-4 h-4" />
              {t("hero_talk")}
            </Button>
          </div>

          {/* CV: still there, but as a quiet text link */}
          {heroData.cv_url && (
            <button
              onClick={handleDownloadCV}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              {t("hero_cv")}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}