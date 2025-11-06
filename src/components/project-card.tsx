"use client"

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

        <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((tech) => (
            <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
              +{project.tech.length - 3}
            </span>
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
