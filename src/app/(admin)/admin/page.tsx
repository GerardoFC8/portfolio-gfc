"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Section } from "@/app/(admin)/admin/components/admin-types";

// Importar los nuevos componentes CRUD
import { GeneralTextAdmin } from "@/app/(admin)/admin/components/general-text-admin";
import { HeroAdmin } from "@/app/(admin)/admin/components/hero-admin";
import { ProjectsAdmin } from "@/app/(admin)/admin/components/projects-admin";
import { ExperienceAdmin } from "@/app/(admin)/admin/components/experience-admin";
import { TechnologiesAdmin } from "@/app/(admin)/admin/components/technologies-admin";
import { SocialLinksAdmin } from "@/app/(admin)/admin/components/social-links-admin";

const sectionTitles: Record<Section, string> = {
  general_text: "Textos Generales",
  hero: "Sección Hero",
  projects: "Proyectos",
  experience: "Experiencia",
  technologies: "Tecnologías",
  social_links: "Redes Sociales",
};

// Componente Principal del Panel de Admin (Ahora mucho más limpio)
export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("projects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "general_text":
        return <GeneralTextAdmin />;
      case "hero":
        return <HeroAdmin />;
      case "projects":
        return <ProjectsAdmin />;
      case "experience":
        return <ExperienceAdmin />;
      case "technologies":
        return <TechnologiesAdmin />;
      case "social_links":
        return <SocialLinksAdmin />;
      default:
        return null;
    }
  };

  const NavButton = ({ section }: { section: Section }) => (
    <Button
      variant={activeSection === section ? "default" : "ghost"}
      onClick={() => {
        setActiveSection(section);
        setIsSidebarOpen(false);
      }}
      className="w-full justify-start"
    >
      {sectionTitles[section]}
    </Button>
  );

  return (
    <div className="flex min-h-screen">
      {/* Botón para abrir sidebar en móvil */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-20 left-4 z-20"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={20} />
      </Button>

      {/* Sidebar */}
      <nav
        className={`fixed md:relative top-16 md:top-0 left-0 h-full md:h-auto md:w-64 bg-card border-r border-border z-10 p-4 space-y-2 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center md:hidden">
          <h2 className="text-lg font-bold">Menú Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <NavButton section="projects" />
        <NavButton section="experience" />
        <NavButton section="technologies" />
        <NavButton section="hero" />
        <NavButton section="general_text" />
        <NavButton section="social_links" />
      </nav>

      {/* Contenido Principal */}
      <div className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold md:hidden">
          {sectionTitles[activeSection]}
        </h1>
        {renderSection()}
      </div>
    </div>
  );
}