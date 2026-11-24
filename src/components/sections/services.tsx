"use client"

import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import {
  Check,
  Gauge,
  Globe,
  History,
  LayoutDashboard,
  Monitor,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export interface ServiceData {
  id: string
  icon: string
  featured: boolean
  title: string
  description: string
  items: string[]
}

// Keys stored in services.icon; the admin offers the same list.
const ICONS: Record<string, LucideIcon> = {
  history: History,
  gauge: Gauge,
  "layout-dashboard": LayoutDashboard,
  globe: Globe,
  monitor: Monitor,
  wrench: Wrench,
}

export function Services({ servicesData }: { servicesData: ServiceData[] }) {
  const { t } = useLanguage()

  if (servicesData.length === 0) return null

  return (
    <section id="services" className="py-14 px-4 sm:px-6 lg:px-8 bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("services_title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            {t("services_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => {
            const Icon = ICONS[service.icon] ?? Wrench
            return (
              <Card
                key={service.id}
                className={
                  "p-6 gap-0 bg-card border-border flex flex-col transition-shadow duration-300 hover:shadow-lg " +
                  (service.featured
                    ? "border-primary/60 ring-1 ring-primary/30"
                    : "")
                }
              >
                {/* Featured cards are marked only by the accent border above. */}
                <div className="mb-4 self-start p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-pretty">
                    {service.description}
                  </p>
                )}
                {service.items.length > 0 && (
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-foreground/90">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
