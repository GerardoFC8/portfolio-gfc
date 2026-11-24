"use client"

import Image from "next/image"
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

type Area = "frontend" | "backend" | "data" | "infra" | "desktop" | "testing" | "other"

const AREAS: Area[] = ["frontend", "backend", "data", "infra", "desktop", "testing", "other"]

const AREA_FALLBACK: Record<Area, string> = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Bases de datos",
  infra: "Infraestructura y DevOps",
  desktop: "Escritorio y sistemas",
  testing: "Testing",
  other: "Otras herramientas",
}

// Technologies only carry a dominant/knowledge category in the database, so the
// area comes from the name. Anything unknown lands in "other" instead of vanishing.
const AREA_BY_NAME: Record<string, Area> = {
  react: "frontend", "next.js": "frontend", vue: "frontend", alpine: "frontend",
  tailwind: "frontend", typescript: "frontend", astro: "frontend",
  laravel: "backend", php: "backend", livewire: "backend", "node js": "backend",
  "node.js": "backend", python: "backend", django: "backend", go: "backend", graphql: "backend",
  ".net": "backend",
  mysql: "data", postgres: "data", postgresql: "data", supabase: "data", redis: "data", appwrite: "data",
  "sql server": "data",
  docker: "infra", linux: "infra", git: "infra", aws: "infra", "google cloud": "infra",
  cloudflare: "infra", vercel: "infra", n8n: "infra",
  rust: "desktop", tauri: "desktop", webassembly: "desktop",
  playwright: "testing", vitest: "testing",
}

const areaOf = (name: string): Area => AREA_BY_NAME[name.trim().toLowerCase()] ?? "other"

const TechItem = ({ tech }: { tech: TechnologyData }) => {
  const dominant = tech.category === "dominant"
  return (
    <li
      className={
        "relative flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted/60 " +
        (dominant ? "" : "opacity-80")
      }
      title={tech.name}
    >
      <Image
        src={tech.logo_url}
        alt=""
        width={40}
        height={40}
        className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/48x48/e0e0e0/a0a0a0?text=?"
        }}
      />
      <span
        className={
          "text-[11px] sm:text-xs text-center leading-tight " +
          (dominant ? "font-semibold text-foreground" : "text-muted-foreground")
        }
      >
        {tech.name}
      </span>
      {dominant && (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      )}
    </li>
  )
}

// --- Recibe 'technologiesData' como prop ---
export function Technologies({
  technologiesData,
}: {
  technologiesData: TechnologyData[] | null
}) {
  const { t } = useLanguage() // Para títulos
  const [viewMode, setViewMode] = useState<"grid" | "cloud">("grid")

  const { groups, allLogoUrls } = useMemo(() => {
    const technologies = technologiesData || []
    const byArea = new Map<Area, TechnologyData[]>()
    for (const tech of technologies) {
      const area = areaOf(tech.name)
      byArea.set(area, [...(byArea.get(area) ?? []), tech])
    }
    // Dominant first inside each area, keeping the admin's order otherwise.
    const rank = (t: TechnologyData) => (t.category === "dominant" ? 0 : 1)
    return {
      groups: AREAS.filter((a) => byArea.has(a)).map((area) => ({
        area,
        items: [...byArea.get(area)!].sort((a, b) => rank(a) - rank(b)),
      })),
      allLogoUrls: technologies.map((tech) => tech.logo_url),
    }
  }, [technologiesData])

  if (!technologiesData) {
    return (
      <section
        id="technologies"
        className="py-14 px-4 sm:px-6 lg:px-8 bg-muted/30"
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
      className="py-14 px-4 sm:px-6 lg:px-8 bg-background/60"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header: same style as the other sections */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("tech_title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("tech_subtitle") || "Herramientas que uso para crear soluciones"}
          </p>
        </div>

        {/* Legend on the left, view toggle on the right */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {viewMode === "grid" ? (
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {t("tech_dominant_title")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-muted-foreground" aria-hidden="true" />
                {t("tech_knowledge_title")}
              </span>
            </p>
          ) : (
            <span />
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "cloud" : "grid")}
            aria-label={viewMode === "grid" ? t("tech_view_cloud") : t("tech_view_grid")}
            title={viewMode === "grid" ? t("tech_view_cloud") : t("tech_view_grid")}
            className="shrink-0 size-11 dark:hover:text-blue-100"
          >
            {viewMode === "grid" ? (
              <Cloud className="h-5 w-5" />
            ) : (
              <Grid className="h-5 w-5" />
            )}
          </Button>
        </div>

        {viewMode === "grid" ? (
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map(({ area, items }) => {
                const key = `tech_area_${area}`
                const label = t(key)
                return (
                  <div key={area} className="rounded-xl border border-border bg-card/70 backdrop-blur-sm p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                      {label === key ? AREA_FALLBACK[area] : label}
                    </h3>
                    <ul className="grid grid-cols-4 gap-1">
                      {items.map((tech) => (
                        <TechItem key={tech.id} tech={tech} />
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="relative flex h-full w-full max-w-4xl mx-auto items-center justify-center overflow-hidden rounded-lg">
            <IconCloud images={allLogoUrls} />
          </div>
        )}
      </div>
    </section>
  )
}
