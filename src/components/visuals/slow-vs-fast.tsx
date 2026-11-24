type SlowVsFastProps = {
  label: string
  beforeLabel: string
  afterLabel: string
  beforeTime: string
  afterTime: string
  badge: string
}

/*
 * Loop of 6 s. Real ratio 2.2 s : 0.14 s (about 16:1):
 * slow bar fills in 4.4 s (73.3 %), fast bar in 0.275 s (4.6 %).
 * Badge pops at 4.4 s, holds about 1 s. Soft reset 5.64-5.94 s: only the
 * animated content (bars, times, badge) fades out; labels and tracks stay.
 */
const css = `
.svf-text { font-family: inherit; fill: var(--foreground); }
.svf-label { font-size: 13px; font-weight: 500; }
.svf-time { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; }
.svf-time-slow { fill: oklch(0.6 0.15 65); }
.svf-time-fast { fill: var(--primary); }
.svf-track { fill: var(--muted); stroke: var(--border); stroke-width: 1; }
.svf-bar { transform-box: fill-box; transform-origin: left center; }
.svf-bar-slow { fill: oklch(0.75 0.15 75); }
.svf-bar-fast { fill: var(--primary); }
.svf-dot { fill: oklch(0.75 0.15 75); }
.svf-check { fill: none; stroke: var(--primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.svf-badge { transform-box: fill-box; transform-origin: center; }
.svf-badge-bg { fill: var(--primary); }
.svf-badge-text { font-family: inherit; font-size: 13px; font-weight: 700; fill: var(--primary-foreground); }
.svf-loading { opacity: 0; }

.svf-bar-slow { animation: svf-slow 6s linear infinite; }
.svf-bar-fast { animation: svf-fast 6s ease-out infinite; }
.svf-time-slow { animation: svf-show-slow 6s linear infinite; }
.svf-done-fast { animation: svf-show-fast 6s linear infinite; }
.svf-loading { animation: svf-loading 6s linear infinite; }
.svf-dot { animation: svf-pulse 0.8s ease-in-out infinite; }
.svf-badge { animation: svf-badge 6s ease-out infinite; }

@keyframes svf-slow {
  0% { transform: scaleX(0); opacity: 1; }
  73.3%, 94% { transform: scaleX(1); opacity: 1; }
  99%, 100% { transform: scaleX(1); opacity: 0; }
}
@keyframes svf-fast {
  0% { transform: scaleX(0); opacity: 1; }
  4.6%, 94% { transform: scaleX(1); opacity: 1; }
  99%, 100% { transform: scaleX(1); opacity: 0; }
}
@keyframes svf-show-slow {
  0%, 73.3% { opacity: 0; }
  75%, 94% { opacity: 1; }
  99%, 100% { opacity: 0; }
}
@keyframes svf-show-fast {
  0%, 4.6% { opacity: 0; }
  6.5%, 94% { opacity: 1; }
  99%, 100% { opacity: 0; }
}
@keyframes svf-loading {
  0%, 72% { opacity: 1; }
  73.3%, 100% { opacity: 0; }
}
@keyframes svf-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}
@keyframes svf-badge {
  0%, 73.3% { opacity: 0; transform: scale(0.6); }
  76.5% { opacity: 1; transform: scale(1.08); }
  79%, 94% { opacity: 1; transform: scale(1); }
  99%, 100% { opacity: 0; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .svf-bar-slow, .svf-bar-fast, .svf-time-slow, .svf-done-fast,
  .svf-loading, .svf-dot, .svf-badge { animation: none; }
  .svf-loading { opacity: 0; }
}
`

export function SlowVsFast({
  label,
  beforeLabel,
  afterLabel,
  beforeTime,
  afterTime,
  badge,
}: SlowVsFastProps) {
  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      height="auto"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <style>{css}</style>
      <g className="svf-scene" aria-hidden="true">
        {/* Row: before (slow) */}
        <text className="svf-text svf-label" x="20" y="36">
          {beforeLabel}
        </text>
        <g className="svf-loading">
          <circle className="svf-dot" cx="294" cy="31.5" r="4" />
        </g>
        <text className="svf-text svf-time svf-time-slow" x="300" y="36" textAnchor="end">
          {beforeTime}
        </text>
        <rect className="svf-track" x="20" y="44" width="280" height="14" rx="7" />
        <rect className="svf-bar svf-bar-slow" x="20" y="44" width="280" height="14" rx="7" />

        {/* Row: after (fast) */}
        <text className="svf-text svf-label" x="20" y="92">
          {afterLabel}
        </text>
        <g className="svf-done-fast">
          <text className="svf-text svf-time svf-time-fast" x="282" y="92" textAnchor="end">
            {afterTime}
          </text>
          <path className="svf-check" d="M288 87 l4 4 l7 -8" />
        </g>
        <rect className="svf-track" x="20" y="100" width="280" height="14" rx="7" />
        <rect className="svf-bar svf-bar-fast" x="20" y="100" width="280" height="14" rx="7" />

        {/* Badge */}
        <g className="svf-badge">
          <rect className="svf-badge-bg" x="80" y="134" width="160" height="28" rx="14" />
          <text className="svf-badge-text" x="160" y="152.5" textAnchor="middle">
            {badge}
          </text>
        </g>
      </g>
    </svg>
  )
}
