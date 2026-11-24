/* Finanzentral demo: ALL DATA IS FICTITIOUS. Generated with a seeded PRNG, dates relative to today. */
(function () {
  "use strict";
  var seed = 20261124;
  function rnd() { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
  function between(a, b) { return Math.round((a + rnd() * (b - a)) * 10) / 10; }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function pad(n) { return ("0" + n).slice(-2); }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  var USD_RATE = 3.75;
  var today = new Date(); today.setHours(0, 0, 0, 0);

  var user = { name: "Usuario Demo", firstName: "Usuario", email: "usuario.demo@ejemplo.com", currency: "PEN", plan: "premium" };

  var categories = [
    { id: "alim", name: "Alimentación", type: "gasto", color: "#f97316", subs: ["Supermercado", "Mercado", "Bodega"] },
    { id: "rest", name: "Restaurantes", type: "gasto", color: "#fb7185", subs: ["Cafetería", "Restaurante", "Delivery"] },
    { id: "trans", name: "Transporte", type: "gasto", color: "#3b82f6", subs: ["Taxi por app", "Combustible", "Transporte público"] },
    { id: "viv", name: "Vivienda", type: "gasto", color: "#8b5cf6", subs: ["Alquiler", "Mantenimiento"] },
    { id: "serv", name: "Servicios", type: "gasto", color: "#06b6d4", subs: ["Luz", "Agua", "Internet", "Telefonía"] },
    { id: "susc", name: "Suscripciones", type: "gasto", color: "#6366f1", subs: ["Streaming", "Música", "Software"] },
    { id: "salud", name: "Salud", type: "gasto", color: "#10b981", subs: ["Farmacia", "Consultas", "Gimnasio"] },
    { id: "ent", name: "Entretenimiento", type: "gasto", color: "#ec4899", subs: ["Cine", "Salidas"] },
    { id: "comp", name: "Compras", type: "gasto", color: "#f43f5e", subs: ["Tecnología", "Ropa", "Hogar"] },
    { id: "edu", name: "Educación", type: "gasto", color: "#eab308", subs: ["Cursos", "Libros"] },
    { id: "sueldo", name: "Sueldo", type: "ingreso", color: "#10b981", subs: ["Quincena"] },
    { id: "free", name: "Freelance", type: "ingreso", color: "#14b8a6", subs: ["Proyectos"] },
    { id: "inv", name: "Inversiones", type: "ingreso", color: "#0ea5e9", subs: ["Intereses"] }
  ];

  var moneySources = [
    { id: "ms1", name: "Cuenta Sueldo", type: "bank_account", color: "#3b82f6", balance: 8420.35, currency: "PEN", bank: "Banco Andino" },
    { id: "ms2", name: "Cuenta Ahorros", type: "bank_account", color: "#10b981", balance: 13400.00, currency: "PEN", bank: "Banco Andino" },
    { id: "ms3", name: "Billetera Digital", type: "digital_wallet", color: "#8b5cf6", balance: 642.80, currency: "PEN" },
    { id: "ms4", name: "Efectivo", type: "cash", color: "#f59e0b", balance: 318.50, currency: "PEN" },
    { id: "ms5", name: "Cuenta Dólares", type: "bank_account", color: "#06b6d4", balance: 1250.00, currency: "USD", bank: "Banco del Pacífico" }
  ];
  var MONEY_SOURCE_TYPE_LABELS = { bank_account: "Cuenta bancaria", debit_card: "Tarjeta de débito", credit_card: "Tarjeta de crédito", cash: "Efectivo", digital_wallet: "Billetera digital", other: "Otro" };

  var creditCards = [
    { id: "cc1", name: "Visa Signature", bank: "Banco Andino", brand: "VISA", last4: "4821", color: "blue", limit: 15000, debtLocal: 3240.50, debtUsd: 185.90, cutDay: 25, dueDay: 15 },
    { id: "cc2", name: "Mastercard Black", bank: "Banco del Pacífico", brand: "MC", last4: "7356", color: "purple", limit: 22000, debtLocal: 8920.00, debtUsd: 0, cutDay: 5, dueDay: 28 },
    { id: "cc3", name: "Amex Gold", bank: "Financiera Sol", brand: "AMEX", last4: "1009", color: "gold", limit: 8000, debtLocal: 0, debtUsd: 0, cutDay: 18, dueDay: 8 }
  ];

  /* ---------- Transactions: 6 months (5 full + current up to today) ---------- */
  var txs = [];
  var idc = 1;
  function add(d, desc, amount, type, cat, sub, src, opts) {
    if (d > today) return;
    opts = opts || {};
    txs.push({
      id: "t" + (idc++), date: iso(d), time: opts.time || (pad(Math.floor(between(7, 22))) + ":" + pad(Math.floor(rnd() * 60))),
      description: desc, amount: Math.round(amount * 100) / 100, currency: opts.currency || "PEN", type: type,
      category: cat, subcategory: sub, source: opts.card ? null : src, card: opts.card || null,
      installments: opts.installments || 1, status: opts.status || "completado", via: opts.via || null
    });
  }
  function day(y, m, d) { var last = new Date(y, m + 1, 0).getDate(); return new Date(y, m, Math.min(d, last)); }

  for (var off = 5; off >= 0; off--) {
    var base = new Date(today.getFullYear(), today.getMonth() - off, 1);
    var Y = base.getFullYear(), M = base.getMonth();
    var D = function (d) { return day(Y, M, d); };
    var rday = function (a, b) { return D(Math.floor(between(a, b))); };

    add(D(15), "Sueldo quincena", 3600, "ingreso", "sueldo", "Quincena", "ms1", { time: "09:00" });
    add(D(30), "Sueldo fin de mes", 3600, "ingreso", "sueldo", "Quincena", "ms1", { time: "09:00" });
    if (off % 2 === 1 || off === 0) add(rday(8, 22), pick(["Proyecto freelance diseño web", "Consultoría freelance", "Proyecto freelance landing page"]), between(900, 2600), "ingreso", "free", "Proyectos", "ms3");
    add(D(28), "Intereses cuenta ahorros", between(38, 55), "ingreso", "inv", "Intereses", "ms2", { time: "06:00" });

    add(D(3), "Alquiler departamento", 1650, "gasto", "viv", "Alquiler", "ms1", { time: "10:15" });
    add(D(2), "Gimnasio mensualidad", 129, "gasto", "salud", "Gimnasio", "ms1");
    add(D(8), "Internet hogar", 119, "gasto", "serv", "Internet", "ms1");
    add(D(8), "Plan móvil", 69.9, "gasto", "serv", "Telefonía", "ms3");
    add(D(10), "Recibo de luz", between(95, 140), "gasto", "serv", "Luz", "ms1");
    add(D(12), "Recibo de agua", between(45, 70), "gasto", "serv", "Agua", "ms1");
    add(D(6), "Netflix", 44.9, "gasto", "susc", "Streaming", null, { card: "cc1" });
    add(D(9), "Spotify", 22.9, "gasto", "susc", "Música", null, { card: "cc1" });

    for (var s = 0; s < 3; s++) add(rday(1 + s * 9, 9 + s * 9), "Supermercado", between(150, 420), "gasto", "alim", "Supermercado", s === 1 ? null : "ms1", s === 1 ? { card: "cc2" } : null);
    add(rday(1, 28), "Mercado local", between(40, 95), "gasto", "alim", "Mercado", "ms4", { via: off % 2 ? "whatsapp" : null });
    add(rday(1, 28), "Bodega snacks", between(5, 12), "gasto", "alim", "Bodega", "ms4");
    for (var tx = 0; tx < 3; tx++) add(rday(1 + tx * 9, 9 + tx * 9), "Taxi por app", between(12, 35), "gasto", "trans", "Taxi por app", "ms3", { via: tx === 0 ? "whatsapp" : null });
    add(rday(5, 25), "Combustible", between(120, 180), "gasto", "trans", "Combustible", null, { card: "cc2" });
    for (var cf = 0; cf < 2; cf++) add(rday(1 + cf * 13, 13 + cf * 13), "Cafetería", between(9, 18), "gasto", "rest", "Cafetería", "ms3", { time: "08:" + pad(Math.floor(rnd() * 50) + 10) });
    add(rday(10, 27), pick(["Restaurante", "Cevichería", "Pollería"]), between(60, 140), "gasto", "rest", "Restaurante", null, { card: "cc1", time: "20:" + pad(Math.floor(rnd() * 50) + 10) });
    add(rday(1, 28), "Delivery de comida", between(35, 70), "gasto", "rest", "Delivery", "ms3", { time: "21:" + pad(Math.floor(rnd() * 50) + 10) });
    add(rday(1, 28), "Farmacia", between(25, 90), "gasto", "salud", "Farmacia", "ms1");
    if (off % 2 === 0) add(rday(5, 27), "Cine", between(30, 60), "gasto", "ent", "Cine", "ms3", { time: "19:30" });
    if (off % 2 === 1) add(rday(5, 27), "Salida con amigos", between(80, 160), "gasto", "ent", "Salidas", "ms4", { time: "22:10" });
    add(rday(3, 26), pick(["Compra online ropa", "Artículos para el hogar", "Accesorios de tecnología"]), between(80, 320), "gasto", "comp", pick(["Ropa", "Hogar", "Tecnología"]), null, { card: "cc2" });
    if (off % 2 === 0) add(rday(3, 26), "Curso online", between(15, 30), "gasto", "edu", "Cursos", null, { card: "cc1", currency: "USD" });
  }
  // Installment purchases (also shown in the cards schedule)
  var mAgo = function (n, d) { return new Date(today.getFullYear(), today.getMonth() - n, d); };
  add(mAgo(5, 11), "Laptop para trabajo", 4788, "gasto", "comp", "Tecnología", null, { card: "cc1", installments: 12, time: "16:40" });
  add(mAgo(3, 4), "Refrigeradora", 2394, "gasto", "comp", "Hogar", null, { card: "cc2", installments: 6, time: "12:05" });
  add(mAgo(1, 20), "Pasajes de avión", 557.7, "gasto", "ent", "Salidas", null, { card: "cc1", installments: 3, currency: "USD", time: "23:10" });
  add(mAgo(2, 14), "Celular nuevo", 3060, "gasto", "comp", "Tecnología", null, { card: "cc2", installments: 18, time: "18:25" });
  // A couple of pending items
  var lastExp = txs.filter(function (t) { return t.type === "gasto"; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  if (lastExp[2]) lastExp[2].status = "pendiente";
  if (lastExp[7]) lastExp[7].status = "pendiente";

  txs.sort(function (a, b) { return a.date === b.date ? (a.time < b.time ? 1 : -1) : (a.date < b.date ? 1 : -1); });

  /* ---------- Installment schedules ---------- */
  function schedule(id, card, desc, total, n, currency, firstDue) {
    var out = [], amt = Math.round(total / n * 100) / 100;
    for (var i = 1; i <= n; i++) {
      var due = new Date(firstDue.getFullYear(), firstDue.getMonth() + i - 1, firstDue.getDate());
      var paid = due < today;
      out.push({ n: i, amount: amt, due: iso(due), paid: paid, paidDate: paid ? iso(new Date(due.getFullYear(), due.getMonth(), due.getDate() - 2)) : null });
    }
    return { id: id, card: card, description: desc, total: total, count: n, currency: currency, items: out };
  }
  var installments = [
    schedule("g1", "cc1", "Laptop para trabajo", 4788, 12, "PEN", mAgo(4, 15)),
    schedule("g2", "cc1", "Pasajes de avión", 557.7, 3, "USD", mAgo(0, 15)),
    schedule("g3", "cc2", "Refrigeradora", 2394, 6, "PEN", mAgo(2, 28)),
    schedule("g4", "cc2", "Celular nuevo", 3060, 18, "PEN", mAgo(1, 28))
  ];

  /* ---------- Goals ---------- */
  function addMonths(n) { var d = new Date(today.getFullYear(), today.getMonth() + n, Math.min(today.getDate(), 28)); return iso(d); }
  var goals = [
    { id: "go1", name: "Fondo de emergencia", description: "6 meses de gastos fijos", target: 20000, current: 13400, color: "#10b981", deadline: addMonths(8), monthly: 850, linked: "Cuenta Ahorros", created: addMonths(-10) },
    { id: "go2", name: "Viaje a Cusco", description: "Vacaciones de julio", target: 4500, current: 2950, color: "#3b82f6", deadline: addMonths(4), monthly: 300, created: addMonths(-6) },
    { id: "go3", name: "Inicial departamento", description: "Cuota inicial del 10%", target: 60000, current: 18500, color: "#8b5cf6", deadline: addMonths(30), monthly: 1100, created: addMonths(-14) },
    { id: "go4", name: "Curso de inglés", description: "Certificación intermedia", target: 2400, current: 1850, color: "#f59e0b", deadline: addMonths(2), monthly: 200, created: addMonths(-5) }
  ];

  /* ---------- Budgets (current month) ---------- */
  var budgets = [
    { category: "alim", amount: 1100, alert: 80 }, { category: "rest", amount: 350, alert: 80 },
    { category: "trans", amount: 300, alert: 80 }, { category: "viv", amount: 1700, alert: 90 },
    { category: "serv", amount: 450, alert: 85 }, { category: "susc", amount: 80, alert: 90 },
    { category: "salud", amount: 220, alert: 80 }, { category: "ent", amount: 150, alert: 75 },
    { category: "comp", amount: 300, alert: 80 }
  ];

  /* ---------- Previous year monthly totals (for the YoY tab) ---------- */
  var prevYear = [];
  for (var py = 0; py < 12; py++) prevYear.push({ income: 6500 + Math.round(rnd() * 1800), expenses: 4300 + Math.round(rnd() * 1300) });

  /* ---------- Helpers shared by all pages ---------- */
  function catById(id) { for (var i = 0; i < categories.length; i++) if (categories[i].id === id) return categories[i]; return null; }
  function srcById(id) { for (var i = 0; i < moneySources.length; i++) if (moneySources[i].id === id) return moneySources[i]; return null; }
  function cardById(id) { for (var i = 0; i < creditCards.length; i++) if (creditCards[i].id === id) return creditCards[i]; return null; }
  function toPEN(t) { return t.currency === "USD" ? t.amount * USD_RATE : t.amount; }
  function ym(dateStr) { return dateStr.slice(0, 7); }
  function monthKey(y, m) { return y + "-" + pad(m + 1); }
  function monthTotals(list, key) {
    var r = { income: 0, expenses: 0, count: 0 };
    list.forEach(function (t) { if (ym(t.date) !== key) return; r.count++; if (t.type === "ingreso") r.income += toPEN(t); else r.expenses += toPEN(t); });
    return r;
  }
  function lastMonths(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) { var d = new Date(today.getFullYear(), today.getMonth() - i, 1); out.push({ y: d.getFullYear(), m: d.getMonth(), key: monthKey(d.getFullYear(), d.getMonth()) }); }
    return out;
  }
  function byCategory(list, filterFn) {
    var map = {};
    list.forEach(function (t) { if (t.type !== "gasto" || (filterFn && !filterFn(t))) return; map[t.category] = (map[t.category] || 0) + toPEN(t); });
    return Object.keys(map).map(function (k) { var c = catById(k); return { id: k, name: c.name, color: c.color, value: Math.round(map[k] * 100) / 100 }; }).sort(function (a, b) { return b.value - a.value; });
  }
  function totalBalancePEN() { return moneySources.reduce(function (s, m) { return s + (m.currency === "USD" ? m.balance * USD_RATE : m.balance); }, 0); }

  window.FZDATA = {
    user: user, today: today, USD_RATE: USD_RATE, categories: categories, moneySources: moneySources, creditCards: creditCards,
    MONEY_SOURCE_TYPE_LABELS: MONEY_SOURCE_TYPE_LABELS, transactions: txs, installments: installments, goals: goals, budgets: budgets, prevYear: prevYear,
    catById: catById, srcById: srcById, cardById: cardById, toPEN: toPEN, ym: ym, monthKey: monthKey, monthTotals: monthTotals,
    lastMonths: lastMonths, byCategory: byCategory, totalBalancePEN: totalBalancePEN, iso: iso, nextId: function () { return "t" + (idc++); }
  };
})();
