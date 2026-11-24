/* ============================================================
   Datos FICTICIOS de la demo. Nada de esto viene del sistema real:
   empresas, RUC, personas, correos, obras, códigos, series, tarifas
   y montos son inventados. Se generan con un PRNG con semilla fija
   y una fecha de referencia fija, así que cada carga produce lo mismo.
   ============================================================ */
(function () {
  'use strict';

  // ---------- PRNG determinístico (mulberry32) ----------
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rnd = mulberry32(20261120);
  function int(min, max) { return Math.floor(rnd() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function pad(n, w) { var s = String(n); while (s.length < w) s = '0' + s; return s; }
  function round2(n) { return Math.round(n * 100) / 100; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }

  var HOY = new Date(2026, 10, 20); // fecha de referencia fija: 20/11/2026
  var TIPO_CAMBIO = 3.75;

  // ---------- Sucursales ----------
  var sucursales = [
    { id: '01', name: 'Lima' },
    { id: '02', name: 'Arequipa' },
  ];

  // ---------- Vendedores / usuarios ----------
  var vendedores = [
    { co_usua: 'CMENDOZA', name: 'Carlos Mendoza Ríos', email: 'cmendoza@ejemplo.com', telefono: '900 000 101', sucursal: '01' },
    { co_usua: 'LPAREDES', name: 'Lucía Paredes Soto', email: 'lparedes@ejemplo.com', telefono: '900 000 102', sucursal: '01' },
    { co_usua: 'JSALAZAR', name: 'Jorge Salazar Vega', email: 'jsalazar@ejemplo.com', telefono: '900 000 103', sucursal: '01' },
    { co_usua: 'AQUINTANA', name: 'Andrea Quintana Luna', email: 'aquintana@ejemplo.com', telefono: '900 000 104', sucursal: '02' },
    { co_usua: 'RVALDEZ', name: 'Raúl Valdez Campos', email: 'rvaldez@ejemplo.com', telefono: '900 000 105', sucursal: '02' },
  ];

  // ---------- Clientes (todos inventados) ----------
  var nombresClientes = [
    'Constructora Los Andes Demo S.A.C.',
    'Minera Ficticia del Sur S.A.',
    'Inmobiliaria Horizonte Ejemplo S.A.C.',
    'Consorcio Vial Demo Norte',
    'Agroindustrial Valle Ficticio S.A.C.',
    'Ingeniería y Montajes Muestra S.R.L.',
    'Corporación Edifica Demo S.A.',
    'Energía Renovable Ejemplo S.A.C.',
    'Constructora Pacífico Ficticia E.I.R.L.',
    'Obras Civiles Prueba S.A.C.',
    'Saneamiento Demo del Centro S.A.C.',
    'Logística Portuaria Ejemplo S.A.',
    'Minera Cerro Imaginario S.A.C.',
    'Consorcio Hidráulico Muestra',
    'Edificaciones Altiplano Demo S.A.C.',
    'Pavimentos Ficticios Asociados S.A.C.',
    'Metalmecánica Ejemplo Industrial S.A.C.',
    'Constructora Selva Demo S.R.L.',
  ];
  var nombresPersonas = [
    'Ana Torres', 'Luis Castillo', 'Rosa Medina', 'Miguel Herrera', 'Carmen Flores', 'Pedro Ramos',
    'Silvia Navarro', 'Diego Cárdenas', 'Patricia León', 'Hugo Espinoza', 'Elena Rivas', 'Óscar Benítez',
    'Julia Campos', 'Ricardo Ortiz', 'Teresa Guzmán', 'Víctor Arce', 'Gabriela Peña', 'Fernando Rubio',
  ];
  var cargos = ['Jefe de Equipos', 'Residente de Obra', 'Administrador de Obra', 'Jefe de Logística', 'Gerente de Proyectos', 'Supervisor de Campo'];
  var clientes = nombresClientes.map(function (nombre, i) {
    var persona = nombresPersonas[i];
    var usuarioCorreo = persona.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(' ', '.');
    return {
      ruc: '200000000' + pad(i + 1, 2),
      nombre: nombre,
      contacto: persona,
      cargo: cargos[i % cargos.length],
      email: usuarioCorreo + '@ejemplo.com',
      telefono: '900 000 ' + pad(200 + i, 3),
      direccion: 'Av. Ficticia ' + (100 + i * 7) + ', Ciudad Demo',
    };
  });

  // ---------- Obras / centros de costo ----------
  var tiposObra = [
    'Ampliación de planta concentradora', 'Edificio multifamiliar', 'Mejoramiento de carretera', 'Habilitación urbana',
    'Defensa ribereña', 'Planta de tratamiento de agua', 'Centro comercial', 'Reservorio y canal de riego',
    'Parque solar', 'Muelle de carga', 'Pavimentación de vías', 'Nave industrial', 'Hospital regional', 'Colegio emblemático',
  ];
  var lugares = ['Lima Sur', 'Lima Norte', 'Ica', 'Arequipa', 'Moquegua', 'Tacna', 'Cusco', 'Piura', 'La Libertad', 'Junín', 'Áncash', 'Puno'];
  var obras = [];
  for (var o = 0; o < 32; o++) {
    var cli = clientes[o % clientes.length];
    var lugar = pick(lugares);
    obras.push({
      co_ccosto: 'CC' + pad(1100 + o * 3, 4),
      no_obra: pick(tiposObra) + ' ' + ['Fase 1', 'Fase 2', 'Sector A', 'Sector B', 'Etapa I', 'Etapa II', 'Lote 3'][o % 7] + ' - ' + lugar,
      ruc: cli.ruc,
      ubicacion: lugar,
      sucursal: (lugar === 'Arequipa' || lugar === 'Moquegua' || lugar === 'Tacna' || lugar === 'Cusco' || lugar === 'Puno') ? '02' : '01',
    });
  }
  function obrasDeCliente(ruc) { return obras.filter(function (x) { return x.ruc === ruc; }); }

  // ---------- Catálogo de referencias alquilables (tarifas inventadas en USD) ----------
  var catalogo = [
    { referencia: 'EXC-20T', descripcion: 'Excavadora sobre orugas 20 t', marca: 'Caterpillar', modelo: '320D', linea: 'Movimiento de tierras', sublinea: 'Excavadoras', potencia: '148 HP', hora: 58, mes: 10900 },
    { referencia: 'EXC-21T', descripcion: 'Excavadora sobre orugas 21 t', marca: 'Komatsu', modelo: 'PC200-8', linea: 'Movimiento de tierras', sublinea: 'Excavadoras', potencia: '155 HP', hora: 60, mes: 11300 },
    { referencia: 'EXC-22T', descripcion: 'Excavadora sobre orugas 22 t', marca: 'Volvo', modelo: 'EC220D', linea: 'Movimiento de tierras', sublinea: 'Excavadoras', potencia: '173 HP', hora: 62, mes: 11800 },
    { referencia: 'RET-4X4', descripcion: 'Retroexcavadora 4x4', marca: 'JCB', modelo: '3CX', linea: 'Movimiento de tierras', sublinea: 'Retroexcavadoras', potencia: '92 HP', hora: 34, mes: 6300 },
    { referencia: 'RET-416', descripcion: 'Retroexcavadora 4x4', marca: 'Caterpillar', modelo: '416F2', linea: 'Movimiento de tierras', sublinea: 'Retroexcavadoras', potencia: '87 HP', hora: 33, mes: 6100 },
    { referencia: 'CFR-3M3', descripcion: 'Cargador frontal 3 m3', marca: 'Volvo', modelo: 'L90H', linea: 'Movimiento de tierras', sublinea: 'Cargadores frontales', potencia: '173 HP', hora: 55, mes: 10200 },
    { referencia: 'CFR-950', descripcion: 'Cargador frontal 3.1 m3', marca: 'Caterpillar', modelo: '950H', linea: 'Movimiento de tierras', sublinea: 'Cargadores frontales', potencia: '197 HP', hora: 57, mes: 10600 },
    { referencia: 'MCG-S650', descripcion: 'Minicargador', marca: 'Bobcat', modelo: 'S650', linea: 'Movimiento de tierras', sublinea: 'Minicargadores', potencia: '74 HP', hora: 24, mes: 4300 },
    { referencia: 'ROD-10T', descripcion: 'Rodillo compactador liso 10 t', marca: 'Dynapac', modelo: 'CA250D', linea: 'Compactación', sublinea: 'Rodillos', potencia: '130 HP', hora: 41, mes: 7500 },
    { referencia: 'ROD-BW211', descripcion: 'Rodillo compactador 11 t', marca: 'Bomag', modelo: 'BW211D-5', linea: 'Compactación', sublinea: 'Rodillos', potencia: '133 HP', hora: 42, mes: 7700 },
    { referencia: 'PLC-VIB', descripcion: 'Plancha compactadora reversible', marca: 'Wacker Neuson', modelo: 'DPU 6555', linea: 'Compactación', sublinea: 'Planchas', potencia: '13 HP', hora: 6, mes: 900 },
    { referencia: 'GEN-150', descripcion: 'Grupo electrógeno 150 kVA insonorizado', marca: 'Cummins', modelo: 'C150 D5', linea: 'Generación eléctrica', sublinea: 'Grupos electrógenos', potencia: '150 kVA', hora: 19, mes: 3500 },
    { referencia: 'GEN-110', descripcion: 'Grupo electrógeno 110 kVA insonorizado', marca: 'FG Wilson', modelo: 'P110-3', linea: 'Generación eléctrica', sublinea: 'Grupos electrógenos', potencia: '110 kVA', hora: 15, mes: 2800 },
    { referencia: 'GEN-250', descripcion: 'Grupo electrógeno 250 kVA', marca: 'Caterpillar', modelo: 'DE250E0', linea: 'Generación eléctrica', sublinea: 'Grupos electrógenos', potencia: '250 kVA', hora: 27, mes: 5000 },
    { referencia: 'TIL-4LED', descripcion: 'Torre de iluminación LED 4 x 300 W', marca: 'Generac', modelo: 'MLT6S', linea: 'Iluminación', sublinea: 'Torres de iluminación', potencia: '6 kW', hora: 6, mes: 1050 },
    { referencia: 'CMP-185', descripcion: 'Compresora de aire 185 cfm', marca: 'Atlas Copco', modelo: 'XAS 185', linea: 'Compresión de aire', sublinea: 'Compresoras', potencia: '185 cfm', hora: 11, mes: 1900 },
    { referencia: 'CMP-375', descripcion: 'Compresora de aire 375 cfm', marca: 'Sullair', modelo: '375H', linea: 'Compresión de aire', sublinea: 'Compresoras', potencia: '375 cfm', hora: 17, mes: 3000 },
    { referencia: 'PLT-T19', descripcion: 'Plataforma tijera eléctrica 19 pies', marca: 'Genie', modelo: 'GS-1930', linea: 'Izaje y elevación', sublinea: 'Plataformas', potencia: '24 V', hora: 8, mes: 1350 },
    { referencia: 'PLT-B60', descripcion: 'Plataforma brazo telescópico 60 pies', marca: 'JLG', modelo: '600S', linea: 'Izaje y elevación', sublinea: 'Plataformas', potencia: '49 HP', hora: 25, mes: 4500 },
    { referencia: 'TLH-4T', descripcion: 'Manipulador telescópico 4 t', marca: 'JCB', modelo: '540-170', linea: 'Izaje y elevación', sublinea: 'Manipuladores', potencia: '109 HP', hora: 36, mes: 6600 },
  ];
  var lineas = ['Movimiento de tierras', 'Compactación', 'Generación eléctrica', 'Iluminación', 'Compresión de aire', 'Izaje y elevación'];
  var prefijoLinea = {
    'Movimiento de tierras': 'MT', 'Compactación': 'CP', 'Generación eléctrica': 'GE',
    'Iluminación': 'IL', 'Compresión de aire': 'CA', 'Izaje y elevación': 'IZ',
  };
  // Horas mínimas sugeridas por periodo (equivale a "periodo_horas" del sistema real)
  var periodoHoras = {
    Dia: [8, 10],
    Semana: [48, 60],
    Quincena: [100, 120],
    Mes: [180, 200, 220, 240],
  };

  // ---------- Equipos / activos (80) ----------
  var situacionesEquipo = [
    { id: 'EC', name: 'Equipo en Campo' },
    { id: 'ER', name: 'Equipo Recepcionado' },
    { id: 'OT', name: 'Equipo en OT' },
    { id: 'OP', name: 'Equipo Terminado' },
    { id: 'ED', name: 'Equipo a Despachar' },
    { id: 'EP', name: 'Equipo en Pedido' },
  ];
  var situacionCorta = { EC: 'En Campo', ER: 'Recepcionado', OT: 'En OT', OP: 'Terminado', ED: 'A Despachar', EP: 'En Pedido', PV: 'Para Venta', PB: 'Para Baja' };
  var estadosTecnicos = [
    { id: 'OP', name: 'Operativo', cls: 'bg-green-200 text-green-800' },
    { id: 'OB', name: 'Op. con obs.', cls: 'bg-orange-200 text-orange-800' },
    { id: 'RE', name: 'En reparación', cls: 'bg-yellow-200 text-yellow-800' },
    { id: 'PE', name: 'Por evaluar', cls: 'bg-gray-200 text-gray-800' },
    { id: 'IN', name: 'Inoperativo', cls: 'bg-red-200 text-red-800' },
  ];
  var tecnicos = ['Téc. Manuel Ruiz', 'Téc. Iván Ponce', 'Téc. Sergio Alva', 'Téc. Bruno Zegarra', 'Téc. Walter Chávez'];
  var equipos = [];
  var contadorPorLinea = {};
  for (var e = 0; e < 80; e++) {
    var ref = catalogo[(e * 7 + int(0, 3)) % catalogo.length];
    var pref = prefijoLinea[ref.linea];
    contadorPorLinea[pref] = (contadorPorLinea[pref] || 0) + 1;
    var r = rnd();
    var sit = r < 0.52 ? 'EC' : r < 0.64 ? 'OP' : r < 0.74 ? 'OT' : r < 0.82 ? 'ER' : r < 0.9 ? 'ED' : r < 0.95 ? 'EP' : (r < 0.975 ? 'PV' : 'PB');
    var enCampo = sit === 'EC' || sit === 'ED' || sit === 'EP';
    var obra = enCampo ? obras[int(0, obras.length - 1)] : null;
    var cliObra = obra ? clientes.filter(function (c) { return c.ruc === obra.ruc; })[0] : null;
    var estado = sit === 'OT' ? pick(['RE', 'PE', 'IN']) : (sit === 'ER' ? pick(['PE', 'OB', 'OP']) : (rnd() < 0.82 ? 'OP' : 'OB'));
    var anio = int(2014, 2024);
    var horo = Math.round((2026 - anio) * int(650, 1400) + int(0, 600));
    var fechaAct = new Date(anio + (rnd() < 0.5 ? 0 : 1), int(0, 11), int(1, 27));
    var feHoro = addDays(HOY, -int(1, 40));
    var sucursal = obra ? obra.sucursal : (rnd() < 0.7 ? '01' : '02');
    var valorUsd = Math.round(ref.mes * int(9, 14) / 100) * 100;
    var codigo = pref + '-' + pad(100 + contadorPorLinea[pref] * 3 + int(0, 2), 4);

    // Historial de movimientos/documentos (del más reciente al más antiguo)
    var movimientos = [];
    var d = new Date(feHoro.getTime());
    var horoMov = horo;
    var nMov = int(6, 10);
    for (var m = 0; m < nMov; m++) {
      var tipo = pick(['AHO', 'AHO', 'GMP', 'ITC', 'ADR', 'OTR', 'AHO']);
      var obraMov = obra || obras[int(0, obras.length - 1)];
      var cliMov = clientes.filter(function (c) { return c.ruc === obraMov.ruc; })[0];
      movimientos.push({
        tipo: tipo,
        nro: { AHO: 'AH01', GMP: 'GM01', ITC: 'IT01', ADR: 'AD01', OTR: 'OT01' }[tipo] + '-' + pad(int(1200, 9800), 6),
        fecha: iso(d),
        obs: {
          AHO: 'Actualización de horómetro en obra',
          GMP: 'Mantenimiento preventivo realizado según plan',
          ITC: 'Informe técnico de campo: revisión general',
          ADR: m % 2 === 0 ? 'Acta de despacho a obra' : 'Acta de recepción en planta',
          OTR: 'Orden de trabajo en taller',
        }[tipo],
        cliente: cliMov.nombre,
        obra: obraMov.no_obra,
        horometro: horoMov,
        estado: tipo === 'OTR' ? 'RE' : (rnd() < 0.85 ? 'OP' : 'OB'),
        sucursal: obraMov.sucursal,
      });
      horoMov = Math.max(0, horoMov - int(60, 260));
      d = addDays(d, -int(12, 45));
    }

    // Mantenimientos
    var mantenimientos = [];
    var pms = ['PM250', 'PM500', 'PM250', 'PM1000', 'PM250', 'PM500'];
    var dm = addDays(HOY, -int(5, 30));
    var horoPm = Math.floor(horo / 250) * 250;
    for (var k = 0; k < int(3, 6); k++) {
      var correctivo = rnd() < 0.25;
      mantenimientos.push({
        tipo: correctivo ? 'Correctivo' : 'Preventivo',
        pm: correctivo ? '-' : pms[k % pms.length],
        fecha: iso(dm),
        horometro: correctivo ? horoPm - int(20, 120) : horoPm,
        detalle: correctivo
          ? pick(['Cambio de manguera hidráulica', 'Reparación de sistema eléctrico', 'Cambio de batería', 'Ajuste de tren de rodaje', 'Cambio de alternador'])
          : 'Cambio de aceite y filtros, inspección general',
        tecnico: pick(tecnicos),
        costo: correctivo ? int(450, 3800) : int(280, 1400),
      });
      horoPm = Math.max(0, horoPm - 250);
      dm = addDays(dm, -int(25, 70));
    }

    equipos.push({
      co_activo: codigo,
      referencia: ref.referencia,
      de_activo: ref.descripcion + ' ' + ref.marca + ' ' + ref.modelo,
      marca: ref.marca,
      modelo: ref.modelo,
      serie: ref.marca.substring(0, 3).toUpperCase() + pad(int(10000, 99999), 5) + 'X' + int(1, 9),
      anio_fab: anio,
      fe_activacion: iso(fechaAct),
      orden: 'OCA - ' + pad(int(100, 999), 5),
      ti_situacion: sit,
      situacion: situacionCorta[sit],
      fe_ult_situacion: iso(addDays(HOY, -int(1, 60))),
      estado_real: estado,
      ubicacion: obra ? obra.ubicacion + ' (obra)' : (sucursal === '01' ? 'Planta Lima' : 'Planta Arequipa'),
      co_equipo_cliente: obra ? 'EQ-' + pad(int(1, 400), 3) : '',
      co_ccosto: obra ? obra.co_ccosto : '',
      no_obra: obra ? obra.no_obra : '',
      cliente: cliObra ? cliObra.nombre : '',
      fe_horometro: iso(feHoro),
      horometro: horo,
      valor: valorUsd,
      moneda: 'USD',
      grupo: 'Flota Alquiler',
      linea: ref.linea,
      sublinea: ref.sublinea,
      sucursal: sucursal,
      potencia: ref.potencia,
      seguro: rnd() < 0.85 ? 'Vigente' : 'Por renovar',
      movimientos: movimientos,
      mantenimientos: mantenimientos,
    });
  }

  // ---------- Situaciones de cotización (nombres inventados; colores por código como el sistema real) ----------
  var situacionesCoti = [
    { codigo: 'P', situacion_code: 'SEG', situacion_nombre: 'En seguimiento', subsituacion_nombre: 'Pendiente de respuesta', row: 'bg-yellow-200 hover:bg-yellow-400' },
    { codigo: 'L', situacion_code: 'SEG', situacion_nombre: 'En seguimiento', subsituacion_nombre: 'En negociación', row: 'bg-orange-400 hover:bg-orange-500' },
    { codigo: 'R', situacion_code: 'SEG', situacion_nombre: 'En seguimiento', subsituacion_nombre: 'Reenviada al cliente', row: 'bg-blue-400 hover:bg-blue-500' },
    { codigo: 'J', situacion_code: 'SEG', situacion_nombre: 'En seguimiento', subsituacion_nombre: 'Por confirmar fecha', row: 'bg-[#D5FAAA] hover:bg-[#C1F57B]' },
    { codigo: 'A', situacion_code: 'GAN', situacion_nombre: 'Ganada', subsituacion_nombre: 'Aprobada', row: 'bg-green-600 hover:bg-green-700' },
    { codigo: 'Z', situacion_code: 'GAN', situacion_nombre: 'Ganada', subsituacion_nombre: 'Con pedido generado', row: 'bg-green-300 hover:bg-green-400' },
    { codigo: 'O', situacion_code: 'GAN', situacion_nombre: 'Ganada', subsituacion_nombre: 'Con orden de compra', row: 'bg-cyan-200 hover:bg-cyan-300' },
    { codigo: 'N', situacion_code: 'GAN', situacion_nombre: 'Ganada', subsituacion_nombre: 'Nueva versión aprobada', row: 'bg-blue-600 hover:bg-blue-700' },
    { codigo: 'S', situacion_code: 'PER', situacion_nombre: 'Perdida', subsituacion_nombre: 'Por precio', row: 'bg-red-400 hover:bg-red-600' },
    { codigo: 'I', situacion_code: 'PER', situacion_nombre: 'Perdida', subsituacion_nombre: 'Sin disponibilidad', row: 'bg-red-200 hover:bg-red-400' },
    { codigo: 'C', situacion_code: 'PER', situacion_nombre: 'Perdida', subsituacion_nombre: 'Proyecto cancelado', row: 'bg-red-300 hover:bg-red-400' },
    { codigo: 'T', situacion_code: 'ARC', situacion_nombre: 'Archivada', subsituacion_nombre: 'Sin respuesta', row: 'bg-gray-300 hover:bg-gray-500' },
    { codigo: 'M', situacion_code: 'ARC', situacion_nombre: 'Archivada', subsituacion_nombre: 'Referencial', row: 'bg-white hover:bg-gray-200' },
  ];

  // ---------- Condiciones comerciales (texto propio de la demo) ----------
  var condiciones = [
    { codigo: 'C001', descripcion: 'Seguro multirriesgo del equipo durante el alquiler', tipo: 'R' },
    { codigo: 'C002', descripcion: 'Mantenimiento preventivo según horas de uso', tipo: 'R' },
    { codigo: 'C003', descripcion: 'Soporte técnico en obra ante fallas de fabricación', tipo: 'R' },
    { codigo: 'C004', descripcion: 'Filtros y lubricantes de mantenimiento programado', tipo: 'R' },
    { codigo: 'C005', descripcion: 'Equipo de reemplazo ante parada mayor a 48 horas', tipo: 'R' },
    { codigo: 'C006', descripcion: 'Capacitación básica al operador del cliente', tipo: 'R' },
    { codigo: 'C007', descripcion: 'Kit antiderrame y extintor por equipo', tipo: 'R' },
    { codigo: 'C101', descripcion: 'Combustible durante todo el periodo de alquiler', tipo: 'C' },
    { codigo: 'C102', descripcion: 'Operador calificado y su seguro SCTR', tipo: 'C' },
    { codigo: 'C103', descripcion: 'Custodia y vigilancia del equipo en obra', tipo: 'C' },
    { codigo: 'C104', descripcion: 'Reparaciones por fallas de operación o mal uso', tipo: 'C' },
    { codigo: 'C105', descripcion: 'Permisos de acceso del personal técnico a obra', tipo: 'C' },
    { codigo: 'C106', descripcion: 'Lavado del equipo antes de la devolución', tipo: 'C' },
    { codigo: 'C107', descripcion: 'Movilización y desmovilización (si no se cotiza aparte)', tipo: 'C' },
  ];
  var formasPago = ['Contado', 'Crédito 15 días', 'Crédito 30 días', 'Crédito 45 días', 'Factura negociable 60 días'];

  // ---------- Cotizaciones de alquiler (60) ----------
  function itemDesdeCatalogo(cat, moneda, idx) {
    var factor = moneda === 'S' ? TIPO_CAMBIO : 1;
    var periodo = pick(['Mes', 'Mes', 'Mes', 'Quincena', 'Semana', 'Dia']);
    var tipoRnd = rnd();
    var tipo = tipoRnd < 0.55 ? 'HN' : tipoRnd < 0.72 ? 'NA' : tipoRnd < 0.84 ? 'RH' : tipoRnd < 0.93 ? 'HE' : 'TH';
    var horasOpts = periodoHoras[periodo];
    var horas = pick(horasOpts);
    var costoHora = round2(cat.hora * factor * (0.92 + rnd() * 0.16));
    var item = {
      citem: idx + 1,
      referencia: cat.referencia,
      descripcion: cat.descripcion + ' ' + cat.marca + ' ' + cat.modelo + ' o similar',
      linea: cat.linea,
      cantidad: rnd() < 0.8 ? 1 : int(2, 3),
      periodo: periodo,
      tipo_tiempo: tipo,
      horas: '',
      costo_hora: 0,
      costo_periodo: 0,
      total_tarifa: 0,
      standby: rnd() < 0.15,
      rangos: [],
      tarifasHora: [],
    };
    if (tipo === 'HN' || tipo === 'HE') {
      if (tipo === 'HE') horas = horas + int(1, 4) * 10;
      item.horas = String(horas);
      item.costo_hora = costoHora;
      item.total_tarifa = round2(horas * costoHora);
    } else if (tipo === 'NA') {
      var base = { Dia: cat.mes / 22, Semana: cat.mes / 4, Quincena: cat.mes / 2, Mes: cat.mes }[periodo];
      item.horas = '-';
      item.costo_periodo = round2(base * factor * (0.92 + rnd() * 0.16));
      item.total_tarifa = item.costo_periodo;
    } else if (tipo === 'RH') {
      var h1 = horas;
      item.rangos = [
        { ini: 0, fin: h1, tarifa: costoHora },
        { ini: h1 + 1, fin: h1 + 100, tarifa: round2(costoHora * 0.9) },
        { ini: h1 + 101, fin: h1 + 200, tarifa: round2(costoHora * 0.82) },
      ];
      item.horas = 'Rangos';
      item.costo_hora = costoHora;
      item.total_tarifa = round2(h1 * costoHora);
    } else { // TH
      item.tarifasHora = [
        { horas: horas, tarifa: costoHora },
        { horas: 50, tarifa: round2(costoHora * 1.15) },
      ];
      item.horas = String(horas + 50);
      item.costo_hora = '-';
      item.total_tarifa = round2(horas * costoHora + 50 * costoHora * 1.15);
    }
    return item;
  }

  function totalesCotizacion(c) {
    var vv = 0;
    c.items.forEach(function (it) { vv += it.total_tarifa * it.cantidad; });
    c.servicios.forEach(function (s) { vv += Number(s.total) || 0; });
    vv = round2(vv);
    var igv = round2(vv * 0.18);
    return { valor_venta: vv, igv: igv, precio_venta: round2(vv + igv) };
  }

  var cotizaciones = [];
  var codigosSituacion = ['P', 'P', 'P', 'L', 'R', 'J', 'A', 'Z', 'Z', 'O', 'N', 'S', 'I', 'C', 'T', 'M', 'P', 'A'];
  for (var c = 0; c < 60; c++) {
    var fecha = addDays(HOY, -Math.round((59 - c) * 5.2) - int(0, 3));
    var obraC = obras[int(0, obras.length - 1)];
    var cliC = clientes.filter(function (x) { return x.ruc === obraC.ruc; })[0];
    var vend = pick(vendedores);
    var monedaC = rnd() < 0.7 ? 'D' : 'S';
    var nItems = int(1, 4);
    var usados = {};
    var items = [];
    for (var it = 0; it < nItems; it++) {
      var cat = catalogo[int(0, catalogo.length - 1)];
      if (usados[cat.referencia]) continue;
      usados[cat.referencia] = true;
      items.push(itemDesdeCatalogo(cat, monedaC, items.length));
    }
    var movil = monedaC === 'S' ? int(8, 30) * 100 : int(2, 8) * 100;
    var servicios = rnd() < 0.75 ? [{ descripcion: 'Movilización y desmovilización', total: movil }] : [];
    var sitCode = codigosSituacion[int(0, codigosSituacion.length - 1)];
    if (c >= 52) sitCode = pick(['P', 'P', 'L', 'R', 'J']); // las más recientes siguen en seguimiento
    var inicio = addDays(fecha, int(7, 40));
    var agendas = [];
    var nAg = rnd() < 0.3 ? 0 : int(1, 3);
    for (var a = 0; a < nAg; a++) {
      agendas.push({
        id: c * 10 + a,
        fecha: iso(addDays(fecha, 2 + a * int(3, 8))) + ' 10:' + pad(int(0, 59), 2),
        estado: a === nAg - 1 ? sitCode : 'P',
        descripcion: pick(['Llamada de seguimiento al contacto', 'Cliente solicita ajuste de tarifa', 'Se envió versión actualizada', 'Visita técnica a obra coordinada', 'Cliente confirma presupuesto en revisión']),
        alarma: rnd() < 0.4,
      });
    }
    var dupl = rnd() < 0.12;
    var cot = {
      id: c + 1,
      nu_cotizacion: 'COT' + (obraC.sucursal === '01' ? 'L' : 'A') + '-' + fecha.getFullYear() + '-' + pad(301 + c * 2, 5),
      co_sucu: obraC.sucursal,
      co_cliente: cliC.ruc,
      no_cliente: cliC.nombre,
      co_ccosto: obraC.co_ccosto,
      no_obra: obraC.no_obra,
      no_contacto: cliC.contacto,
      nu_telefono: cliC.telefono,
      no_correo: cliC.email,
      fe_cotizacion: iso(fecha),
      fe_inicio_obra: rnd() < 0.85 ? iso(inicio) : '',
      duracion_obra: pick(['1 mes', '2 meses', '3 meses', '4 meses', '6 meses', '8 meses', '1 año']),
      co_usua: vend.co_usua,
      co_moneda: monedaC,
      dolar_value: TIPO_CAMBIO,
      ti_cotizacion: sitCode,
      st_duplicado: dupl ? 1 : 0,
      ti_duplicado: dupl ? pick(['CT', 'DP']) : '',
      nu_version: '',
      items: items,
      servicios: servicios,
      condiciones: condiciones.filter(function (x) { return x.tipo === 'C' || rnd() < 0.75; }).map(function (x) { return { codigo: x.codigo, descripcion: x.descripcion, tipo: x.tipo }; }),
      de_forpago: pick(formasPago),
      de_dispon: pick(['Inmediata, sujeta a confirmación', '7 días desde la orden de compra', '15 días desde la orden de compra', 'Inmediata desde planta']),
      de_obs: pick(['Tarifas válidas por 15 días.', 'Tarifa sujeta a horas mínimas mensuales.', 'Incluye visita técnica previa a obra.', 'Precios referenciales según horas de trabajo.']),
      agendas: agendas,
    };
    // Las duplicadas apuntan a una cotización anterior que sí existe en el listado
    if (dupl && cotizaciones.length) cot.nu_version = cotizaciones[int(0, cotizaciones.length - 1)].nu_cotizacion;
    else { cot.st_duplicado = 0; cot.ti_duplicado = ''; }
    var t = totalesCotizacion(cot);
    cot.valor_venta = t.valor_venta; cot.igv = t.igv; cot.precio_venta = t.precio_venta;
    cotizaciones.push(cot);
  }
  cotizaciones.reverse(); // más recientes primero, como el listado real

  // ---------- Facturación (para el dashboard) ----------
  // Cada factura: año, mes (1..12), división, cliente, línea, monto en PEN.
  var lineasComercial = ['Venta de equipos usados', 'Repuestos y filtros', 'Servicio técnico'];
  var facturas = [];
  var anios = [2024, 2025, 2026];
  var crecimiento = { 2024: 1, 2025: 1.12, 2026: 1.21 };
  var pesoCliente = clientes.map(function (_, i) { return Math.pow(0.84, i) * (0.8 + rnd() * 0.4); });
  var sumaPeso = pesoCliente.reduce(function (s, x) { return s + x; }, 0);
  function clientePonderado() {
    var x = rnd() * sumaPeso;
    for (var i = 0; i < pesoCliente.length; i++) { x -= pesoCliente[i]; if (x <= 0) return clientes[i]; }
    return clientes[clientes.length - 1];
  }
  // Peso de cada línea Rental en la facturación (mismo orden que "lineas")
  var pesoLinea = [0.38, 0.16, 0.2, 0.06, 0.08, 0.12];
  function lineaPonderada() {
    var x = rnd();
    for (var i = 0; i < lineas.length; i++) { x -= pesoLinea[i]; if (x <= 0) return lineas[i]; }
    return lineas[0];
  }
  var estacional = [0.82, 0.86, 0.95, 1.0, 1.04, 1.08, 1.1, 1.12, 1.07, 1.03, 0.98, 0.92];
  var nf = 1;
  anios.forEach(function (anio) {
    var ultimoMes = anio === 2026 ? 11 : 12; // noviembre 2026 parcial
    for (var mes = 1; mes <= ultimoMes; mes++) {
      var parcial = (anio === 2026 && mes === 11) ? 0.6 : 1;
      var n = Math.round(int(30, 38) * parcial);
      for (var f = 0; f < n; f++) {
        var esRental = rnd() < 0.72;
        var cliF = clientePonderado();
        var montoBase = esRental ? int(9000, 68000) : int(4000, 95000);
        facturas.push({
          id: nf++,
          anio: anio,
          mes: mes,
          division: esRental ? 'rental' : 'comercial',
          ruc: cliF.ruc,
          cliente: cliF.nombre,
          linea: esRental ? lineaPonderada() : pick(lineasComercial),
          monto_pen: round2(montoBase * crecimiento[anio] * estacional[mes - 1]),
          fecha: anio + '-' + pad(mes, 2) + '-' + pad(int(1, parcial < 1 ? 18 : 28), 2),
        });
      }
    }
  });
  var rentabilidad = { 2024: 0.118, 2025: 0.131, 2026: 0.142 };

  // ---------- Actas para la firma por enlace ----------
  var equiposCampo = equipos.filter(function (x) { return x.ti_situacion === 'EC'; });
  var obraActa = obras.filter(function (x) { return x.co_ccosto === equiposCampo[0].co_ccosto; })[0];
  var cliActa = clientes.filter(function (x) { return x.ruc === obraActa.ruc; })[0];
  var checklist = [
    'Nivel de aceite de motor', 'Nivel de refrigerante', 'Nivel de aceite hidráulico', 'Estado de neumáticos / orugas',
    'Luces y alarma de retroceso', 'Extintor con carga vigente', 'Kit antiderrame', 'Manual de operación y mantenimiento',
    'Llaves de encendido (2)', 'Pintura y carrocería sin daños nuevos',
  ];
  var equiposActa = equipos.filter(function (x) { return x.co_ccosto === obraActa.co_ccosto; }).slice(0, 2);
  if (equiposActa.length < 2) equiposActa = equiposCampo.slice(0, 2);
  var actas = equiposActa.map(function (eq, i) {
    return {
      id: i + 1,
      nu_acta: 'AD01-' + pad(4521 + i, 6),
      co_equipo: eq.co_activo,
      de_equipo: eq.de_activo,
      serie: eq.serie,
      horometro: eq.horometro,
      fecha: iso(addDays(HOY, -1)),
      cliente: cliActa.nombre,
      ruc: cliActa.ruc,
      obra: obraActa.no_obra,
      co_ccosto: obraActa.co_ccosto,
      responsable_interno: pick(tecnicos),
      checklist: checklist.map(function (txt, j) {
        var obs = (i + j) % 7 === 3;
        return { item: txt, estado: obs ? 'OBS' : 'OK', obs: obs ? pick(['Rayón leve en lateral', 'Se entrega con 3/4 de tanque', 'Neumático con desgaste normal']) : '' };
      }),
    };
  });

  // ---------- Valorizaciones mensuales (por obra y equipo) ----------
  var valorizaciones = [];
  var nVal = 1;
  var mesesVal = [[2026, 6], [2026, 7], [2026, 8], [2026, 9], [2026, 10]];
  var obrasConEquipos = obras.filter(function (ob) { return equipos.some(function (x) { return x.co_ccosto === ob.co_ccosto; }); });
  obrasConEquipos.forEach(function (ob, oi) {
    var cliV = clientes.filter(function (x) { return x.ruc === ob.ruc; })[0];
    var eqs = equipos.filter(function (x) { return x.co_ccosto === ob.co_ccosto; });
    var monedaV = oi % 3 === 0 ? 'S' : 'D';
    var factor = monedaV === 'S' ? TIPO_CAMBIO : 1;
    mesesVal.slice(oi % 2).forEach(function (am, mi, arr) {
      var anio = am[0], mes = am[1];
      var ini = new Date(anio, mes - 1, 1);
      var fin = new Date(anio, mes, 0);
      var detalle = eqs.map(function (eq) {
        var cat = catalogo.filter(function (x) { return x.referencia === eq.referencia; })[0];
        var horasMin = 200;
        var horasTrab = int(150, 260);
        var tarifa = round2(cat.hora * factor);
        var horasVal = Math.max(horasMin, horasTrab);
        // Lecturas coherentes: los meses anteriores quedan más atrás en el horómetro
        var horoFin = eq.horometro - (arr.length - 1 - mi) * 215 - int(0, 40);
        return {
          co_activo: eq.co_activo,
          de_activo: eq.de_activo,
          horo_ini: horoFin - horasTrab,
          horo_fin: horoFin,
          horas_min: horasMin,
          horas_trab: horasTrab,
          horas_val: horasVal,
          dias: fin.getDate(),
          tarifa: tarifa,
          subtotal: round2(horasVal * tarifa),
        };
      });
      var total = round2(detalle.reduce(function (s, x) { return s + x.subtotal; }, 0));
      var esUltimo = mi === arr.length - 1;
      var estado = esUltimo ? pick(['P', 'R']) : (mi === arr.length - 2 ? pick(['R', 'T']) : 'T');
      if ((oi + mi) % 17 === 5) estado = 'E';
      var diasFact = estado === 'T' ? int(3, 25) : null;
      valorizaciones.push({
        idval: nVal,
        co_ccosto: ob.co_ccosto,
        no_obra: ob.no_obra,
        anio: anio,
        mes: mes,
        numval: 'VAL-' + pad(nVal, 5),
        correlativo: mi + 1 + (oi % 2),
        co_cliente: cliV.ruc,
        no_cliente: cliV.nombre,
        fechaini: iso(ini),
        fechafin: iso(fin),
        co_moneda: monedaV,
        linea: eqs[0].linea,
        estado: estado,
        dias_pend: estado === 'P' ? int(1, 18) : 0,
        docs: int(1, 4),
        enviado_sig: estado === 'T',
        facturado: estado === 'T' && diasFact !== null,
        dias_fact: diasFact,
        detalle: detalle,
        valor_venta: total,
        igv: round2(total * 0.18),
        total: round2(total * 1.18),
      });
      nVal++;
    });
  });

  window.DEMO = {
    hoy: iso(HOY),
    tipoCambio: TIPO_CAMBIO,
    empresa: {
      nombre: 'Alquiler de Maquinaria Demo S.A.C.',
      ruc: '20000000000',
      direccion: 'Av. de los Ejemplos 1000, Ciudad Demo',
      web: 'www.ejemplo.com',
      correo: 'comercial@ejemplo.com',
    },
    usuario: { co_usua: 'USUARIODEMO', name: 'Usuario Demo', email: 'usuario.demo@ejemplo.com', sucursal: '01' },
    sucursales: sucursales,
    vendedores: vendedores,
    clientes: clientes,
    obras: obras,
    obrasDeCliente: obrasDeCliente,
    catalogo: catalogo,
    lineas: lineas,
    lineasComercial: lineasComercial,
    periodoHoras: periodoHoras,
    situacionesEquipo: situacionesEquipo,
    estadosTecnicos: estadosTecnicos,
    equipos: equipos,
    situacionesCoti: situacionesCoti,
    condiciones: condiciones,
    formasPago: formasPago,
    cotizaciones: cotizaciones,
    totalesCotizacion: totalesCotizacion,
    facturas: facturas,
    aniosFacturacion: anios,
    rentabilidad: rentabilidad,
    actas: actas,
    valorizaciones: valorizaciones,
  };
})();
