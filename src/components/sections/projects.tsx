"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
// import { Button } from "@/components/ui/button" // (Opcional si quitas el botón "Ver más")
import ProjectCard from "@/components/project-card"
import GalleryModal from "@/components/gallery-modal"

// --- Tipo de Datos (debe coincidir con page.tsx) ---
interface Project {
  id: string
  title: string
  description: string
  image_url: string
  gallery_urls: string[]
  tech: string[]
  live_url?: string
  github_url?: string
}

// --- Recibe 'projectsData' como prop ---
export function Projects({
  projectsData,
}: {
  projectsData: Project[] | null
}) {
  const { t } = useLanguage() // Para textos de botones
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const projects = projectsData || []

  if (!projectsData) {
    // Muestra loader si projectsData es null
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Cargando proyectos...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("projects_title")} {/* 't' del contexto */}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("projects_subtitle") || "Proyectos que demuestran mis habilidades"}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                id: project.id,
                title: project.title,
                description: project.description,
                image: project.image_url,
                gallery: project.gallery_urls,
                tech: project.tech,
                liveUrl: project.live_url,
                githubUrl: project.github_url,
              }}
              onGalleryClick={() => {
                setSelectedProject(project)
                setIsGalleryOpen(true)
              }}
            />
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedProject && (
        <GalleryModal
          isOpen={isGalleryOpen}
          onClose={() => {
            setIsGalleryOpen(false)
            setSelectedProject(null)
          }}
          project={{
            title: selectedProject.title,
            gallery: selectedProject.gallery_urls,
          }}
        />
      )}
    </section>
  )
}