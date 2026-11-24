// El equipo del cliente edita su propia web: cambia el título y la imagen en el
// panel, guarda y la web se actualiza al instante. Bucle de 7 s.
// Reinicio suave 6.6-6.9 s: el título y la imagen nuevos se funden de vuelta a
// los originales; marcos, etiquetas, barras y botón no se desvanecen nunca.

const css = `
.cms-label { fill: var(--foreground); font-size: 11px; font-family: inherit; }
.cms-frame { fill: var(--card); stroke: var(--muted-foreground); stroke-opacity: 0.7; stroke-width: 1.2; }
.cms-line { stroke: var(--muted-foreground); stroke-opacity: 0.55; stroke-width: 1.5; fill: none; stroke-linecap: round; }
.cms-flow { stroke-dasharray: 3 3; }
.cms-dot { fill: var(--muted-foreground); opacity: 0.6; }
.cms-bar { fill: var(--muted); }
.cms-input { fill: var(--background); stroke: var(--primary); stroke-width: 1.2; }
.cms-in-text { fill: var(--foreground); font-size: 10px; font-family: inherit; }
.cms-heading { fill: var(--foreground); font-size: 12px; font-weight: 700; font-family: inherit; }
.cms-btn-bg { fill: var(--primary); }
.cms-btn-text { fill: var(--primary-foreground); font-size: 10px; font-weight: 600; font-family: inherit; }
.cms-sel { fill: var(--primary); fill-opacity: 0.25; opacity: 0; }
.cms-old { opacity: 0; }
.cms-cover { fill: var(--background); transform: translateX(106px); }
.cms-caret { stroke: var(--primary); stroke-width: 1.2; opacity: 0; }
.cms-pa { opacity: 0; }
.cms-pb, .cms-btn, .cms-ring { transform-box: fill-box; transform-origin: center; }
.cms-ring { fill: none; stroke: var(--primary); stroke-width: 1.5; opacity: 0; }
.cms-chip { fill: var(--primary); opacity: 0; }
.cms-hl { fill: var(--primary); fill-opacity: 0.18; opacity: 0; }
.cms-hl-ring { fill: none; stroke: var(--primary); stroke-width: 2; opacity: 0; }
.cms-sky-a { fill: var(--muted); }
.cms-sun { fill: oklch(0.75 0.15 75); }
.cms-mount { fill: var(--muted-foreground); fill-opacity: 0.45; }
.cms-sky-b { fill: color-mix(in oklch, var(--primary) 16%, var(--card)); }
.cms-tag { fill: var(--primary); }
.cms-hole { fill: var(--card); }
.cms-pct { fill: var(--primary-foreground); stroke: var(--primary-foreground); stroke-width: 1.5; stroke-linecap: round; }

.cms-sel { animation: cms-sel 7s linear infinite; }
.cms-in .cms-old { animation: cms-old-in 7s linear infinite; }
.cms-typed { animation: cms-typed 7s linear infinite; }
.cms-cover { animation: cms-cover 7s linear infinite; }
.cms-caret { animation: cms-caret 7s step-end infinite; }
.cms-admin .cms-pa { animation: cms-pa-admin 7s ease-in-out infinite; }
.cms-admin .cms-pb { animation: cms-pb-admin 7s ease-out infinite; }
.cms-btn { animation: cms-btn 7s ease-in-out infinite; }
.cms-ring { animation: cms-ring 7s ease-out infinite; }
.cms-chip { animation: cms-chip 7s ease-in-out infinite; }
.cms-site .cms-old, .cms-site .cms-pa { animation: cms-site-out 7s ease-in-out infinite; }
.cms-site .cms-new { animation: cms-site-in 7s ease-in-out infinite; }
.cms-site .cms-pb { animation: cms-pb-site 7s ease-out infinite; }
.cms-hl, .cms-hl-ring { animation: cms-hl 7s ease-out infinite; }

@keyframes cms-sel { 0%, 11% { opacity: 0; } 13%, 17% { opacity: 1; } 18.5%, 100% { opacity: 0; } }
@keyframes cms-old-in { 0%, 17% { opacity: 1; } 18.5%, 94.5% { opacity: 0; } 99%, 100% { opacity: 1; } }
@keyframes cms-typed { 0%, 94.5% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes cms-cover {
  0%, 23% { transform: translateX(0); animation-timing-function: steps(12, end); }
  37%, 100% { transform: translateX(106px); }
}
@keyframes cms-caret {
  0% { opacity: 0; } 18.5% { opacity: 1; } 20.5% { opacity: 0; }
  22.5% { opacity: 1; } 38%, 100% { opacity: 0; }
}
@keyframes cms-pa-admin { 0%, 41% { opacity: 1; } 46%, 94.5% { opacity: 0; } 99%, 100% { opacity: 1; } }
@keyframes cms-pb-admin {
  0%, 41% { opacity: 0; transform: scale(0.85); }
  46% { opacity: 1; transform: scale(1.05); }
  49%, 94.5% { opacity: 1; transform: scale(1); }
  99%, 100% { opacity: 0; transform: scale(1); }
}
@keyframes cms-btn {
  0%, 52% { transform: scale(1); } 55% { transform: scale(0.92); }
  58% { transform: scale(1.06); } 61%, 100% { transform: scale(1); }
}
@keyframes cms-ring {
  0%, 55% { opacity: 0; transform: scale(1); }
  58% { opacity: 0.6; }
  66%, 100% { opacity: 0; transform: scale(1.15); }
}
@keyframes cms-chip {
  0%, 58% { opacity: 0; transform: translateX(0); }
  59.5% { opacity: 1; }
  65% { opacity: 1; transform: translateX(22px); }
  66.5%, 100% { opacity: 0; transform: translateX(26px); }
}
@keyframes cms-site-out { 0%, 66% { opacity: 1; } 68.5%, 94.5% { opacity: 0; } 99%, 100% { opacity: 1; } }
@keyframes cms-site-in { 0%, 66% { opacity: 0; } 68.5%, 94.5% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes cms-pb-site {
  0%, 66% { opacity: 0; transform: scale(0.9); }
  70% { opacity: 1; transform: scale(1.04); }
  73%, 94.5% { opacity: 1; transform: scale(1); }
  99%, 100% { opacity: 0; transform: scale(1); }
}
@keyframes cms-hl { 0%, 66% { opacity: 0; } 69% { opacity: 1; } 80%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .cms-sel, .cms-old, .cms-typed, .cms-new, .cms-cover, .cms-caret, .cms-pa, .cms-pb,
  .cms-btn, .cms-ring, .cms-chip, .cms-hl, .cms-hl-ring { animation: none !important; }
}
`

// Dibujos en una caja de 108 x 50: A = sol y montañas, B = etiqueta de oferta.
function PictureA() {
  return (
    <g className="cms-pa">
      <rect className="cms-sky-a" width={108} height={50} rx={3} />
      <circle className="cms-sun" cx={80} cy={15} r={7} />
      <path className="cms-mount" d="M0 50 L30 22 L50 38 L68 24 L108 50 Z" />
    </g>
  )
}

function PictureB() {
  return (
    <g className="cms-pb">
      <rect className="cms-sky-b" width={108} height={50} rx={3} />
      <path className="cms-tag" d="M40 13 H76 a3 3 0 0 1 3 3 V34 a3 3 0 0 1 -3 3 H40 L28 25 Z" />
      <circle className="cms-hole" cx={38} cy={25} r={3} />
      <circle className="cms-pct" cx={54} cy={20} r={2.2} />
      <circle className="cms-pct" cx={66} cy={30} r={2.2} />
      <path className="cms-pct" d="M53 31 L67 19" />
    </g>
  )
}

export function CmsLiveEdit({
  label,
  adminLabel,
  siteLabel,
  oldTitle,
  newTitle,
  saveLabel,
}: {
  label: string
  adminLabel: string
  siteLabel: string
  oldTitle: string
  newTitle: string
  saveLabel: string
}) {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="auto" role="img" aria-label={label}>
      <title>{label}</title>
      <style>{css}</style>
      <defs>
        <clipPath id="cms-clip-input">
          <rect x={19} y={45} width={106} height={18} />
        </clipPath>
        <clipPath id="cms-clip-heading">
          <rect x={158} y={44} width={146} height={18} />
        </clipPath>
      </defs>

      <g className="cms-scene" aria-hidden="true">
        <text className="cms-label" x={12} y={18}>
          {adminLabel}
        </text>
        <text className="cms-label" x={152} y={18}>
          {siteLabel}
        </text>

        {/* Panel de administración */}
        <g className="cms-admin">
          <rect className="cms-frame" x={10} y={26} width={124} height={144} rx={6} />
          <rect className="cms-bar" x={18} y={35} width={30} height={5} rx={2} />
          <rect className="cms-input" x={18} y={44} width={108} height={20} rx={3} />
          <g className="cms-in" clipPath="url(#cms-clip-input)">
            <text className="cms-in-text cms-typed" x={23} y={57.5}>
              {newTitle}
            </text>
            <g className="cms-cover">
              <rect className="cms-cover-bg" x={19} y={45} width={106} height={18} />
              <line className="cms-caret" x1={21.5} y1={48} x2={21.5} y2={60} />
            </g>
            <rect className="cms-sel" x={21} y={47} width={102} height={14} rx={2} />
            <text className="cms-in-text cms-old" x={23} y={57.5}>
              {oldTitle}
            </text>
          </g>
          <rect className="cms-bar" x={18} y={71} width={24} height={5} rx={2} />
          <svg x={18} y={80} width={108} height={50} viewBox="0 0 108 50">
            <PictureA />
            <PictureB />
          </svg>
          <rect className="cms-ring" x={18} y={140} width={108} height={20} rx={10} />
          <g className="cms-btn">
            <rect className="cms-btn-bg" x={18} y={140} width={108} height={20} rx={10} />
            <text className="cms-btn-text" x={72} y={153.5} textAnchor="middle">
              {saveLabel}
            </text>
          </g>
        </g>

        {/* Flujo del panel a la web */}
        <path className="cms-line cms-flow" d="M127 150 H150" />

        {/* Web del cliente en el navegador */}
        <g className="cms-site">
          <rect className="cms-frame" x={150} y={26} width={160} height={144} rx={6} />
          <line className="cms-line" x1={150} y1={38} x2={310} y2={38} />
          <circle className="cms-dot" cx={157} cy={32} r={1.6} />
          <circle className="cms-dot" cx={163} cy={32} r={1.6} />
          <circle className="cms-dot" cx={169} cy={32} r={1.6} />
          <rect className="cms-hl" x={156} y={45} width={148} height={17} rx={3} />
          <g clipPath="url(#cms-clip-heading)">
            <text className="cms-heading cms-old" x={160} y={58}>
              {oldTitle}
            </text>
            <text className="cms-heading cms-new" x={160} y={58}>
              {newTitle}
            </text>
          </g>
          <rect className="cms-bar" x={160} y={67} width={96} height={5} rx={2} />
          <rect className="cms-bar" x={160} y={75} width={70} height={5} rx={2} />
          <svg x={160} y={84} width={140} height={65} viewBox="0 0 108 50">
            <PictureA />
            <PictureB />
          </svg>
          <rect className="cms-hl-ring" x={159} y={83} width={142} height={67} rx={4} />
          <rect className="cms-bar" x={160} y={156} width={42} height={8} rx={4} />
        </g>

        <rect className="cms-chip" x={126} y={145.5} width={12} height={9} rx={2.5} />
      </g>
    </svg>
  )
}
