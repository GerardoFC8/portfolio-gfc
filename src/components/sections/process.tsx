"use client"

import { useLanguage } from "@/context/language-context"

// Four fixed steps; their texts live in general_text (process_step1_title, ...).
const STEPS = [1, 2, 3, 4] as const

export function Process() {
  const { t } = useLanguage()

  return (
    <section id="process" className="py-14 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("process_title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            {t("process_subtitle")}
          </p>
        </div>

        {/* Vertical on mobile, horizontal from lg up, with a connecting line */}
        <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/30 lg:left-[12.5%] lg:right-[12.5%] lg:top-6 lg:bottom-auto lg:h-0.5 lg:w-auto"
          />
          {STEPS.map((n) => (
            <li key={n} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground ring-4 ring-background">
                {n}
              </span>
              <div className="pt-1 lg:pt-2">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {t(`process_step${n}_title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {t(`process_step${n}_text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
