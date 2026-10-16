/* FakerStudio · núcleo común: marca, idioma, tema y utilidades. Sin dependencias. */
(function () {
  'use strict';

  const WEB = 'https://www.unfantasmaenelsistema.com';
  const REPO = 'https://github.com/unfantasmaenelsistema/FakerStudio';
  const PAGES = [['home', 'index.html'], ['persona', 'identidad.html'], ['chat', 'chat.html']];

  // ───────────────────────── Almacenamiento ─────────────────────────
  const PREFIX = 'fs_';
  const store = {
    get(k) { try { return localStorage.getItem(PREFIX + k); } catch (e) { return null; } },
    set(k, v) {
      try { if (v == null || v === '') localStorage.removeItem(PREFIX + k); else localStorage.setItem(PREFIX + k, v); } catch (e) { /* modo privado */ }
    },
    json(k, fallback) { try { const v = JSON.parse(store.get(k)); return v == null ? fallback : v; } catch (e) { return fallback; } },
    setJson(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };

  // ───────────────────────── Idioma ─────────────────────────
  const DICT = { es: {}, en: {} };
  let lang = store.get('lang') || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
  if (!DICT[lang]) lang = 'es';

  function addI18n(d) { for (const l of Object.keys(DICT)) Object.assign(DICT[l], d[l] || {}); }
  function t(key, vars) {
    let s = DICT[lang][key];
    if (s == null) s = DICT.es[key];
    if (s == null) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }
  function applyI18n(root) {
    root = root || document;
    root.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    root.querySelectorAll('[data-t-html]').forEach(el => { el.innerHTML = t(el.dataset.tHtml); });
    root.querySelectorAll('[data-t-ph]').forEach(el => { el.placeholder = t(el.dataset.tPh); });
    root.querySelectorAll('[data-t-title]').forEach(el => { el.title = t(el.dataset.tTitle); });
    root.querySelectorAll('[data-t-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.tAria)); });
    document.documentElement.lang = lang;
    if (document.body && document.body.dataset.titleKey) document.title = t(document.body.dataset.titleKey) + ' · FakerStudio';
  }
  function setLang(l) {
    if (!DICT[l] || l === lang) return;
    lang = l;
    store.set('lang', l);
    applyI18n();
    renderChrome();
    document.dispatchEvent(new CustomEvent('fs:lang', { detail: l }));
  }

  // ───────────────────────── Tema ─────────────────────────
  function theme() { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function setTheme(th) {
    document.documentElement.setAttribute('data-theme', th);
    store.set('theme', th);
    renderChrome();
    document.dispatchEvent(new CustomEvent('fs:theme', { detail: th }));
  }

  // ───────────────────────── Utilidades ─────────────────────────
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  let toastTimer;
  function toast(msg, ms) {
    let el = document.getElementById('fsToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'fsToast'; el.className = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms || 2600);
  }
  function download(name, content, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { /* nada */ }
      ta.remove(); return ok;
    }
  }
  function reveal(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 60 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ───────────────────────── Textos comunes ─────────────────────────
  addI18n({
    es: {
      'brand.sub': 'UN FANTASMA EN EL SISTEMA · DATOS FICTICIOS',
      'nav.home': 'Inicio', 'nav.persona': 'Identidades', 'nav.chat': 'Chat',
      'chip.themeTitle': 'Cambiar entre tema claro y oscuro', 'chip.langTitle': 'Switch to English',
      'foot.text': 'Gratis y de código abierto. Todo se genera en tu navegador: nada sale de él.',
      'foot.source': 'Código fuente',
    },
    en: {
      'brand.sub': 'UN FANTASMA EN EL SISTEMA · FICTITIOUS DATA',
      'nav.home': 'Home', 'nav.persona': 'Identities', 'nav.chat': 'Chat',
      'chip.themeTitle': 'Switch between light and dark theme', 'chip.langTitle': 'Cambiar a español',
      'foot.text': 'Free and open source. Everything is generated in your browser: nothing leaves it.',
      'foot.source': 'Source code',
    },
  });

  function renderChrome() {
    const tool = document.body.dataset.tool || 'home';
    const top = document.getElementById('fsTop');
    if (top) {
      top.innerHTML = `
        <a class="fs-brand" href="index.html">
          <img src="assets/ghost.png" alt="Un Fantasma en el Sistema" width="42" height="42">
          <span><b>FAKER<span>STUDIO</span></b><small>${esc(t('brand.sub'))}</small></span>
        </a>
        <nav class="fs-nav" aria-label="FakerStudio">
          ${PAGES.map(([id, href]) => `<a href="${href}"${id === tool ? ' aria-current="page"' : ''}>${esc(t('nav.' + id))}</a>`).join('')}
        </nav>
        <div class="fs-controls">
          <a class="chip" href="${WEB}" target="_blank" rel="noopener">[ WEB ]</a>
          <button class="chip" id="fsLangBtn" type="button" title="${esc(t('chip.langTitle'))}">${lang === 'es' ? 'EN' : 'ES'}</button>
          <button class="chip" id="fsThemeBtn" type="button" title="${esc(t('chip.themeTitle'))}" aria-label="${esc(t('chip.themeTitle'))}">${theme() === 'dark' ? '☀' : '☾'}</button>
        </div>`;
      top.querySelector('#fsLangBtn').onclick = () => setLang(lang === 'es' ? 'en' : 'es');
      top.querySelector('#fsThemeBtn').onclick = () => setTheme(theme() === 'dark' ? 'light' : 'dark');
    }
    const foot = document.getElementById('fsFoot');
    if (foot) {
      foot.innerHTML = `
        <span>© ${new Date().getFullYear()} Un Fantasma en el Sistema · ${esc(t('foot.text'))}</span>
        <span class="links">
          <a href="${WEB}" target="_blank" rel="noopener">unfantasmaenelsistema.com</a>
          <a href="${REPO}" target="_blank" rel="noopener">${esc(t('foot.source'))} (MIT)</a>
        </span>`;
    }
  }

  window.FS = { store, t, addI18n, applyI18n, setLang, lang: () => lang, theme, setTheme, esc, toast, download, copyText, reveal };

  document.addEventListener('DOMContentLoaded', () => { renderChrome(); applyI18n(); });
})();
