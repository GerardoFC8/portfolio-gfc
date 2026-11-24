/* ============================================================
   Layout compartido y utilidades de la demo.
   Se carga con defer ANTES de Alpine: inyecta el aviso de demo,
   la barra de navegación (igual a la del
   sistema real) y expone helpers en window.App.
   Todas las rutas son relativas para que funcione desde un subdirectorio.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'demoErp.cotizaciones.v1';

  // ---------- Formato ----------
  var nf2 = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var nf0 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 });
  function fmt(n) { return nf2.format(Number(n) || 0); }
  function fmt0(n) { return nf0.format(Number(n) || 0); }
  function simbolo(moneda) { return (moneda === 'S' || moneda === 'PEN') ? 'S/' : 'US$'; }
  function fechaDMY(isoDate) {
    if (!isoDate) return '';
    var p = String(isoDate).substring(0, 10).split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // ---------- Paginación (lista de páginas con "..." como el paginador de Laravel) ----------
  function pageList(current, last) {
    if (last <= 7) { var a = []; for (var i = 1; i <= last; i++) a.push(i); return a; }
    var out = [1];
    var start = Math.max(2, current - 1);
    var end = Math.min(last - 1, current + 1);
    if (current <= 3) { start = 2; end = 4; }
    if (current >= last - 2) { start = last - 3; end = last - 1; }
    if (start > 2) out.push('...');
    for (var p = start; p <= end; p++) out.push(p);
    if (end < last - 1) out.push('...');
    out.push(last);
    return out;
  }

  // ---------- Cotizaciones en memoria + sessionStorage ----------
  // Las altas/ediciones de la demo se guardan en sessionStorage para que
  // el PDF de una cotización nueva funcione al abrirse en otra pestaña.
  function getCotizaciones() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) { /* almacenamiento no disponible: se usan los datos base */ }
    return JSON.parse(JSON.stringify(window.DEMO.cotizaciones));
  }
  function saveCotizaciones(list) {
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* sin persistencia */ }
  }
  function resetCotizaciones() {
    try { window.sessionStorage.removeItem(STORAGE_KEY); } catch (e) { /* nada */ }
  }

  // ---------- Notificación tipo WireUI ----------
  function toast(title, description, kind) {
    var cont = document.getElementById('demo-toasts');
    if (!cont) {
      cont = document.createElement('div');
      cont.id = 'demo-toasts';
      cont.className = 'fixed right-0 top-10 z-[70] flex w-full flex-col items-end gap-2 p-3 sm:w-96 pointer-events-none';
      document.body.appendChild(cont);
    }
    var color = kind === 'error' ? 'text-negative-500' : (kind === 'info' ? 'text-primary-500' : 'text-positive-500');
    var icon = kind === 'error'
      ? '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>'
      : (kind === 'info'
        ? '<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>');
    var el = document.createElement('div');
    el.className = 'pointer-events-auto w-full rounded-lg bg-white shadow-lg ring-1 ring-black/5 p-4 flex gap-3 transition-opacity duration-300';
    el.innerHTML = '<svg class="h-6 w-6 shrink-0 ' + color + '" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">' + icon + '</svg>' +
      '<div class="min-w-0"><p class="text-sm font-medium text-gray-900"></p><p class="mt-1 text-sm text-gray-500"></p></div>';
    el.querySelector('p').textContent = title;
    el.querySelectorAll('p')[1].textContent = description || '';
    cont.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; }, 3200);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3600);
  }

  // ---------- Menú (estructura del menú real; solo algunas opciones están en la demo) ----------
  var MODULOS = [
    { title: 'Sistemas', icon: 'fas fa-sitemap', items: [
      { title: 'Tablas', submenu: [{ title: 'Sucursal(es)' }, { title: 'Usuarios' }, { title: 'Condiciones Comercial' }] },
      { title: 'Transacciones', submenu: [{ title: 'Roles' }, { title: 'Permisos' }] },
    ] },
    { title: 'Gerencia', icon: 'fas fa-toolbox', items: [
      { title: 'Tablas', submenu: [{ title: 'Grupos' }, { title: 'Línea de activos' }, { title: 'Sublineas de activos' }] },
      { title: 'Transacciones', submenu: [{ title: 'Aprobación de compras' }] },
    ] },
    { title: 'Almacen', icon: 'fas fa-box-open', items: [
      { title: 'Tablas', submenu: [{ title: 'Marca' }, { title: 'Modelo' }] },
    ] },
    { title: 'Equipos', icon: 'fas fa-cogs', items: [
      { title: 'Tablas', submenu: [{ title: 'Activos', url: 'equipos.html' }, { title: 'Personal técnico' }, { title: 'Trabajos realizados' }] },
      { title: 'Operaciones', submenu: [
        { title: 'Planta', submenu: [{ title: 'Orden de Trabajo (OTR)' }, { title: 'Equipos en Planta' }] },
        { title: 'Campo', submenu: [{ title: 'Equipos Campo' }, { title: 'Actu. Horometros' }] },
      ] },
      { title: 'Transacciones', submenu: [
        { title: 'Generar Acta Despacho' },
        { title: 'Actas Despacho/Recepción' },
        { title: 'Firma de acta por enlace (vista del cliente)', url: 'acta-firma.html' },
      ] },
      { title: 'Consultas', submenu: [{ title: 'Historial de Equipos' }, { title: 'Comparación de Actas' }] },
      { title: 'Mantenimiento', submenu: [{ title: 'Mantenimiento Preventivo' }, { title: 'Mantenimiento Correctivo' }] },
    ] },
    { title: 'Comercial', icon: 'fas fa-donate', items: [
      { title: 'Tablas', submenu: [{ title: 'Clientes' }, { title: 'Obras' }, { title: 'Condiciones de Alquiler' }, { title: 'Formas de Pago' }] },
      { title: 'Transacciones', submenu: [
        { title: 'Cotizaciones', submenu: [{ title: 'De Alquileres', url: 'cotizaciones.html' }] },
        { title: 'Pedidos', submenu: [{ title: 'Listado Pedidos' }] },
      ] },
    ] },
    { title: 'Logistica', icon: 'fas fa-dolly', items: [
      { title: 'Transacciones', submenu: [{ title: 'Solicitud de Compra' }, { title: 'Orden de Compra' }] },
    ] },
    { title: 'Valorización', icon: 'fas fa-dollar-sign', items: [
      { title: 'Transacciones', submenu: [{ title: 'Previo Valo' }, { title: 'Valorizaciones', url: 'valorizaciones.html' }] },
      { title: 'Consultas', submenu: [{ title: 'Reporte Valorizaciones' }] },
    ] },
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var CHEVRON = '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>';
  // Página actual; tolera servidores que quitan la extensión (/cotizaciones) o sirven la carpeta (/erp-demo/)
  var current = location.pathname.split('/').pop() || 'index.html';
  if (current.indexOf('.') === -1) current += '.html';

  function contieneActual(item) {
    if (item.url && item.url === current) return true;
    return !!(item.submenu && item.submenu.some(contieneActual));
  }
  function renderLeaf(item) {
    if (item.url) {
      var activo = item.url === current;
      return '<a href="' + item.url + '" class="flex items-center min-h-[44px] md:min-h-0 w-full ps-3 pe-4 py-2 border-l-4 text-start text-sm font-medium rounded-md transition ' +
        (activo ? 'border-indigo-400 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-700 hover:bg-gray-200') + '">' + esc(item.title) + '</a>';
    }
    return '<span title="No incluido en la demo" class="flex items-center justify-between min-h-[44px] md:min-h-0 w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-sm text-gray-400 cursor-not-allowed rounded-md">' +
      esc(item.title) + '<i class="fas fa-lock text-[10px] ml-2"></i></span>';
  }
  function renderItems(items) {
    return items.map(function (item) {
      if (item.submenu) {
        var abierto = contieneActual(item);
        return '<div x-data="{ sub: ' + abierto + ' }" class="relative">' +
          '<button type="button" @click="sub = !sub" class="flex justify-between items-center w-full px-4 py-2 min-h-[44px] md:min-h-[40px] text-sm font-medium text-left text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">' +
          esc(item.title) +
          '<svg :class="{\'rotate-180\': sub}" class="w-4 h-4 transform transition-transform text-gray-700" fill="currentColor" viewBox="0 0 20 20">' + CHEVRON + '</svg></button>' +
          '<div x-show="sub" x-cloak class="mt-2 space-y-1 pl-4 border-l-2 border-gray-300">' + renderItems(item.submenu) + '</div></div>';
      }
      return renderLeaf(item);
    }).join('');
  }
  function renderDropdown(mod) {
    var activo = mod.items.some(contieneActual);
    return '<div class="flex items-center ms-4" x-data="{ open: false }" @click.outside="open = false" @keydown.escape.window="open = false">' +
      '<div class="relative">' +
      '<button type="button" @click="open = !open" class="flex justify-between items-center w-full p-1 text-sm font-medium text-left rounded-md hover:bg-gray-200 ' + (activo ? 'text-indigo-700' : 'text-gray-700') + ' bg-white">' +
      '<div class="flex items-center space-x-2"><i class="' + mod.icon + '"></i><span>' + esc(mod.title) + '</span></div>' +
      '<svg :class="{\'rotate-180\': open}" class="w-5 h-5 transform transition-transform text-gray-700" fill="currentColor" viewBox="0 0 20 20">' + CHEVRON + '</svg></button>' +
      '<div x-show="open" x-transition x-cloak class="absolute left-0 mt-2 w-[300px] bg-white shadow-lg rounded-md z-50 border border-gray-200 p-1 space-y-1">' +
      renderItems(mod.items) + '</div></div></div>';
  }
  function renderResponsive(mod) {
    return '<div x-data="{ open: ' + mod.items.some(contieneActual) + ' }" class="px-2">' +
      '<button type="button" @click="open = !open" class="flex justify-between items-center w-full px-3 py-3 min-h-[44px] text-base font-medium text-left text-gray-700 rounded-md hover:bg-gray-100">' +
      '<span class="flex items-center gap-2"><i class="' + mod.icon + ' w-5 text-center"></i>' + esc(mod.title) + '</span>' +
      '<svg :class="{\'rotate-180\': open}" class="w-5 h-5 transform transition-transform" fill="currentColor" viewBox="0 0 20 20">' + CHEVRON + '</svg></button>' +
      '<div x-show="open" x-cloak class="mt-1 space-y-1 pl-3">' + renderItems(mod.items) + '</div></div>';
  }

  function renderShell() {
    // El aviso ya viene escrito en cada HTML (visible aun sin JavaScript); solo se crea si falta.
    var banner = document.getElementById('demo-banner') || document.createElement('div');
    banner.id = 'demo-banner';
    banner.setAttribute('role', 'note');
    banner.className = 'demo-banner';
    banner.textContent = 'Demo con datos ficticios · No es el sistema real';
    if (!banner.parentNode) document.body.insertBefore(banner, document.body.firstChild);
    document.body.classList.add('has-demo-banner');

    var slot = document.getElementById('nav-slot');
    if (!slot) return;
    var dashActivo = current === 'index.html' || current === '';
    var usuario = window.DEMO ? window.DEMO.usuario : { name: 'Usuario Demo' };
    slot.outerHTML =
      '<nav x-data="{ open: false }" class="bg-white border-b-2 border-blue-400 sticky top-7 z-50">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4"><div class="flex justify-between h-16 w-full"><div class="flex min-w-0">' +
      // Logo de texto neutro (el sistema real usa la imagen de marca del cliente)
      '<a href="index.html" class="shrink-0 flex items-center gap-2" title="Inicio">' +
      '<span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-sm">RE</span>' +
      '<span class="leading-tight"><span class="block text-sm font-bold text-gray-800">Rental ERP</span><span class="block text-[10px] uppercase tracking-wider text-gray-500">Demo</span></span></a>' +
      '<div class="hidden space-x-2 md:-my-px md:ms-6 md:flex">' +
      '<a href="index.html" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition ' +
      (dashActivo ? 'border-indigo-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') + '"><i class="fas fa-chart-pie mr-1"></i>Dashboard</a>' +
      MODULOS.map(renderDropdown).join('') +
      '</div></div>' +
      // Usuario
      '<div class="hidden lg:flex lg:items-center lg:ms-6" x-data="{ u: false }" @click.outside="u = false"><div class="relative">' +
      '<button type="button" @click="u = !u" class="inline-flex items-center px-1 border border-transparent text-xs leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700">' +
      '<div class="flex flex-col text-center"><span class="capitalize">' + esc(usuario.name) + '</span><span class="font-bold">(Lima, Rental)</span></div>' +
      '<svg class="ms-2 -me-0.5 size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg></button>' +
      '<div x-show="u" x-transition x-cloak class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black/5 py-1 z-50">' +
      '<div class="block px-4 py-2 text-xs text-gray-400">Manage Account</div>' +
      ['Perfil', 'Adjuntar Firma', 'Cambiar Sucursal'].map(function (t) { return '<span class="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed" title="No incluido en la demo">' + t + '</span>'; }).join('') +
      '<div class="border-t border-gray-200"></div><span class="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed" title="No incluido en la demo">Log Out</span></div></div></div>' +
      // Hamburguesa
      '<div class="-me-2 flex items-center md:hidden">' +
      '<button type="button" @click="open = !open" aria-label="Abrir menú" class="inline-flex items-center justify-center h-11 w-11 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">' +
      '<svg class="size-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">' +
      '<path :class="{\'hidden\': open, \'inline-flex\': !open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>' +
      '<path :class="{\'hidden\': !open, \'inline-flex\': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>' +
      '</div></div>' +
      // Menú responsivo
      '<div x-show="open" x-cloak class="md:hidden border-t border-gray-200 max-h-[calc(100vh-6rem)] overflow-y-auto">' +
      '<div class="pt-2 pb-3 space-y-1">' +
      '<a href="index.html" class="block w-full ps-3 pe-4 py-3 border-l-4 text-start text-base font-medium ' +
      (dashActivo ? 'border-indigo-400 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-600 hover:bg-gray-50') + '"><i class="fas fa-chart-pie mr-2"></i>Dashboard</a>' +
      MODULOS.map(renderResponsive).join('') + '</div>' +
      '<div class="pt-4 pb-3 border-t border-gray-200 px-4"><div class="font-medium text-base text-gray-800">' + esc(usuario.name) + '</div>' +
      '<div class="font-medium text-sm text-gray-500">' + esc(usuario.email || '') + '</div></div></div>' +
      '</nav>';
  }

  window.App = {
    fmt: fmt, fmt0: fmt0, simbolo: simbolo, fechaDMY: fechaDMY,
    MESES: MESES, MESES_CORTOS: MESES_CORTOS,
    pageList: pageList, toast: toast,
    getCotizaciones: getCotizaciones, saveCotizaciones: saveCotizaciones, resetCotizaciones: resetCotizaciones,
    // Clases de botones idénticas a las del sistema real ($buttonBlue500Class, etc.)
    btn: {
      red: 'bg-red-500 hover:bg-red-700 text-white font-semibold px-2 py-1 text-sm rounded-lg shadow-md transition duration-300',
      blue: 'bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-1 text-sm rounded-lg shadow-md transition duration-300',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-2 py-1 text-sm rounded-lg shadow-md transition duration-300',
      green: 'bg-green-500 hover:bg-green-600 text-white font-semibold px-2 py-1 text-sm rounded-lg shadow-md transition duration-300',
    },
  };

  // Los scripts con defer se ejecutan con el DOM ya parseado: se puede inyectar ya, antes de que arranque Alpine.
  renderShell();
})();
