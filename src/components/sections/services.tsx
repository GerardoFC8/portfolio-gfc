"use client"

import type { ReactNode } from "react"
import { useLanguage } from "@/context/language-context"
import { Card } from "@/components/ui/card"
import { SlowVsFast } from "@/components/visuals/slow-vs-fast"
import { SceneCarousel } from "@/components/visuals/scene-carousel"
import { DesktopToWeb } from "@/components/visuals/desktop-to-web"
import { MigrationDualWrite } from "@/components/visuals/migration-dual-write"
import { QuoteBuilder } from "@/components/visuals/quote-builder"
import { DesktopInstall } from "@/components/visuals/desktop-install"
import { IntegrationsHub } from "@/components/visuals/integrations-hub"
import { AiAssistant } from "@/components/visuals/ai-assistant"
import { CmsLiveEdit } from "@/components/visuals/cms-live-edit"
import {
  Check,
  Gauge,
  Globe,
  History,
  LayoutDashboard,
  Monitor,
  Plug,
  Sparkles,
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
  plug: Plug,
  sparkles: Sparkles,
  globe: Globe,
  monitor: Monitor,
  wrench: Wrench,
}

type T = (key: string) => string

// Animation shown at the top of each service card, keyed by its icon.
// A service whose icon is not listed here shows just the icon.
// `scenes` marks the ones that rotate, which carry their own dots below.
function visualFor(icon: string, t: T): { node: ReactNode; scenes: boolean } | null {
  switch (icon) {
    case "gauge":
      return {
        scenes: false,
        node: (
          <SlowVsFast
            label={t("visual_svf_label")}
            beforeLabel={t("visual_svf_before")}
            afterLabel={t("visual_svf_after")}
            beforeTime={t("visual_svf_before_time")}
            afterTime={t("visual_svf_after_time")}
            badge={t("visual_svf_badge")}
          />
        ),
      }
    case "history":
      // Rebuilt for the web, then the data moves over without stopping work.
      return {
        scenes: true,
        node: (
          <SceneCarousel
            scenes={[
              { ms: 7000, label: t("visual_dtw_label"), node: <DesktopToWeb label={t("visual_dtw_label")} /> },
              {
                ms: 8000,
                label: t("visual_mdw_label"),
                node: (
                  <MigrationDualWrite
                    label={t("visual_mdw_label")}
                    appLabel={t("visual_mdw_app")}
                    newLabel={t("visual_mdw_new")}
                    oldLabel={t("visual_mdw_old")}
                    offLabel={t("visual_mdw_off")}
                  />
                ),
              },
            ]}
          />
        ),
      }
    case "layout-dashboard":
      // Custom systems come as a web app or a desktop app: one scene each.
      return {
        scenes: true,
        node: (
          <SceneCarousel
            scenes={[
              {
                ms: 7000,
                label: t("visual_qb_label"),
                node: (
                  <QuoteBuilder
                    label={t("visual_qb_label")}
                    clientLabel={t("visual_qb_client")}
                    machineLabel={t("visual_qb_machine")}
                    hoursLabel={t("visual_qb_hours")}
                    totalLabel={t("visual_qb_total")}
                    sentLabel={t("visual_qb_sent")}
                  />
                ),
              },
              {
                ms: 7000,
                label: t("visual_dti_label"),
                node: (
                  <DesktopInstall
                    label={t("visual_dti_label")}
                    installingLabel={t("visual_dti_installing")}
                    readyLabel={t("visual_dti_ready")}
                  />
                ),
              },
            ]}
          />
        ),
      }
    case "plug":
      return {
        scenes: false,
        node: (
          <IntegrationsHub
            label={t("visual_ih_label")}
            systemLabel={t("visual_ih_system")}
            taxLabel={t("visual_ih_tax")}
            accountingLabel={t("visual_ih_accounting")}
            paymentsLabel={t("visual_ih_payments")}
            whatsappLabel={t("visual_ih_whatsapp")}
            offlineLabel={t("visual_ih_offline")}
            okLabel={t("visual_ih_ok")}
          />
        ),
      }
    case "sparkles":
      return {
        scenes: false,
        node: (
          <AiAssistant
            label={t("visual_ai_label")}
            question={t("visual_ai_question")}
            answer={t("visual_ai_answer")}
            col1={t("visual_ai_col1")}
            col2={t("visual_ai_col2")}
          />
        ),
      }
    case "globe":
      return {
        scenes: false,
        node: (
          <CmsLiveEdit
            label={t("visual_cms_label")}
            adminLabel={t("visual_cms_admin")}
            siteLabel={t("visual_cms_site")}
            oldTitle={t("visual_cms_old")}
            newTitle={t("visual_cms_new")}
            saveLabel={t("visual_cms_save")}
          />
        ),
      }
    case "monitor":
      return {
        scenes: false,
        node: (
          <DesktopInstall
            label={t("visual_dti_label")}
            installingLabel={t("visual_dti_installing")}
            readyLabel={t("visual_dti_ready")}
          />
        ),
      }
    default:
      return null
  }
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
            const visual = visualFor(service.icon, t)
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
                {/* Featured cards are marked only by the accent border above.
                    Services with an animation show it instead of the icon. */}
                {visual ? (
                  <div
                    className={
                      "mb-4 rounded-lg border border-border bg-muted/30 p-2 " +
                      (visual.scenes ? "pb-0" : "")
                    }
                  >
                    {visual.node}
                  </div>
                ) : (
                  <div className="mb-4 self-start p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                )}
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
