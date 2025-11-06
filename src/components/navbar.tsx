"use client"

import { useState } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useLanguage } from "@/context/language-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()

  const navItems = [
    { key: "nav_projects", href: "#projects" },
    { key: "nav_tech", href: "#technologies" },
    { key: "nav_exp", href: "#experience" },
    { key: "nav_contact", href: "#contact" },
  ]

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="text-xl font-bold text-primary">
              <img src="/logo-gfc.ico" alt="Icono" className="w-12 rounded-lg" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                {t(item.key)}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setLang("es")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                  lang === "es"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <AnimatedThemeToggler />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-200 font-medium"
              >
                {t(item.key)}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
