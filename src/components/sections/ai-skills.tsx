"use client"

import Image from "next/image"
import { useLanguage } from "@/context/language-context"

interface AISkillData {
  id: string
  name: string
  logo_url: string
}

const SkillItem = ({ name, logoUrl }: { name: string; logoUrl: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-300">
    <Image
      src={logoUrl}
      alt={name}
      width={48}
      height={48}
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

export function AISkills({
  aiSkillsData,
}: {
  aiSkillsData: AISkillData[] | null
}) {
  const { t } = useLanguage()

  if (!aiSkillsData) {
    return (
      <section
        id="ai-skills"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando habilidades de IA...</p>
        </div>
      </section>
    )
  }

  if (aiSkillsData.length === 0) {
    return null
  }

  return (
    <section
      id="ai-skills"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background/60"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("ai_skills_title") || "Habilidades con agentes de IA"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("ai_skills_subtitle") || "Agentes y herramientas que uso a diario"}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
          {aiSkillsData.map((skill) => (
            <SkillItem
              key={skill.id}
              name={skill.name}
              logoUrl={skill.logo_url}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {t("ai_skills_description") ||
              "Texto descriptivo sobre tu workflow con agentes de IA — editalo desde el admin."}
          </p>
        </div>
      </div>
    </section>
  )
}
