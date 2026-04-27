"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ExternalLink, Github, ImageIcon, FileText } from "lucide-react"

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

const formatDescription = (text: string) =>
  text.split("\n").map((line, index) => {
    const trimmed = line.trim()

    if (!trimmed) return <br key={index} />

    if (trimmed.startsWith("> ")) {
      return (
        <div key={index} className="ml-4 mb-1">
          • {trimmed.substring(2)}
        </div>
      )
    }

    if (/^\d+\.\s+.+$/.test(trimmed)) {
      return (
        <div key={index} className="font-semibold mt-3 mb-1">
          {trimmed}
        </div>
      )
    }

    return (
      <div key={index} className="mb-1">
        {trimmed}
      </div>
    )
  })

export default function ProjectCard({
  project,
  onGalleryClick,
}: ProjectCardProps) {
  const { t } = useLanguage()
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isTechExpanded, setIsTechExpanded] = useState(false)

  const displayedTech = isTechExpanded ? project.tech : project.tech.slice(0, 3)
  const hasMoreTech = project.tech.length > 3

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border flex flex-col h-full dark:hover:shadow-blue-950">
        <div className="relative overflow-hidden h-48 bg-muted">
          {/* Project card image: dynamic Supabase URL, dimensions vary per project. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col grow p-6 space-y-4">
          <h3 className="text-xl font-bold text-card-foreground">
            {project.title}
          </h3>

          {project.description && (
            <button
              onClick={() => setIsDescriptionOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline self-start"
            >
              <FileText className="w-4 h-4" />
              {t("project_view_description") || "Ver descripción"}
            </button>
          )}

          <div className="flex flex-wrap gap-2">
            {displayedTech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
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

      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground leading-relaxed pt-2">
            {formatDescription(project.description)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
