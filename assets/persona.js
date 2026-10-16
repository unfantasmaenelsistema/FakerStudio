/* FakerStudio · motor de identidades ficticias españolas.
   Sin DOM ni dependencias: funciona igual en el navegador (window.Persona) y en Node (require). */
(function (root) {
  'use strict';

  // ───────────────────────── Generador pseudoaleatorio con semilla ─────────────────────────
  // cyrb128 → mulberry32: la misma semilla produce siempre el mismo lote.
  function hashSeed(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0; i < str.length; i++) {
      const k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
  }
  function makeRng(seed) {
    let a = hashSeed(String(seed));
    const next = function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.int = (min, max) => min + Math.floor(next() * (max - min + 1));
    next.pick = arr => arr[Math.floor(next() * arr.length)];
    next.chance = p => next() < p;
    next.weighted = (items, weightOf) => {
      let total = 0;
      for (const it of items) total += weightOf(it);
      let r = next() * total;
      for (const it of items) { r -= weightOf(it); if (r < 0) return it; }
      return items[items.length - 1];
    };
    return next;
  }
  function randomSeed() {
    const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
    let out = '';
    const buf = new Uint32Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(buf);
    else for (let i = 0; i < 8; i++) buf[i] = Math.floor(Math.random() * 4294967296);
    for (let i = 0; i < 8; i++) out += abc[buf[i] % abc.length];
    return out;
  }

  // ───────────────────────── Datos ─────────────────────────
  // [código INE = prefijo del CP, provincia, comunidad, prefijos de fijo, peso (población aprox. en cientos de miles),
  //  capital, último CP de la capital (se usa XX001…este), [[municipio, CP], …]]
  const PROVINCIAS = [
    ['01', 'Álava', 'País Vasco', ['945'], 3.3, 'Vitoria-Gasteiz', 15, [['Llodio', '01400'], ['Amurrio', '01470']]],
    ['02', 'Albacete', 'Castilla-La Mancha', ['967'], 3.9, 'Albacete', 8, [['Hellín', '02400'], ['Villarrobledo', '02600'], ['Almansa', '02640']]],
    ['03', 'Alicante', 'Comunidad Valenciana', ['965', '966'], 19.5, 'Alicante', 16, [['Elche', '03201'], ['Torrevieja', '03181'], ['Orihuela', '03300'], ['Benidorm', '03501'], ['Alcoy', '03801']]],
    ['04', 'Almería', 'Andalucía', ['950'], 7.4, 'Almería', 9, [['Roquetas de Mar', '04740'], ['El Ejido', '04700']]],
    ['05', 'Ávila', 'Castilla y León', ['920'], 1.6, 'Ávila', 5, [['Arévalo', '05200']]],
    ['06', 'Badajoz', 'Extremadura', ['924'], 6.7, 'Badajoz', 11, [['Mérida', '06800'], ['Don Benito', '06400']]],
    ['07', 'Illes Balears', 'Illes Balears', ['971'], 12.0, 'Palma', 15, [['Ibiza', '07800'], ['Manacor', '07500'], ['Mahón', '07701']]],
    ['08', 'Barcelona', 'Cataluña', ['93'], 58.0, 'Barcelona', 42, [["L'Hospitalet de Llobregat", '08901'], ['Badalona', '08911'], ['Sabadell', '08201'], ['Terrassa', '08221'], ['Mataró', '08301']]],
    ['09', 'Burgos', 'Castilla y León', ['947'], 3.6, 'Burgos', 7, [['Miranda de Ebro', '09200'], ['Aranda de Duero', '09400']]],
    ['10', 'Cáceres', 'Extremadura', ['927'], 3.9, 'Cáceres', 5, [['Plasencia', '10600']]],
    ['11', 'Cádiz', 'Andalucía', ['956'], 12.5, 'Cádiz', 12, [['Jerez de la Frontera', '11401'], ['Algeciras', '11201'], ['San Fernando', '11100']]],
    ['12', 'Castellón', 'Comunidad Valenciana', ['964'], 5.9, 'Castellón de la Plana', 6, [['Vila-real', '12540'], ['Burriana', '12530']]],
    ['13', 'Ciudad Real', 'Castilla-La Mancha', ['926'], 4.9, 'Ciudad Real', 5, [['Puertollano', '13500'], ['Tomelloso', '13700']]],
    ['14', 'Córdoba', 'Andalucía', ['957'], 7.7, 'Córdoba', 14, [['Lucena', '14900'], ['Puente Genil', '14500']]],
    ['15', 'A Coruña', 'Galicia', ['981'], 11.2, 'A Coruña', 11, [['Santiago de Compostela', '15701'], ['Ferrol', '15401']]],
    ['16', 'Cuenca', 'Castilla-La Mancha', ['969'], 2.0, 'Cuenca', 4, [['Tarancón', '16400']]],
    ['17', 'Girona', 'Cataluña', ['972'], 7.9, 'Girona', 7, [['Figueres', '17600'], ['Blanes', '17300']]],
    ['18', 'Granada', 'Andalucía', ['958'], 9.2, 'Granada', 15, [['Motril', '18600'], ['Baza', '18800']]],
    ['19', 'Guadalajara', 'Castilla-La Mancha', ['949'], 2.7, 'Guadalajara', 5, [['Azuqueca de Henares', '19200']]],
    ['20', 'Gipuzkoa', 'País Vasco', ['943'], 7.2, 'Donostia-San Sebastián', 18, [['Irun', '20301'], ['Errenteria', '20100'], ['Eibar', '20600']]],
    ['21', 'Huelva', 'Andalucía', ['959'], 5.3, 'Huelva', 7, [['Lepe', '21440'], ['Almonte', '21730']]],
    ['22', 'Huesca', 'Aragón', ['974'], 2.2, 'Huesca', 6, [['Monzón', '22400'], ['Barbastro', '22300'], ['Jaca', '22700']]],
    ['23', 'Jaén', 'Andalucía', ['953'], 6.2, 'Jaén', 9, [['Linares', '23700'], ['Úbeda', '23400'], ['Andújar', '23740']]],
    ['24', 'León', 'Castilla y León', ['987'], 4.5, 'León', 10, [['Ponferrada', '24400'], ['Astorga', '24700']]],
    ['25', 'Lleida', 'Cataluña', ['973'], 4.4, 'Lleida', 8, [['Tàrrega', '25300'], ['Balaguer', '25600']]],
    ['26', 'La Rioja', 'La Rioja', ['941'], 3.2, 'Logroño', 9, [['Calahorra', '26500'], ['Haro', '26200']]],
    ['27', 'Lugo', 'Galicia', ['982'], 3.3, 'Lugo', 4, [['Monforte de Lemos', '27400'], ['Viveiro', '27850']]],
    ['28', 'Madrid', 'Comunidad de Madrid', ['91'], 69.0, 'Madrid', 55, [['Móstoles', '28931'], ['Alcalá de Henares', '28801'], ['Fuenlabrada', '28941'], ['Getafe', '28901'], ['Leganés', '28911'], ['Alcorcón', '28921']]],
    ['29', 'Málaga', 'Andalucía', ['952'], 17.5, 'Málaga', 18, [['Marbella', '29601'], ['Mijas', '29650'], ['Fuengirola', '29640'], ['Vélez-Málaga', '29700']]],
    ['30', 'Murcia', 'Región de Murcia', ['968'], 15.5, 'Murcia', 12, [['Cartagena', '30201'], ['Lorca', '30800'], ['Molina de Segura', '30500']]],
    ['31', 'Navarra', 'Comunidad Foral de Navarra', ['948'], 6.6, 'Pamplona', 15, [['Tudela', '31500'], ['Estella-Lizarra', '31200']]],
    ['32', 'Ourense', 'Galicia', ['988'], 3.0, 'Ourense', 5, [['Verín', '32600'], ['O Barco de Valdeorras', '32300']]],
    ['33', 'Asturias', 'Principado de Asturias', ['985'], 10.0, 'Oviedo', 13, [['Gijón', '33201'], ['Avilés', '33400'], ['Mieres', '33600']]],
    ['34', 'Palencia', 'Castilla y León', ['979'], 1.6, 'Palencia', 6, [['Guardo', '34880'], ['Aguilar de Campoo', '34800']]],
    ['35', 'Las Palmas', 'Canarias', ['928'], 11.3, 'Las Palmas de Gran Canaria', 19, [['Telde', '35200'], ['Arrecife', '35500'], ['Puerto del Rosario', '35600']]],
    ['36', 'Pontevedra', 'Galicia', ['986'], 9.4, 'Pontevedra', 5, [['Vigo', '36201'], ['Vilagarcía de Arousa', '36600']]],
    ['37', 'Salamanca', 'Castilla y León', ['923'], 3.3, 'Salamanca', 8, [['Béjar', '37700'], ['Ciudad Rodrigo', '37500']]],
    ['38', 'Santa Cruz de Tenerife', 'Canarias', ['922'], 10.5, 'Santa Cruz de Tenerife', 11, [['San Cristóbal de La Laguna', '38201'], ['Arona', '38640'], ['Santa Cruz de La Palma', '38700']]],
    ['39', 'Cantabria', 'Cantabria', ['942'], 5.8, 'Santander', 12, [['Torrelavega', '39300'], ['Castro Urdiales', '39700']]],
    ['40', 'Segovia', 'Castilla y León', ['921'], 1.5, 'Segovia', 6, [['Cuéllar', '40200'], ['El Espinar', '40400']]],
    ['41', 'Sevilla', 'Andalucía', ['954', '955'], 19.5, 'Sevilla', 20, [['Dos Hermanas', '41700'], ['Alcalá de Guadaíra', '41500'], ['Utrera', '41710'], ['Écija', '41400']]],
    ['42', 'Soria', 'Castilla y León', ['975'], 0.9, 'Soria', 5, [['Almazán', '42200'], ['El Burgo de Osma', '42300']]],
    ['43', 'Tarragona', 'Cataluña', ['977'], 8.3, 'Tarragona', 8, [['Reus', '43201'], ['Tortosa', '43500'], ['Cambrils', '43850']]],
    ['44', 'Teruel', 'Aragón', ['978'], 1.3, 'Teruel', 3, [['Alcañiz', '44600'], ['Andorra', '44500']]],
    ['45', 'Toledo', 'Castilla-La Mancha', ['925'], 7.1, 'Toledo', 8, [['Talavera de la Reina', '45600'], ['Illescas', '45200'], ['Torrijos', '45500']]],
    ['46', 'Valencia', 'Comunidad Valenciana', ['961', '962', '963'], 26.0, 'Valencia', 26, [['Torrent', '46900'], ['Gandia', '46700'], ['Paterna', '46980'], ['Sagunto', '46500'], ['Alzira', '46600']]],
    ['47', 'Valladolid', 'Castilla y León', ['983'], 5.2, 'Valladolid', 16, [['Medina del Campo', '47400'], ['Laguna de Duero', '47140']]],
    ['48', 'Bizkaia', 'País Vasco', ['944', '946'], 11.5, 'Bilbao', 15, [['Barakaldo', '48901'], ['Getxo', '48990'], ['Portugalete', '48920'], ['Durango', '48200']]],
    ['49', 'Zamora', 'Castilla y León', ['980'], 1.7, 'Zamora', 8, [['Benavente', '49600'], ['Toro', '49800']]],
    ['50', 'Zaragoza', 'Aragón', ['976'], 9.7, 'Zaragoza', 21, [['Calatayud', '50300'], ['Utebo', '50180'], ['Ejea de los Caballeros', '50600']]],
    ['51', 'Ceuta', 'Ceuta', ['956'], 0.8, 'Ceuta', 5, []],
    ['52', 'Melilla', 'Melilla', ['952'], 0.85, 'Melilla', 6, []],
  ].map(p => ({ ine: p[0], provincia: p[1], comunidad: p[2], fijos: p[3], peso: p[4], capital: p[5], cpMax: p[6], municipios: p[7] }));

  // Nombres más frecuentes por generación (INE), para que el nombre encaje con la edad.
  const NOMBRES = {
    1960: {
      M: ['Antonio', 'José', 'Manuel', 'Francisco', 'Juan', 'Pedro', 'Jesús', 'Ángel', 'Miguel', 'Rafael', 'José Antonio', 'José Luis', 'Ramón', 'Vicente', 'Joaquín', 'Fernando', 'Luis', 'Andrés', 'Enrique', 'Emilio'],
      F: ['María Carmen', 'María', 'Carmen', 'Josefa', 'Isabel', 'Dolores', 'Pilar', 'Teresa', 'Ana María', 'Francisca', 'María Dolores', 'Rosario', 'Antonia', 'Mercedes', 'Concepción', 'Encarnación', 'Rosa María', 'Ángeles', 'Amparo', 'Julia'],
    },
    1980: {
      M: ['José Luis', 'Javier', 'Francisco Javier', 'Carlos', 'José Manuel', 'Juan Carlos', 'Miguel Ángel', 'Jesús', 'Antonio', 'David', 'Alberto', 'Fernando', 'Rafael', 'Luis', 'Óscar', 'Jorge', 'Juan José', 'Pablo', 'Ignacio', 'Ricardo'],
      F: ['María José', 'Ana', 'Cristina', 'Laura', 'Marta', 'Elena', 'Isabel', 'Pilar', 'Mercedes', 'Rosa', 'Susana', 'Beatriz', 'Silvia', 'Raquel', 'Patricia', 'Montserrat', 'Yolanda', 'Nuria', 'Eva', 'Sonia'],
    },
    1995: {
      M: ['David', 'Daniel', 'Alejandro', 'Javier', 'Sergio', 'Pablo', 'Adrián', 'Carlos', 'Jorge', 'Rubén', 'Iván', 'Álvaro', 'Raúl', 'Víctor', 'Alberto', 'Diego', 'Óscar', 'Manuel', 'Mario', 'Roberto'],
      F: ['Laura', 'Cristina', 'María', 'Marta', 'Sara', 'Andrea', 'Ana', 'Lucía', 'Paula', 'Elena', 'Raquel', 'Beatriz', 'Irene', 'Silvia', 'Patricia', 'Sandra', 'Noelia', 'Alba', 'Rocío', 'Verónica'],
    },
    9999: {
      M: ['Alejandro', 'Pablo', 'Daniel', 'Hugo', 'Álvaro', 'Adrián', 'David', 'Javier', 'Diego', 'Mario', 'Sergio', 'Marcos', 'Manuel', 'Iván', 'Carlos', 'Lucas', 'Jorge', 'Martín', 'Izan', 'Rubén'],
      F: ['Lucía', 'María', 'Paula', 'Laura', 'Marta', 'Andrea', 'Alba', 'Sara', 'Claudia', 'Carla', 'Irene', 'Sofía', 'Elena', 'Nerea', 'Ana', 'Julia', 'Daniela', 'Carmen', 'Noa', 'Aitana'],
    },
  };

  // Los 100 apellidos más frecuentes en España (INE).
  const APELLIDOS = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín',
    'Jiménez', 'Hernández', 'Ruiz', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Gutiérrez', 'Alonso',
    'Navarro', 'Torres', 'Domínguez', 'Ramos', 'Vázquez', 'Ramírez', 'Gil', 'Serrano', 'Morales', 'Molina',
    'Blanco', 'Suárez', 'Castro', 'Ortega', 'Delgado', 'Ortiz', 'Marín', 'Rubio', 'Núñez', 'Medina',
    'Sanz', 'Castillo', 'Iglesias', 'Cortés', 'Garrido', 'Santos', 'Guerrero', 'Lozano', 'Cano', 'Cruz',
    'Méndez', 'Flores', 'Prieto', 'Herrera', 'Peña', 'León', 'Márquez', 'Cabrera', 'Gallego', 'Calvo',
    'Vidal', 'Campos', 'Reyes', 'Vega', 'Fuentes', 'Carrasco', 'Díez', 'Aguilar', 'Caballero', 'Nieto',
    'Santana', 'Vargas', 'Pascual', 'Giménez', 'Herrero', 'Hidalgo', 'Montero', 'Lorenzo', 'Santiago', 'Benítez',
    'Durán', 'Ibáñez', 'Arias', 'Mora', 'Ferrer', 'Carmona', 'Vicente', 'Rojas', 'Soto', 'Crespo',
    'Román', 'Pastor', 'Velasco', 'Parra', 'Sáez', 'Moya', 'Bravo', 'Rivera', 'Gallardo', 'Soler'];

  // Países hispanohablantes para quien tiene NIE: así nombre y apellidos siguen siendo coherentes.
  const NACIONALIDADES_NIE = ['Colombia', 'Venezuela', 'Perú', 'Argentina', 'Ecuador', 'Honduras', 'Bolivia', 'Paraguay', 'Cuba', 'México', 'Chile', 'Uruguay'];

  const VIAS = [['Calle', 62], ['Avenida', 14], ['Plaza', 7], ['Paseo', 5], ['Camino', 4], ['Ronda', 3], ['Travesía', 3]];
  const CALLES = ['Mayor', 'Real', 'de la Constitución', 'de Cervantes', 'del Sol', 'de la Paz', 'de San José', 'de Goya', 'de Colón',
    'de la Iglesia', 'Nueva', 'Ancha', 'del Carmen', 'de Antonio Machado', 'de Federico García Lorca', 'de Miguel Hernández',
    'de Ramón y Cajal', 'de la Libertad', 'de España', 'de Europa', 'de los Olivos', 'de las Flores', 'del Pino', 'del Mar',
    'de la Estación', 'del Río', 'de San Francisco', 'de Santa María', 'de la Virgen del Pilar', 'de Benito Pérez Galdós',
    'de Rosalía de Castro', 'de Clara Campoamor', 'de la Ermita', 'de los Almendros', 'del Molino', 'de las Huertas',
    'de Gregorio Marañón', 'de Severo Ochoa', 'de Pablo Picasso', 'de la Hispanidad', 'de Velázquez', 'de Isaac Peral'];

  // [masculino, femenino, edad mínima]
  const PROFESIONES = [
    ['Administrativo', 'Administrativa', 18], ['Auxiliar administrativo', 'Auxiliar administrativa', 18], ['Enfermero', 'Enfermera', 22],
    ['Auxiliar de enfermería', 'Auxiliar de enfermería', 19], ['Médico de familia', 'Médica de familia', 27], ['Profesor de secundaria', 'Profesora de secundaria', 23],
    ['Maestro de primaria', 'Maestra de primaria', 22], ['Técnico de sistemas', 'Técnica de sistemas', 20], ['Desarrollador de software', 'Desarrolladora de software', 20],
    ['Analista de datos', 'Analista de datos', 22], ['Técnico de ciberseguridad', 'Técnica de ciberseguridad', 21], ['Dependiente', 'Dependienta', 18],
    ['Camarero', 'Camarera', 18], ['Cocinero', 'Cocinera', 18], ['Recepcionista', 'Recepcionista', 18], ['Conductor de autobús', 'Conductora de autobús', 24],
    ['Repartidor', 'Repartidora', 18], ['Electricista', 'Electricista', 19], ['Fontanero', 'Fontanera', 19], ['Mecánico de automóviles', 'Mecánica de automóviles', 19],
    ['Contable', 'Contable', 21], ['Abogado', 'Abogada', 24], ['Arquitecto', 'Arquitecta', 25], ['Ingeniero industrial', 'Ingeniera industrial', 24],
    ['Comercial', 'Comercial', 20], ['Policía local', 'Policía local', 21], ['Bombero', 'Bombera', 22], ['Peluquero', 'Peluquera', 18],
    ['Fisioterapeuta', 'Fisioterapeuta', 22], ['Farmacéutico', 'Farmacéutica', 24], ['Periodista', 'Periodista', 22], ['Diseñador gráfico', 'Diseñadora gráfica', 20],
    ['Técnico de prevención de riesgos', 'Técnica de prevención de riesgos', 22], ['Agricultor', 'Agricultora', 18], ['Operario de almacén', 'Operaria de almacén', 18],
    ['Cuidador de personas mayores', 'Cuidadora de personas mayores', 18], ['Funcionario de la Administración', 'Funcionaria de la Administración', 22],
    ['Gestor de proyectos', 'Gestora de proyectos', 26], ['Psicólogo', 'Psicóloga', 24], ['Veterinario', 'Veterinaria', 24], ['Autónomo (hostelería)', 'Autónoma (hostelería)', 22],
  ];

  const DNI_LETRAS = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const DOMINIOS = ['example.com', 'example.org', 'example.net']; // reservados (RFC 2606): nunca son buzones reales

  // ───────────────────────── Documentos ─────────────────────────
  function letraDNI(num) { return DNI_LETRAS[Number(num) % 23]; }
  function dni(rng) {
    const n = String(rng.int(10000000, 79999999));
    return n + letraDNI(n);
  }
  function nie(rng) {
    const pre = rng.weighted(['X', 'Y', 'Z'], l => ({ X: 3, Y: 5, Z: 2 })[l]);
    const n = String(rng.int(0, 9999999)).padStart(7, '0');
    return pre + n + letraDNI('XYZ'.indexOf(pre) + n);
  }
  // Devuelve { ok, tipo, motivo, esperado } para DNI, NIE o CIF.
  function validar(doc) {
    const s = String(doc || '').toUpperCase().replace(/[\s.\-]/g, '');
    if (/^\d{8}[A-Z]$/.test(s)) {
      const e = letraDNI(s.slice(0, 8));
      return { ok: e === s[8], tipo: 'DNI', esperado: s.slice(0, 8) + e };
    }
    if (/^[XYZ]\d{7}[A-Z]$/.test(s)) {
      const e = letraDNI('XYZ'.indexOf(s[0]) + s.slice(1, 8));
      return { ok: e === s[8], tipo: 'NIE', esperado: s.slice(0, 8) + e };
    }
    if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(s)) {
      const d = s.slice(1, 8);
      let sum = 0;
      for (let i = 0; i < 7; i++) {
        const v = Number(d[i]);
        if (i % 2 === 0) { const x = v * 2; sum += Math.floor(x / 10) + (x % 10); } else sum += v;
      }
      const c = (10 - (sum % 10)) % 10;
      const letra = 'JABCDEFGHI'[c];
      const soloLetra = 'NPQRSW'.includes(s[0]);
      const soloDigito = 'ABEH'.includes(s[0]);
      const last = s[8];
      const ok = soloLetra ? last === letra : soloDigito ? last === String(c) : (last === letra || last === String(c));
      return { ok, tipo: 'CIF', esperado: s.slice(0, 8) + (soloLetra ? letra : String(c)) };
    }
    return { ok: false, tipo: null, esperado: null };
  }

  // ───────────────────────── Piezas ─────────────────────────
  function sinAcentos(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function slugNombre(s) { return sinAcentos(s).toLowerCase().replace(/[^a-z0-9]+/g, ''); }

  function cohorte(anio) { return anio < 1960 ? 1960 : anio < 1980 ? 1980 : anio < 1995 ? 1995 : 9999; }

  function fechaNacimiento(rng, edadMin, edadMax, hoy) {
    // Intervalo exacto: quien tiene edadMax años nació hace entre edadMax+1 años (+1 día) y edadMax años.
    const hasta = new Date(hoy.getFullYear() - edadMin, hoy.getMonth(), hoy.getDate());
    const desde = new Date(hoy.getFullYear() - edadMax - 1, hoy.getMonth(), hoy.getDate() + 1);
    const dias = Math.round((hasta - desde) / 86400000);
    const d = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate() + rng.int(0, dias));
    return d;
  }
  function edadEn(nac, hoy) {
    let e = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) e--;
    return e;
  }
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function movil(rng) {
    // 6XX XX XX XX (la mayoría) o 71X–74X, los rangos móviles que se asignan hoy.
    const n = rng.chance(0.85) ? '6' + String(rng.int(0, 99999999)).padStart(8, '0') : '7' + rng.int(1, 4) + String(rng.int(0, 9999999)).padStart(7, '0');
    return n;
  }
  function fijo(rng, prov) {
    const pre = rng.pick(prov.fijos);
    // Tras el prefijo de dos cifras (91, 93) el número de abonado no empieza por 0 ni 1.
    let n = pre + (pre.length === 2 ? rng.int(2, 9) : '');
    while (n.length < 9) n += rng.int(0, 9);
    return n;
  }
  function formatoTelefono(n) {
    if (/^(91|93)\d{7}$/.test(n)) return n.replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
    return n.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
  }

  function direccion(rng, prov) {
    let municipio, cp;
    if (!prov.municipios.length || rng.chance(0.55)) {
      municipio = prov.capital;
      cp = prov.ine + String(rng.int(1, prov.cpMax)).padStart(3, '0');
    } else {
      [municipio, cp] = rng.pick(prov.municipios);
    }
    const tipo = rng.weighted(VIAS, v => v[1])[0];
    const nombre = rng.pick(CALLES);
    const numero = rng.chance(0.08) ? 's/n' : String(rng.int(1, rng.chance(0.7) ? 60 : 220));
    let piso = '';
    if (municipio === prov.capital ? rng.chance(0.85) : rng.chance(0.55)) {
      const planta = rng.chance(0.1) ? 'Bajo' : rng.int(1, 9) + '.º';
      piso = planta + ' ' + rng.pick(['A', 'B', 'C', 'D', 'A', 'B', '1.ª', '2.ª', 'Izda.', 'Dcha.']);
    }
    const via = `${tipo} ${nombre}, ${numero}${piso ? ', ' + piso : ''}`;
    return { via, cp, municipio, provincia: prov.provincia, comunidad: prov.comunidad };
  }

  function profesion(rng, sexo, edad) {
    if (edad >= 67 && rng.chance(0.85)) return sexo === 'F' ? 'Jubilada' : 'Jubilado';
    if (edad <= 22 && rng.chance(0.65)) return 'Estudiante';
    if (rng.chance(0.06)) return sexo === 'F' ? 'Desempleada' : 'Desempleado';
    const p = rng.pick(PROFESIONES.filter(x => x[2] <= edad));
    return sexo === 'F' ? p[1] : p[0];
  }

  function correo(rng, nombre, ap1, ap2, anio) {
    const n = slugNombre(nombre.split(' ')[0]), a1 = slugNombre(ap1), a2 = slugNombre(ap2);
    const dom = rng.pick(DOMINIOS);
    const forma = rng.int(0, 4);
    const local = [
      `${n}.${a1}`,
      `${n}.${a1}${rng.int(1, 99)}`,
      `${n[0]}${a1}${a2[0]}`,
      `${n}_${a1}${String(anio).slice(2)}`,
      `${n}${a1}.${a2}`,
    ][forma];
    return local + '@' + dom;
  }
  function usuario(rng, nombre, ap1, anio) {
    const n = slugNombre(nombre.split(' ')[0]), a1 = slugNombre(ap1);
    return [`${n}${a1}`, `${n}_${a1.slice(0, 4)}${rng.int(1, 999)}`, `${n[0]}${a1}${String(anio).slice(2)}`, `${a1}.${n}`][rng.int(0, 3)];
  }

  const COLORES = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#ffb74d', '#ff8a65', '#a1887f', '#90a4ae'];

  // ───────────────────────── Persona completa ─────────────────────────
  /* opts: { edadMin, edadMax, sexo: 'any'|'M'|'F', documento: 'DNI'|'NIE'|'mix', provincia: código INE o 'any', hoy: Date } */
  function persona(rng, opts) {
    opts = opts || {};
    const hoy = opts.hoy || new Date();
    const edadMin = Math.max(0, Math.min(Number(opts.edadMin) || 18, 110));
    const edadMax = Math.max(edadMin, Math.min(Number(opts.edadMax) || 75, 110));
    const sexo = opts.sexo === 'M' || opts.sexo === 'F' ? opts.sexo : (rng.chance(0.5) ? 'F' : 'M');
    const prov = opts.provincia && opts.provincia !== 'any' ? (PROVINCIAS.find(p => p.ine === opts.provincia) || PROVINCIAS[27]) : rng.weighted(PROVINCIAS, p => p.peso);
    const nac = fechaNacimiento(rng, edadMin, edadMax, hoy);
    const edad = edadEn(nac, hoy);
    const nombre = rng.pick(NOMBRES[cohorte(nac.getFullYear())][sexo]);
    const ap1 = rng.pick(APELLIDOS);
    let ap2 = rng.pick(APELLIDOS);
    if (ap2 === ap1 && rng.chance(0.9)) ap2 = rng.pick(APELLIDOS);
    const tipoDoc = opts.documento === 'NIE' ? 'NIE' : opts.documento === 'mix' ? (rng.chance(0.13) ? 'NIE' : 'DNI') : 'DNI';
    const doc = tipoDoc === 'NIE' ? nie(rng) : dni(rng);
    const dir = direccion(rng, prov);
    const tel = movil(rng);
    const telFijo = rng.chance(0.45) ? fijo(rng, prov) : '';
    const iniciales = (nombre[0] + ap1[0]).toUpperCase();
    return {
      sexo,
      nombre,
      apellido1: ap1,
      apellido2: ap2,
      nombreCompleto: `${nombre} ${ap1} ${ap2}`,
      documentoTipo: tipoDoc,
      documento: doc,
      nacionalidad: tipoDoc === 'NIE' ? rng.pick(NACIONALIDADES_NIE) : 'España',
      fechaNacimiento: iso(nac),
      edad,
      email: correo(rng, nombre, ap1, ap2, nac.getFullYear()),
      usuario: usuario(rng, nombre, ap1, nac.getFullYear()),
      movil: formatoTelefono(tel),
      fijo: telFijo ? formatoTelefono(telFijo) : '',
      direccion: dir.via,
      cp: dir.cp,
      municipio: dir.municipio,
      provincia: dir.provincia,
      comunidad: dir.comunidad,
      profesion: profesion(rng, sexo, edad),
      iniciales,
      color: rng.pick(COLORES),
    };
  }

  // ───────────────────────── Avatar ilustrado (Open Peeps vía DiceBear) ─────────────────────────
  // Solo elige las piezas; quien dibuja es DiceBear. Sale de un generador propio a partir de la
  // persona, así que no altera la secuencia del lote y la misma semilla da siempre el mismo dibujo.
  const PEINADOS = {
    F: ['bangs', 'bangs2', 'bun', 'bun2', 'buns', 'long', 'longBangs', 'longCurly', 'medium1', 'medium2', 'medium3', 'mediumBangs', 'mediumBangs2', 'mediumBangs3', 'mediumStraight', 'afro', 'short3'],
    M: ['flatTop', 'short1', 'short2', 'short3', 'short4', 'short5', 'pomp', 'shaved1', 'shaved2', 'twists2', 'grayShort', 'hatBeanie'],
    Fmayor: ['grayBun', 'grayMedium', 'short3', 'medium1', 'bangs', 'bun'],
    Mmayor: ['grayShort', 'short1', 'short2', 'noHair1', 'noHair2', 'noHair3'],
  };
  // Solo estos peinados admiten color de pelo (el resto va siempre en negro), así que las canas salen de aquí.
  // noHair1 y noHair2 son calvos: valen para cualquier edad avanzada.
  const CANOSOS = { F: ['grayBun', 'grayMedium', 'bangs', 'mediumBangs2'], M: ['grayShort', 'short4', 'noHair3', 'noHair1', 'noHair2'] };
  const PELO = ['2c1b18', '2c1b18', '4a312c', '4a312c', '724133', 'a55728', 'b58143', 'd6b370', 'c93305'];
  const CANAS = ['e8e1e1', 'ecdcbf'];
  const PIEL = [['ffdbb4', 38], ['edb98a', 40], ['d08b5b', 15], ['ae5d29', 4], ['694d3d', 3]];
  const PIEL_NIE = [['ffdbb4', 15], ['edb98a', 35], ['d08b5b', 30], ['ae5d29', 12], ['694d3d', 8]];
  const CARAS = ['smile', 'calm', 'cute', 'serious', 'smileBig', 'explaining', 'solemn', 'driven'];
  const GAFAS = ['glasses', 'glasses2', 'glasses3', 'glasses4', 'glasses5'];

  function avatarSpec(p) {
    const r = makeRng('avatar|' + p.documento + '|' + p.nombreCompleto);
    const mayor = p.edad >= 62;
    const canas = mayor ? r.chance(0.85) : p.edad >= 48 ? r.chance(0.35) : false;
    const lista = canas ? CANOSOS[p.sexo] : PEINADOS[p.sexo + (mayor ? 'mayor' : '')];
    // Con canas no hay barba: casi todas las barbas de Open Peeps se dibujan en un color fijo oscuro.
    const barba = !canas && p.sexo === 'M' && p.edad >= 20 && r.chance(p.edad >= 30 ? 0.35 : 0.2);
    const gafas = r.chance(p.edad >= 45 ? 0.5 : 0.15);
    return {
      seed: p.documento,
      head: [r.pick(lista)],
      headContrastColor: [canas ? r.pick(CANAS) : r.pick(PELO)],
      skinColor: [r.weighted(p.documentoTipo === 'NIE' ? PIEL_NIE : PIEL, x => x[1])[0]],
      face: [mayor && r.chance(0.4) ? 'old' : r.pick(CARAS)],
      facialHair: barba ? [r.pick(['chin', 'full', 'full2', 'full3', 'full4', 'goatee1', 'goatee2', 'moustache1', 'moustache2', 'moustache3', 'moustache7'])] : [],
      facialHairProbability: barba ? 100 : 0,
      accessories: gafas ? [r.pick(GAFAS)] : [],
      accessoriesProbability: gafas ? 100 : 0,
      maskProbability: 0,
      backgroundColor: [p.color.replace('#', '')],
    };
  }

  function lote(seed, n, opts) {
    const rng = makeRng(seed);
    const out = [];
    for (let i = 0; i < n; i++) out.push(persona(rng, opts));
    return out;
  }

  // ───────────────────────── Exportación ─────────────────────────
  const CAMPOS = ['nombre', 'apellido1', 'apellido2', 'sexo', 'documentoTipo', 'documento', 'nacionalidad', 'fechaNacimiento', 'edad',
    'email', 'usuario', 'movil', 'fijo', 'direccion', 'cp', 'municipio', 'provincia', 'comunidad', 'profesion'];

  function aCSV(lista) {
    const q = v => {
      const s = String(v == null ? '' : v);
      // Evita la inyección de fórmulas al abrir el CSV en Excel o LibreOffice.
      const safe = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
      return /[";\n\r]/.test(safe) ? '"' + safe.replace(/"/g, '""') + '"' : safe;
    };
    return '﻿' + [CAMPOS.join(';')].concat(lista.map(p => CAMPOS.map(c => q(p[c])).join(';'))).join('\r\n') + '\r\n';
  }
  function aJSON(lista) { return JSON.stringify(lista.map(p => { const o = {}; CAMPOS.forEach(c => { o[c] = p[c]; }); return o; }), null, 2); }
  function aSQL(lista, tabla) {
    tabla = /^[A-Za-z_][A-Za-z0-9_]*$/.test(tabla || '') ? tabla : 'personas';
    const v = x => (typeof x === 'number' ? String(x) : "'" + String(x == null ? '' : x).replace(/'/g, "''") + "'");
    const cols = CAMPOS.map(c => c.replace(/[A-Z]/g, m => '_' + m.toLowerCase()));
    const tipos = { edad: 'SMALLINT', fecha_nacimiento: 'DATE', sexo: 'CHAR(1)', cp: 'CHAR(5)' };
    const create = `CREATE TABLE IF NOT EXISTS ${tabla} (\n  id INTEGER PRIMARY KEY,\n` + cols.map(c => `  ${c} ${tipos[c] || 'VARCHAR(120)'}`).join(',\n') + '\n);\n\n';
    return create + lista.map((p, i) => `INSERT INTO ${tabla} (id, ${cols.join(', ')}) VALUES (${i + 1}, ${CAMPOS.map(c => v(p[c])).join(', ')});`).join('\n') + '\n';
  }

  const api = { makeRng, randomSeed, persona, lote, avatarSpec, validar, letraDNI, PROVINCIAS, APELLIDOS, NOMBRES, CAMPOS, aCSV, aJSON, aSQL, formatoTelefono };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Persona = api;
})(typeof window !== 'undefined' ? window : this);
