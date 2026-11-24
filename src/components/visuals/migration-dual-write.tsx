// Migración sin parar el negocio: escritura doble en ambas bases, retiro del
// sistema antiguo y la app sigue escribiendo solo en la base nueva. Bucle de 8 s.

const css = `
.mdw-line { stroke: var(--muted-foreground); stroke-opacity: 0.55; stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.mdw-old-line { stroke-dasharray: 4 0; animation: mdw-line-off 8s linear infinite; }
.mdw-text { fill: var(--foreground); font-size: 11px; font-family: inherit; }
.mdw-sub { fill: var(--muted-foreground); font-size: 10px; font-family: inherit; }
.mdw-new-fill { fill: color-mix(in oklch, var(--primary) 16%, var(--card)); stroke: var(--primary); stroke-width: 1.5; }
.mdw-new-band { fill: none; stroke: var(--primary); stroke-opacity: 0.5; stroke-width: 1; }
.mdw-old-fill { fill: var(--muted); stroke: var(--muted-foreground); stroke-width: 1.5; }
.mdw-old-band { fill: none; stroke: var(--muted-foreground); stroke-opacity: 0.6; stroke-width: 1; stroke-dasharray: 2 2; }
.mdw-old { animation: mdw-retire 8s ease-in-out infinite; }
.mdw-tag { opacity: 0; animation: mdw-tag 8s ease-in-out infinite; }
.mdw-tag-box { fill: var(--card); stroke: var(--muted-foreground); stroke-width: 1; }
.mdw-chip { opacity: 0; transform: translate(106px, 77px); animation: 8s linear infinite both; }
.mdw-chip-new { fill: var(--primary); animation-name: mdw-to-new; }
.mdw-chip-old { fill: var(--muted-foreground); animation-name: mdw-to-old; }
.mdw-halo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: mdw-pulse 8s ease-out infinite both; }
.mdw-halo-new { fill: var(--primary); }
.mdw-halo-old { fill: var(--muted-foreground); }
.mdw-window { fill: var(--card); stroke: var(--muted-foreground); stroke-opacity: 0.7; stroke-width: 1.2; }
.mdw-row { fill: var(--muted); }
.mdw-row-hi { fill: var(--primary); opacity: 0.15; animation: mdw-row 1.8s ease-in-out infinite; }
.mdw-live { fill: var(--primary); animation: mdw-live 1.2s ease-in-out infinite; }
.mdw-dot { fill: var(--muted-foreground); opacity: 0.6; }
@keyframes mdw-to-new {
  0% { transform: translate(106px, 77px); opacity: 0; }
  2% { opacity: 1; }
  6% { transform: translate(150px, 77px); }
  12% { transform: translate(186px, 37px); }
  17% { transform: translate(228px, 37px); opacity: 1; }
  18.5%, 100% { transform: translate(234px, 37px); opacity: 0; }
}
@keyframes mdw-to-old {
  0% { transform: translate(106px, 77px); opacity: 0; }
  2% { opacity: 1; }
  6% { transform: translate(150px, 77px); }
  12% { transform: translate(186px, 117px); }
  17% { transform: translate(228px, 117px); opacity: 1; }
  18.5%, 100% { transform: translate(234px, 117px); opacity: 0; }
}
@keyframes mdw-pulse {
  0% { opacity: 0; transform: scale(1); }
  2% { opacity: 0.3; }
  10%, 100% { opacity: 0; transform: scale(1.2); }
}
@keyframes mdw-retire {
  0%, 50% { opacity: 1; filter: grayscale(0); }
  62.5%, 92% { opacity: 0.3; filter: grayscale(1); }
  100% { opacity: 1; filter: grayscale(0); }
}
@keyframes mdw-line-off {
  0%, 50% { stroke-dasharray: 4 0; opacity: 1; }
  62.5%, 92% { stroke-dasharray: 4 4; opacity: 0.3; }
  100% { stroke-dasharray: 4 0; opacity: 1; }
}
@keyframes mdw-tag {
  0%, 54% { opacity: 0; }
  62.5%, 90% { opacity: 1; }
  96%, 100% { opacity: 0; }
}
@keyframes mdw-row { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.45; } }
@keyframes mdw-live { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
@media (prefers-reduced-motion: reduce) {
  .mdw-old, .mdw-old-line, .mdw-tag, .mdw-chip, .mdw-halo, .mdw-row-hi, .mdw-live { animation: none; }
  .mdw-old { opacity: 0.3; filter: grayscale(1); }
  .mdw-old-line { stroke-dasharray: 4 4; opacity: 0.3; }
  .mdw-tag { opacity: 1; }
  .mdw-chip-static { opacity: 1; transform: translate(196px, 37px); }
}
`

// Llegadas (s): fase 1 doble escritura a 0.2 y 2.0; fase 3 solo base nueva a 5.2 y 6.3.
const dual = [0.2, 2.0]
const newOnly = [5.2, 6.3]
const travel = 1.4

function Cylinder({ cy, kind }: { cy: number; kind: "new" | "old" }) {
  const top = cy - 15
  return (
    <g>
      <path
        className={`mdw-${kind}-fill`}
        d={`M238 ${top} v30 a24 6 0 0 0 48 0 v-30`}
      />
      <ellipse className={`mdw-${kind}-fill`} cx={262} cy={top} rx={24} ry={6} />
      <path className={`mdw-${kind}-band`} d={`M238 ${cy} a24 6 0 0 0 48 0`} />
    </g>
  )
}

export function MigrationDualWrite({
  label,
  appLabel,
  newLabel,
  oldLabel,
  offLabel,
}: {
  label: string
  appLabel: string
  newLabel: string
  oldLabel: string
  offLabel: string
}) {
  const chip = (key: string, cls: string, delay: number) => (
    <rect
      key={key}
      className={`mdw-chip ${cls}`}
      x={-7}
      y={-4.5}
      width={14}
      height={9}
      rx={2.5}
      style={{ animationDelay: `${delay}s` }}
    />
  )
  const halo = (key: string, kind: "new" | "old", cy: number, delay: number) => (
    <rect
      key={key}
      className={`mdw-halo mdw-halo-${kind}`}
      x={232}
      y={cy - 25}
      width={60}
      height={50}
      rx={12}
      style={{ animationDelay: `${delay + travel}s` }}
    />
  )

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

      {/* Conexiones */}
      <path className="mdw-line" d="M106 77 H150 L186 37 H236" />
      <path className="mdw-line mdw-old-line" d="M150 77 L186 117 H236" />

      {/* App web, siempre activa */}
      <rect className="mdw-window" x={14} y={40} width={92} height={74} rx={6} />
      <line className="mdw-line" x1={14} y1={52} x2={106} y2={52} />
      <circle className="mdw-dot" cx={22} cy={46} r={1.6} />
      <circle className="mdw-dot" cx={28} cy={46} r={1.6} />
      <circle className="mdw-dot" cx={34} cy={46} r={1.6} />
      <circle className="mdw-live" cx={98} cy={46} r={2.4} />
      {[
        [60, 62],
        [72, 48],
        [84, 56],
        [96, 40],
      ].map(([y, w], i) => (
        <g key={y}>
          <rect className="mdw-row" x={22} y={y} width={w} height={6} rx={2} />
          <rect
            className="mdw-row-hi"
            x={22}
            y={y}
            width={w}
            height={6}
            rx={2}
            style={{ animationDelay: `${i * 0.45}s` }}
          />
        </g>
      ))}
      <text className="mdw-text" x={60} y={132} textAnchor="middle">
        {appLabel}
      </text>

      {/* Pulsos al llegar cada registro */}
      {[...dual, ...newOnly].map((d) => halo(`hn${d}`, "new", 37, d))}
      {dual.map((d) => halo(`ho${d}`, "old", 117, d))}

      {/* Base nueva */}
      <Cylinder cy={37} kind="new" />
      <text className="mdw-text" x={262} y={74} textAnchor="middle">
        {newLabel}
      </text>

      {/* Sistema antiguo */}
      <g className="mdw-old">
        <Cylinder cy={117} kind="old" />
        <text className="mdw-sub" x={262} y={154} textAnchor="middle">
          {oldLabel}
        </text>
      </g>
      <g className="mdw-tag">
        <rect className="mdw-tag-box" x={228} y={109} width={68} height={16} rx={8} />
        <text className="mdw-sub" x={262} y={120.5} textAnchor="middle">
          {offLabel}
        </text>
      </g>

      {/* Registros viajando */}
      {dual.map((d) => chip(`cn${d}`, "mdw-chip-new", d))}
      {dual.map((d) => chip(`co${d}`, "mdw-chip-old", d))}
      {chip("cs1", "mdw-chip-new mdw-chip-static", newOnly[0])}
      {chip("cs2", "mdw-chip-new", newOnly[1])}
    </svg>
  )
}
