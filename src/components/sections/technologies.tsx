"use client"

import { useLanguage } from "@/context/language-context"
// import { Card } from "@/components/ui/card" // (No se usa Card aquí)
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Grid, Cloud } from "lucide-react"
import { IconCloud } from "@/components/ui/icon-cloud"

// --- Tipo de Datos (debe coincidir con page.tsx) ---
interface TechnologyData {
  id: string
  name: string
  logo_url: string
  category: "dominant" | "knowledge"
}

// Componente para un ícono de tecnología individual
const TechItem = ({ name, logoUrl }: { name: string; logoUrl: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-300">
    <img
      src={logoUrl}
      alt={name}
      className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
      onError={(e) => {
        e.currentTarget.src = "https://placehold.co/48x48/e0e0e0/a0a0a0?text=?"
      }}
    />
    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
      {name}
    </span>
  </div>
)

// --- Recibe 'technologiesData' como prop ---
export function Technologies({
  technologiesData,
}: {
  technologiesData: TechnologyData[] | null
}) {
  const { t } = useLanguage() // Para títulos
  const [viewMode, setViewMode] = useState<"grid" | "cloud">("grid")
  const technologies = technologiesData || []

  // Separa las tecnologías por categoría usando useMemo
  const { dominantTech, knowledgeTech, allLogoUrls } = useMemo(() => {
    const dominant = technologies.filter(
      (tech) => tech.category === "dominant"
    )
    const knowledge = technologies.filter(
      (tech) => tech.category === "knowledge"
    )
    // Cambiamos de 'tech.name' a 'tech.logo_url'
    const allLogos = technologies.map((tech) => tech.logo_url)
    return {
      dominantTech: dominant,
      knowledgeTech: knowledge,
      allLogoUrls: allLogos,
    }
  }, [technologies])

  if (!technologiesData) {
    return (
      <section
        id="technologies"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando tecnologías...</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="technologies"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background/60"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header y Toggle Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-16">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {t("tech_title")} {/* 't' del contexto */}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto sm:mx-0">
              {t("tech_subtitle") || "Herramientas que uso para crear soluciones"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "cloud" : "grid")}
              aria-label="Cambiar vista"
            >
              {viewMode === "grid" ? (
                <Cloud className="h-5 w-5" />
              ) : (
                <Grid className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Contenido Condicional: Grid o Cloud */}
        {viewMode === "grid" ? (
          // --- VISTA DE GRID (Estilo imagen) ---
          <div className="space-y-16">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-center text-foreground mb-8">
                {t("tech_dominant_title") || "Tecnologías que Domino"}
              </h3>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {dominantTech.map((tech) => (
                  <TechItem
                    key={tech.id}
                    name={tech.name}
                    logoUrl={tech.logo_url}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-center text-foreground mb-8">
                {t("tech_knowledge_title") || "Conocimientos en"}
              </h3>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {knowledgeTech.map((tech) => (
                  <TechItem
                    key={tech.id}
                    name={tech.name}
                    logoUrl={tech.logo_url}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // --- VISTA DE NUBE (Magic UI) ---
          <div className="relative flex h-full w-full max-w-4xl mx-auto items-center justify-center overflow-hidden rounded-lg bg-background py-16">
            <IconCloud images={allLogoUrls} />
          </div>
        )}
      </div>
    </section>
  )
}