/* FakerStudio · simulador de chat de mensajería */
(function () {
  'use strict';
  const { t, esc, store, toast, download } = FS;
  const $ = id => document.getElementById(id);

  FS.addI18n({
    es: {
      'ch.title': 'Chat ficticio',
      'ch.warnT': 'Solo para formación, humor o arte.',
      'ch.warnD': 'Las capturas llevan la marca «FICTICIO» para que nadie las tome por reales. No las uses para engañar, acosar ni suplantar a nadie: además de hacer daño, puede ser delito.',
      'ch.tpl': 'Plantillas', 'ch.tplLoad': 'Cargar', 'ch.tplConfirm': '¿Sustituir la conversación actual por la plantilla?',
      'ch.contact': 'Contacto', 'ch.groupOn': 'Es un grupo', 'ch.cName': 'Nombre o número', 'ch.gName': 'Nombre del grupo',
      'ch.cStatus': 'Estado o última conexión', 'ch.members': 'Participantes (separados por comas)',
      'ch.avatar': 'Foto', 'ch.avatarUp': 'Subir foto', 'ch.avatarInit': 'Iniciales', 'ch.avatarNone': 'Sin foto', 'ch.avatarBad': 'No se pudo leer la imagen',
      'ch.fromPersona': '↗ Generar un contacto ficticio',
      'ch.aiFace': 'Conseguir una cara generada por IA ↗',
      'ch.aiFaceHelp': 'Se abre en otra pestaña una cara inventada: guárdala (clic derecho → «Guardar imagen como…») y súbela con «Subir foto». Esa web no es nuestra y puede cambiar o dejar de funcionar.',
      'ch.messages': 'Mensajes', 'ch.tIn': '← Recibido', 'ch.tOut': 'Enviado →', 'ch.tDate': 'Fecha', 'ch.tSys': 'Aviso',
      'ch.sender': 'Quién lo escribe', 'ch.text': 'Texto', 'ch.textDate': 'Texto del separador (p. ej. HOY, AYER, 12 DE MARZO)', 'ch.textSys': 'Texto del aviso',
      'ch.time': 'Hora', 'ch.status': 'Estado', 'ch.sSent': '✓ Enviado', 'ch.sDelivered': '✓✓ Entregado', 'ch.sRead': '✓✓ Leído (azul)',
      'ch.add': 'Añadir', 'ch.save': 'Guardar cambios', 'ch.cancel': 'Cancelar', 'ch.empty': 'Escribe el texto del mensaje.',
      'ch.textHelp': 'Ctrl+Intro añade el mensaje. Los saltos de línea se respetan.',
      'ch.noMsgs': 'Todavía no hay mensajes.', 'ch.count': '{n}',
      'ch.up': 'Subir', 'ch.down': 'Bajar', 'ch.edit': 'Editar', 'ch.dup': 'Duplicar', 'ch.del': 'Borrar',
      'ch.whoIn': 'RECIBIDO', 'ch.whoOut': 'ENVIADO', 'ch.whoDate': 'FECHA', 'ch.whoSys': 'AVISO',
      'ch.phone': 'Teléfono y aspecto', 'ch.pTime': 'Hora', 'ch.pBattery': 'Batería %', 'ch.pSignal': 'Cobertura', 'ch.pWifi': 'Wi-Fi conectado',
      'ch.waTheme': 'Tema del chat', 'ch.dark': 'Oscuro', 'ch.light': 'Claro', 'ch.pInput': 'Texto de la barra de escritura',
      'ch.file': 'Guardar y cargar', 'ch.saveJson': 'Guardar conversación (.json)', 'ch.loadJson': 'Abrir .json', 'ch.clear': 'Vaciar',
      'ch.clearConfirm': '¿Borrar todos los mensajes?', 'ch.loaded': 'Conversación cargada', 'ch.badJson': 'Ese archivo no es una conversación de FakerStudio válida.',
      'ch.autosave': 'Todo se guarda solo en este navegador mientras editas.',
      'ch.preview': 'Vista previa (así saldrá la imagen)', 'ch.png': 'Descargar PNG', 'ch.copyImg': 'Copiar imagen',
      'ch.pngHelp': 'Se exporta a triple resolución. La marca «FICTICIO» forma parte de la imagen.',
      'ch.rendering': 'Generando imagen…', 'ch.pngOk': 'Imagen descargada', 'ch.copyOk': 'Imagen copiada al portapapeles',
      'ch.copyNo': 'Tu navegador no deja copiar imágenes: usa «Descargar PNG».', 'ch.pngFail': 'No se pudo generar la imagen. Recarga la página e inténtalo de nuevo.',
      'ch.noLib': 'No se ha podido cargar el generador de imágenes (html2canvas). Revisa tu conexión o el bloqueador de contenido.',
      'ch.contactIn': 'Contacto cargado desde Identidades',
      'wa.online': 'en línea', 'wa.typeMsg': 'Mensaje', 'wa.you': 'Tú', 'wa.mark': 'FICTICIO', 'wa.markFoot': 'CAPTURA FICTICIA · UNFANTASMAENELSISTEMA.COM',
      'wa.today': 'HOY', 'wa.e2e': '🔒 Los mensajes y las llamadas están cifrados de extremo a extremo. Nadie fuera de este chat puede leerlos ni escucharlos.',
      'wa.groupSub': 'toca para ver la información del grupo',
    },
    en: {
      'ch.title': 'Fictitious chat',
      'ch.warnT': 'For training, humour or art only.',
      'ch.warnD': 'Screenshots carry a “FICTITIOUS” mark so nobody takes them for real. Do not use them to deceive, harass or impersonate anyone: besides the harm, it may be a crime.',
      'ch.tpl': 'Templates', 'ch.tplLoad': 'Load', 'ch.tplConfirm': 'Replace the current conversation with the template?',
      'ch.contact': 'Contact', 'ch.groupOn': 'It is a group', 'ch.cName': 'Name or number', 'ch.gName': 'Group name',
      'ch.cStatus': 'Status or last seen', 'ch.members': 'Members (comma separated)',
      'ch.avatar': 'Photo', 'ch.avatarUp': 'Upload photo', 'ch.avatarInit': 'Initials', 'ch.avatarNone': 'No photo', 'ch.avatarBad': 'Could not read the image',
      'ch.fromPersona': '↗ Generate a fictitious contact',
      'ch.aiFace': 'Get an AI-generated face ↗',
      'ch.aiFaceHelp': 'A made-up face opens in another tab: save it (right click → “Save image as…”) and upload it with “Upload photo”. That site is not ours and may change or stop working.',
      'ch.messages': 'Messages', 'ch.tIn': '← Received', 'ch.tOut': 'Sent →', 'ch.tDate': 'Date', 'ch.tSys': 'Notice',
      'ch.sender': 'Who writes it', 'ch.text': 'Text', 'ch.textDate': 'Separator text (e.g. TODAY, YESTERDAY, 12 MARCH)', 'ch.textSys': 'Notice text',
      'ch.time': 'Time', 'ch.status': 'Status', 'ch.sSent': '✓ Sent', 'ch.sDelivered': '✓✓ Delivered', 'ch.sRead': '✓✓ Read (blue)',
      'ch.add': 'Add', 'ch.save': 'Save changes', 'ch.cancel': 'Cancel', 'ch.empty': 'Type the message text.',
      'ch.textHelp': 'Ctrl+Enter adds the message. Line breaks are kept.',
      'ch.noMsgs': 'No messages yet.', 'ch.count': '{n}',
      'ch.up': 'Move up', 'ch.down': 'Move down', 'ch.edit': 'Edit', 'ch.dup': 'Duplicate', 'ch.del': 'Delete',
      'ch.whoIn': 'IN', 'ch.whoOut': 'OUT', 'ch.whoDate': 'DATE', 'ch.whoSys': 'NOTICE',
      'ch.phone': 'Phone and look', 'ch.pTime': 'Time', 'ch.pBattery': 'Battery %', 'ch.pSignal': 'Signal', 'ch.pWifi': 'Wi-Fi connected',
      'ch.waTheme': 'Chat theme', 'ch.dark': 'Dark', 'ch.light': 'Light', 'ch.pInput': 'Typing bar text',
      'ch.file': 'Save and load', 'ch.saveJson': 'Save conversation (.json)', 'ch.loadJson': 'Open .json', 'ch.clear': 'Clear',
      'ch.clearConfirm': 'Delete all messages?', 'ch.loaded': 'Conversation loaded', 'ch.badJson': 'That file is not a valid FakerStudio conversation.',
      'ch.autosave': 'Everything is saved in this browser only while you edit.',
      'ch.preview': 'Preview (this is how the image will look)', 'ch.png': 'Download PNG', 'ch.copyImg': 'Copy image',
      'ch.pngHelp': 'Exported at triple resolution. The “FICTITIOUS” mark is part of the image.',
      'ch.rendering': 'Rendering image…', 'ch.pngOk': 'Image downloaded', 'ch.copyOk': 'Image copied to clipboard',
      'ch.copyNo': 'Your browser does not allow copying images: use “Download PNG”.', 'ch.pngFail': 'Could not render the image. Reload the page and try again.',
      'ch.noLib': 'The image renderer (html2canvas) could not be loaded. Check your connection or content blocker.',
      'ch.contactIn': 'Contact loaded from Identities',
      'wa.online': 'online', 'wa.typeMsg': 'Message', 'wa.you': 'You', 'wa.mark': 'FICTITIOUS', 'wa.markFoot': 'FICTITIOUS SCREENSHOT · UNFANTASMAENELSISTEMA.COM',
      'wa.today': 'TODAY', 'wa.e2e': '🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.',
      'wa.groupSub': 'tap here for group info',
    },
  });

  // ───────────────────────── Plantillas ─────────────────────────
  // Las de estafas reproducen esquemas públicos y muy conocidos (INCIBE / OSI) para practicar cómo detectarlos.
  const TEMPLATES = {
    casual: {
      es: { label: 'Charla entre amigos', hint: 'Una conversación corriente para empezar.' },
      en: { label: 'Chat between friends', hint: 'An everyday conversation to start with.' },
      build: L => ({
        contact: { name: L === 'es' ? 'Marta' : 'Martha', status: t('wa.online'), avatar: 'initials' },
        group: { on: false },
        messages: L === 'es' ? [
          ['date', 'HOY'], ['in', '¡Hola! ¿Qué tal el examen? 😊', '17:02'], ['out', 'Mejor de lo que esperaba 🙌', '17:04', 'read'],
          ['out', 'La parte de redes me salió bastante bien', '17:04', 'read'], ['in', '¡Genial! ¿Lo celebramos esta tarde?', '17:05'],
          ['in', '¿A las 8 en la plaza?', '17:05'], ['out', 'Hecho, allí nos vemos 👍', '17:07', 'delivered'],
        ] : [
          ['date', 'TODAY'], ['in', 'Hi! How did the exam go? 😊', '17:02'], ['out', 'Better than I expected 🙌', '17:04', 'read'],
          ['out', 'The networking part went pretty well', '17:04', 'read'], ['in', 'Great! Shall we celebrate this evening?', '17:05'],
          ['in', '8 pm at the square?', '17:05'], ['out', 'Deal, see you there 👍', '17:07', 'delivered'],
        ],
      }),
    },
    son: {
      es: { label: 'Estafa «hijo en apuros» (didáctica)', hint: 'Señales: número nuevo, prisa, dinero, «no me llames». Úsala para enseñar a detectarla.' },
      en: { label: '“Child in trouble” scam (training)', hint: 'Red flags: new number, urgency, money, “don’t call me”. Use it to teach how to spot it.' },
      build: L => ({
        contact: { name: '+34 611 20 47 93', status: t('wa.online'), avatar: 'none' },
        group: { on: false },
        messages: L === 'es' ? [
          ['system', t('wa.e2e')], ['date', 'HOY'],
          ['in', 'Hola mamá, se me ha caído el móvil al agua y este es mi número nuevo 😥', '10:41'],
          ['in', 'Guárdalo y borra el otro', '10:41'],
          ['out', '¿Hijo? ¿Estás bien? ¿Qué ha pasado?', '10:44', 'read'],
          ['in', 'Sí sí, todo bien. Pero tengo que pagar una factura hoy y desde el móvil nuevo no puedo entrar al banco', '10:45'],
          ['in', '¿Me la puedes pagar tú? Te lo devuelvo mañana sin falta 🙏', '10:45'],
          ['out', '¿Cuánto es?', '10:47', 'read'],
          ['in', '1.480 €. Es urgente, que si no me cobran recargo. Te paso ahora el número de cuenta', '10:47'],
          ['in', 'No me llames que el micro de este móvil no funciona', '10:48'],
        ] : [
          ['system', t('wa.e2e')], ['date', 'TODAY'],
          ['in', 'Hi mum, I dropped my phone in the water and this is my new number 😥', '10:41'],
          ['in', 'Save it and delete the old one', '10:41'],
          ['out', 'Is that you? Are you OK? What happened?', '10:44', 'read'],
          ['in', 'Yes yes, all fine. But I have to pay a bill today and I can’t log into my bank from the new phone', '10:45'],
          ['in', 'Could you pay it for me? I’ll pay you back tomorrow 🙏', '10:45'],
          ['out', 'How much is it?', '10:47', 'read'],
          ['in', '€1,480. It’s urgent or they’ll charge me a fee. I’ll send you the account number now', '10:47'],
          ['in', 'Don’t call me, the mic on this phone doesn’t work', '10:48'],
        ],
      }),
    },
    parcel: {
      es: { label: 'Falso aviso de paquete (didáctica)', hint: 'Señales: remitente desconocido, enlace que no es oficial, pago pequeño y urgente.' },
      en: { label: 'Fake parcel notice (training)', hint: 'Red flags: unknown sender, unofficial link, small urgent payment.' },
      build: L => ({
        contact: { name: '+34 722 05 18 64', status: '', avatar: 'none' },
        group: { on: false },
        messages: L === 'es' ? [
          ['date', 'HOY'],
          ['in', 'AVISO: Su paquete n.º ES2381774 está retenido en nuestro centro por falta de franqueo (1,99 €).', '09:12'],
          ['in', 'Si no lo abona en 24 h será devuelto al remitente.\nPague aquí: https://entregas-paqueteria.example.com/pago', '09:12'],
          ['out', '¿Qué paquete? No espero nada', '09:30', 'read'],
          ['in', 'Puede consultar los datos del envío en el enlace. Gracias por su colaboración.', '09:31'],
        ] : [
          ['date', 'TODAY'],
          ['in', 'NOTICE: Your parcel no. ES2381774 is held at our depot due to unpaid postage (€1.99).', '09:12'],
          ['in', 'If not paid within 24 h it will be returned to the sender.\nPay here: https://parcel-delivery.example.com/pay', '09:12'],
          ['out', 'What parcel? I’m not expecting anything', '09:30', 'read'],
          ['in', 'You can check the shipment details at the link. Thank you for your cooperation.', '09:31'],
        ],
      }),
    },
    group: {
      es: { label: 'Grupo de clase', hint: 'Ejemplo de grupo con varios participantes.' },
      en: { label: 'Class group', hint: 'Group example with several members.' },
      build: L => ({
        contact: { name: L === 'es' ? 'Clase 1.º SMR 💻' : 'Class 1A IT 💻', status: '', avatar: 'initials' },
        group: { on: true, members: L === 'es' ? 'Lucía, Hugo, Profe Ana' : 'Lucy, Hugo, Ms Ana' },
        messages: L === 'es' ? [
          ['date', 'HOY'], ['in', 'Recordad que mañana es la práctica de subredes 📚', '19:20', '', 'Profe Ana'],
          ['in', '¿Hay que llevar el portátil?', '19:22', '', 'Hugo'], ['in', 'Sí, con Packet Tracer instalado', '19:23', '', 'Profe Ana'],
          ['in', 'Yo no lo tengo todavía 😅', '19:25', '', 'Lucía'], ['out', 'Os paso el enlace de descarga oficial en un momento', '19:26', 'read'],
        ] : [
          ['date', 'TODAY'], ['in', 'Remember tomorrow is the subnetting lab 📚', '19:20', '', 'Ms Ana'],
          ['in', 'Do we need our laptops?', '19:22', '', 'Hugo'], ['in', 'Yes, with Packet Tracer installed', '19:23', '', 'Ms Ana'],
          ['in', 'I haven’t got it yet 😅', '19:25', '', 'Lucy'], ['out', 'I’ll share the official download link in a minute', '19:26', 'read'],
        ],
      }),
    },
  };

  // ───────────────────────── Estado ─────────────────────────
  const COLORS = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4dd0e1', '#4db6ac', '#81c784', '#ffb74d', '#ff8a65', '#a1887f'];
  const SENDER_COLORS = { dark: ['#53bdeb', '#fc9775', '#a5b337', '#e542a3', '#06cf9c', '#ffbc38', '#d88deb', '#25d366'], light: ['#1f7aec', '#c4532d', '#7a8100', '#c2185b', '#00897b', '#b26500', '#8e44ad', '#028a3f'] };
  let uid = 1;
  const newId = () => 'm' + Date.now().toString(36) + (uid++);

  function defaults() {
    return {
      v: 1,
      contact: { name: 'María García', status: t('wa.online'), avatar: null, avatarMode: 'initials', color: '#64b5f6' },
      group: { on: false, members: 'Ana, Luis' },
      phone: { time: '12:34', battery: 87, signal: 4, wifi: true },
      waTheme: 'dark',
      inputText: t('wa.typeMsg'),
      messages: TEMPLATES.casual.build(FS.lang()).messages.map(toMsg),
    };
  }
  function toMsg(a) { return { id: newId(), type: a[0], text: a[1], time: a[2] || '', status: a[3] || 'read', sender: a[4] || '' }; }

  const str = (v, max) => String(v == null ? '' : v).slice(0, max);
  const isTime = v => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
  const IMG_RE = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

  // Normaliza cualquier estado (guardado o importado) a la forma esperada; lo que no encaja se descarta.
  function normalize(s) {
    const d = defaults();
    if (!s || typeof s !== 'object') return d;
    const c = s.contact || {};
    const out = {
      v: 1,
      contact: {
        name: str(c.name, 60), status: str(c.status, 60),
        avatar: typeof c.avatar === 'string' && IMG_RE.test(c.avatar) && c.avatar.length < 600000 ? c.avatar : null,
        avatarMode: ['photo', 'initials', 'none'].includes(c.avatarMode) ? c.avatarMode : 'initials',
        color: /^#[0-9a-f]{6}$/i.test(c.color || '') ? c.color : d.contact.color,
      },
      group: { on: !!(s.group && s.group.on), members: str(s.group && s.group.members, 200) },
      phone: {
        time: isTime(s.phone && s.phone.time) ? s.phone.time : d.phone.time,
        battery: Math.min(100, Math.max(1, Math.round(Number(s.phone && s.phone.battery)) || d.phone.battery)),
        signal: [1, 2, 3, 4].includes(Number(s.phone && s.phone.signal)) ? Number(s.phone.signal) : 4,
        wifi: !(s.phone && s.phone.wifi === false),
      },
      waTheme: s.waTheme === 'light' ? 'light' : 'dark',
      inputText: str(s.inputText != null ? s.inputText : d.inputText, 60),
      messages: [],
    };
    if (out.contact.avatarMode === 'photo' && !out.contact.avatar) out.contact.avatarMode = 'initials';
    if (Array.isArray(s.messages)) {
      for (const m of s.messages.slice(0, 300)) {
        if (!m || !['in', 'out', 'date', 'system'].includes(m.type)) continue;
        out.messages.push({
          id: newId(), type: m.type, text: str(m.text, 2000),
          time: isTime(m.time) ? m.time : '', status: ['sent', 'delivered', 'read'].includes(m.status) ? m.status : 'read',
          sender: str(m.sender, 40),
        });
      }
    }
    return out;
  }

  let S = store.json('chat', null) ? normalize(store.json('chat', null)) : defaults();
  let msgType = 'in';
  let editingId = null;

  let saveTimer;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (!store.setJson('chat', S)) {
        // Si la foto no cabe en el almacenamiento, se guarda el resto.
        store.setJson('chat', Object.assign({}, S, { contact: Object.assign({}, S.contact, { avatar: null, avatarMode: 'initials' }) }));
      }
    }, 250);
  }

  // ───────────────────────── Iconos (Material Icons, Apache 2.0) ─────────────────────────
  const P = {
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    video: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
    call: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    mic: 'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
    attach: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
    camera: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    emoji: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
    wifi: 'M12 21.5 23.64 7C23.19 6.66 18.71 3 12 3 5.28 3 .81 6.66.36 7L12 21.5z',
    person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    group: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    checks: 'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z',
  };
  // Los colores van como atributo literal: html2canvas serializa el SVG y no resuelve variables ni currentColor.
  const svg = (name, fill, extra) => `<svg viewBox="0 0 24 24" ${extra || ''} xmlns="http://www.w3.org/2000/svg"><path fill="${fill}" d="${P[name]}"/></svg>`;

  function signalSvg(level, fill) {
    let bars = '';
    for (let i = 0; i < 4; i++) {
      const h = 4 + i * 3;
      bars += `<rect x="${1 + i * 4}" y="${15 - h}" width="3" height="${h}" rx=".6" fill="${fill}" opacity="${i < level ? 1 : 0.3}"/>`;
    }
    return `<svg viewBox="0 0 17 16" width="15" height="14" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
  }
  function batterySvg(pct, fill) {
    const w = Math.max(1.5, Math.round(16 * pct / 100 * 10) / 10);
    const color = pct <= 15 ? '#ff4b4b' : fill;
    return `<svg viewBox="0 0 24 12" width="22" height="11" xmlns="http://www.w3.org/2000/svg"><rect x=".75" y=".75" width="19.5" height="10.5" rx="2.6" fill="none" stroke="${fill}" stroke-width="1.3" opacity=".55"/><rect x="21.3" y="3.8" width="1.8" height="4.4" rx=".8" fill="${fill}" opacity=".55"/><rect x="2.5" y="2.5" width="${w}" height="7" rx="1.4" fill="${color}"/></svg>`;
  }

  const THEMES = {
    dark: { bar: '#1f2c34', barText: '#e9edef', barSub: '#8696a0', icon: '#aebac1', bg: '#0b141a', bin: '#202c33', bout: '#005c4b', text: '#e9edef', time: '#8696a0', timeOut: 'rgba(233,237,239,.6)', tick: '#53bdeb', tickGrey: 'rgba(233,237,239,.6)', chip: '#182229', chipText: '#8696a0', sys: '#182229', sysText: '#ffd279', field: '#202c33', fieldText: '#8696a0', mic: '#00a884', mark: '#ffffff', markFoot: '#000000', markFootText: '#ffd279' },
    light: { bar: '#008069', barText: '#ffffff', barSub: 'rgba(255,255,255,.85)', icon: '#ffffff', bg: '#efeae2', bin: '#ffffff', bout: '#d9fdd3', text: '#111b21', time: '#667781', timeOut: '#667781', tick: '#53bdeb', tickGrey: '#8696a0', chip: '#ffffff', chipText: '#54656f', sys: '#ffeecd', sysText: '#54656f', field: '#ffffff', fieldText: '#8696a0', mic: '#00a884', mark: '#000000', markFoot: '#000000', markFootText: '#ffd279' },
  };

  function initialsOf(name) {
    const clean = String(name || '').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim();
    if (!clean) return '';
    if (/^[\d\s]+$/.test(clean)) return '';
    const parts = clean.split(/\s+/);
    return ((parts[0] || '')[0] + ((parts[1] || '')[0] || '')).toUpperCase();
  }

  function members() { return S.group.members.split(',').map(x => x.trim()).filter(Boolean).slice(0, 12); }

  // ───────────────────────── Pantalla del teléfono ─────────────────────────
  function renderScreen() {
    const T = THEMES[S.waTheme];
    const c = S.contact;
    let av;
    if (c.avatarMode === 'photo' && c.avatar) av = `<div class="wa-av"><img src="${esc(c.avatar)}" alt=""></div>`;
    else if (c.avatarMode === 'initials' && initialsOf(c.name)) av = `<div class="wa-av" style="background:${esc(c.color)}">${esc(initialsOf(c.name))}</div>`;
    else av = `<div class="wa-av" style="background:${S.waTheme === 'dark' ? '#6a7175' : '#dfe5e7'}">${svg(S.group.on ? 'group' : 'person', S.waTheme === 'dark' ? '#cfd4d6' : '#ffffff', 'width="28" height="28"')}</div>`;

    const sub = S.group.on ? ([t('wa.you')].concat(members()).join(', ') || t('wa.groupSub')) : c.status;
    const sColors = SENDER_COLORS[S.waTheme];
    const mList = members();

    let html = '';
    let prevKind = null;
    for (const m of S.messages) {
      if (m.type === 'date' || m.type === 'system') {
        html += `<div class="wa-center"><div class="wa-chip${m.type === 'system' ? ' system' : ''}" style="background:${m.type === 'system' ? T.sys : T.chip};color:${m.type === 'system' ? T.sysText : T.chipText}">${esc(m.text)}</div></div>`;
        prevKind = null;
        continue;
      }
      const kind = m.type + (m.type === 'in' && S.group.on ? '|' + m.sender : '');
      const first = kind !== prevKind;
      prevKind = kind;
      const out = m.type === 'out';
      let ticks = '';
      if (out) {
        ticks = m.status === 'sent' ? svg('check', T.tickGrey) : svg('checks', m.status === 'read' ? T.tick : T.tickGrey);
      }
      let sender = '';
      if (!out && S.group.on && first && m.sender) {
        const idx = Math.max(0, mList.indexOf(m.sender));
        sender = `<span class="wa-sender" style="color:${sColors[idx % sColors.length]}">${esc(m.sender)}</span>`;
      }
      html += `<div class="wa-row ${m.type}${first ? ' first gap' : ''}"><div class="wa-bubble" style="background:${out ? T.bout : T.bin};color:${T.text}">${sender}${esc(m.text)}<span class="wa-meta" style="color:${out ? T.timeOut : T.time}">${esc(m.time)}${ticks}</span></div></div>`;
    }

    $('screen').innerHTML = `
      <div class="wa-status" style="background:${T.bar};color:${T.barText}">
        <span>${esc(S.phone.time)}</span>
        <span class="icons">${S.phone.wifi ? svg('wifi', T.barText, 'width="14" height="14"') : ''}${signalSvg(S.phone.signal, T.barText)}<span class="bat">${batterySvg(S.phone.battery, T.barText)}${esc(S.phone.battery)}%</span></span>
      </div>
      <div class="wa-head" style="background:${T.bar};color:${T.barText}">
        ${svg('back', T.icon, 'class="back"')}
        ${av}
        <div class="wa-who"><div class="n">${esc(c.name)}</div>${sub ? `<div class="s" style="color:${T.barSub}">${esc(sub)}</div>` : ''}</div>
        <div class="acts">${svg('video', T.icon)}${svg('call', T.icon)}${svg('more', T.icon)}</div>
      </div>
      <div class="wa-chat" style="background:${T.bg}">${html}</div>
      <div class="wa-input" style="background:${T.bg}">
        <div class="wa-field" style="background:${T.field};color:${T.fieldText}">${svg('emoji', T.fieldText)}<span class="ph">${esc(S.inputText)}</span>${svg('attach', T.fieldText)}${svg('camera', T.fieldText)}</div>
        <div class="wa-mic" style="background:${T.mic}">${svg('mic', '#ffffff')}</div>
      </div>
      <div class="wa-markfoot" style="background:${T.markFoot};color:${T.markFootText}">${esc(t('wa.markFoot'))}</div>
      <div class="wa-mark" aria-hidden="true"><div class="big" style="color:${T.mark}">${esc(t('wa.mark'))}</div></div>`;
  }

  // ───────────────────────── Lista de mensajes del editor ─────────────────────────
  function renderList() {
    const list = $('msgList');
    $('msgCount').textContent = S.messages.length ? t('ch.count', { n: S.messages.length }) : '';
    if (!S.messages.length) { list.innerHTML = `<li class="msg-empty">${esc(t('ch.noMsgs'))}</li>`; return; }
    const who = { in: 'ch.whoIn', out: 'ch.whoOut', date: 'ch.whoDate', system: 'ch.whoSys' };
    list.innerHTML = S.messages.map((m, i) => `
      <li class="msg-item${m.id === editingId ? ' editing' : ''}" data-id="${m.id}">
        <span class="who ${m.type}">${esc(t(who[m.type]))}</span>
        <span class="txt">${m.type === 'in' && S.group.on && m.sender ? `<b>${esc(m.sender)}:</b> ` : ''}${esc(m.text.replace(/\n/g, ' ⏎ '))}${m.time && (m.type === 'in' || m.type === 'out') ? `<small>${esc(m.time)}</small>` : ''}</span>
        <span class="acts">
          <button type="button" data-act="up" title="${esc(t('ch.up'))}" aria-label="${esc(t('ch.up'))}"${i === 0 ? ' disabled' : ''}>↑</button>
          <button type="button" data-act="down" title="${esc(t('ch.down'))}" aria-label="${esc(t('ch.down'))}"${i === S.messages.length - 1 ? ' disabled' : ''}>↓</button>
          <button type="button" data-act="edit" title="${esc(t('ch.edit'))}" aria-label="${esc(t('ch.edit'))}">✎</button>
          <button type="button" data-act="dup" title="${esc(t('ch.dup'))}" aria-label="${esc(t('ch.dup'))}">⧉</button>
          <button type="button" data-act="del" class="del" title="${esc(t('ch.del'))}" aria-label="${esc(t('ch.del'))}">✕</button>
        </span>
      </li>`).join('');
  }

  function render() { renderScreen(); renderList(); save(); }

  // ───────────────────────── Formulario ─────────────────────────
  function setType(v) {
    msgType = v;
    $('typeSeg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v));
    const bubble = v === 'in' || v === 'out';
    $('metaRow').hidden = !bubble;
    $('statusSelField').style.visibility = v === 'out' ? 'visible' : 'hidden';
    $('senderField').hidden = !(v === 'in' && S.group.on);
    $('mTextLbl').textContent = t(v === 'date' ? 'ch.textDate' : v === 'system' ? 'ch.textSys' : 'ch.text');
    if (v === 'date' && !$('mText').value && !editingId) $('mText').value = t('wa.today');
  }

  function fillSenders() {
    const sel = $('mSender');
    const prev = sel.value;
    const list = members();
    sel.innerHTML = list.map(m => `<option>${esc(m)}</option>`).join('');
    if (list.includes(prev)) sel.value = prev;
  }

  function nextTime() {
    for (let i = S.messages.length - 1; i >= 0; i--) {
      const tm = S.messages[i].time;
      if (isTime(tm)) {
        let [h, m] = tm.split(':').map(Number);
        m += 1; if (m === 60) { m = 0; h = (h + 1) % 24; }
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      }
    }
    return S.phone.time;
  }

  function resetForm() {
    editingId = null;
    $('mText').value = '';
    $('mTime').value = nextTime();
    $('addBtn').hidden = false; $('saveBtn').hidden = true; $('cancelBtn').hidden = true;
    setType(msgType);
  }

  function readForm() {
    const text = $('mText').value.replace(/\s+$/, '');
    if (!text.trim()) { toast(t('ch.empty')); $('mText').focus(); return null; }
    return {
      type: msgType, text: text.slice(0, 2000),
      time: (msgType === 'in' || msgType === 'out') && isTime($('mTime').value) ? $('mTime').value : '',
      status: $('mStatus').value, sender: msgType === 'in' && S.group.on ? $('mSender').value : '',
    };
  }

  function add() {
    const m = readForm();
    if (!m) return;
    m.id = newId();
    S.messages.push(m);
    render();
    resetForm();
    $('mText').focus();
  }

  function saveEdit() {
    const m = readForm();
    if (!m) return;
    const i = S.messages.findIndex(x => x.id === editingId);
    if (i >= 0) S.messages[i] = Object.assign({ id: editingId }, m);
    render();
    resetForm();
  }

  function startEdit(id) {
    const m = S.messages.find(x => x.id === id);
    if (!m) return;
    editingId = id;
    setType(m.type);
    $('mText').value = m.text;
    if (m.time) $('mTime').value = m.time;
    $('mStatus').value = m.status;
    if (m.sender) { fillSenders(); $('mSender').value = m.sender; }
    $('addBtn').hidden = true; $('saveBtn').hidden = false; $('cancelBtn').hidden = false;
    renderList();
    FS.reveal($('typeSeg'));
    $('mText').focus();
  }

  function onListClick(e) {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = b.closest('[data-id]').dataset.id;
    const i = S.messages.findIndex(x => x.id === id);
    if (i < 0) return;
    const act = b.dataset.act;
    if (act === 'up' && i > 0) [S.messages[i - 1], S.messages[i]] = [S.messages[i], S.messages[i - 1]];
    else if (act === 'down' && i < S.messages.length - 1) [S.messages[i + 1], S.messages[i]] = [S.messages[i], S.messages[i + 1]];
    else if (act === 'dup') S.messages.splice(i + 1, 0, Object.assign({}, S.messages[i], { id: newId() }));
    else if (act === 'del') { S.messages.splice(i, 1); if (editingId === id) resetForm(); }
    else if (act === 'edit') { startEdit(id); return; }
    render();
  }

  // ───────────────────────── Campos de contacto y teléfono ─────────────────────────
  function syncFields() {
    $('groupOn').checked = S.group.on;
    $('cName').value = S.contact.name;
    $('cStatus').value = S.contact.status;
    $('gMembers').value = S.group.members;
    $('pTime').value = S.phone.time;
    $('pBattery').value = S.phone.battery;
    $('pSignal').value = String(S.phone.signal);
    $('pWifi').checked = S.phone.wifi;
    $('pInput').value = S.inputText;
    $('waThemeSeg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.waTheme));
    groupUi();
  }
  function groupUi() {
    $('statusField').hidden = S.group.on;
    $('membersField').hidden = !S.group.on;
    $('cNameLbl').textContent = t(S.group.on ? 'ch.gName' : 'ch.cName');
    fillSenders();
    setType(msgType);
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\//.test(file.type)) { reject(new Error('type')); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        // Recorte cuadrado centrado a 192 px: suficiente para el avatar y cabe en el almacenamiento local.
        const s = Math.min(img.naturalWidth, img.naturalHeight);
        const cv = document.createElement('canvas');
        cv.width = cv.height = 192;
        cv.getContext('2d').drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, 192, 192);
        URL.revokeObjectURL(url);
        resolve(cv.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  // ───────────────────────── Imagen ─────────────────────────
  async function renderCanvas() {
    if (typeof html2canvas !== 'function') throw new Error('nolib');
    const el = $('screen');
    return html2canvas(el, { scale: 3, backgroundColor: null, logging: false, useCORS: false });
  }
  function fileName() {
    const base = (S.contact.name || 'chat').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'chat';
    return `fakerstudio-chat-${base}.png`;
  }
  async function busy(btn, fn) {
    const prev = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = t('ch.rendering');
    try { await fn(); } catch (e) {
      console.error(e);
      toast(t(e && e.message === 'nolib' ? 'ch.noLib' : 'ch.pngFail'), 5000);
    } finally { btn.disabled = false; btn.innerHTML = prev; FS.applyI18n(btn); }
  }
  async function downloadPng() {
    await busy($('pngBtn'), async () => {
      const cv = await renderCanvas();
      const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
      if (!blob) throw new Error('blob');
      download(fileName(), blob);
      toast(t('ch.pngOk'));
    });
  }
  async function copyPng() {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') { toast(t('ch.copyNo'), 4000); return; }
    await busy($('copyImgBtn'), async () => {
      const cv = await renderCanvas();
      const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        toast(t('ch.copyOk'));
      } catch (e) { toast(t('ch.copyNo'), 4000); }
    });
  }

  // ───────────────────────── Plantillas ─────────────────────────
  function fillTemplates() {
    const L = FS.lang();
    const sel = $('tplSel');
    const prev = sel.value || 'casual';
    sel.innerHTML = Object.keys(TEMPLATES).map(k => `<option value="${k}">${esc(TEMPLATES[k][L].label)}</option>`).join('');
    sel.value = TEMPLATES[prev] ? prev : 'casual';
    $('tplHint').textContent = TEMPLATES[sel.value][L].hint;
  }
  function loadTemplate() {
    const k = $('tplSel').value;
    if (S.messages.length && !confirm(t('ch.tplConfirm'))) return;
    const tp = TEMPLATES[k].build(FS.lang());
    S.contact.name = tp.contact.name;
    S.contact.status = tp.contact.status;
    S.contact.avatarMode = tp.contact.avatar === 'none' ? 'none' : (S.contact.avatar && tp.contact.avatar === 'photo' ? 'photo' : 'initials');
    S.contact.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    S.group.on = !!tp.group.on;
    if (tp.group.members) S.group.members = tp.group.members;
    S.messages = tp.messages.map(toMsg);
    const lastTime = [...S.messages].reverse().find(m => isTime(m.time));
    if (lastTime) S.phone.time = lastTime.time;
    syncFields();
    resetForm();
    render();
  }

  // ───────────────────────── Arranque ─────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Contacto enviado desde la página de identidades.
    const pending = store.json('pending_contact', null);
    if (pending && /[?&]contacto=1/.test(location.search)) {
      S.contact.name = str(pending.name, 60);
      S.contact.status = t('wa.online');
      if (/^#[0-9a-f]{6}$/i.test(pending.color || '')) S.contact.color = pending.color;
      if (typeof pending.avatar === 'string' && IMG_RE.test(pending.avatar) && pending.avatar.length < 600000) {
        S.contact.avatar = pending.avatar; S.contact.avatarMode = 'photo';
      } else S.contact.avatarMode = 'initials';
      S.group.on = false;
      setTimeout(() => toast(t('ch.contactIn')), 300);
      history.replaceState(null, '', location.pathname);
    }
    store.set('pending_contact', null);

    fillTemplates();
    syncFields();
    resetForm();
    render();

    $('tplSel').onchange = () => { $('tplHint').textContent = TEMPLATES[$('tplSel').value][FS.lang()].hint; };
    $('tplBtn').onclick = loadTemplate;
    $('groupOn').onchange = () => { S.group.on = $('groupOn').checked; groupUi(); render(); };
    $('cName').oninput = () => { S.contact.name = str($('cName').value, 60); renderScreen(); save(); };
    $('cStatus').oninput = () => { S.contact.status = str($('cStatus').value, 60); renderScreen(); save(); };
    $('gMembers').oninput = () => { S.group.members = str($('gMembers').value, 200); fillSenders(); render(); };
    $('avatarFile').onchange = async e => {
      const f = e.target.files[0];
      e.target.value = '';
      if (!f) return;
      try { S.contact.avatar = await readImage(f); S.contact.avatarMode = 'photo'; render(); } catch (err) { toast(t('ch.avatarBad')); }
    };
    $('avatarInit').onclick = () => { S.contact.avatarMode = 'initials'; S.contact.color = COLORS[(COLORS.indexOf(S.contact.color) + 1) % COLORS.length]; render(); };
    $('avatarNone').onclick = () => { S.contact.avatarMode = 'none'; render(); };

    $('typeSeg').querySelectorAll('button').forEach(b => { b.onclick = () => setType(b.dataset.v); });
    $('addBtn').onclick = add;
    $('saveBtn').onclick = saveEdit;
    $('cancelBtn').onclick = () => { resetForm(); renderList(); };
    $('mText').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); (editingId ? saveEdit : add)(); } });
    $('msgList').addEventListener('click', onListClick);

    $('pTime').oninput = () => { if (isTime($('pTime').value)) { S.phone.time = $('pTime').value; renderScreen(); save(); } };
    $('pBattery').oninput = () => { const v = Math.round(Number($('pBattery').value)); if (v >= 1 && v <= 100) { S.phone.battery = v; renderScreen(); save(); } };
    $('pBattery').onchange = () => { $('pBattery').value = S.phone.battery; };
    $('pSignal').onchange = () => { S.phone.signal = Number($('pSignal').value); renderScreen(); save(); };
    $('pWifi').onchange = () => { S.phone.wifi = $('pWifi').checked; renderScreen(); save(); };
    $('pInput').oninput = () => { S.inputText = str($('pInput').value, 60); renderScreen(); save(); };
    $('waThemeSeg').querySelectorAll('button').forEach(b => {
      b.onclick = () => { S.waTheme = b.dataset.v; $('waThemeSeg').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); };
    });

    $('saveJson').onclick = () => download(fileName().replace(/\.png$/, '.json'), JSON.stringify(Object.assign({ app: 'FakerStudio' }, S), null, 2), 'application/json');
    $('loadJson').onchange = async e => {
      const f = e.target.files[0];
      e.target.value = '';
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || !Array.isArray(data.messages)) throw new Error('shape');
        S = normalize(data);
        syncFields(); resetForm(); render();
        toast(t('ch.loaded'));
      } catch (err) { toast(t('ch.badJson'), 4000); }
    };
    $('clearBtn').onclick = () => { if (S.messages.length && confirm(t('ch.clearConfirm'))) { S.messages = []; resetForm(); render(); } };
    $('pngBtn').onclick = downloadPng;
    $('copyImgBtn').onclick = copyPng;
  });

  document.addEventListener('fs:lang', () => { fillTemplates(); groupUi(); renderScreen(); renderList(); });
})();
