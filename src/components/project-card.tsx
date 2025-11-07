"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { ExternalLink, Github, ImageIcon } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    image: string
    tech: string[]
    liveUrl?: string
    githubUrl?: string
    gallery: string[]
  }
  onGalleryClick: () => void
}

export default function ProjectCard({ project, onGalleryClick }: ProjectCardProps) {
  const { t } = useLanguage()

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isTechExpanded, setIsTechExpanded] = useState(false)

  // --- Lógica para la descripción ---
  // Definimos un límite de caracteres para mostrar el botón "Ver más"
  const MAX_DESC_CHARS = 120
  const isLongDescription = project.description.length > MAX_DESC_CHARS

  // --- Lógica para las tecnologías ---
  const displayedTech = isTechExpanded ? project.tech : project.tech.slice(0, 3)
  const hasMoreTech = project.tech.length > 3

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border flex flex-col h-full dark:hover:shadow-blue-950">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-muted">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col grow p-6 space-y-4">
        <h3 className="text-xl font-bold text-card-foreground">{project.title}</h3>

        <div className="text-sm text-muted-foreground">
          <p className={!isDescriptionExpanded ? "line-clamp-3" : ""}>
            {project.description}
          </p>
          {/* Botón para expandir/contraer descripción */}
          {isLongDescription && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm font-medium text-primary hover:underline mt-1"
            >
              {isDescriptionExpanded
                ? t("project_see_less")
                : t("project_see_more")}
            </button>
          )}
        </div>

        {/* --- Tech Stack Actualizado --- */}
        <div className="flex flex-wrap gap-2">
          {displayedTech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
            >
              {tech}
            </span>
          ))}
          {/* Botón para expandir/contraer tecnologías */}
          {hasMoreTech && (
            <button
              onClick={() => setIsTechExpanded(!isTechExpanded)}
              className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium cursor-pointer hover:bg-muted/80 transition-colors"
              aria-expanded={isTechExpanded}
            >
              {isTechExpanded
                ? t("project_tech_less")
                : `+${project.tech.length - 3}`}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto pt-4">
          <button
            onClick={onGalleryClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors duration-200 font-medium text-sm"
          >
            <ImageIcon className="w-4 h-4" />
            {t("project_gallery")}
          </button>

          <div className="flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border hover:bg-muted rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                {t("project_online")}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border hover:bg-muted rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                {t("project_github")}
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}