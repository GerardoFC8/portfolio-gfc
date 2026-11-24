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

  const links = [
    { name: t("nav_projects"), href: "#projects" },
    { name: t("nav_services"), href: "#services" },
    { name: t("nav_exp"), href: "#experience" },
    { name: t("nav_ai_skills"), href: "#ai-skills" },
    { name: t("nav_tech"), href: "#technologies" },
    { name: t("nav_contact"), href: "#contact" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contact CTA, repeated from the Contact section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4 mb-8 text-center sm:text-left">
          <p className="text-base font-semibold text-card-foreground">{t("footer_cta")}</p>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            {t("footer_cta_button")}
          </a>
        </div>

        {/* One row: brand, section links and social icons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8 text-center lg:text-left">
          <div className="shrink-0">
            <p className="text-base font-bold text-card-foreground">{t("footer_title")}</p>
            <p className="text-sm text-muted-foreground">{t("footer_description")}</p>
          </div>

          <nav aria-label={t("footer_quick_links")}>
            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-5">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex justify-center gap-1 shrink-0">
            {(footerData ?? []).map((link) => {
              const Icon = iconMap[link.icon.toLowerCase()]
              if (!Icon) return null
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted transition-colors duration-200"
                  aria-label={link.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {currentYear} Gerardo Franco · {t("footer_disclaimer")}</p>
          <p className="flex items-center gap-1">
            {t("made_with")}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" aria-hidden="true" />
            {t("by_author")}
          </p>
        </div>
      </div>
    </footer>
  )
}
