/* Egypt Passport: the game shell (screens, map, passport, stamps, sound, ticket).
   The five mini-games live in minigames.js. No libraries. */
(function () {
  'use strict';

  var EG = window.EG, G = window.EG_GAME, C = EG.config;
  var STOPS = G.stops;

  /* ------------------------------------------------------------ helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(id, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + id + '"></use></svg>'; }
  function ar(text, cls) { return '<span class="ar' + (cls ? ' ' + cls : '') + '" lang="ar" dir="rtl">' + esc(text) + '</span>'; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  function starPoints(cx, cy, R) {
    var pts = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    return pts.join(' ');
  }

  /* ------------------------------------------------------------ language */
  var params = new URLSearchParams(location.search);
  if (params.has('reset')) { store.del('eg.game.v1'); }
  var lang = (function () {
    var q = params.get('lang'); if (q === 'en' || q === 'zh') return q;
    var s = store.get('eg.lang'); if (s === 'en' || s === 'zh') return s;
    return /^zh/i.test(navigator.language || '') ? 'zh' : 'en';
  })();
  function L(o) { return (o && (o[lang] || o.en)) || ''; }
  function t(key, vars) {
    var s = G.ui[lang][key];
    if (s == null) s = EG.ui[lang][key];
    if (s == null) s = G.ui.en[key] != null ? G.ui.en[key] : (EG.ui.en[key] != null ? EG.ui.en[key] : key);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] == null ? '' : vars[k]; });
    return s;
  }

  /* ------------------------------------------------------------ state */
  var KEY = 'eg.game.v1';
  var S = (function () { try { var s = JSON.parse(store.get(KEY)); if (s && s.stamps) return s; } catch (e) { /* fresh */ } return { name: '', opened: false, stamps: {}, ticket: null }; })();
  function save() { store.set(KEY, JSON.stringify(S)); }
  function doneCount() { return STOPS.filter(function (s) { return S.stamps[s.id]; }).length; }
  function nextIndex() { for (var i = 0; i < STOPS.length; i++) if (!S.stamps[STOPS[i].id]) return i; return -1; }
  function totalStars() { return STOPS.reduce(function (n, s) { return n + (S.stamps[s.id] ? S.stamps[s.id].stars : 0); }, 0); }

  /* ------------------------------------------------------------ sound (synthesised, no files) */
  var Snd = {
    ctx: null, on: store.get('eg.sound') !== 'off',
    init: function () {
      if (!this.ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) this.ctx = new AC(); }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    tone: function (f, dur, type, vol, when, slide) {
      if (!this.on || !this.ctx) return;
      var c = this.ctx, t0 = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    },
    noise: function (dur, vol, when, freq) {
      if (!this.on || !this.ctx) return;
      var c = this.ctx, t0 = c.currentTime + (when || 0), n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      src.buffer = b; f.type = 'bandpass'; f.frequency.value = freq || 1200; g.gain.value = vol || 0.3;
      src.connect(f); f.connect(g); g.connect(c.destination); src.start(t0);
    },
    tap: function () { this.tone(560, 0.05, 'triangle', 0.12); },
    good: function () { this.tone(660, 0.09, 'triangle', 0.18); this.tone(990, 0.16, 'triangle', 0.18, 0.08); },
    bad: function () { this.tone(190, 0.2, 'square', 0.06, 0, 110); },
    stamp: function () { this.noise(0.12, 0.6, 0, 700); this.tone(80, 0.3, 'sine', 0.7, 0, 38); },
    star: function (i) { this.tone(740 + i * 200, 0.2, 'triangle', 0.16); },
    dice: function () { for (var i = 0; i < 7; i++) this.noise(0.035, 0.35, i * 0.08 + Math.random() * 0.03, 2600); },
    doum: function () { this.tone(95, 0.32, 'sine', 0.55, 0, 55); },
    tek: function (w) { this.noise(0.05, 0.3, w || 0, 5200); },
    light: function () { this.tone(1100, 0.16, 'sine', 0.12, 0, 1650); },
    flower: function () { this.tone(880, 0.07, 'sine', 0.15); this.tone(1320, 0.1, 'sine', 0.12, 0.06); },
    plop: function () { this.tone(320, 0.12, 'sine', 0.3, 0, 140); },
    count: function (last) { this.tone(last ? 880 : 440, last ? 0.3 : 0.12, 'triangle', 0.18); },
    win: function () { var self = this; [523, 659, 784, 1047, 1319].forEach(function (f, i) { self.tone(f, 0.28, 'triangle', 0.16, i * 0.11); }); this.doum(); this.tek(0.22); this.tek(0.33); this.doum(); }
  };
  function buzz(p) { if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) { /* ignore */ } } }

  /* ------------------------------------------------------------ dom roots */
  var app = $('#app'), bar = $('#bar'), screen = $('#screen'), ovl = $('#ovl');
  var cleanup = [];
  function runCleanup() { cleanup.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } }); cleanup = []; }
  function setScreen(html, cls) {
    runCleanup();
    screen.className = 'screen ' + (cls || '');
    screen.innerHTML = html;
    if (!reduce) { screen.classList.remove('enter'); void screen.offsetWidth; screen.classList.add('enter'); }
  }
  function openOvl(html, center) {
    ovl.className = 'ovl' + (center ? ' ovl--center' : '');
    ovl.innerHTML = html; ovl.hidden = false;
  }
  function closeOvl() { ovl.hidden = true; ovl.innerHTML = ''; }
  function toast(msg, kind, host) {
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' ' + kind : '');
    el.textContent = msg;
    (host || screen).appendChild(el);
    setTimeout(function () { el.remove(); }, 1500);
  }

  /* ------------------------------------------------------------ static bits */
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.title = t('title');
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
  }
  function langToggle() {
    return '<div class="lang" role="group" aria-label="Language / 语言"><button type="button" data-lang="en" aria-pressed="' + (lang === 'en') + '">EN</button><button type="button" data-lang="zh" aria-pressed="' + (lang === 'zh') + '">中文</button></div>';
  }
  function renderBar() {
    bar.hidden = false;
    bar.innerHTML =
      '<button type="button" class="chip" data-passport aria-label="' + esc(t('bar.passport')) + '">' + icon('star') + '<span>' + esc(t('bar.passport')) + '</span><b>' + doneCount() + '/5</b></button>' +
      '<span class="bar__space"></span>' +
      '<button type="button" class="iconbtn" data-sound aria-label="' + esc(t(Snd.on ? 'bar.soundOn' : 'bar.soundOff')) + '">' + icon(Snd.on ? 'sound' : 'close') + '</button>' +
      langToggle();
  }

  /* ------------------------------------------------------------ stamps */
  function fmtDate(ms) {
    var d = new Date(ms), mo = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return lang === 'zh' ? d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate() : ('0' + d.getDate()).slice(-2) + ' ' + mo[d.getMonth()] + ' ' + d.getFullYear();
  }
  function stampSVG(i, rec) {
    var s = STOPS[i], ink = s.ink, name = L(s).place, up = lang === 'zh' ? name : name.toUpperCase();
    var stars = '', k;
    for (k = 0; k < 3; k++) stars += '<polygon points="' + starPoints(82 + k * 18, 158, 7) + '" fill="' + (k < rec.stars ? ink : 'none') + '" stroke="' + ink + '" stroke-width="1.6"/>';
    var shape, inner, title;
    var pid = 'sp' + i + Math.random().toString(36).slice(2, 6);
    switch (i % 5) {
      case 0: /* double circle with text on the arc */
        shape = '<circle cx="100" cy="100" r="92" fill="none" stroke="' + ink + '" stroke-width="6"/>';
        inner = '<circle cx="100" cy="100" r="78" fill="none" stroke="' + ink + '" stroke-width="2"/>';
        title = '<defs><path id="' + pid + '" d="M30 100 A70 70 0 0 1 170 100"/></defs><text font-family="Archivo, sans-serif" font-weight="800" font-size="17" letter-spacing="2" fill="' + ink + '" text-anchor="middle"><textPath href="#' + pid + '" startOffset="50%">' + esc(up) + '</textPath></text>';
        break;
      case 1: /* rounded rectangle */
        shape = '<rect x="10" y="22" width="180" height="156" rx="18" fill="none" stroke="' + ink + '" stroke-width="6"/>';
        inner = '<rect x="22" y="34" width="156" height="132" rx="10" fill="none" stroke="' + ink + '" stroke-width="2"/><line x1="22" y1="66" x2="178" y2="66" stroke="' + ink + '" stroke-width="2"/>';
        title = '<text x="100" y="57" font-family="Archivo, sans-serif" font-weight="800" font-size="17" letter-spacing="2" fill="' + ink + '" text-anchor="middle">' + esc(up) + '</text>';
        break;
      case 2: /* octagon */
        shape = '<polygon points="62,10 138,10 190,62 190,138 138,190 62,190 10,138 10,62" fill="none" stroke="' + ink + '" stroke-width="6"/>';
        inner = '<polygon points="67,23 133,23 177,67 177,133 133,177 67,177 23,133 23,67" fill="none" stroke="' + ink + '" stroke-width="2"/>';
        title = '<text x="100" y="56" font-family="Archivo, sans-serif" font-weight="800" font-size="15" letter-spacing="1.5" fill="' + ink + '" text-anchor="middle">' + esc(up) + '</text>';
        break;
      case 3: /* scalloped circle */
        var d = '', n = 20;
        for (k = 0; k <= n; k++) {
          var a = k / n * Math.PI * 2, r = k % 2 ? 84 : 94;
          d += (k ? 'L' : 'M') + (100 + r * Math.cos(a)).toFixed(1) + ' ' + (100 + r * Math.sin(a)).toFixed(1);
        }
        shape = '<path d="' + d + 'Z" fill="none" stroke="' + ink + '" stroke-width="5" stroke-linejoin="round"/>';
        inner = '<circle cx="100" cy="100" r="72" fill="none" stroke="' + ink + '" stroke-width="2" stroke-dasharray="3 4"/>';
        title = '<defs><path id="' + pid + '" d="M38 100 A62 62 0 0 1 162 100"/></defs><text font-family="Archivo, sans-serif" font-weight="800" font-size="15" letter-spacing="1.5" fill="' + ink + '" text-anchor="middle"><textPath href="#' + pid + '" startOffset="50%">' + esc(up) + '</textPath></text>';
        break;
      default: /* oval */
        shape = '<ellipse cx="100" cy="100" rx="94" ry="80" fill="none" stroke="' + ink + '" stroke-width="6"/>';
        inner = '<ellipse cx="100" cy="100" rx="80" ry="66" fill="none" stroke="' + ink + '" stroke-width="2"/>';
        title = '<text x="100" y="62" font-family="Archivo, sans-serif" font-weight="800" font-size="16" letter-spacing="2" fill="' + ink + '" text-anchor="middle">' + esc(up) + '</text>';
    }
    return '<svg class="stamp" viewBox="0 0 200 200" role="img" aria-label="' + esc(name) + '" style="--icon-fill:transparent;color:' + ink + '">' +
      '<g filter="url(#inkRough)" opacity=".92">' + shape + inner + title +
        '<svg x="74" y="66" width="52" height="52" viewBox="0 0 32 32" fill="none" stroke="' + ink + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><use href="#i-' + s.icon + '"/></svg>' +
        '<text x="100" y="138" font-family="Aref Ruqaa, serif" font-weight="700" font-size="17" fill="' + ink + '" text-anchor="middle" direction="rtl">' + esc(s.ar) + '</text>' +
        stars +
        '<text x="100" y="180" font-family="Archivo, sans-serif" font-weight="700" font-size="10" letter-spacing="1" fill="' + ink + '" text-anchor="middle">' + esc(fmtDate(rec.at)) + '</text>' +
      '</g></svg>';
  }

  function passportView() {
    var slots = STOPS.map(function (s, i) {
      var rec = S.stamps[s.id];
      if (rec) return '<div class="slot has"><div style="transform:rotate(' + rec.rot + 'deg);width:100%;display:grid;place-items:center">' + stampSVG(i, rec) + '</div></div>';
      return '<div class="slot"><div class="slot__empty">' + icon(s.icon) + '<span>' + esc(L(s).place) + '</span><span>' + esc(t('pass.empty')) + '</span></div></div>';
    }).join('');
    openOvl('<div class="card pp guilloche" role="dialog" aria-label="' + esc(t('pass.title')) + '">' +
      '<div class="pp__head"><h2>' + esc(t('pass.title')) + '</h2><span>' + esc(t('pass.count', { n: doneCount() })) + ' · ' + esc(t('pass.stars', { s: totalStars() })) + '</span></div>' +
      '<div class="pp__grid">' + slots + '</div>' +
      '<button type="button" class="btn btn--blue btn--wide" data-close-ovl>' + esc(t('pass.close')) + '</button></div>');
  }

  /* ------------------------------------------------------------ screen: cover */
  function renderCover() {
    bar.hidden = true;
    var today = new Date();
    var nameVal = esc(S.name || '');
    setScreen(
      '<div class="cover">' +
        '<div class="cover__top">' + langToggle() + '</div>' +
        '<div class="book" id="book">' +
          '<div class="book__inner guilloche">' + idPage(nameVal, today) + '</div>' +
          '<div class="book__cover"><div class="book__face">' +
            '<span class="book__kicker foil">' + esc(t('cover.kicker')) + '</span>' +
            '<span class="book__emblem">' + icon('star') + '</span>' +
            '<span class="book__ar ar foil" lang="ar">مصر</span>' +
            '<span class="book__en foil">Egypt</span>' +
          '</div><div class="book__back"></div></div>' +
        '</div>' +
        '<div class="cover__text" id="coverText"><p>' + esc(t('cover.sub')) + '</p><span class="cover__time">' + icon('clock') + esc(t('cover.time')) + '</span></div>' +
        '<div class="cover__actions" id="coverActions">' +
          '<button type="button" class="btn btn--gold btn--wide" data-open-book>' + esc(t('cover.open')) + icon('arrow') + '</button>' +
          '<a class="link" href="guide.html?lang=' + lang + '">' + esc(t('cover.guide')) + '</a>' +
          '<a class="link" style="font-size:.75rem" href="guide.html?lang=' + lang + '#credits">' + esc(t('credits')) + '</a>' +
        '</div>' +
      '</div>', 'is-cover');
  }
  function mrz(name) {
    var n = (name || '').toUpperCase().normalize('NFD').replace(/[^A-Z]/g, '').slice(0, 14) || 'TRAVELER';
    var line1 = ('P<EGY' + n + '<<FRIEND<OF<EGYPT' + '<'.repeat(44)).slice(0, 44);
    var line2 = (C.booth.en.toUpperCase().replace(/[^A-Z]/g, '<') + '<<' + new Date().getFullYear() + '<'.repeat(44)).slice(0, 44);
    return line1 + '\n' + line2;
  }
  function idPage(nameVal, d) {
    return '<div class="idp">' +
      '<div class="idp__head"><span>' + esc(t('cover.kicker')) + '</span>' + ar('مصر') + '</div>' +
      '<div class="idp__row"><div class="idp__photo">' + icon('lantern') + '</div><dl>' +
        '<div><dt>' + esc(t('id.status')) + '</dt><dd>' + esc(t('id.statusVal')) + '</dd></div>' +
        '<div><dt>' + esc(t('id.issued')) + '</dt><dd>' + esc(L(C.booth)) + '</dd></div>' +
        '<div><dt>' + esc(t('id.date')) + '</dt><dd>' + esc(d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })) + '</dd></div>' +
      '</dl></div>' +
      '<label>' + esc(t('id.name')) + '<input id="travName" maxlength="24" autocomplete="off" value="' + nameVal + '" placeholder="' + esc(t('id.placeholder')) + '"></label>' +
      '<button type="button" class="btn btn--blue btn--wide" data-start>' + esc(t('id.start')) + icon('arrow') + '</button>' +
      '<pre class="mrz" id="mrz">' + esc(mrz(S.name)) + '</pre>' +
    '</div>';
  }
  function openBook() {
    Snd.init(); Snd.tap();
    var book = $('#book'); book.classList.add('is-open');
    $('#coverText').style.visibility = 'hidden';
    $('#coverActions').style.visibility = 'hidden';
    setTimeout(function () { Snd.tone(300, 0.25, 'sine', 0.12, 0, 600); var inp = $('#travName'); if (inp && window.innerWidth > 700) inp.focus({ preventScroll: true }); }, 700);
  }

  /* ------------------------------------------------------------ screen: map */
  var BOARD = {
    w: 400, h: 1060,
    stops: [ [92, 110], [128, 322], [290, 306], [286, 432], [214, 922] ],
    start: [40, 78],
    dock: 40,
    legs: [
      'M40 78 Q 70 100 92 110',
      'M92 110 C 110 190, 140 250, 128 322',
      'M128 322 C 170 352, 250 352, 290 306',
      'M290 306 C 322 350, 312 402, 286 432',
      'M286 432 Q 230 452 212 480 C 204 520, 120 560, 150 640 S 300 760, 250 840 Q 222 880 214 922'
    ],
    river: 'M210 262 C 200 330, 220 380, 210 470 C 204 520, 120 560, 150 640 S 300 760, 250 840 S 200 960, 214 1010',
    delta: ['M210 262 C 190 200, 160 140, 150 72', 'M210 262 C 228 200, 262 140, 276 72']
  };
  function boardSVG(tokenPos) {
    var B = BOARD, s = '';
    s += '<svg viewBox="0 0 ' + B.w + ' ' + B.h + '" aria-hidden="false" role="img" aria-label="' + esc(t('map.title')) + '">';
    s += '<defs><clipPath id="bclip"><rect width="' + B.w + '" height="' + B.h + '"/></clipPath></defs><g clip-path="url(#bclip)">';
    /* sea */
    s += '<path class="b-sea" d="M0 0 H400 V64 Q 350 80 300 68 T 200 70 T 100 66 T 0 72 Z"/>';
    s += '<text class="b-sea-label" x="300" y="34" text-anchor="middle">' + esc(t('map.sea')) + '</text>';
    /* delta fan and green strip */
    s += '<path d="M150 70 L276 70 L210 262 Z" fill="#DCEBC9"/>';
    s += '<path class="b-green" d="' + B.river + '"/>';
    B.delta.forEach(function (d) { s += '<path class="b-river" style="stroke-width:7" d="' + d + '"/>'; });
    s += '<path class="b-river" d="' + B.river + '"/>';
    s += '<path class="b-river-hi" d="' + B.river + '"/>';
    /* lake nasser */
    s += '<path d="M170 1000 Q 214 990 250 1004 Q 290 1030 250 1060 H170 Q 150 1030 170 1000 Z" fill="#3F6FD1"/>';
    /* Cairo district ring */
    s += '<circle cx="210" cy="378" r="126" fill="none" stroke="#16171C" stroke-opacity=".28" stroke-width="1.5" stroke-dasharray="4 6"/>';
    s += '<text x="318" y="262" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="850" font-size="13" letter-spacing="3" fill="#16171C" fill-opacity=".55">' + esc(lang === 'zh' ? '开罗' : 'CAIRO') + '</text>';
    /* decorations: pyramids (yes, they are here too), palms, luxor, nubian houses, rocks */
    s += '<g class="b-deco"><path class="b-deco-fill" d="M40 520 L66 478 L92 520 Z"/><path class="b-deco-fill" d="M74 520 L94 488 L114 520 Z"/><path d="M40 520 L66 478 L92 520 Z M74 520 L94 488 L114 520 Z M30 520 H124"/></g>';
    s += '<text x="77" y="540" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" font-style="italic" font-weight="600" fill="#7A7262">' + esc(lang === 'zh' ? '吉萨（对，金字塔在这儿）' : 'Giza (yes, the pyramids)') + '</text>';
    [[300, 600], [318, 616], [86, 700], [104, 716], [330, 900], [96, 880], [120, 980]].forEach(function (p) {
      s += '<g class="b-deco" transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 18 Q 2 8 0 0"/><path d="M0 0 Q -10 -4 -14 2 M0 0 Q 10 -5 14 1 M0 0 Q -4 -10 -10 -12 M0 0 Q 5 -10 11 -11"/></g>';
    });
    s += '<g class="b-deco" transform="translate(300 700)"><path class="b-deco-fill" d="M0 0 H54 V8 H0 Z"/><path d="M4 8 V36 M16 8 V36 M28 8 V36 M40 8 V36 M50 8 V36 M-2 36 H56 M0 0 H54 V8 H0 Z"/></g>';
    s += '<text x="327" y="764" text-anchor="middle" font-family="Archivo, sans-serif" font-size="11" font-weight="700" fill="#7A7262">' + esc(lang === 'zh' ? '卢克索' : 'Luxor') + '</text>';
    s += '<g transform="translate(96 940)"><rect x="0" y="10" width="22" height="16" fill="#F2B33D"/><path d="M0 10 Q 11 -2 22 10" fill="#F2B33D"/><rect x="24" y="12" width="20" height="14" fill="#7FB3E8"/><rect x="46" y="8" width="18" height="18" fill="#E58A7A"/><path class="b-deco" d="M0 26 H64"/></g>';
    s += '<text x="210" y="1000" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="850" font-size="12" letter-spacing="3" fill="#fff">' + esc(t('map.nile').toUpperCase()) + '</text>';
    /* route */
    B.legs.forEach(function (d) { s += '<path class="b-route" d="' + d + '"/>'; });
    /* stops */
    var next = nextIndex();
    STOPS.forEach(function (st, i) {
      var p = B.stops[i], rec = S.stamps[st.id], state = rec ? 'is-done' : (i === next ? 'is-next' : 'is-locked');
      var lx = p[0], anchor = 'middle', ly = p[1] + (rec ? 62 : 46);
      s += '<g class="stop ' + state + '" data-stop="' + i + '" tabindex="0" role="button" aria-label="' + esc(L(st).place + ': ' + L(st).title) + '">' +
        '<circle class="stop__halo" cx="' + p[0] + '" cy="' + p[1] + '" r="28"/>' +
        '<circle class="stop__disc" cx="' + p[0] + '" cy="' + p[1] + '" r="27"/>' +
        '<svg class="stop__icon" x="' + (p[0] - 16) + '" y="' + (p[1] - 16) + '" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><use href="#i-' + (rec ? 'check' : (state === 'is-locked' ? st.icon : st.icon)) + '"/></svg>' +
        '<circle class="stop__numbg" cx="' + (p[0] - 20) + '" cy="' + (p[1] - 20) + '" r="11"/>' +
        '<text class="stop__num" x="' + (p[0] - 20) + '" y="' + (p[1] - 15.5) + '" text-anchor="middle">' + (i + 1) + '</text>' +
        '<text class="stop__label" x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + esc(L(st).place) + '</text>' +
        '<text class="stop__sub" x="' + lx + '" y="' + (ly + 15) + '" text-anchor="' + anchor + '">' + esc(L(st).title) + '</text>';
      if (rec) {
        s += '<g class="stop__stars">';
        for (var k = 0; k < 3; k++) s += '<polygon class="' + (k < rec.stars ? '' : 'off') + '" points="' + starPoints(p[0] - 14 + k * 14, p[1] + 38, 6) + '"/>';
        s += '</g>';
      }
      s += '</g>';
    });
    /* traveling felucca token */
    s += '<g class="token" id="token" style="transform:translate(' + tokenPos[0] + 'px,' + (tokenPos[1] - B.dock) + 'px)"><circle class="token__bg" r="17"/><svg class="icon" x="-12" y="-13" width="24" height="24" viewBox="0 0 32 32"><use href="#i-boat"/></svg></g>';
    s += '</g></svg>';
    return s;
  }

  var sheetIndex = null;
  function renderMap(arriveFrom) {
    renderBar();
    var next = nextIndex();
    var arriving = arriveFrom != null && next !== -1;
    var firstVisit = next === 0 && !S.sailedIn;
    /* the boat waits at the stop you are heading to; after a new stamp it sails there */
    var posIdx = next === -1 ? STOPS.length - 1 : (arriving ? arriveFrom : next);
    var tokenPos = firstVisit ? BOARD.start : BOARD.stops[posIdx];
    sheetIndex = next === -1 ? null : next;
    setScreen(
      '<div class="mapwrap" id="mapwrap"><div class="board"><div class="board__head"><h1>' + esc(t('map.title')) + '</h1><p>' + esc(t('pass.count', { n: doneCount() })) + ' · ' + esc(t('pass.stars', { s: totalStars() })) + '</p></div>' + boardSVG(tokenPos) + '</div></div>' +
      '<div id="sheetHost"></div>', 'is-map');
    renderSheet();
    scrollToStop(posIdx, false);
    if (arriving) {
      setTimeout(function () { sailTo(arriveFrom, next); }, 450);
    } else if (firstVisit) {
      S.sailedIn = true; save();
      setTimeout(function () { sailTo(-1, 0); }, 500);
    }
  }
  function scrollToStop(i, smooth) {
    var wrap = $('#mapwrap'); if (!wrap) return;
    var svg = $('.board svg', wrap); if (!svg) return;
    var scale = svg.getBoundingClientRect().width / BOARD.w;
    var y = svg.getBoundingClientRect().top - wrap.getBoundingClientRect().top + wrap.scrollTop + BOARD.stops[Math.max(0, i)][1] * scale;
    wrap.scrollTo({ top: Math.max(0, y - wrap.clientHeight * 0.38), behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }
  function sailTo(from, to) {
    var tok = $('#token'); if (!tok) return;
    var d = BOARD.legs[to];
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d); path.style.visibility = 'hidden';
    $('.board svg').appendChild(path);
    var len = path.getTotalLength(), dur = reduce ? 1 : Math.min(2600, 700 + len * 4), t0 = performance.now();
    tok.style.transition = 'none';
    Snd.tone(220, 0.4, 'sine', 0.08, 0, 330);
    function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      var pt = path.getPointAtLength(e * len);
      tok.style.transform = 'translate(' + pt.x + 'px,' + (pt.y - BOARD.dock) + 'px)';
      if (k < 1) { raf = requestAnimationFrame(step); followScroll(pt.y); }
      else { path.remove(); Snd.tone(660, 0.12, 'triangle', 0.12); }
    }
    var raf = requestAnimationFrame(step);
    cleanup.push(function () { cancelAnimationFrame(raf); });
  }
  function followScroll(y) {
    var wrap = $('#mapwrap'), svg = wrap && $('.board svg', wrap); if (!svg) return;
    var scale = svg.getBoundingClientRect().width / BOARD.w;
    var py = svg.getBoundingClientRect().top - wrap.getBoundingClientRect().top + wrap.scrollTop + y * scale;
    wrap.scrollTop = Math.max(0, py - wrap.clientHeight * 0.38);
  }
  function renderSheet() {
    var host = $('#sheetHost'); if (!host) return;
    var next = nextIndex();
    if (next === -1 && sheetIndex == null) {
      host.innerHTML = '<div class="sheet"><div class="sheet__row"><div class="sheet__tile" style="background:var(--gold);color:#2A1E05;box-shadow:0 4px 0 #A9853A">' + icon('gift') + '</div><div><p class="sheet__k">' + esc(t('pass.stars', { s: totalStars() })) + '</p><h2>' + esc(t('map.allDone')) + '</h2></div></div>' +
        '<button type="button" class="btn btn--gold btn--wide" data-finale>' + esc(t('map.claim')) + icon('arrow') + '</button></div>';
      return;
    }
    var i = sheetIndex == null ? next : sheetIndex, st = STOPS[i], rec = S.stamps[st.id];
    host.innerHTML = '<div class="sheet"><div class="sheet__row"><div class="sheet__tile">' + icon(st.icon) + '</div><div style="min-width:0">' +
      '<p class="sheet__k">' + esc(t('map.stop', { n: i + 1 })) + ' · ' + esc(t('map.sec')) + '</p><h2>' + esc(L(st).title) + '</h2>' +
      '<p class="sheet__place">' + esc(L(st).place) + ar(st.ar) + '</p></div></div>' +
      '<button type="button" class="btn ' + (rec ? 'btn--paper' : 'btn--blue') + ' btn--wide" data-play="' + i + '">' + esc(t(rec ? 'map.replay' : 'map.play')) + icon('arrow') + '</button>' +
      (next === -1 ? '<button type="button" class="btn btn--gold btn--wide" data-finale>' + esc(t('map.claim')) + icon('arrow') + '</button>' : '') +
      '</div>';
  }
  function tapStop(i) {
    var next = nextIndex(), st = STOPS[i];
    if (!S.stamps[st.id] && i !== next) { Snd.bad(); toast(t('map.locked'), 'bad'); return; }
    Snd.tap(); sheetIndex = i; renderSheet();
  }

  /* ------------------------------------------------------------ screen: play a stop */
  var current = null;
  function playStop(i) {
    var st = STOPS[i];
    bar.hidden = true;
    setScreen(
      '<div class="scenebg" style="background-image:url(assets/img/' + st.bg + ')" aria-hidden="true"></div>' +
      '<div class="gbar"><button type="button" class="iconbtn" data-quit aria-label="' + esc(t('game.back')) + '">' + icon('close') + '</button>' +
        '<div class="gbar__title"><b>' + esc(L(st).title) + '</b><span>' + esc(t('map.stop', { n: i + 1 })) + ' · ' + esc(L(st).place) + '</span></div>' +
        '<span class="pill" id="pill"></span></div>' +
      '<div class="timebar" id="timebar" hidden><i id="timefill"></i></div>' +
      '<div class="stage" id="stage"></div>', 'is-play');
    current = { i: i, game: null };
    /* the lesson: real photo, what it is in two sentences, then how to play */
    var les = L(G.lessons[st.id]);
    openOvl('<div class="card lesson">' +
      '<div class="lesson__photo" style="background-image:url(assets/img/' + st.bg + ')"></div>' +
      '<p class="card__k">' + icon('book') + esc(t('learn.k')) + ' · ' + esc(t('map.stop', { n: i + 1 })) + ' · ' + esc(L(st).place) + ' ' + ar(st.ar) + '</p>' +
      '<h2>' + esc(les.t) + '</h2>' +
      '<p class="lesson__text">' + esc(les.d) + '</p>' +
      '<div class="how"><div class="how__tile">' + icon(st.icon) + '</div><div><b style="font-size:.8rem;color:var(--blue)">' + esc(t('game.how')) + ' · ' + esc(L(st).title) + '</b><p>' + esc(L(st).how) + '</p></div></div>' +
      '<button type="button" class="btn btn--blue btn--wide" data-go="' + i + '">' + esc(t('learn.go')) + icon('arrow') + '</button></div>');
  }
  function learnedHTML(list) {
    if (!list || !list.length) return '';
    return '<div class="learned"><b class="learned__k">' + esc(t('res.learned')) + '</b><ul>' + list.map(function (w) {
      return '<li>' + (w.ar ? ar(w.ar) : '') + '<span><b>' + esc(w.tr) + '</b>' + esc(w.m) + '</span></li>';
    }).join('') + '</ul></div>';
  }
  function countdown() {
    return new Promise(function (resolve) {
      var steps = ['3', '2', '1', t('game.go')], k = 0;
      var host = document.createElement('div'); host.className = 'count'; screen.appendChild(host);
      (function tick() {
        if (k >= steps.length) { host.remove(); resolve(); return; }
        host.innerHTML = '<span>' + esc(steps[k]) + '</span>';
        Snd.count(k === steps.length - 1);
        k++; setTimeout(tick, reduce ? 150 : 620);
      })();
    });
  }
  function startGame(i) {
    closeOvl(); Snd.init();
    countdown().then(function () {
      if (!current || current.i !== i) return;
      var st = STOPS[i];
      var ctx = {
        stage: $('#stage'), lang: lang, t: t, L: L, esc: esc, icon: icon, ar: ar, shuffle: shuffle, wait: wait, reduce: reduce,
        sfx: Snd, buzz: buzz, data: G, words: EG.words,
        toast: function (m, k) { toast(m, k); },
        pill: function (html) { var p = $('#pill'); if (p) p.innerHTML = html; },
        warn: function (on) { var p = $('#pill'); if (p) p.classList.toggle('warn', !!on); },
        time: function (frac) {
          var tb = $('#timebar'), f = $('#timefill'); if (!tb) return;
          if (frac == null) { tb.hidden = true; return; }
          tb.hidden = false; f.style.transform = 'scaleX(' + Math.max(0, Math.min(1, frac)) + ')';
        },
        onCleanup: function (fn) { cleanup.push(fn); },
        done: function (stars, learned) { finishGame(i, stars, learned); }
      };
      current.game = window.EG_MINI[st.game](ctx);
    });
  }
  function finishGame(i, stars, learned) {
    if (!current || current.i !== i || current.finished) return;
    current.finished = true;
    var st = STOPS[i];
    stars = Math.max(1, Math.min(3, stars));
    setTimeout(function () {
      runCleanup();
      var starHtml = '';
      for (var k = 0; k < 3; k++) starHtml += '<svg viewBox="0 0 56 56" class="' + (k < stars ? 'on' : '') + '"><polygon points="' + starPoints(28, 29, 25) + '"/></svg>';
      openOvl('<div class="card result"><div class="stars">' + starHtml + '</div><h2>' + esc(t('res.' + stars)) + '</h2>' +
        learnedHTML(learned) +
        '<div class="fact"><b>' + esc(t('res.fact')) + '</b><p>' + esc(L(st).fact) + '</p></div>' +
        '<button type="button" class="btn btn--gold btn--wide" data-stamp="' + i + '" data-stars="' + stars + '">' + esc(t('res.stamp')) + '</button></div>', true);
      Snd.good();
      for (var j = 0; j < stars; j++) (function (j) { setTimeout(function () { Snd.star(j); }, 300 + j * 250); })(j);
    }, 500);
  }
  function stampIt(i, stars) {
    var st = STOPS[i], prev = S.stamps[st.id], first = !prev;
    var rec = { stars: Math.max(stars, prev ? prev.stars : 0), at: prev ? prev.at : Date.now(), rot: prev ? prev.rot : Math.round(Math.random() * 16 - 8) };
    S.stamps[st.id] = rec; save();
    openOvl('<div class="slam"><div class="slam__page guilloche" id="slamPage"><div class="slam__stamp" style="--r:' + rec.rot + 'deg">' + stampSVG(i, rec) + '</div></div></div>', true);
    setTimeout(function () { Snd.stamp(); buzz([30, 30, 60]); var pg = $('#slamPage'); if (pg) pg.classList.add('shake'); }, reduce ? 50 : 420);
    setTimeout(function () {
      closeOvl();
      current = null;
      if (nextIndex() === -1 && first) { renderFinale(); return; }
      renderMap(first ? i : null);
      var chip = $('.chip'); if (chip) { chip.classList.add('bump'); }
    }, reduce ? 900 : 1700);
  }

  /* ------------------------------------------------------------ finale + ticket */
  function newCode() {
    var A = 'ACDEFHJKMNPRTUVWXY34679', out = '', buf = new Uint32Array(4);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < 4; i++) out += A[buf[i] % A.length];
    return 'EG-' + out;
  }
  function locale() { return lang === 'zh' ? 'zh-CN' : 'en-GB'; }
  function fmtStamp(ms) { return new Date(ms).toLocaleString(locale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  function fmtClock(d) { return d.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); }
  function ticketHTML(tk) {
    var perfect = tk.stars >= G.settings.perfectStars;
    return '<div class="ticket' + (tk.redeemedAt ? ' is-redeemed' : '') + '"' + (tk.redeemedAt ? '' : ' data-live') + '>' +
      '<div class="ticket__main"><div class="ticket__top"><span class="ticket__title">' + esc(t('ticket.title')) + '</span>' + ar('هدية') + '</div>' +
      '<p class="ticket__code">' + esc(tk.code) + '</p>' +
      '<dl class="ticket__meta">' +
        (tk.name ? '<div><dt>' + esc(t('ticket.name')) + '</dt><dd>' + esc(tk.name) + '</dd></div>' : '') +
        '<div><dt>' + esc(t('ticket.stars')) + '</dt><dd>' + tk.stars + ' / 15</dd></div>' +
        '<div><dt>' + esc(t('ticket.time')) + '</dt><dd>' + esc(fmtStamp(tk.issuedAt)) + '</dd></div></dl>' +
      (perfect ? '<span class="ticket__perfect">' + icon('star') + esc(t('ticket.perfect')) + '</span>' : '') + '</div>' +
      '<div class="ticket__stub"><span class="ticket__seal">' + icon('star') + '</span><span class="ticket__clock" data-clock>' + esc(fmtClock(new Date())) + '</span></div>' +
      '<div class="ticket__stamp"' + (tk.redeemedAt ? '' : ' aria-hidden="true"') + '>' + esc(t('ticket.redeemed')) + '</div></div>';
  }
  function renderFinale() {
    if (!S.ticket) { S.ticket = { code: newCode(), stars: totalStars(), name: S.name || '', issuedAt: Date.now(), redeemedAt: null }; save(); }
    renderBar();
    var tk = S.ticket;
    var mini = STOPS.map(function (s, i) { return S.stamps[s.id] ? '<div style="width:19%;transform:rotate(' + S.stamps[s.id].rot + 'deg)">' + stampSVG(i, S.stamps[s.id]) + '</div>' : ''; }).join('');
    setScreen('<div class="fin" id="fin">' +
      '<div class="tanoura" aria-hidden="true"><div class="tanoura__skirt"></div><div class="tanoura__skirt s2"></div><div class="tanoura__skirt s3"></div><div class="tanoura__head">' + ar('مبروك') + '</div></div>' +
      '<h1>' + esc(t('fin.title')) + '</h1>' +
      '<p class="fin__sub">' + esc(t('fin.sub')) + '</p>' +
      '<span class="fin__stars"><svg viewBox="0 0 20 20"><polygon points="' + starPoints(10, 10.5, 9) + '"/></svg>' + esc(t('fin.stars', { s: tk.stars })) + '</span>' +
      '<div style="display:flex;justify-content:center;gap:2%;margin-top:16px">' + mini + '</div>' +
      '<div class="recap"><b class="recap__k">' + esc(t('fin.learned')) + '</b><ul>' + STOPS.map(function (s) {
        return '<li>' + icon(s.icon) + '<span><b>' + esc(L(s).place) + '</b>' + esc(L(G.lessons[s.id]).r) + '</span></li>';
      }).join('') + '</ul></div>' +
      '<div class="fin__ticket">' + ticketHTML(tk) +
        (tk.redeemedAt
          ? '<p class="redeemed">' + icon('check') + esc(t('ticket.redeemedAt', { time: fmtStamp(tk.redeemedAt) })) + '</p>'
          : '<p class="ticket__live">' + icon('star') + '<span>' + esc(t('ticket.show')) + (lang === 'zh' ? '' : ' ') + esc(t('ticket.live')) + '</span></p>' +
            '<button type="button" class="hold" id="holdBtn" style="--hold:' + C.staffHoldMs + 'ms"><span class="hold__fill"></span><span>' + esc(t('ticket.hold')) + '</span></button>') +
      '</div>' +
      '<div class="fin__links"><button type="button" class="btn btn--ghost" data-tomap>' + icon('replay') + esc(t('fin.again')) + '</button>' +
        '<a class="link" href="guide.html?lang=' + lang + '">' + esc(t('fin.guide')) + '</a>' +
        '<a class="link" style="font-size:.75rem" href="guide.html?lang=' + lang + '#credits">' + esc(t('credits')) + '</a></div>' +
    '</div>', 'is-fin');
    var clock = setInterval(function () { var el = $('[data-clock]'); if (el) el.textContent = fmtClock(new Date()); }, 1000);
    cleanup.push(function () { clearInterval(clock); });
    bindHold();
    if (!S.celebrated) { S.celebrated = true; save(); Snd.win(); buzz([40, 60, 40, 60, 120]); confetti(); }
  }
  function bindHold() {
    var btn = $('#holdBtn'); if (!btn) return;
    var timer = null;
    function start(e) {
      if (e.type === 'keydown' && (e.repeat || (e.key !== ' ' && e.key !== 'Enter'))) return;
      e.preventDefault(); btn.classList.add('is-holding'); timer = setTimeout(redeem, C.staffHoldMs);
    }
    function cancel() { clearTimeout(timer); btn.classList.remove('is-holding'); }
    btn.addEventListener('pointerdown', start); btn.addEventListener('keydown', start);
    ['pointerup', 'pointerleave', 'pointercancel', 'keyup', 'blur'].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }
  function redeem() {
    if (!S.ticket || S.ticket.redeemedAt) return;
    S.ticket.redeemedAt = Date.now(); save();
    Snd.stamp(); buzz([20, 40, 80]);
    var y = $('#fin') ? $('#fin').scrollTop : 0;
    renderFinale();
    if ($('#fin')) $('#fin').scrollTop = y;
  }
  function confetti() {
    if (reduce) return;
    var cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
    var dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr, c = cv.getContext('2d');
    var cols = ['#2340A8', '#D9B45A', '#B3261E', '#1D7347', '#F4F0E6', '#F2B33D'];
    var parts = []; for (var i = 0; i < 140; i++) parts.push({ x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35, vx: (Math.random() - 0.5) * 18 * dpr, vy: (-Math.random() * 16 - 6) * dpr, r: (5 + Math.random() * 7) * dpr, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, col: cols[i % cols.length] });
    var t0 = performance.now();
    (function frame(now) {
      var k = (now - t0) / 1000; c.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.45 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.col; c.globalAlpha = Math.max(0, 1 - k / 4);
        c.beginPath();
        for (var j = 0; j < 16; j++) { var ang = j * Math.PI / 8, rr = j % 2 ? p.r * 0.77 : p.r; c.lineTo(rr * Math.cos(ang), rr * Math.sin(ang)); }
        c.closePath(); c.fill(); c.restore();
      });
      if (k < 4) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  /* ------------------------------------------------------------ events */
  function rerender() {
    applyLang();
    if (screen.classList.contains('is-cover')) renderCover();
    else if (screen.classList.contains('is-map')) renderMap();
    else if (screen.classList.contains('is-fin')) renderFinale();
    if (!ovl.hidden && $('.pp', ovl)) passportView();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, [data-stop]');
    if (!el) return;
    if (el.hasAttribute('data-lang')) { var nl = el.getAttribute('data-lang'); if (nl !== lang) { lang = nl; store.set('eg.lang', lang); Snd.tap(); rerender(); } return; }
    if (el.hasAttribute('data-open-book')) { openBook(); return; }
    if (el.hasAttribute('data-start')) {
      var inp = $('#travName'); S.name = inp ? inp.value.trim().slice(0, 24) : ''; S.opened = true; save();
      Snd.init(); Snd.good(); renderMap(); return;
    }
    if (el.hasAttribute('data-passport')) { Snd.tap(); passportView(); return; }
    if (el.hasAttribute('data-close-ovl')) { Snd.tap(); closeOvl(); return; }
    if (el.hasAttribute('data-sound')) { Snd.on = !Snd.on; store.set('eg.sound', Snd.on ? 'on' : 'off'); Snd.init(); Snd.tap(); renderBar(); return; }
    if (el.hasAttribute('data-stop')) { tapStop(Number(el.getAttribute('data-stop'))); return; }
    if (el.hasAttribute('data-play')) { Snd.init(); Snd.tap(); playStop(Number(el.getAttribute('data-play'))); return; }
    if (el.hasAttribute('data-go')) { startGame(Number(el.getAttribute('data-go'))); return; }
    if (el.hasAttribute('data-quit')) { Snd.tap(); closeOvl(); current = null; renderMap(); return; }
    if (el.hasAttribute('data-stamp')) { stampIt(Number(el.getAttribute('data-stamp')), Number(el.getAttribute('data-stars'))); return; }
    if (el.hasAttribute('data-finale')) { Snd.tap(); renderFinale(); return; }
    if (el.hasAttribute('data-tomap')) { Snd.tap(); sheetIndex = 0; renderMap(); sheetIndex = 0; renderSheet(); return; }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.hasAttribute && e.target.hasAttribute('data-stop')) { e.preventDefault(); tapStop(Number(e.target.getAttribute('data-stop'))); }
    if (e.key === 'Escape' && !ovl.hidden && $('.pp', ovl)) closeOvl();
    if (e.key === 'Enter' && e.target.id === 'travName') { var b = $('[data-start]'); if (b) b.click(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'travName') { var m = $('#mrz'); if (m) m.textContent = mrz(e.target.value); }
  });
  ovl.addEventListener('click', function (e) { if (e.target === ovl && $('.pp', ovl)) closeOvl(); });

  /* ------------------------------------------------------------ boot */
  applyLang();
  if (S.ticket || nextIndex() === -1) { if (doneCount() === STOPS.length) renderFinale(); else renderMap(); }
  else if (S.opened) renderMap();
  else renderCover();
  window.EG_DEBUG = { state: S, save: save, render: function () { rerender(); } };
})();
