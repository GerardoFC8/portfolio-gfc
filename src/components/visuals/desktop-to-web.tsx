// Animación: un programa de escritorio antiguo que se convierte en una app web.
// Ciclo de 7 s: escena retro (0-2.5 s), transición (2.5-4 s), app web (4-6.5 s), vuelta suave.

const css = `
.dtw-svg * { transform-box: view-box; transform-origin: 160px 90px; }
.dtw-retro { animation: dtw-retro 7s ease-in-out infinite; }
.dtw-retro-grid { animation: dtw-retro-grid 7s ease-in-out infinite; }
.dtw-web { animation: dtw-web 7s ease-in-out infinite; }
.dtw-piece { animation: dtw-piece 7s ease-out infinite both; }
.dtw-d1 { animation-delay: 0.12s; }
.dtw-d2 { animation-delay: 0.24s; }
.dtw-row-new { animation: dtw-row 7s ease-out infinite both; }
.dtw-btn { transform-origin: 266px 95px; animation: dtw-btn 7s ease-in-out infinite; }
@keyframes dtw-retro {
  0%, 36% { opacity: 1; transform: scale(1); }
  52%, 94% { opacity: 0; transform: scale(0.96); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes dtw-retro-grid {
  0%, 36% { opacity: 1; transform: translateY(0) scale(1); }
  48%, 94% { opacity: 0; transform: translateY(6px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes dtw-web {
  0%, 38% { opacity: 0; transform: scale(1.04); }
  56%, 92% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.02); }
}
@keyframes dtw-piece {
  0%, 44% { opacity: 0; transform: translateY(5px); }
  58%, 100% { opacity: 1; transform: translateY(0); }
}
@keyframes dtw-row {
  0%, 64% { opacity: 0; transform: translateX(-14px); }
  72%, 100% { opacity: 1; transform: translateX(0); }
}
@keyframes dtw-btn {
  0%, 76% { transform: scale(1); }
  80% { transform: scale(1.12); }
  85%, 100% { transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .dtw-svg * { animation: none !important; }
  .dtw-retro { opacity: 0; }
  .dtw-web, .dtw-piece, .dtw-row-new { opacity: 1; transform: none; }
}
`;

const RETRO_GREY = "#c0c0c0";
const RETRO_BLUE = "#0a2a8a";
const LIGHT = "#ffffff";
const SHADOW = "#7a7a7a";
const DARK = "#2b2b2b";

/** Botón o caja con relieve estilo años 90. `inset` lo dibuja hundido. */
function Bevel({ x, y, w, h, inset = false, fill = RETRO_GREY }: {
  x: number; y: number; w: number; h: number; inset?: boolean; fill?: string;
}) {
  const tl = inset ? SHADOW : LIGHT;
  const br = inset ? LIGHT : DARK;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      <path d={`M${x} ${y + h}V${y}H${x + w}`} stroke={tl} strokeWidth="1" fill="none" />
      <path d={`M${x + w} ${y}V${y + h}H${x}`} stroke={br} strokeWidth="1" fill="none" />
    </g>
  );
}

const gridRows = [0, 1, 2, 3, 4, 5];
const gridCols = [26, 94, 162, 230];
const toolbar = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const menu = [28, 46, 66, 84, 104];

function RetroWindow() {
  return (
    <g className="dtw-retro">
      <Bevel x={20} y={14} w={280} h={152} />
      {/* Barra de título con sus tres botones cuadrados */}
      <rect x={23} y={17} width={274} height={13} fill={RETRO_BLUE} />
      <rect x={27} y={20} width={7} height={7} fill={RETRO_GREY} />
      <rect x={38} y={22} width={58} height={3} fill={LIGHT} opacity={0.8} />
      {[258, 270, 284].map((bx) => (
        <g key={bx}>
          <Bevel x={bx} y={19} w={10} h={9} />
          <rect x={bx + 3} y={25} width={4} height={1.5} fill={DARK} />
        </g>
      ))}
      {/* Menú y barra de herramientas */}
      {menu.map((mx) => (
        <rect key={mx} x={mx} y={34} width={13} height={3} fill={DARK} opacity={0.75} />
      ))}
      {toolbar.map((i) => (
        <Bevel key={i} x={26 + i * 13} y={41} w={10} h={10} />
      ))}
      {/* Rejilla densa de campos */}
      <g className="dtw-retro-grid">
        {gridRows.map((r) =>
          gridCols.map((cx) => (
            <g key={`${r}-${cx}`}>
              <rect x={cx} y={61 + r * 13} width={17} height={3} fill={DARK} opacity={0.7} />
              <Bevel x={cx + 21} y={58 + r * 13} w={40} h={9} inset fill={LIGHT} />
            </g>
          )),
        )}
      </g>
      {/* Botones inferiores y barra de estado */}
      {[170, 214, 258].map((bx) => (
        <g key={bx}>
          <Bevel x={bx} y={138} w={38} h={13} />
          <rect x={bx + 11} y={143} width={16} height={3} fill={DARK} opacity={0.8} />
        </g>
      ))}
      <Bevel x={24} y={155} w={272} h={8} inset />
    </g>
  );
}

const rows = [104, 118, 132];

function TableRow({ y, accent = false }: { y: number; accent?: boolean }) {
  return (
    <g>
      <circle cx={97} cy={y + 4} r={3} fill={accent ? "var(--primary)" : "var(--muted)"} />
      <rect x={106} y={y + 2} width={60} height={4} rx={2} fill="var(--foreground)" opacity={0.55} />
      <rect x={196} y={y + 2} width={30} height={4} rx={2} fill="var(--muted-foreground)" opacity={0.5} />
      <rect x={252} y={y + 1} width={30} height={6} rx={3} fill="var(--primary)" opacity={0.18} />
      <line x1={90} x2={288} y1={y + 11} y2={y + 11} stroke="var(--border)" strokeWidth={1} />
    </g>
  );
}

function WebApp() {
  return (
    <g className="dtw-web">
      <rect x={20.5} y={14.5} width={279} height={151} rx={10} fill="var(--background)"
        stroke="var(--muted-foreground)" strokeOpacity={0.45} strokeWidth={1} />
      {/* Barra del navegador */}
      {[32, 41, 50].map((dx) => (
        <circle key={dx} cx={dx} cy={24} r={2.5} fill="var(--muted-foreground)" opacity={0.6} />
      ))}
      <rect x={70} y={18} width={160} height={12} rx={6} fill="var(--muted)" />
      <text x={82} y={26.5} fontSize={7} fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill="var(--muted-foreground)">tusistema.app</text>
      <line x1={21} x2={299} y1={34} y2={34} stroke="var(--border)" strokeWidth={1} />
      {/* Menú lateral */}
      <g className="dtw-piece">
        <path d="M21 34.5H76V165H31A10 10 0 0 1 21 155Z" fill="var(--muted)" opacity={0.55} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={30} y={46 + i * 14} width={i === 0 ? 38 : 30} height={6} rx={3}
            fill={i === 0 ? "var(--primary)" : "var(--muted-foreground)"} opacity={i === 0 ? 0.9 : 0.45} />
        ))}
      </g>
      {/* Tarjetas de resumen */}
      <g className="dtw-piece dtw-d1">
        {[86, 194].map((cx, i) => (
          <g key={cx}>
            <rect x={cx} y={42} width={98} height={36} rx={6} fill="var(--card)"
              stroke="var(--border)" strokeWidth={1} />
            <rect x={cx + 9} y={50} width={30} height={4} rx={2} fill="var(--muted-foreground)" opacity={0.55} />
            <rect x={cx + 9} y={60} width={44} height={8} rx={2} fill="var(--foreground)" opacity={0.8} />
            {i === 1 ? (
              <polyline points={`${cx + 62},68 ${cx + 70},62 ${cx + 77},65 ${cx + 88},54`} fill="none"
                stroke="var(--primary)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <rect x={cx + 66} y={54} width={22} height={14} rx={3} fill="var(--primary)" opacity={0.2} />
            )}
          </g>
        ))}
      </g>
      {/* Tabla con botón principal */}
      <g className="dtw-piece dtw-d2">
        <rect x={86} y={84} width={206} height={74} rx={6} fill="var(--card)"
          stroke="var(--border)" strokeWidth={1} />
        <rect x={96} y={92} width={50} height={5} rx={2.5} fill="var(--foreground)" opacity={0.7} />
        <rect className="dtw-btn" x={248} y={89} width={36} height={12} rx={6} fill="var(--primary)" />
        <line x1={90} x2={288} y1={103} y2={103} stroke="var(--border)" strokeWidth={1} />
        {rows.map((y) => <TableRow key={y} y={y} />)}
        <g className="dtw-row-new">
          <rect x={88} y={145} width={202} height={11} rx={3} fill="var(--primary)" opacity={0.1} />
          <TableRow y={146} accent />
        </g>
      </g>
    </g>
  );
}

export function DesktopToWeb({ label }: { label: string }) {
  return (
    <svg className="dtw-svg" viewBox="0 0 320 180" width="100%" height="auto" role="img"
      aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <title>{label}</title>
      <style>{css}</style>
      <RetroWindow />
      <WebApp />
    </svg>
  );
}
