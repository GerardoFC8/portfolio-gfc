"use client"

import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Send } from "lucide-react"

export function Contact() {
  const { t } = useLanguage()

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
              href={`mailto:${t("contact_email_address")}`}
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
              href={`https://wa.me/${t("contact_whatsapp_number")}`}
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
              href={t("contact_linkedin_profile")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold text-sm"
            >
              {t("contact_linkedin_profile")}
            </a>
          </Card>
        </div>

      </div>
    </section>
  )
}
