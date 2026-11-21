"use client"

import { useId, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Briefcase, Calendar } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

interface ExperienceData {
  id: string
  position: string
  company: string
  period: string
  description_items: string[]
  technologies: string[]
}

// A period like "Oct. 2023 - Actualidad" marks the current role.
const CURRENT_PERIOD = /actualidad|presente|hoy|present|now|current/i

export function Experience({
  experienceData,
}: {
  experienceData: ExperienceData[] | null
}) {
  const { t } = useLanguage()
  const experiences = experienceData ?? []
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  if (!experienceData) {
    return (
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando experiencia...</p>
        </div>
      </section>
    )
  }

  if (experiences.length === 0) return null

  const current = experiences[Math.min(active, experiences.length - 1)]

  // On phones the tab row scrolls sideways, so bring the chosen tab into view.
  const select = (index: number) => {
    setActive(index)
    tabRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" })
  }

  // Roving focus for the tablist, as in the WAI-ARIA tabs pattern.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    }
    let next: number | null = null
    if (event.key in keys) next = (active + keys[event.key] + experiences.length) % experiences.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = experiences.length - 1
    if (next === null) return
    event.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("exp_title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("exp_subtitle") || "Mi trayectoria profesional"}
          </p>
        </div>

        <BlurFade delay={0.2} inView>
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden md:grid md:grid-cols-[15rem_1fr]">
            {/* Company tabs: a scrollable row on phones, a column from md up. */}
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label={t("exp_title") || "Experiencia"}
              className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r border-border bg-muted/30 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_80%,transparent)] md:[mask-image:none]"
            >
              {experiences.map((exp, index) => {
                const selected = index === active
                const isCurrent = CURRENT_PERIOD.test(exp.period)
                return (
                  <button
                    key={exp.id}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    id={`${baseId}-tab-${index}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={onKeyDown}
                    className={cn(
                      "relative shrink-0 text-left px-4 py-3 md:px-5 md:py-3.5 transition-colors outline-none",
                      "focus-visible:bg-primary/10 hover:bg-primary/5",
                      selected ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`${baseId}-indicator`}
                        className="absolute bg-primary rounded-full left-3 right-3 bottom-0 h-0.5 md:left-0 md:right-auto md:top-2 md:bottom-2 md:h-auto md:w-1"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
                      {exp.company}
                      {isCurrent && (
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </span>
                    <span className="hidden md:block text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Detail of the selected role. */}
            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active}`}
              className="p-6 sm:p-8 min-h-[22rem]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground leading-snug">
                    {current.position}{" "}
                    <span className="text-primary">@ {current.company}</span>
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {current.period}
                    </span>
                    {CURRENT_PERIOD.test(current.period) && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <Briefcase className="w-3 h-3" />
                        {t("exp_current") || "Actual"}
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {current.description_items.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {current.technologies.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {current.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-xs text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
