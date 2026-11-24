type DesktopInstallProps = {
  label: string
  installingLabel: string
  readyLabel: string
}

/*
 * Loop of 7 s: app icon pops into the taskbar (0-0.3 s), installer fills (0.5-1.3 s),
 * ready card (1.4-2.3 s), window opens from the icon (2.2-2.7 s), Markdown is typed
 * on the left while the rendered result appears on the right (2.8-4.6 s),
 * hold, then the window closes back into the icon (5.8-6.3 s).
 */
const css = `
.dti-text { font-family: inherit; fill: var(--foreground); }
.dti-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; fill: var(--muted-foreground); }
.dti-card-bg { fill: var(--card); stroke: var(--border); stroke-width: 1; }
.dti-small { font-size: 11px; font-weight: 500; }
.dti-glyph { fill: none; stroke: var(--muted-foreground); stroke-width: 1.2; stroke-linecap: round; }
.dti-check { fill: none; stroke: var(--primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.dti-icon { transform-box: fill-box; transform-origin: center; animation: dti-icon 7s ease-out infinite; }
.dti-install { transform-box: fill-box; transform-origin: center bottom; animation: dti-install 7s ease-out infinite; }
.dti-bar { transform-box: fill-box; transform-origin: left center; animation: dti-bar 7s ease-in-out infinite; }
.dti-ready { transform-box: fill-box; transform-origin: center bottom; animation: dti-ready 7s ease-out infinite; }
.dti-window { transform-box: view-box; transform-origin: 200px 168px; animation: dti-window 7s ease-in-out infinite; }
.dti-cover { fill: var(--card); transform-box: fill-box; transform-origin: right center; }
.dti-c1 { animation: dti-c1 7s linear infinite; }
.dti-c2 { animation: dti-c2 7s linear infinite; }
.dti-c3 { animation: dti-c3 7s linear infinite; }
.dti-r1 { animation: dti-r1 7s ease-out infinite; }
.dti-r2 { animation: dti-r2 7s ease-out infinite; }
.dti-r3 { animation: dti-r3 7s ease-out infinite; }
@keyframes dti-icon {
  0% { opacity: 0; transform: scale(0.4); }
  4% { opacity: 1; transform: scale(1.15); }
  6%, 94% { opacity: 1; transform: scale(1); }
  98%, 100% { opacity: 0; transform: scale(0.6); }
}
@keyframes dti-install {
  0%, 5% { opacity: 0; transform: translateY(4px) scale(0.95); }
  8%, 19% { opacity: 1; transform: translateY(0) scale(1); }
  21%, 100% { opacity: 0; transform: translateY(0) scale(1); }
}
@keyframes dti-bar {
  0%, 8% { transform: scaleX(0); }
  18.5%, 100% { transform: scaleX(1); }
}
@keyframes dti-ready {
  0%, 19% { opacity: 0; transform: scale(0.9); }
  22% { opacity: 1; transform: scale(1.05); }
  24%, 31% { opacity: 1; transform: scale(1); }
  34%, 100% { opacity: 0; transform: scale(1); }
}
@keyframes dti-window {
  0%, 31% { opacity: 0; transform: scale(0.06); }
  38%, 83% { opacity: 1; transform: scale(1); }
  90%, 100% { opacity: 0; transform: scale(0.06); }
}
@keyframes dti-c1 {
  0%, 40% { transform: scaleX(1); animation-timing-function: steps(7, end); }
  45%, 100% { transform: scaleX(0); }
}
@keyframes dti-c2 {
  0%, 48% { transform: scaleX(1); animation-timing-function: steps(7, end); }
  53%, 100% { transform: scaleX(0); }
}
@keyframes dti-c3 {
  0%, 56% { transform: scaleX(1); animation-timing-function: steps(14, end); }
  65%, 100% { transform: scaleX(0); }
}
@keyframes dti-r1 { 0%, 45% { opacity: 0; } 48%, 100% { opacity: 1; } }
@keyframes dti-r2 { 0%, 53% { opacity: 0; } 56%, 100% { opacity: 1; } }
@keyframes dti-r3 { 0%, 65% { opacity: 0; } 68%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .dti-svg * { animation: none !important; }
  .dti-install, .dti-ready, .dti-cover { opacity: 0; }
}
`

/** Generic app icon: rounded square with a split page (source | preview). */
function AppIcon({ x, y, s }: { x: number; y: number; s: number }) {
  const k = s / 12
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={3 * k} fill="var(--primary)" />
      <rect x={x + 2.5 * k} y={y + 3 * k} width={3 * k} height={1.2 * k} rx={0.6 * k} fill="var(--primary-foreground)" />
      <rect x={x + 2.5 * k} y={y + 5.5 * k} width={2.5 * k} height={1.2 * k} rx={0.6 * k} fill="var(--primary-foreground)" opacity={0.7} />
      <rect x={x + 6.5 * k} y={y + 3 * k} width={3 * k} height={6 * k} rx={0.8 * k} fill="var(--primary-foreground)" opacity={0.85} />
    </g>
  )
}

export function DesktopInstall({ label, installingLabel, readyLabel }: DesktopInstallProps) {
  return (
    <svg
      className="dti-svg"
      viewBox="0 0 320 180"
      width="100%"
      height="auto"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <style>{css}</style>
      <g aria-hidden="true">
        {/* Taskbar */}
        <rect x="10.5" y="157.5" width="299" height="20" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
        {[0, 1].map((r) =>
          [0, 1].map((c) => (
            <rect key={`${r}-${c}`} x={124 + c * 5.5} y={162 + r * 5.5} width="4.5" height="4.5" rx="1" fill="var(--primary)" opacity={0.8} />
          )),
        )}
        {[142, 158, 174].map((ix, i) => (
          <rect key={ix} x={ix} y="161.5" width="12" height="12" rx="3" fill="var(--muted-foreground)" opacity={0.45 - i * 0.08} />
        ))}
        <g className="dti-icon">
          <AppIcon x={194} y={161.5} s={12} />
          <rect x="197" y="175" width="6" height="1.5" rx="0.75" fill="var(--primary)" />
        </g>

        {/* Installer card */}
        <g className="dti-install">
          <rect className="dti-card-bg" x="140.5" y="118.5" width="119" height="32" rx="6" />
          <text className="dti-text dti-small" x="150" y="132">{installingLabel}</text>
          <rect x="150" y="138" width="100" height="5" rx="2.5" fill="var(--muted)" />
          <rect className="dti-bar" x="150" y="138" width="100" height="5" rx="2.5" fill="var(--primary)" />
        </g>

        {/* Ready card */}
        <g className="dti-ready">
          <rect className="dti-card-bg" x="140.5" y="118.5" width="119" height="32" rx="6" />
          <path className="dti-check" d="M151 134.5 l3.5 3.5 l6.5 -7.5" />
          <text className="dti-text dti-small" x="167" y="138.5">{readyLabel}</text>
        </g>

        {/* App window */}
        <g className="dti-window">
          <rect x="40.5" y="10.5" width="239" height="139" rx="8" fill="var(--card)"
            stroke="var(--muted-foreground)" strokeOpacity={0.45} strokeWidth="1" />
          <AppIcon x={49} y={15} s={9} />
          <rect x="63" y="17.5" width="40" height="4" rx="2" fill="var(--muted-foreground)" opacity={0.5} />
          <path className="dti-glyph" d="M235 19.5h7" />
          <rect className="dti-glyph" x="250.5" y="16" width="7" height="7" rx="1" />
          <path className="dti-glyph" d="M266 16l7 7M273 16l-7 7" />
          <line x1="41" x2="279" y1="28" y2="28" stroke="var(--border)" strokeWidth="1" />
          <line x1="160" x2="160" y1="28" y2="149" stroke="var(--border)" strokeWidth="1" />

          {/* Left pane: Markdown source, typed line by line */}
          <text className="dti-mono" x="50" y="50">{"# Notas"}</text>
          <text className="dti-mono" x="50" y="72">{"- Lista"}</text>
          <text className="dti-mono" x="50" y="94">{"**importante**"}</text>
          <rect className="dti-cover dti-c1" x="48" y="39" width="106" height="15" />
          <rect className="dti-cover dti-c2" x="48" y="61" width="106" height="15" />
          <rect className="dti-cover dti-c3" x="48" y="83" width="106" height="15" />

          {/* Right pane: rendered result */}
          <text className="dti-text dti-r1" x="172" y="52" fontSize="15" fontWeight="700">Notas</text>
          <g className="dti-r2">
            <circle cx="175" cy="68.5" r="2" fill="var(--primary)" />
            <text className="dti-text" x="182" y="72" fontSize="11">Lista</text>
          </g>
          <text className="dti-text dti-r3" x="172" y="94" fontSize="11" fontWeight="700">importante</text>
        </g>
      </g>
    </svg>
  )
}
