/* FakerStudio · página de identidades */
(function () {
  'use strict';
  const { t, esc, store, toast, download, copyText, reveal } = FS;
  const $ = id => document.getElementById(id);
  const MAX_ROWS = 300;

  FS.addI18n({
    es: {
      'id.title': 'Identidades ficticias',
      'id.options': 'Opciones', 'id.sex': 'Sexo', 'id.sexAny': 'Cualquiera', 'id.sexF': 'Mujer', 'id.sexM': 'Hombre',
      'id.ageMin': 'Edad mínima', 'id.ageMax': 'Edad máxima', 'id.doc': 'Documento',
      'id.docDni': 'DNI (nacionalidad española)', 'id.docNie': 'NIE (residente extranjero)', 'id.docMix': 'Mezcla realista (~13 % NIE)',
      'id.prov': 'Provincia', 'id.provAny': 'Cualquiera (según población)', 'id.count': 'Cantidad', 'id.seed': 'Semilla', 'id.seedPh': 'aleatoria',
      'id.seedNew': 'Nueva semilla aleatoria',
      'id.seedHelp': 'Con la misma semilla y las mismas opciones obtienes exactamente el mismo lote: útil para repetir pruebas.',
      'id.generate': 'Generar', 'id.result': 'Identidad', 'id.seedUsed': 'semilla: {s}',
      'id.copy': 'Copiar ficha', 'id.toChat': 'Usar como contacto en el chat', 'id.copied': 'Copiado al portapapeles', 'id.copyFail': 'No se pudo copiar',
      'id.colName': 'Nombre', 'id.colDoc': 'Documento', 'id.colBirth': 'Nacimiento', 'id.colPhone': 'Móvil', 'id.colEmail': 'Correo', 'id.colPlace': 'Municipio',
      'id.tableTitle': '{n} identidades', 'id.tableNote': 'Se muestran las {m} primeras; la exportación incluye las {n}. Pulsa una fila para ver su ficha.',
      'id.tableNoteAll': 'Pulsa una fila para ver su ficha arriba.',
      'f.doc': 'Documento', 'f.birth': 'Fecha de nacimiento', 'f.age': '{n} años', 'f.nat': 'Nacionalidad', 'f.mobile': 'Móvil', 'f.landline': 'Fijo',
      'f.email': 'Correo', 'f.user': 'Usuario', 'f.address': 'Dirección', 'f.place': 'Código postal y municipio', 'f.region': 'Provincia y comunidad',
      'f.job': 'Profesión', 'f.copy1': 'Copiar', 'f.none': '—', 'sex.F': 'Mujer', 'sex.M': 'Hombre',
      'id.valTitle': 'Comprobar un DNI, NIE o CIF', 'id.valPh': '12345678Z, X1234567L, B12345674…', 'id.valBtn': 'Comprobar',
      'id.valOk': '✓ {tipo} con el control correcto.', 'id.valBad': '✗ {tipo} con el control incorrecto. Sería: {e}',
      'id.valUnknown': '✗ No tiene formato de DNI (8 cifras + letra), NIE (X/Y/Z + 7 cifras + letra) ni CIF (letra + 7 cifras + control).',
      'id.valHelp': 'Solo comprueba la letra o el dígito de control; no consulta ninguna base de datos, así que no dice si el documento existe ni de quién es.',
      'id.warnT': 'Datos inventados, no de personas reales.',
      'id.warnD': 'Los nombres y apellidos son los más frecuentes del INE y los documentos tienen la letra de control correcta, así que un número puede coincidir por azar con el de alguien. Úsalos solo para probar formularios, rellenar bases de datos de prueba o preparar ejercicios, nunca para suplantar ni para registrarte en servicios reales. Los correos usan dominios reservados (example.com/.org/.net) que no pertenecen a nadie.',
      'id.sentToChat': 'Contacto preparado. Abriendo el chat…', 'id.exported': 'Descargado {f}',
      'id.ageFix': 'He ajustado las edades a {a}–{b}.',
    },
    en: {
      'id.title': 'Fictitious identities',
      'id.options': 'Options', 'id.sex': 'Sex', 'id.sexAny': 'Any', 'id.sexF': 'Female', 'id.sexM': 'Male',
      'id.ageMin': 'Minimum age', 'id.ageMax': 'Maximum age', 'id.doc': 'Document',
      'id.docDni': 'DNI (Spanish national)', 'id.docNie': 'NIE (foreign resident)', 'id.docMix': 'Realistic mix (~13% NIE)',
      'id.prov': 'Province', 'id.provAny': 'Any (weighted by population)', 'id.count': 'Amount', 'id.seed': 'Seed', 'id.seedPh': 'random',
      'id.seedNew': 'New random seed',
      'id.seedHelp': 'The same seed with the same options always gives exactly the same batch: handy for repeatable tests.',
      'id.generate': 'Generate', 'id.result': 'Identity', 'id.seedUsed': 'seed: {s}',
      'id.copy': 'Copy record', 'id.toChat': 'Use as chat contact', 'id.copied': 'Copied to clipboard', 'id.copyFail': 'Could not copy',
      'id.colName': 'Name', 'id.colDoc': 'Document', 'id.colBirth': 'Birth date', 'id.colPhone': 'Mobile', 'id.colEmail': 'Email', 'id.colPlace': 'Town',
      'id.tableTitle': '{n} identities', 'id.tableNote': 'Showing the first {m}; the export includes all {n}. Click a row to see its record.',
      'id.tableNoteAll': 'Click a row to see its record above.',
      'f.doc': 'Document', 'f.birth': 'Date of birth', 'f.age': '{n} years old', 'f.nat': 'Nationality', 'f.mobile': 'Mobile', 'f.landline': 'Landline',
      'f.email': 'Email', 'f.user': 'Username', 'f.address': 'Address', 'f.place': 'Postcode and town', 'f.region': 'Province and region',
      'f.job': 'Occupation', 'f.copy1': 'Copy', 'f.none': '—', 'sex.F': 'Female', 'sex.M': 'Male',
      'id.valTitle': 'Check a DNI, NIE or CIF', 'id.valPh': '12345678Z, X1234567L, B12345674…', 'id.valBtn': 'Check',
      'id.valOk': '✓ {tipo} with a correct check character.', 'id.valBad': '✗ {tipo} with a wrong check character. It should be: {e}',
      'id.valUnknown': '✗ Not a DNI (8 digits + letter), NIE (X/Y/Z + 7 digits + letter) or CIF (letter + 7 digits + check) format.',
      'id.valHelp': 'It only checks the control letter or digit; it queries no database, so it cannot tell whether the document exists or whose it is.',
      'id.warnT': 'Made-up data, not real people.',
      'id.warnD': 'First names and surnames are the most common ones according to Spain’s INE and documents carry a valid check letter, so a number may match someone’s by chance. Use them only to test forms, fill test databases or prepare exercises, never to impersonate anyone or sign up for real services. Emails use reserved domains (example.com/.org/.net) that belong to nobody.',
      'id.sentToChat': 'Contact ready. Opening the chat…', 'id.exported': 'Downloaded {f}',
      'id.ageFix': 'Ages adjusted to {a}–{b}.',
    },
  });

  let sex = 'any';
  let batch = [];
  let current = null;
  let lastSeed = '';

  function fillProvinces() {
    const sel = $('province');
    const prev = sel.value || store.get('id_prov') || 'any';
    const provs = Persona.PROVINCIAS.slice().sort((a, b) => a.provincia.localeCompare(b.provincia, 'es'));
    sel.innerHTML = `<option value="any">${esc(t('id.provAny'))}</option>` +
      provs.map(p => `<option value="${p.ine}">${esc(p.provincia)}</option>`).join('');
    sel.value = provs.some(p => p.ine === prev) ? prev : 'any';
  }

  function fmtDate(isoStr) {
    const [y, m, d] = isoStr.split('-');
    return FS.lang() === 'es' ? `${d}/${m}/${y}` : `${y}-${m}-${d}`;
  }

  function fieldsOf(p) {
    return [
      ['f.doc', `${p.documentoTipo} ${p.documento}`, p.documento, true],
      ['f.birth', `${fmtDate(p.fechaNacimiento)} · ${t('f.age', { n: p.edad })}`, fmtDate(p.fechaNacimiento)],
      ['f.nat', p.nacionalidad],
      ['f.mobile', p.movil, p.movil.replace(/ /g, ''), true],
      ['f.landline', p.fijo || t('f.none'), p.fijo ? p.fijo.replace(/ /g, '') : '', true],
      ['f.email', p.email, p.email, true],
      ['f.user', p.usuario, p.usuario, true],
      ['f.job', p.profesion],
      ['f.address', p.direccion],
      ['f.place', `${p.cp} ${p.municipio}`],
      ['f.region', `${p.provincia} · ${p.comunidad}`],
    ];
  }

  function renderCard(p) {
    current = p;
    const card = $('card');
    card.innerHTML = `
      <div class="id-card">
        <div class="id-avatar" style="background:${esc(p.color)}" aria-hidden="true">${esc(p.iniciales)}</div>
        <div>
          <div class="id-name">${esc(p.nombreCompleto)}</div>
          <div class="id-sub">${esc(t('sex.' + p.sexo))} · ${esc(t('f.age', { n: p.edad }))} · ${esc(p.municipio)}</div>
        </div>
        <div class="id-fields">
          ${fieldsOf(p).map(([k, v, raw, mono]) => `
            <div class="id-field">
              <span class="k">${esc(t(k))}</span>
              <span class="v${mono ? ' mono' : ''}">${esc(v)}</span>
              <button class="cp1" type="button" data-copy="${esc(raw != null ? raw : v)}" title="${esc(t('f.copy1'))}" aria-label="${esc(t('f.copy1'))}: ${esc(t(k))}">⧉</button>
            </div>`).join('')}
        </div>
      </div>`;
    card.querySelectorAll('[data-copy]').forEach(b => {
      if (!b.dataset.copy) { b.remove(); return; }
      b.onclick = async () => toast(t(await copyText(b.dataset.copy) ? 'id.copied' : 'id.copyFail'));
    });
  }

  function renderTable() {
    const many = batch.length > 1;
    $('tablePanel').hidden = !many;
    $('singleExport').hidden = many;
    if (!many) return;
    $('tableTitle').textContent = t('id.tableTitle', { n: batch.length });
    const rows = batch.slice(0, MAX_ROWS);
    $('tbody').innerHTML = rows.map((p, i) => `
      <tr data-i="${i}" tabindex="0" aria-selected="${p === current}">
        <td class="mono">${i + 1}</td><td>${esc(p.nombreCompleto)}</td><td class="mono">${esc(p.documento)}</td>
        <td class="mono">${esc(fmtDate(p.fechaNacimiento))}</td><td class="mono">${esc(p.movil)}</td>
        <td class="mono">${esc(p.email)}</td><td>${esc(p.municipio)} (${esc(p.provincia)})</td>
      </tr>`).join('');
    $('tableNote').textContent = batch.length > MAX_ROWS ? t('id.tableNote', { m: MAX_ROWS, n: batch.length }) : t('id.tableNoteAll');
  }

  function selectRow(i) {
    const p = batch[i];
    if (!p) return;
    renderCard(p);
    $('tbody').querySelectorAll('tr').forEach(tr => tr.setAttribute('aria-selected', tr.dataset.i === String(i)));
    reveal($('cardPanel'));
  }

  function opts() {
    let a = Math.round(Number($('ageMin').value)), b = Math.round(Number($('ageMax').value));
    if (!Number.isFinite(a)) a = 18;
    if (!Number.isFinite(b)) b = 75;
    a = Math.min(Math.max(a, 0), 110); b = Math.min(Math.max(b, 0), 110);
    if (a > b) [a, b] = [b, a];
    if (String(a) !== $('ageMin').value || String(b) !== $('ageMax').value) {
      $('ageMin').value = a; $('ageMax').value = b;
      toast(t('id.ageFix', { a, b }));
    }
    return { edadMin: a, edadMax: b, sexo: sex, documento: $('docType').value, provincia: $('province').value };
  }

  function generate() {
    const o = opts();
    let n = Math.round(Number($('count').value));
    if (!Number.isFinite(n) || n < 1) n = 1;
    if (n > 1000) n = 1000;
    $('count').value = n;
    const seed = $('seed').value.trim() || Persona.randomSeed();
    lastSeed = seed;
    batch = Persona.lote(seed, n, o);
    $('seedUsed').textContent = t('id.seedUsed', { s: seed });
    renderCard(batch[0]);
    renderTable();
    store.setJson('id_opts', { sex, a: o.edadMin, b: o.edadMax, doc: o.documento, n });
    store.set('id_prov', o.provincia);
  }

  function asText(p) {
    return [p.nombreCompleto, ...fieldsOf(p).map(([k, v]) => `${t(k)}: ${v}`)].join('\n');
  }

  function exportAs(kind) {
    if (!batch.length) return;
    const base = `fakerstudio-identidades-${lastSeed.replace(/[^a-z0-9_-]/gi, '').slice(0, 20) || 'lote'}`;
    let name, content, type;
    if (kind === 'csv') { name = base + '.csv'; content = Persona.aCSV(batch); type = 'text/csv;charset=utf-8'; }
    else if (kind === 'json') { name = base + '.json'; content = Persona.aJSON(batch); type = 'application/json'; }
    else { name = base + '.sql'; content = Persona.aSQL(batch, 'personas'); type = 'application/sql'; }
    download(name, content, type);
    toast(t('id.exported', { f: name }));
  }

  function validate() {
    const v = $('valInput').value;
    const out = $('valOut');
    if (!v.trim()) { out.textContent = ''; out.className = 'val-out'; return; }
    const r = Persona.validar(v);
    if (!r.tipo) { out.textContent = t('id.valUnknown'); out.className = 'val-out bad'; return; }
    out.textContent = r.ok ? t('id.valOk', { tipo: r.tipo }) : t('id.valBad', { tipo: r.tipo, e: r.esperado });
    out.className = 'val-out ' + (r.ok ? 'ok' : 'bad');
  }

  function setSex(v) {
    sex = v;
    $('sexSeg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v));
  }

  document.addEventListener('DOMContentLoaded', () => {
    fillProvinces();
    const saved = store.json('id_opts', null);
    if (saved) {
      setSex(['any', 'F', 'M'].includes(saved.sex) ? saved.sex : 'any');
      if (saved.a != null) $('ageMin').value = saved.a;
      if (saved.b != null) $('ageMax').value = saved.b;
      if (['DNI', 'NIE', 'mix'].includes(saved.doc)) $('docType').value = saved.doc;
      if (saved.n) $('count').value = saved.n;
    }
    $('sexSeg').querySelectorAll('button').forEach(b => { b.onclick = () => setSex(b.dataset.v); });
    $('seedNew').onclick = () => { $('seed').value = Persona.randomSeed(); };
    $('genBtn').onclick = generate;
    $('seed').addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
    $('count').addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
    $('copyBtn').onclick = async () => { if (current) toast(t(await copyText(asText(current)) ? 'id.copied' : 'id.copyFail')); };
    $('toChatBtn').onclick = () => {
      if (!current) return;
      store.setJson('pending_contact', { name: `${current.nombre} ${current.apellido1}`, initials: current.iniciales, color: current.color, phone: current.movil });
      toast(t('id.sentToChat'));
      setTimeout(() => { location.href = 'chat.html?contacto=1'; }, 400);
    };
    document.querySelectorAll('[data-export]').forEach(b => { b.onclick = () => exportAs(b.dataset.export); });
    $('tbody').addEventListener('click', e => { const tr = e.target.closest('tr[data-i]'); if (tr) selectRow(Number(tr.dataset.i)); });
    $('tbody').addEventListener('keydown', e => { if (e.key === 'Enter') { const tr = e.target.closest('tr[data-i]'); if (tr) selectRow(Number(tr.dataset.i)); } });
    $('valBtn').onclick = validate;
    $('valInput').addEventListener('keydown', e => { if (e.key === 'Enter') validate(); });
    generate();
  });

  document.addEventListener('fs:lang', () => {
    fillProvinces();
    if (current) renderCard(current);
    renderTable();
    if (lastSeed) $('seedUsed').textContent = t('id.seedUsed', { s: lastSeed });
    if ($('valOut').textContent) validate();
  });
})();
