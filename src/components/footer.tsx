"use client"

import { useLanguage } from "@/context/language-context"
// Importamos los íconos que usaremos y también el tipo 'LucideIcon'
import { Heart, Github, Linkedin, Twitter, Youtube, Instagram, Mail, MessageSquare, Link, type LucideIcon } from "lucide-react"

interface FooterData {
  name: string
  icon: string // Esto sigue siendo un string, ej: "github"
  href: string
}

// Creamos un "mapa" para traducir los strings a componentes
// La llave (key) es el string que viene de Supabase (ej: "github")
// El valor (value) es el componente importado (ej: Github)
const iconMap: { [key: string]: LucideIcon } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  mail: Mail,
  messagesquare: MessageSquare,
  link: Link,
}

// Actualizamos los props para aceptar un array de FooterData o null
export function Footer({ footerData }: { footerData: FooterData[] | null }) {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("footer_title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("footer_description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-4">
              {t("footer_quick_links")}
            </h4>
            <ul className="space-y-2">
              {[
                { name: t("nav_projects"), href: "#projects" },
                { name: t("nav_tech"), href: "#technologies" },
                { name: t("nav_exp"), href: "#experience" },
                { name: t("nav_contact"), href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-4">
              {t("footer_follow_me")}
            </h4>
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {/* 1. Verificamos que footerData exista y sea un array con items.
                2. Buscamos el componente de ícono en nuestro iconMap.
                3. Ponemos .toLowerCase() por seguridad, para que "GitHub" o "github" funcionen.
              */}
              {footerData &&
                footerData.length > 0 &&
                footerData.map((link) => {
                  const Icon = iconMap[link.icon.toLowerCase()]

                  // Si no encontramos el ícono en el mapa, no renderizamos nada
                  if (!Icon) {
                    console.warn(`Icono no encontrado: ${link.icon}`)
                    return null
                  }

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                      aria-label={link.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            {currentYear}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {t("made_with")}{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            {t("by_author")}
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            {t("footer_disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  )
}