"use client"

import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { Linkedin, Mail, MessageSquare } from "lucide-react"

// The number lives in one place: general_text.contact_whatsapp_number (editable
// from /admin). A 9-digit Peruvian mobile gets the 51 country code wa.me needs.
const waNumber = (raw: string) => {
  const digits = raw.replace(/\D/g, "")
  return digits.length === 9 ? `51${digits}` : digits
}

// "https://linkedin.com/in/gerardofc/" -> "in/gerardofc"
const linkedinHandle = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, "").replace(/\/$/, "")

const cardBase = "p-6 gap-0 bg-card border-border hover:shadow-lg transition-all duration-300 text-center flex flex-col"
const btn = "mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"

export function Contact() {
  const { t } = useLanguage()

  const email = t("contact_email_address")
  const whatsappHref = `https://wa.me/${waNumber(t("contact_whatsapp_number"))}?text=${encodeURIComponent(t("contact_whatsapp_message"))}`
  const linkedinUrl = t("contact_linkedin_profile")

  return (
    <section id="contact" className="py-14 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{t("contact_title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">{t("contact_cta")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email: the main channel, so it gets the solid button and the accent border */}
          <Card className={`${cardBase} border-primary/60 ring-1 ring-primary/30`}>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("contact_title_email")}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {t("contact_subtitle_email")}
            </p>
            <p className="text-sm font-semibold text-foreground mb-4 break-all">{email}</p>
            <a
              href={`mailto:${email}`}
              className={`${btn} bg-primary hover:bg-primary/90 text-primary-foreground`}
            >
              <Mail className="w-4 h-4" />
              {t("contact_email_button")}
            </a>
          </Card>

          {/* WhatsApp: a button with a prefilled message, no number in plain text */}
          <Card className={cardBase}>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("contact_title_whatsapp")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("contact_reply_time")}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-border hover:bg-muted`}
            >
              <MessageSquare className="w-4 h-4" />
              {t("contact_whatsapp_button")}
            </a>
          </Card>

          {/* LinkedIn: track record rather than a main channel */}
          <Card className={cardBase}>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Linkedin className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {t("contact_title_linkedin")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("contact_subtitle_linkedin")}
            </p>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} text-primary hover:text-primary/80 font-semibold`}
            >
              {linkedinHandle(linkedinUrl)}
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}
