// Un asistente responde con los datos de la propia empresa: el usuario pregunta,
// el asistente consulta la base y contesta con una tabla. Bucle de 7 s.

type AiAssistantProps = {
  label: string
  question: string
  answer: string
  col1: string
  col2: string
}

/*
 * Tiempos (s): pregunta 0.2, tipeo 0.4-1.5, pensando 1.7-2.9 (la base late),
 * respuesta 3.0, cabecera 3.5, filas 3.9 / 4.3 / 4.7. Reinicio suave 6.6-6.9:
 * solo se desvanecen la pregunta y la respuesta; la ventana, la cabecera, el
 * avatar y la barra de escritura quedan siempre visibles (también en 0 ms).
 * Los estilos base son el estado final, así reduced-motion lo muestra completo.
 */
const css = `
.ai-frame { fill: var(--card); stroke: var(--muted-foreground); stroke-opacity: 0.7; stroke-width: 1.2; }
.ai-line { stroke: var(--muted-foreground); stroke-opacity: 0.55; stroke-width: 1; }
.ai-dot { fill: var(--muted-foreground); opacity: 0.6; }
.ai-bar { fill: var(--muted); }
.ai-spark { fill: var(--primary); }
.ai-avatar { fill: color-mix(in oklch, var(--primary) 16%, var(--card)); stroke: var(--primary); stroke-width: 1.2; }
.ai-db { fill: var(--card); stroke: var(--muted-foreground); stroke-width: 1.2; stroke-linejoin: round; transform-box: fill-box; transform-origin: center; opacity: 0.8; }
.ai-q-bg { fill: var(--primary); }
.ai-q-text { fill: var(--primary-foreground); font-size: 10.5px; font-family: inherit; }
.ai-cover { fill: var(--primary); transform-box: fill-box; transform-origin: right center; transform: scaleX(0); }
.ai-q, .ai-a { transform-box: fill-box; }
.ai-q { transform-origin: right center; }
.ai-a { transform-origin: left top; }
.ai-bubble { fill: var(--muted); }
.ai-a-text { fill: var(--foreground); font-size: 11px; font-weight: 600; font-family: inherit; }
.ai-th-bg { fill: color-mix(in oklch, var(--primary) 16%, var(--card)); }
.ai-row-bg { fill: var(--card); }
.ai-th { fill: var(--foreground); font-size: 10px; font-weight: 700; font-family: inherit; }
.ai-td { fill: var(--foreground); font-size: 10px; font-family: inherit; }
.ai-num { fill: var(--primary); font-size: 10px; font-weight: 700; font-family: inherit; font-variant-numeric: tabular-nums; }
.ai-think { opacity: 0; }
.ai-input { fill: var(--background); stroke: var(--border); stroke-width: 1; }
.ai-send { fill: var(--muted-foreground); opacity: 0.6; }
.ai-bounce { fill: var(--muted-foreground); transform-box: fill-box; transform-origin: center; }

.ai-q { animation: ai-q 7s ease-out infinite; }
.ai-cover { animation: ai-type 7s linear infinite; }
.ai-think { animation: ai-think 7s linear infinite; }
.ai-bounce { animation: ai-bounce 0.6s ease-in-out infinite; }
.ai-b2 { animation-delay: 0.15s; }
.ai-b3 { animation-delay: 0.3s; }
.ai-db { animation: ai-db 7s ease-in-out infinite; }
.ai-a { animation: ai-a 7s ease-out infinite; }
.ai-r0 { animation: ai-r0 7s ease-out infinite; }
.ai-r1 { animation: ai-r1 7s ease-out infinite; }
.ai-r2 { animation: ai-r2 7s ease-out infinite; }
.ai-r3 { animation: ai-r3 7s ease-out infinite; }

@keyframes ai-q {
  0% { opacity: 0; transform: scale(0.7); }
  2.9% { opacity: 1; transform: scale(1.04); }
  5%, 94.5% { opacity: 1; transform: scale(1); }
  99%, 100% { opacity: 0; transform: scale(1); }
}
@keyframes ai-type {
  0%, 6% { transform: scaleX(1); animation-timing-function: steps(16, end); }
  21.5%, 100% { transform: scaleX(0); }
}
@keyframes ai-think { 0%, 24% { opacity: 0; } 25.5%, 40.5% { opacity: 1; } 42%, 100% { opacity: 0; } }
@keyframes ai-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-3px); } }
@keyframes ai-db {
  0%, 24% { opacity: 0.8; transform: scale(1); }
  28%, 36% { opacity: 1; transform: scale(1.18); }
  32%, 40% { opacity: 0.7; transform: scale(1); }
  44%, 100% { opacity: 0.8; transform: scale(1); }
}
@keyframes ai-a {
  0%, 42% { opacity: 0; transform: scale(0.85); }
  45% { opacity: 1; transform: scale(1.02); }
  47%, 94.5% { opacity: 1; transform: scale(1); }
  99%, 100% { opacity: 0; transform: scale(1); }
}
@keyframes ai-r0 { 0%, 49% { opacity: 0; transform: translateY(4px); } 52%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes ai-r1 { 0%, 55% { opacity: 0; transform: translateY(4px); } 58%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes ai-r2 { 0%, 61% { opacity: 0; transform: translateY(4px); } 64%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes ai-r3 { 0%, 67% { opacity: 0; transform: translateY(4px); } 70%, 100% { opacity: 1; transform: translateY(0); } }

@media (prefers-reduced-motion: reduce) {
  .ai-q, .ai-cover, .ai-think, .ai-bounce, .ai-db, .ai-a,
  .ai-r0, .ai-r1, .ai-r2, .ai-r3 { animation: none; }
}
`

// Valores de ejemplo fijos: 9 + 8 + 7 = 24, igual que la respuesta.
const rows = [
  { key: "n", name: "Obra Norte", value: 9, cls: "ai-r1", y: 101 },
  { key: "s", name: "Obra Sur", value: 8, cls: "ai-r2", y: 115 },
  { key: "l", name: "Planta Lima", value: 7, cls: "ai-r3", y: 129 },
]

const sparkle = "M0 -5 Q0.8 -0.8 5 0 Q0.8 0.8 0 5 Q-0.8 0.8 -5 0 Q-0.8 -0.8 0 -5 Z"

export function AiAssistant({ label, question, answer, col1, col2 }: AiAssistantProps) {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="auto" role="img" aria-label={label}>
      <title>{label}</title>
      <style>{css}</style>
      <defs>
        <clipPath id="ai-clip-q">
          <rect x={118} y={36} width={176} height={20} />
        </clipPath>
      </defs>

      <g className="ai-scene" aria-hidden="true">
        {/* Ventana del chat */}
        <rect className="ai-frame" x={10} y={8} width={300} height={164} rx={6} />
        <path className="ai-spark" d={sparkle} transform="translate(22 18)" />
        <rect className="ai-bar" x={32} y={15.5} width={40} height={5} rx={2} />
        <circle className="ai-dot" cx={286} cy={18} r={1.6} />
        <circle className="ai-dot" cx={292} cy={18} r={1.6} />
        <circle className="ai-dot" cx={298} cy={18} r={1.6} />
        <line className="ai-line" x1={10} y1={28} x2={310} y2={28} />

        {/* Barra de escritura (marcador, siempre visible) */}
        <rect className="ai-input" x={20} y={156} width={280} height={11} rx={5.5} />
        <rect className="ai-bar" x={28} y={159.5} width={64} height={4} rx={2} />
        <path className="ai-send" d="M287 158.5 L294 161.5 L287 164.5 Z" />

        {/* Pregunta del usuario */}
        <g className="ai-q">
          <rect className="ai-q-bg" x={112} y={36} width={188} height={20} rx={10} />
          <g clipPath="url(#ai-clip-q)">
            <text className="ai-q-text" x={122} y={49.5}>
              {question}
            </text>
            <rect className="ai-cover" x={119} y={37} width={176} height={18} />
          </g>
        </g>

        {/* Asistente y la base de datos de la empresa */}
        <circle className="ai-avatar" cx={24} cy={74} r={9} />
        <path className="ai-spark" d={sparkle} transform="translate(24 74) scale(0.9)" />
        <g className="ai-db">
          <path d="M18 92 v9 a6 2 0 0 0 12 0 v-9" />
          <path d="M18 96.5 a6 2 0 0 0 12 0" fill="none" />
          <ellipse cx={24} cy={92} rx={6} ry={2} />
        </g>

        {/* Pensando */}
        <g className="ai-think">
          <rect className="ai-bubble" x={38} y={64} width={40} height={20} rx={10} />
          <circle className="ai-bounce" cx={49} cy={74} r={2.2} />
          <circle className="ai-bounce ai-b2" cx={58} cy={74} r={2.2} />
          <circle className="ai-bounce ai-b3" cx={67} cy={74} r={2.2} />
        </g>

        {/* Respuesta con tabla */}
        <g className="ai-a">
          <rect className="ai-bubble" x={38} y={64} width={172} height={88} rx={8} />
          <text className="ai-a-text" x={48} y={79}>
            {answer}
          </text>
          <g className="ai-r0">
            <rect className="ai-th-bg" x={46} y={86} width={156} height={15} rx={3} />
            <text className="ai-th" x={52} y={96.5}>
              {col1}
            </text>
            <text className="ai-th" x={196} y={96.5} textAnchor="end">
              {col2}
            </text>
          </g>
          {rows.map((r) => (
            <g key={r.key} className={r.cls}>
              <rect className="ai-row-bg" x={46} y={r.y} width={156} height={14} />
              <line className="ai-line" x1={46} y1={r.y + 14} x2={202} y2={r.y + 14} />
              <text className="ai-td" x={52} y={r.y + 10}>
                {r.name}
              </text>
              <text className="ai-num" x={196} y={r.y + 10} textAnchor="end">
                {r.value}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}
