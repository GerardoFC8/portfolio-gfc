/* Finanzentral demo: shared layout + helpers. Loaded in <head> as a classic script. */
(function () {
  "use strict";

  /* ---------- Theme (next-themes: defaultTheme="system", key "theme") ---------- */
  var THEME_KEY = "theme";
  function storedTheme() { try { return localStorage.getItem(THEME_KEY) || "system"; } catch (e) { return "system"; } }
  function systemDark() { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }
  function applyTheme() {
    var t = storedTheme();
    var dark = t === "dark" || (t === "system" && systemDark());
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    return dark;
  }
  applyTheme();
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSys = function () { if (storedTheme() === "system") { applyTheme(); window.dispatchEvent(new CustomEvent("fz-theme")); } };
    if (mq.addEventListener) mq.addEventListener("change", onSys);
  }

  /* ---------- Tailwind v4 theme (same @theme inline block as globals.css) ---------- */
  var tw = document.createElement("style");
  tw.setAttribute("type", "text/tailwindcss");
  tw.textContent = [
    "@custom-variant dark (&:where(.dark, .dark *));",
    "@theme inline {",
    "  --font-sans: 'Geist', 'Geist Fallback', ui-sans-serif, system-ui, sans-serif;",
    "  --font-mono: 'Geist Mono', ui-monospace, monospace;",
    "  --font-display: 'Outfit', 'Geist', system-ui, sans-serif;",
    "  --color-background: var(--background); --color-foreground: var(--foreground);",
    "  --color-card: var(--card); --color-card-foreground: var(--card-foreground);",
    "  --color-popover: var(--popover); --color-popover-foreground: var(--popover-foreground);",
    "  --color-primary: var(--primary); --color-primary-foreground: var(--primary-foreground);",
    "  --color-secondary: var(--secondary); --color-secondary-foreground: var(--secondary-foreground);",
    "  --color-muted: var(--muted); --color-muted-foreground: var(--muted-foreground);",
    "  --color-accent: var(--accent); --color-accent-foreground: var(--accent-foreground);",
    "  --color-destructive: var(--destructive); --color-destructive-foreground: var(--destructive-foreground);",
    "  --color-border: var(--border); --color-input: var(--input); --color-ring: var(--ring);",
    "  --color-zen: var(--zen);",
    "  --color-chart-1: var(--chart-1); --color-chart-2: var(--chart-2); --color-chart-3: var(--chart-3);",
    "  --color-chart-4: var(--chart-4); --color-chart-5: var(--chart-5);",
    "  --radius-sm: calc(var(--radius) - 4px); --radius-md: calc(var(--radius) - 2px);",
    "  --radius-lg: var(--radius); --radius-xl: calc(var(--radius) + 4px);",
    "  --color-sidebar: var(--sidebar); --color-sidebar-foreground: var(--sidebar-foreground);",
    "  --color-sidebar-primary: var(--sidebar-primary); --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);",
    "  --color-sidebar-accent: var(--sidebar-accent); --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);",
    "  --color-sidebar-border: var(--sidebar-border); --color-sidebar-ring: var(--sidebar-ring);",
    "}"
  ].join("\n");
  document.head.appendChild(tw);

  /* ---------- Lucide icons (inline, 24x24 stroke icons) ---------- */
  var I = {
    "layout-dashboard": '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    "receipt": '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    "refresh-cw": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    "arrow-left-right": '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    "wallet": '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "trending-up": '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    "trending-down": '<path d="M22 17 13.5 8.5 8.5 13.5 2 7"/><path d="M16 17h6v-6"/>',
    "landmark": '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4z"/>',
    "bar-chart-3": '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    "repeat": '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    "flame": '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    "line-chart": '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    "calendar-clock": '<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "bot": '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
    "zap": '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    "help-circle": '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    "keyboard": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    "moon": '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    "panel-left": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    "home": '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    "menu": '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
    "dollar-sign": '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-down-left": '<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "more-horizontal": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-up": '<path d="m18 15-6-6-6 6"/>',
    "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    "upload": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    "camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    "filter": '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
    "sparkles": '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    "send": '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    "message-square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "alert-circle": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "sunrise": '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
    "bug": '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    "pie-chart": '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    "banknote": '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    "pencil": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    "trash": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    "link": '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
    "focus": '<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
    "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    "lock": '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "piggy-bank": '<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>',
    "smartphone": '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>'
  };
  function icon(name, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="' + (cls || "h-4 w-4") + '">' + (I[name] || I["info"]) + "</svg>";
  }
  function hydrateIcons(root) {
    root = root || document;
    var els = root.querySelectorAll("i[data-icon]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var tmp = document.createElement("span");
      tmp.innerHTML = icon(el.getAttribute("data-icon"), el.getAttribute("class") || "h-4 w-4");
      var svg = tmp.firstChild;
      var style = el.getAttribute("style"); if (style) svg.setAttribute("style", style);
      el.parentNode.replaceChild(svg, el);
    }
    var tpls = root.querySelectorAll("template");
    for (var j = 0; j < tpls.length; j++) hydrateIcons(tpls[j].content);
  }

  /* ---------- Formatting (mirrors lib/utils/currency.ts formatMoney) ---------- */
  var fmtCache = {};
  function money(n, cur) {
    cur = cur || "PEN";
    if (!fmtCache[cur]) fmtCache[cur] = new Intl.NumberFormat(cur === "PEN" ? "es-PE" : "en-US", { style: "currency", currency: cur, minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return fmtCache[cur].format(Number(n) || 0);
  }
  var MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  function parseDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtDate(s) { var d = parseDate(s); return ("0" + d.getDate()).slice(-2) + " " + MONTHS_SHORT[d.getMonth()] + " " + d.getFullYear(); }
  function fmtDateLong(s) { var d = parseDate(s); return d.getDate() + " de " + MONTHS[d.getMonth()].toLowerCase() + " de " + d.getFullYear(); }
  function relDate(s) {
    var d = parseDate(s), t = new Date(); t.setHours(0, 0, 0, 0);
    var days = Math.round((t - d) / 86400000);
    if (days <= 0) return "hoy";
    if (days === 1) return "hace 1 día";
    if (days < 30) return "hace " + days + " días";
    var m = Math.round(days / 30); return m <= 1 ? "hace alrededor de 1 mes" : "hace " + m + " meses";
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(title, desc) {
    var el = document.getElementById("fz-toast");
    if (!el) { el = document.createElement("div"); el.id = "fz-toast"; document.body.appendChild(el); }
    el.innerHTML = '<div class="rounded-lg border border-border bg-popover text-popover-foreground shadow-lg px-4 py-3 text-sm w-[340px] max-w-full" role="status"><p class="font-medium">' + title + "</p>" + (desc ? '<p class="text-muted-foreground text-xs mt-0.5">' + desc + "</p>" : "") + "</div>";
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.display = "none"; }, 2800);
  }
  function notInDemo() { toast("No disponible en la demo", "Esta sección existe en la aplicación real."); }

  /* ---------- Navigation (same groups and labels as components/dashboard/sidebar.tsx) ---------- */
  var NAV = [
    [{ t: "Dashboard", i: "layout-dashboard", h: "index.html", k: "index" }],
    [{ t: "Transacciones", i: "receipt", h: "transacciones.html", k: "transacciones" },
     { t: "Plantillas Transacciones", i: "refresh-cw" },
     { t: "Movimientos Internos", i: "arrow-left-right" }],
    [{ t: "Fuentes de Dinero", i: "wallet" },
     { t: "Tarjetas de Crédito", i: "credit-card", h: "tarjetas.html", k: "tarjetas" },
     { t: "Metas de Ahorro", i: "target", h: "metas.html", k: "metas" }],
    [{ t: "Reportes", i: "trending-up", h: "reportes.html", k: "reportes" },
     { t: "Planificación", i: "calendar", h: "presupuestos.html", k: "presupuestos" },
     { t: "Patrimonio Neto", i: "landmark" },
     { t: "Tendencias", i: "bar-chart-3" },
     { t: "Suscripciones Detectadas", i: "repeat" },
     { t: "Rachas", i: "flame" },
     { t: "Proyecciones", i: "line-chart" },
     { t: "Pagos y Facturas", i: "calendar-clock" }],
    [{ t: "Asistente Virtual", i: "bot", h: "asistente.html", k: "asistente" },
     { t: "Automatizaciones n8n", i: "zap" },
     { t: "Alertas", i: "bell" },
     { t: "Gestión de Plan", i: "credit-card" }],
    [{ t: "Configuracion", i: "settings" }]
  ];
  var BOTTOM = [
    { t: "Inicio", i: "home", h: "index.html", k: "index" },
    { t: "Transacciones", i: "arrow-left-right", h: "transacciones.html", k: "transacciones" },
    { t: "Metas", i: "target", h: "metas.html", k: "metas" },
    { t: "Reportes", i: "bar-chart-3", h: "reportes.html", k: "reportes" }
  ];

  function navItem(it, active) {
    var base = "fz-touch relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8 md:h-8 transition-colors duration-200";
    if (!it.h) {
      return '<li><button type="button" data-inert class="' + base + ' text-sidebar-foreground/55 hover:bg-muted/50" title="No disponible en la demo">' + icon(it.i, "h-4 w-4 shrink-0") + '<span class="truncate">' + it.t + "</span></button></li>";
    }
    if (active) {
      return '<li class="relative"><div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-primary via-primary/80 to-accent shadow-[0_0_8px_0px] shadow-primary/40"></div>' +
        '<a href="' + it.h + '" aria-current="page" class="' + base + ' bg-gradient-to-r from-primary/10 to-transparent text-primary font-semibold">' + icon(it.i, "h-4 w-4 shrink-0 text-primary drop-shadow-[0_0_4px_var(--primary)]") + '<span class="truncate">' + it.t + "</span></a></li>";
    }
    return '<li><a href="' + it.h + '" class="' + base + ' hover:bg-muted/50">' + icon(it.i, "h-4 w-4 shrink-0") + '<span class="truncate">' + it.t + "</span></a></li>";
  }

  function sidebarHTML(page) {
    var sep = '<div class="mx-2 h-px bg-gradient-to-r from-transparent via-sidebar-border/60 to-transparent"></div>';
    var groups = NAV.map(function (g, gi) {
      var items = g.map(function (it) { return navItem(it, it.k === page); }).join("");
      var extra = gi === NAV.length - 1 ? '<li><div class="flex items-center justify-between px-2 py-1.5"><span class="text-[10px] uppercase tracking-widest text-muted-foreground/60">Peticiones IA</span><span class="text-[11px] font-medium text-muted-foreground tabular-nums">18/100</span></div></li>' : "";
      return '<div class="p-1"><ul class="flex w-full min-w-0 flex-col gap-1 px-1">' + items + extra + "</ul></div>";
    }).join(sep);
    var u = (window.FZDATA && FZDATA.user) || { name: "Usuario Demo", email: "usuario.demo@ejemplo.com" };
    return '' +
      '<div class="relative border-b border-sidebar-border/60 h-16 shrink-0 overflow-hidden">' +
        '<div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>' +
        '<div class="flex items-center gap-2 px-4 h-full">' +
          '<a href="index.html" class="flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-primary/20 shadow-[0_0_10px_-3px] shadow-primary/20 overflow-hidden"><img src="./icon-finanzentral.webp" alt="Finanzentral" width="32" height="32"></a>' +
          '<div class="flex flex-col"><span class="text-sm font-bold tracking-tight dash-text-primary">Finanzentral</span><span class="text-[10px] uppercase tracking-widest text-muted-foreground/70">Dashboard</span></div>' +
          '<button type="button" data-sheet-close class="fz-icon-btn ml-auto md:hidden inline-flex items-center justify-center rounded-md hover:bg-muted/60" aria-label="Cerrar menú">' + icon("x", "h-4 w-4") + "</button>" +
        "</div></div>" +
      '<nav class="fz-scroll flex-1 overflow-y-auto py-1 flex flex-col gap-1" aria-label="Navegación principal">' + groups + "</nav>" +
      '<div class="relative border-t border-sidebar-border/60 shrink-0">' +
        '<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>' +
        '<div class="px-2 py-3 space-y-2">' +
          '<div class="flex items-center gap-3 rounded-lg p-3 bg-gradient-to-br from-muted/80 to-muted/40 border border-sidebar-border/40">' +
            '<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_12px_-2px] shadow-primary/30"><span class="text-sm font-semibold text-primary-foreground">UD</span></div>' +
            '<div class="flex flex-col overflow-hidden flex-1"><span class="text-sm font-medium truncate">' + u.name + '</span><span class="text-[11px] text-muted-foreground/70 truncate">' + u.email + "</span></div>" +
          "</div>" +
          '<div class="flex gap-2">' +
            '<button type="button" data-inert class="flex-1 inline-flex items-center justify-start h-8 rounded-md border border-sidebar-border/50 px-3 text-xs font-medium hover:border-primary/30 hover:bg-primary/5">' + icon("help-circle", "mr-2 h-4 w-4") + "Guia</button>" +
            '<button type="button" data-inert class="flex-1 inline-flex items-center justify-start h-8 rounded-md border border-sidebar-border/50 px-3 text-xs font-medium hover:border-destructive/30 hover:bg-destructive/5 whitespace-nowrap">' + icon("log-out", "mr-2 h-4 w-4") + "Cerrar Sesion</button>" +
          "</div>" +
        "</div></div>";
  }

  function headerHTML() {
    var ib = "fz-icon-btn inline-flex size-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-muted/70 transition-all duration-200";
    return '<header class="relative flex h-16 items-center gap-2 sm:gap-4 border-b border-border/50 bg-background/60 backdrop-blur-xl px-4 md:px-6">' +
      '<div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"></div>' +
      '<button type="button" data-sidebar-trigger class="' + ib.replace("size-9", "size-7") + '" aria-label="Mostrar u ocultar menú lateral">' + icon("panel-left", "h-4 w-4") + "</button>" +
      '<div class="flex-1"></div>' +
      '<button type="button" data-inert class="' + ib + '" title="Guia de usuario" aria-label="Guia de usuario">' + icon("help-circle", "h-5 w-5") + "</button>" +
      '<button type="button" data-inert class="' + ib + ' hidden md:inline-flex" title="Atajos de teclado (?)" aria-label="Atajos de teclado">' + icon("keyboard", "h-5 w-5") + "</button>" +
      '<button type="button" data-inert class="' + ib + '" title="Modo enfoque" aria-label="Modo enfoque">' + icon("focus", "h-5 w-5") + "</button>" +
      '<button type="button" data-theme-toggle class="' + ib + '" title="Cambiar tema" aria-label="Cambiar tema"><span class="dark:hidden">' + icon("moon", "h-5 w-5") + '</span><span class="hidden dark:inline">' + icon("sun", "h-5 w-5") + "</span></button>" +
      '<button type="button" data-inert class="' + ib + ' relative" aria-label="Notificaciones">' + icon("bell", "h-5 w-5") + '<span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive shadow-[0_0_6px_1px] shadow-destructive/50"></span></button>' +
      "</header>";
  }

  function bottomNavHTML(page) {
    var items = BOTTOM.map(function (it) {
      var a = it.k === page;
      return '<a href="' + it.h + '" class="relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 rounded-md text-xs transition-all duration-200 ' + (a ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground") + '"' + (a ? ' aria-current="page"' : "") + ">" +
        icon(it.i, "size-5" + (a ? " stroke-[2.5] drop-shadow-[0_0_6px_var(--primary)]" : "")) + '<span class="leading-none">' + it.t + "</span>" +
        (a ? '<span class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_1px] shadow-primary/40"></span>' : "") + "</a>";
    }).join("");
    return '<nav class="fixed bottom-0 inset-x-0 z-40 border-t border-border/40 bg-background/70 backdrop-blur-2xl backdrop-saturate-150 md:hidden" aria-label="Navegación inferior">' +
      '<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>' +
      '<div class="flex items-center justify-around h-14">' + items +
      '<button type="button" data-sheet-open class="flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground">' + icon("menu", "size-5") + '<span class="leading-none">Más</span></button>' +
      "</div></nav>";
  }

  function isMobile() { return window.innerWidth < 768; }

  function mountShell(page) {
    var sb = document.getElementById("fz-sidebar");
    if (sb) sb.innerHTML = sidebarHTML(page);
    var hd = document.getElementById("fz-header");
    if (hd) hd.innerHTML = headerHTML();
    var bn = document.getElementById("fz-bottomnav");
    if (bn) bn.innerHTML = bottomNavHTML(page);
    if (!document.getElementById("fz-overlay")) {
      var ov = document.createElement("div"); ov.id = "fz-overlay"; document.body.appendChild(ov);
    }
    hydrateIcons(document);

    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-inert],[data-sidebar-trigger],[data-sheet-open],[data-sheet-close],[data-theme-toggle],#fz-overlay") : null;
      if (!t) return;
      var root = document.documentElement;
      if (t.hasAttribute("data-inert")) { e.preventDefault(); notInDemo(); }
      else if (t.hasAttribute("data-sidebar-trigger")) {
        if (isMobile()) root.classList.add("fz-sheet-open");
        else { root.classList.toggle("fz-collapsed"); setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 220); }
      }
      else if (t.hasAttribute("data-sheet-open")) root.classList.add("fz-sheet-open");
      else if (t.hasAttribute("data-sheet-close") || t.id === "fz-overlay") root.classList.remove("fz-sheet-open");
      else if (t.hasAttribute("data-theme-toggle")) {
        var dark = !root.classList.contains("dark");
        try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch (err) { /* ignore */ }
        applyTheme();
        window.dispatchEvent(new CustomEvent("fz-theme"));
      }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") document.documentElement.classList.remove("fz-sheet-open"); });
  }

  /* ---------- Chart.js helpers (hex colors, theme aware) ---------- */
  function chartTheme() {
    var dark = document.documentElement.classList.contains("dark");
    return {
      dark: dark,
      text: dark ? "#9ca3af" : "#737373",
      grid: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      tooltipBg: dark ? "#18181b" : "#ffffff",
      tooltipFg: dark ? "#f4f4f5" : "#18181b",
      tooltipBorder: dark ? "#3f3f46" : "#e5e5e5",
      income: "#10b981", expense: "#f43f5e", primary: dark ? "#5b8def" : "#2563eb", accent: dark ? "#a78bfa" : "#8b5cf6"
    };
  }
  function baseChartOptions(extra) {
    var th = chartTheme();
    var o = {
      responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: th.tooltipBg, titleColor: th.tooltipFg, bodyColor: th.tooltipFg, borderColor: th.tooltipBorder, borderWidth: 1, padding: 10, cornerRadius: 8, boxPadding: 4,
          callbacks: { label: function (c) { return " " + (c.dataset.label || c.label) + ": " + money(c.parsed.y != null ? c.parsed.y : c.parsed); } } }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: th.text, font: { size: 11 } } },
        y: { beginAtZero: true, grid: { color: th.grid }, border: { display: false, dash: [3, 3] }, ticks: { color: th.text, font: { size: 11 }, callback: function (v) { return v >= 1000 ? (v / 1000).toFixed(0) + "k" : v; } } }
      }
    };
    if (window.Chart) Chart.defaults.font.family = "Geist, ui-sans-serif, system-ui, sans-serif";
    if (extra) extra(o, th);
    return o;
  }

  window.FZ = {
    icon: icon, hydrateIcons: hydrateIcons, money: money, fmtDate: fmtDate, fmtDateLong: fmtDateLong, relDate: relDate, parseDate: parseDate,
    MONTHS: MONTHS, MONTHS_SHORT: MONTHS_SHORT, toast: toast, notInDemo: notInDemo, mountShell: mountShell,
    chartTheme: chartTheme, baseChartOptions: baseChartOptions, applyTheme: applyTheme
  };
})();
