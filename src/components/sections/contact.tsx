"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Send, Linkedin } from "lucide-react"

export function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } catch {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendEmail = () => {
    window.location.href = `mailto:hello@gerardofranco.dev?subject=Proyecto%20para%20${formData.name}&body=${encodeURIComponent(formData.message)}`
  }

  const sendWhatsApp = () => {
    const message = encodeURIComponent(`Hola Gerardo, me gustaría contactarte sobre: ${formData.message}`)
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank")
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{t("contact_title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("contact_subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Email Card */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("contact_title_email")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("contact_subtitle_email")}
            </p>
            <a
              href="mailto:hello@gerardofranco.dev"
              className="text-primary hover:text-primary/80 font-semibold text-sm"
            >
              {t("contact_email_address")}
            </a>
          </Card>

          {/* WhatsApp Card */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("contact_title_whatsapp")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("contact_subtitle_whatsapp")}
            </p>
            <a
              href="https://wa.me/{t'1234567890'}"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold text-sm"
            >
              {t("contact_whatsapp_number")}
            </a>
          </Card>

          {/* LinkedIn Card */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Send className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("contact_title_linkedin")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("contact_subtitle_linkedin")}
            </p>
            <a
              href="https://www.linkedin.com/in/gerardofranco/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold text-sm"
            >
              {t("contact_linkedin_profile")}
            </a>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Cuéntame sobre tu proyecto..."
                required
              ></textarea>
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm font-medium">
                ¡Mensaje enviado correctamente! Te responderé pronto.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm font-medium">
                Error al enviar el mensaje. Por favor intenta de nuevo.
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Mensaje
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
