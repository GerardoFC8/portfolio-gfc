"use client"

import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"

export interface ToolData {
  id: string
  title: string
  description: string
  tech: string[]
  live_url?: string
  github_url?: string
}

// "Claumeter: Métricas de uso..." -> name "Claumeter", tagline "Métricas de uso..."
const splitTitle = (title: string) => {
  const i = title.indexOf(": ")
  return i === -1 ? { name: title, tagline: "" } : { name: title.slice(0, i), tagline: title.slice(i + 2) }
}

const firstParagraph = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("> ") && !/^\d+\.\s/.test(line)) ?? ""

const iconBtn =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors duration-200"

// Compact list for developer tools, kept apart from the client projects.
export function OpenSourceTools({ toolsData }: { toolsData: ToolData[] }) {
  const { t } = useLanguage()

  if (toolsData.length === 0) return null

  return (
    <section id="open-source" className="py-14 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("tools_title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            {t("tools_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolsData.map((tool) => {
            const { name, tagline } = splitTitle(tool.title)
            return (
              <Card key={tool.id} className="p-5 gap-0 bg-card/80 backdrop-blur-sm border-border flex flex-col">
                <h3 className="text-base font-bold text-card-foreground">{name}</h3>
                {tagline && <p className="text-sm text-primary font-medium mb-2">{tagline}</p>}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {firstParagraph(tool.description)}
                </p>
                <div className="mt-auto flex items-end justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tech.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {tool.live_url && (
                      <a
                        href={tool.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("project_online")}: ${name}`}
                        title={t("project_online")}
                        className={iconBtn}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {tool.github_url && (
                      <a
                        href={tool.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("project_github")}: ${name}`}
                        title={t("project_github")}
                        className={iconBtn}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
