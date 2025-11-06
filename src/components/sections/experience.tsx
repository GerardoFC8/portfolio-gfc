"use client"

import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { Building2, Calendar } from "lucide-react"

// --- Tipo de Datos (debe coincidir con page.tsx) ---
interface ExperienceData {
  id: string
  position: string
  company: string
  period: string
  description_items: string[]
  technologies: string[]
}

// --- Recibe 'experienceData' como prop ---
export function Experience({
  experienceData,
}: {
  experienceData: ExperienceData[] | null
}) {
  const { t } = useLanguage() // Para títulos
  const experiences = experienceData || []

  if (!experienceData) {
    return (
      <section
        id="experience"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando experiencia...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("exp_title")} {/* 't' del contexto */}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("exp_subtitle") || "Mi trayectoria profesional"}
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-linear-to-b from-primary to-primary/20"></div>
              )}

              <Card className="p-6 md:p-8 bg-card border-border hover:shadow-lg transition-all duration-300 relative">
                {/* ... (código del timeline dot sin cambios) ... */}
                <div className="md:pl-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-2">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <Building2 className="w-4 h-4" />
                        {exp.company}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>
                  </div>

                  {/* Description */}
                  <ul className="space-y-2 mb-6">
                    {exp.description_items.map((desc, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="text-primary mt-1">▹</span>
                        {desc}
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}