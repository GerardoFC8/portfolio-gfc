"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    title: string
    gallery: string[]
  }
}

export default function GalleryModal({ isOpen, onClose, project }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen) return null

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? project.gallery.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === project.gallery.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-card rounded-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-background rounded-lg transition-colors duration-200"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Image Container */}
        <div className="flex-1 overflow-hidden bg-background">
          <img
            src={project.gallery[currentIndex] || "/placeholder.svg"}
            alt={`${project.title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 bg-card border-t border-border">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Image Counter */}
          <div className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {project.gallery.length}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 p-4 bg-background overflow-x-auto">
          {project.gallery.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                index === currentIndex ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
