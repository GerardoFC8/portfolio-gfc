"use client"

import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { ChevronDown } from "lucide-react"

// --- Tipo de Datos (debe coincidir con page.tsx) ---
interface TechnologyData {
  id: string
  name: string
  logo_url: string
  category: "dominant" | "knowledge"
  featured?: boolean
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
  cloudflare: "infra", vercel: "infra",
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

// Featured tile: bigger logo, full contrast, for the stack a client hires for.
const FeaturedItem = ({ tech }: { tech: TechnologyData }) => (
  <li className="flex w-24 sm:w-28 flex-col items-center gap-2 rounded-xl border border-border bg-card/70 backdrop-blur-sm p-3 transition-colors hover:border-primary/50">
    <Image
      src={tech.logo_url}
      alt=""
      width={48}
      height={48}
      className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
      onError={(e) => {
        e.currentTarget.src = "https://placehold.co/48x48/e0e0e0/a0a0a0?text=?"
      }}
    />
    <span className="text-xs sm:text-sm font-semibold text-foreground text-center leading-tight">
      {tech.name}
    </span>
  </li>
)

// --- Recibe 'technologiesData' como prop ---
export function Technologies({
  technologiesData,
}: {
  technologiesData: TechnologyData[] | null
}) {
  const { t } = useLanguage()

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

  const featured = technologiesData.filter((tech) => tech.featured)
  const others = technologiesData.filter((tech) => !tech.featured)

  // The rest, grouped by area; dominant first inside each, admin order otherwise.
  const byArea = new Map<Area, TechnologyData[]>()
  for (const tech of others) {
    const area = areaOf(tech.name)
    byArea.set(area, [...(byArea.get(area) ?? []), tech])
  }
  const rank = (tech: TechnologyData) => (tech.category === "dominant" ? 0 : 1)
  const groups = AREAS.filter((a) => byArea.has(a)).map((area) => ({
    area,
    items: [...byArea.get(area)!].sort((a, b) => rank(a) - rank(b)),
  }))

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

        {featured.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
            {featured.map((tech) => (
              <FeaturedItem key={tech.id} tech={tech} />
            ))}
          </ul>
        )}

        {groups.length > 0 && (
          <details className="group rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
              {t("tech_others_title")} ({others.length})
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="px-4 pb-4">
              <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mb-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  {t("tech_dominant_title")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full border border-muted-foreground" aria-hidden="true" />
                  {t("tech_knowledge_title")}
                </span>
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map(({ area, items }) => {
                  const key = `tech_area_${area}`
                  const label = t(key)
                  return (
                    <div key={area} className="rounded-xl border border-border bg-card/70 p-4">
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
          </details>
        )}
      </div>
    </section>
  )
}
