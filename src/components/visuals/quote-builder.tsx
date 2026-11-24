// Un sistema a medida arma solo una cotización de alquiler: llena el formulario,
// calcula el total, genera el PDF y lo envía. Bucle de 7 s.

type QuoteBuilderProps = {
  label: string
  clientLabel: string
  machineLabel: string
  hoursLabel: string
  totalLabel: string
  sentLabel: string
}

/*
 * Tiempos (s): cliente 0.3-0.9, máquina 1.0-1.6, horas 1.7-2.1, total 2.4,
 * PDF sale 3.1-3.6, cabecera 3.7, avión 4.2-5.0, insignia 5.0, fundido 6.4-6.9.
 * Los estilos base son el estado final, así reduced-motion lo muestra completo.
 */
const css = `
.qb-window { fill: var(--card); stroke: var(--muted-foreground); stroke-opacity: 0.7; stroke-width: 1.2; }
.qb-label { fill: var(--muted-foreground); font-size: 10px; font-family: inherit; }
.qb-value { fill: var(--foreground); font-size: 11px; font-family: inherit; }
.qb-box { fill: var(--background); stroke: var(--border); stroke-width: 1; }
.qb-cover { fill: var(--background); transform-box: fill-box; transform-origin: right center; transform: scaleX(0); }
.qb-rule { stroke: var(--muted-foreground); stroke-opacity: 0.55; stroke-width: 1; }
.qb-total { fill: var(--primary); font-size: 11px; font-weight: 700; font-family: inherit; font-variant-numeric: tabular-nums; }
.qb-hi { fill: var(--primary); opacity: 0.12; }
.qb-sheet { fill: var(--card); stroke: var(--muted-foreground); stroke-width: 1.2; stroke-linejoin: round; }
.qb-fold { fill: var(--muted); stroke: var(--muted-foreground); stroke-width: 1.2; stroke-linejoin: round; }
.qb-row { fill: var(--muted); }
.qb-head { fill: var(--primary); transform-box: fill-box; transform-origin: left center; }
.qb-pdf { fill: var(--muted-foreground); font-size: 10px; font-weight: 700; font-family: inherit; }
.qb-plane { fill: var(--primary); opacity: 0; }
.qb-trail { stroke: var(--primary); stroke-opacity: 0.5; stroke-width: 1.5; stroke-dasharray: 3 3; fill: none; stroke-linecap: round; opacity: 0; }
.qb-badge { transform-box: fill-box; transform-origin: center; }
.qb-badge-bg { fill: var(--primary); }
.qb-badge-text { fill: var(--primary-foreground); font-size: 10px; font-weight: 700; font-family: inherit; }
.qb-check { fill: none; stroke: var(--primary-foreground); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.qb-scene { animation: qb-scene 7s linear infinite; }
.qb-cover-1 { animation: qb-type-1 7s linear infinite; }
.qb-cover-2 { animation: qb-type-2 7s linear infinite; }
.qb-cover-3 { animation: qb-type-3 7s linear infinite; }
.qb-sum { animation: qb-sum 7s ease-out infinite; }
.qb-hi { animation: qb-hi 7s ease-out infinite; }
.qb-doc { animation: qb-doc 7s ease-out infinite; }
.qb-head { animation: qb-head 7s ease-out infinite; }
.qb-plane { animation: qb-plane 7s ease-in infinite; }
.qb-trail { animation: qb-trail 7s linear infinite; }
.qb-badge { animation: qb-badge 7s ease-out infinite; }

@keyframes qb-scene {
  0%, 91% { opacity: 1; }
  98%, 100% { opacity: 0; }
}
@keyframes qb-type-1 {
  0%, 4.3% { transform: scaleX(1); animation-timing-function: steps(10, end); }
  12.9%, 100% { transform: scaleX(0); }
}
@keyframes qb-type-2 {
  0%, 14.3% { transform: scaleX(1); animation-timing-function: steps(10, end); }
  22.9%, 100% { transform: scaleX(0); }
}
@keyframes qb-type-3 {
  0%, 24.3% { transform: scaleX(1); animation-timing-function: steps(5, end); }
  30%, 100% { transform: scaleX(0); }
}
@keyframes qb-sum {
  0%, 34.3% { opacity: 0; transform: translateY(4px); }
  38%, 100% { opacity: 1; transform: translateY(0); }
}
@keyframes qb-hi {
  0%, 34.3% { opacity: 0; }
  38% { opacity: 0.35; }
  45%, 100% { opacity: 0.12; }
}
@keyframes qb-doc {
  0%, 44.3% { opacity: 0; transform: translateX(-26px); }
  51.4%, 100% { opacity: 1; transform: translateX(0); }
}
@keyframes qb-head {
  0%, 52.9% { transform: scaleX(0); }
  57%, 100% { transform: scaleX(1); }
}
@keyframes qb-plane {
  0%, 60% { opacity: 0; transform: translate(0, 0); }
  62% { opacity: 1; transform: translate(2px, -1px); }
  70% { opacity: 1; transform: translate(30px, -26px); }
  72.5%, 100% { opacity: 0; transform: translate(36px, -31px); }
}
@keyframes qb-trail {
  0%, 62% { opacity: 0; }
  66%, 72% { opacity: 1; }
  78%, 100% { opacity: 0; }
}
@keyframes qb-badge {
  0%, 71.4% { opacity: 0; transform: scale(0.6); }
  74.5% { opacity: 1; transform: scale(1.08); }
  77%, 100% { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .qb-scene, .qb-cover-1, .qb-cover-2, .qb-cover-3, .qb-sum, .qb-hi, .qb-doc,
  .qb-head, .qb-plane, .qb-trail, .qb-badge { animation: none; }
}
`

const fields = [
  { key: "c", y: 36, value: "Constructora Demo", cover: "qb-cover-1" },
  { key: "m", y: 66, value: "Excavadora 320", cover: "qb-cover-2" },
  { key: "h", y: 96, value: "200 h", cover: "qb-cover-3" },
]

export function QuoteBuilder({
  label,
  clientLabel,
  machineLabel,
  hoursLabel,
  totalLabel,
  sentLabel,
}: QuoteBuilderProps) {
  const labels = [clientLabel, machineLabel, hoursLabel]

  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      height="auto"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <style>{css}</style>
      <g className="qb-scene" aria-hidden="true">
        {/* Formulario */}
        <rect className="qb-window" x={12} y={16} width={164} height={142} rx={6} />
        {fields.map((f, i) => (
          <g key={f.key}>
            <text className="qb-label" x={22} y={f.y - 4}>
              {labels[i]}
            </text>
            <rect className="qb-box" x={22} y={f.y} width={144} height={18} rx={3} />
            <text className="qb-value" x={28} y={f.y + 13}>
              {f.value}
            </text>
            <rect className={`qb-cover ${f.cover}`} x={23} y={f.y + 1} width={142} height={16} />
          </g>
        ))}
        <line className="qb-rule" x1={22} y1={124} x2={166} y2={124} />
        <rect className="qb-hi" x={18} y={130} width={152} height={20} rx={4} />
        <g className="qb-sum">
          <text className="qb-label" x={24} y={144}>
            {totalLabel}
          </text>
          <text className="qb-total" x={164} y={144} textAnchor="end">
            S/ 12,980.00
          </text>
        </g>

        {/* PDF generado */}
        <g className="qb-doc">
          <path className="qb-sheet" d="M206 34 H250 L262 46 V110 H206 Z" />
          <rect className="qb-head" x={206.6} y={34.6} width={43} height={11} />
          <path className="qb-fold" d="M250 34 V46 H262 Z" />
          <rect className="qb-row" x={213} y={56} width={36} height={4} rx={2} />
          <rect className="qb-row" x={213} y={65} width={28} height={4} rx={2} />
          <rect className="qb-row" x={213} y={74} width={32} height={4} rx={2} />
          <text className="qb-pdf" x={234} y={101} textAnchor="middle">
            PDF
          </text>
        </g>

        {/* Envío */}
        <path className="qb-trail" d="M268 76 L298 50" />
        <path className="qb-plane" d="M266 80 L284 70 L276 86 L274 79 Z" />

        <g className="qb-badge">
          <rect className="qb-badge-bg" x={182} y={126} width={132} height={24} rx={12} />
          <path className="qb-check" d="M193 138 l3.5 3.5 l6 -7" />
          <text className="qb-badge-text" x={207} y={141.5}>
            {sentLabel}
          </text>
        </g>
      </g>
    </svg>
  )
}
