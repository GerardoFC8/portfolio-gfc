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
import { Download, ExternalLink, Github, ImageIcon, FileText } from "lucide-react"

// A link to a releases page or an installer is a download, not a live demo.
const DOWNLOAD_URL = /\/releases(\/|$)|\.(exe|msi|dmg|zip|apk)$/i

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

// First plain paragraph of the long description, shown as the card's summary.
const firstParagraph = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("> ") && !/^\d+\.\s/.test(line)) ?? ""

export default function ProjectCard({
  project,
  onGalleryClick,
}: ProjectCardProps) {
  const { t } = useLanguage()
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isTechExpanded, setIsTechExpanded] = useState(false)

  const displayedTech = isTechExpanded ? project.tech : project.tech.slice(0, 3)
  const hasMoreTech = project.tech.length > 3
  const hiddenTech = project.tech.slice(3).join(", ")
  const isDownload = !!project.liveUrl && DOWNLOAD_URL.test(project.liveUrl)
  const summary = firstParagraph(project.description)
  const hasGallery = project.gallery.length > 0

  // The live link is the main action; without one, the gallery takes its place.
  const solid = "bg-primary hover:bg-primary/90 text-primary-foreground"
  const outline = "border border-border hover:bg-muted"
  const btn = "flex-1 min-w-0 min-h-11 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 text-sm font-medium"

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border flex flex-col h-full gap-0 py-0 dark:hover:shadow-blue-950">
        <div className="relative overflow-hidden aspect-[16/10] bg-muted">
          {/* Project card image: dynamic Supabase URL, dimensions vary per project. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col grow p-6 space-y-3">
          <h3 className="text-xl font-bold text-card-foreground">
            {project.title}
          </h3>

          {summary && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}

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
                title={isTechExpanded ? undefined : hiddenTech}
                aria-label={isTechExpanded ? undefined : hiddenTech}
              >
                {isTechExpanded
                  ? t("project_tech_less")
                  : `+${project.tech.length - 3}`}
              </button>
            )}
          </div>

          {/* Footer pinned to the bottom so cards in a row line up. */}
          <div className="flex gap-2 mt-auto pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} ${solid}`}
              >
                {isDownload ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                {isDownload ? t("project_download") || "Descargar" : t("project_online")}
              </a>
            )}
            {hasGallery && (
              <button
                onClick={onGalleryClick}
                className={`${btn} ${project.liveUrl ? outline : solid}`}
              >
                <ImageIcon className="w-4 h-4" />
                {t("project_gallery")}
              </button>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("project_github")}
                title={t("project_github")}
                className={`shrink-0 w-11 min-h-11 flex items-center justify-center rounded-lg transition-colors duration-200 ${outline}`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
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
