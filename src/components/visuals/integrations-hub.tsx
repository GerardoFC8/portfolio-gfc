// El sistema de la empresa conectado con lo que ya usa: datos que van y vienen,
// Contabilidad se cae un rato y el resto sigue funcionando. Bucle de 8 s.

/*
 * Cada conexión usa la misma curva (arriba a la izquierda) y las demás la reflejan
 * con un transform del grupo, así bastan dos recorridos: salida y llegada.
 * Contabilidad sin conexión de 4.2 s a 6.2 s; en 6.4 y 6.6 recibe lo que quedó en cola.
 * Los estilos base son el estado conectado, que es lo que ve reduced-motion.
 */
const css = `
.ih-line { stroke: var(--muted-foreground); stroke-opacity: 0.55; stroke-width: 1.5; fill: none; stroke-linecap: round; }
.ih-line-off { stroke: var(--destructive-foreground); stroke-width: 1.5; stroke-dasharray: 3 3; fill: none; opacity: 0; }
.ih-text { fill: var(--foreground); font-size: 11px; font-family: inherit; }
.ih-sub { fill: var(--foreground); font-size: 10px; font-family: inherit; }
.ih-core { fill: color-mix(in oklch, var(--primary) 16%, var(--card)); stroke: var(--primary); stroke-width: 1.5; }
.ih-pill { fill: var(--card); stroke: var(--muted-foreground); stroke-opacity: 0.7; stroke-width: 1.2; }
.ih-glyph { fill: none; stroke: var(--primary); stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
.ih-red { fill: color-mix(in oklch, var(--destructive-foreground) 14%, var(--card)); stroke: var(--destructive-foreground); stroke-width: 1.2; opacity: 0; }
.ih-red-text { fill: var(--destructive-foreground); font-size: 10px; font-family: inherit; }
.ih-badge-bg { fill: var(--primary); }
.ih-badge-text { fill: var(--primary-foreground); font-size: 10px; font-weight: 700; font-family: inherit; }
.ih-check { fill: none; stroke: var(--primary-foreground); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.ih-dot { opacity: 0; transform: translate(122px, 74px); animation: 8s linear infinite both; }
.ih-dot-out { fill: var(--primary); animation-name: ih-out; }
.ih-dot-fast { animation-name: ih-out-fast; }
.ih-dot-in { fill: var(--foreground); animation-name: ih-in; }
.ih-halo { opacity: 0; transform-box: fill-box; transform-origin: center; fill: var(--primary); animation: ih-pulse 8s ease-out infinite both; }
.ih-acc { animation: ih-acc 8s ease-in-out infinite; }
.ih-red, .ih-line-off { animation: ih-off 8s ease-in-out infinite; }
.ih-line-on { animation: ih-on 8s ease-in-out infinite; }
.ih-tag { opacity: 0; animation: ih-tag 8s ease-in-out infinite; }
.ih-ok { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ih-ok 8s ease-out infinite; }
@keyframes ih-out {
  0% { transform: translate(122px, 74px); opacity: 0; }
  1.5% { opacity: 1; }
  2.5% { transform: translate(114.6px, 67.8px); }
  5% { transform: translate(111px, 54px); }
  7.5% { transform: translate(107.4px, 40.2px); opacity: 1; }
  10%, 100% { transform: translate(100px, 34px); opacity: 0; }
}
@keyframes ih-out-fast {
  0% { transform: translate(122px, 74px); opacity: 0; }
  1% { opacity: 1; }
  2.5% { transform: translate(111px, 54px); }
  4% { opacity: 1; }
  5%, 100% { transform: translate(100px, 34px); opacity: 0; }
}
@keyframes ih-in {
  0% { transform: translate(100px, 34px); opacity: 0; }
  1.5% { opacity: 1; }
  2.5% { transform: translate(107.4px, 40.2px); }
  5% { transform: translate(111px, 54px); }
  7.5% { transform: translate(114.6px, 67.8px); opacity: 1; }
  10%, 100% { transform: translate(122px, 74px); opacity: 0; }
}
@keyframes ih-pulse {
  0% { opacity: 0; transform: scale(1); }
  2% { opacity: 0.3; }
  10%, 100% { opacity: 0; transform: scale(1.15); }
}
@keyframes ih-acc { 0%, 52.5% { opacity: 1; } 55%, 77.5% { opacity: 0.45; } 80%, 100% { opacity: 1; } }
@keyframes ih-off { 0%, 52.5% { opacity: 0; } 55%, 77.5% { opacity: 1; } 80%, 100% { opacity: 0; } }
@keyframes ih-on { 0%, 52.5% { opacity: 1; } 55%, 77.5% { opacity: 0; } 80%, 100% { opacity: 1; } }
@keyframes ih-tag { 0%, 53% { opacity: 0; } 56%, 76% { opacity: 1; } 79%, 100% { opacity: 0; } }
@keyframes ih-ok {
  0%, 55% { opacity: 0; transform: scale(0.6); }
  58% { opacity: 1; transform: scale(1.08); }
  60%, 86% { opacity: 1; transform: scale(1); }
  90%, 100% { opacity: 0; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ih-dot, .ih-halo, .ih-acc, .ih-red, .ih-line-off, .ih-line-on, .ih-tag, .ih-ok { animation: none; }
  .ih-static { opacity: 1; transform: translate(111px, 54px); }
}
`

// Conexiones: mismo trazo reflejado. tl SUNAT, bl Contabilidad, tr Pagos, br WhatsApp.
const links = {
  tl: { flip: undefined, pill: [4, 22] },
  bl: { flip: "translate(0 164) scale(1 -1)", pill: [4, 118] },
  tr: { flip: "translate(320 0) scale(-1 1)", pill: [220, 22] },
  br: { flip: "translate(320 164) scale(-1 -1)", pill: [220, 118] },
} as const
type Link = keyof typeof links
const PILL_W = 96

// [conexión, sentido, inicio en s]
const flows: [Link, "out" | "in" | "fast", number][] = [
  ["tl", "out", 0.2], ["tr", "in", 0.6], ["tl", "in", 1.1], ["bl", "out", 1.3],
  ["br", "out", 1.8], ["tl", "out", 2.5], ["tr", "in", 2.8], ["bl", "out", 3.2],
  ["tl", "out", 4.3], ["tr", "in", 4.6], ["br", "out", 5.0], ["tl", "in", 5.4],
  ["tr", "in", 5.7], ["bl", "fast", 6.4], ["bl", "fast", 6.6], ["br", "out", 6.9],
]
// Pills are 96 wide (end at x=100), the core starts at x=122.
const path = "M100 34 C114 34 108 74 122 74"

function Glyph({ kind, x, y }: { kind: Link; x: number; y: number }) {
  const g = {
    tl: `M${x - 5} ${y - 6.5} h7 l3 3 v10 h-10 Z M${x - 2.5} ${y - 1} h5 M${x - 2.5} ${y + 2} h5`,
    bl: `M${x - 6} ${y - 5.5} h12 v11 h-12 Z M${x - 3} ${y - 5.5} v11 M${x} ${y - 2} h3.5 M${x} ${y + 1} h3.5`,
    tr: `M${x - 6.5} ${y - 4.5} h13 v9 h-13 Z M${x - 6.5} ${y - 1.5} h13 M${x - 4} ${y + 2.2} h3`,
    br: `M${x - 6} ${y - 5} h12 v8 h-6 l-4 3 v-3 h-2 Z`,
  }[kind]
  return <path className="ih-glyph" d={g} />
}

export function IntegrationsHub(props: {
  label: string
  systemLabel: string
  taxLabel: string
  accountingLabel: string
  paymentsLabel: string
  whatsappLabel: string
  offlineLabel: string
  okLabel: string
}) {
  const names: Record<Link, string> = {
    tl: props.taxLabel,
    bl: props.accountingLabel,
    tr: props.paymentsLabel,
    br: props.whatsappLabel,
  }
  // Badge sized to its label (~5.6 units per bold 10px character) and centered.
  const okW = Math.min(150, 28 + props.okLabel.length * 5.6)
  const okX = 160 - okW / 2

  const pill = (k: Link) => {
    const [x, y] = links[k].pill
    return (
      <>
        <rect className="ih-pill" x={x} y={y} width={PILL_W} height={24} rx={12} />
        <Glyph kind={k} x={x + 15} y={y + 12} />
        <text className="ih-sub" x={x + 27} y={y + 15.5}>
          {names[k]}
        </text>
      </>
    )
  }

  return (
    <svg viewBox="0 0 320 180" width="100%" height="auto" role="img" aria-label={props.label}>
      <title>{props.label}</title>
      <style>{css}</style>
      <g aria-hidden="true">
        {/* Pulsos al llegar: en el satélite (salida) o en el sistema (llegada) */}
        {flows.map(([k, dir, t], i) => {
          const arrive = t + (dir === "fast" ? 0.4 : 0.8)
          const [x, y] = dir === "in" ? [118, 58] : links[k].pill
          const [w, h, r] = dir === "in" ? [84, 48, 10] : [PILL_W, 24, 12]
          return (
            <rect
              key={`h${i}`}
              className="ih-halo"
              x={x}
              y={y}
              width={w}
              height={h}
              rx={r}
              style={{ animationDelay: `${arrive}s` }}
            />
          )
        })}

        {/* Conexiones y datos viajando */}
        {(Object.keys(links) as Link[]).map((k) => (
          <g key={k} transform={links[k].flip}>
            <path className={`ih-line${k === "bl" ? " ih-line-on" : ""}`} d={path} />
            {k === "bl" && <path className="ih-line-off" d={path} />}
            {flows.map(([fk, dir, t], i) =>
              fk !== k ? null : dir === "in" ? (
                <circle
                  key={i}
                  className={`ih-dot ih-dot-in${i === 1 ? " ih-static" : ""}`}
                  r={3}
                  style={{ animationDelay: `${t}s` }}
                />
              ) : (
                <rect
                  key={i}
                  className={`ih-dot ih-dot-out${dir === "fast" ? " ih-dot-fast" : ""}${i === 0 ? " ih-static" : ""}`}
                  x={-4.5}
                  y={-3}
                  width={9}
                  height={6}
                  rx={2}
                  style={{ animationDelay: `${t}s` }}
                />
              ),
            )}
          </g>
        ))}

        {/* Tu sistema */}
        <rect className="ih-core" x={122} y={62} width={76} height={40} rx={8} />
        <rect className="ih-glyph" x={153} y={67} width={14} height={11} rx={2} />
        <path className="ih-glyph" d="M153 70.5 h14" />
        <text className="ih-text" x={160} y={95} textAnchor="middle">
          {props.systemLabel}
        </text>

        {/* Satélites */}
        {pill("tl")}
        {pill("tr")}
        {pill("br")}
        {/* Red backing goes behind the pill so "Contabilidad" stays readable while offline. */}
        <rect className="ih-red" x={4} y={118} width={PILL_W} height={24} rx={12} />
        <g className="ih-acc">{pill("bl")}</g>
        <g className="ih-tag">
          <rect className="ih-red" style={{ opacity: 1, animation: "none" }} x={10} y={147} width={84} height={16} rx={8} />
          <text className="ih-red-text" x={52} y={158.5} textAnchor="middle">
            {props.offlineLabel}
          </text>
        </g>

        {/* El sistema sigue funcionando */}
        <g className="ih-ok">
          {/* Below the bottom curves, in the clear space between the two lower pills. */}
          <rect className="ih-badge-bg" x={okX} y={148} width={okW} height={16} rx={8} />
          <path className="ih-check" d={`M${okX + 8} 156 l2.5 2.5 l4.5 -5`} />
          <text className="ih-badge-text" x={okX + 19} y={159.5}>
            {props.okLabel}
          </text>
        </g>
      </g>
    </svg>
  )
}
