"use client"

import { useLanguage } from "@/context/language-context"
import { Heart, Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/gerardofranco",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/gerardofranco",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/gerardofranco",
    },
  ]

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
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
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
            {t("made_with")} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {t("by_author")}
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            {t("footer_disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  )
}
