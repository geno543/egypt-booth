/* Egypt booth site: rendering, language switch, map and quiz. No build step, no libraries. */
(function () {
  'use strict';

  var D = window.EG;
  var C = D.config;
  var IMG = 'assets/img/';

  /* ------------------------------------------------------------ helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(id, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + id + '"></use></svg>'; }
  function tile(id, mod) { return '<span class="tile' + (mod ? ' tile--' + mod : '') + '">' + icon(id) + '</span>'; }
  function ar(text, cls) { return '<span class="ar' + (cls ? ' ' + cls : '') + '" lang="ar" dir="rtl">' + esc(text) + '</span>'; }
  function pos(p) { return p ? ' style="object-position:' + esc(p) + '"' : ''; }
  function swap(el) { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode: fine */ } }
  };

  /* ------------------------------------------------------------ language */
  function initialLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'zh') return q;
    var saved = store.get('eg.lang');
    if (saved === 'en' || saved === 'zh') return saved;
    return /^zh/i.test(navigator.language || '') ? 'zh' : 'en';
  }
  var lang = initialLang();
  function L(o) { return (o && (o[lang] || o.en)) || ''; }
  function t(key, vars) {
    var s = D.ui[lang][key];
    if (s == null) s = D.ui.en[key];
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] == null ? '' : vars[k]; });
    return s;
  }

  /* ------------------------------------------------------------ state */
  var S = { word: 'malesh', food: 'breakfast', art: 'umm', place: 'cairo' };
  var booted = false;

  /* ------------------------------------------------------------ reveal on scroll */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }) : null;

  function hydrate(root) {
    $$('[data-reveal]:not(.in)', root).forEach(function (el) {
      if (booted || !io || reduceMotion) el.classList.add('in');
      else io.observe(el);
    });
  }

  /* ------------------------------------------------------------ static text */
  function applyStatic() {
    var html = document.documentElement;
    html.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); }); /* trusted strings from content.js */
    $$('[data-i18n-alt]').forEach(function (el) { el.alt = t(el.getAttribute('data-i18n-alt')); });
    document.title = t('meta.title') + ' | ' + L(C.booth);
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('meta.desc'));
    $('#eyebrow').textContent = L(C.event) + ' · ' + L(C.booth);
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    var uni = L(C.university);
    $('#footMade').textContent = uni ? t('footer.madeU', { university: uni, event: L(C.event) }) : t('footer.made', { event: L(C.event) });
    $('[data-close-quiz]').setAttribute('aria-label', t('quiz.close'));
    $('#placeChips').setAttribute('aria-label', t('places.pick'));
    var seal = $('#sealText');
    if (seal) seal.textContent = lang === 'zh' ? 'AHLAN ✦ 欢迎 ✦ AHLAN ✦ 欢迎 ✦ AHLAN ✦ 欢迎 ✦ ' : 'AHLAN ✦ WELCOME ✦ AHLAN ✦ WELCOME ✦ ';
  }

  /* ------------------------------------------------------------ marquee */
  function renderMarquee() {
    var items = D.words.map(function (w) {
      return '<span class="marquee__item">' + ar(w.ar) + '<b>' + esc(w.tr) + '</b><span>' + esc(L(w).m) + '</span></span>' + icon('star', 'marquee__star');
    }).join('');
    $('#marquee').innerHTML = '<div class="marquee__group">' + items + '</div><div class="marquee__group">' + items + '</div>';
  }

  /* ------------------------------------------------------------ words */
  var voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    var vs = window.speechSynthesis.getVoices();
    voice = vs.filter(function (v) { return /^ar[-_]EG/i.test(v.lang); })[0] ||
            vs.filter(function (v) { return /^ar([-_]|$)/i.test(v.lang); })[0] || null;
    $$('.words__listen').forEach(function (b) { b.hidden = !voice; });
  }
  function say(text) {
    if (!voice) return;
    var u = new SpeechSynthesisUtterance(text);
    u.voice = voice; u.lang = voice.lang; u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function renderWords() {
    $('#wordList').innerHTML = D.words.map(function (w) {
      var on = w.id === S.word;
      return '<button type="button" class="word-btn" role="tab" id="w-' + w.id + '" data-word="' + w.id + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" aria-controls="wordStage">' +
        ar(w.ar) + '<b>' + esc(w.tr) + '</b></button>';
    }).join('');
    renderWordStage(false);
  }
  function renderWordStage(animate) {
    var w = D.words.filter(function (x) { return x.id === S.word; })[0];
    var l = L(w);
    var st = $('#wordStage');
    st.setAttribute('aria-labelledby', 'w-' + w.id);
    st.innerHTML =
      '<p class="words__ar ar" lang="ar" dir="rtl">' + esc(w.ar) + '</p>' +
      '<div class="words__meta">' +
        '<p class="words__tr">' + esc(w.tr) + '</p>' +
        '<p class="words__m">' + esc(l.m) + '</p>' +
        '<p class="words__label">' + esc(t('words.useit')) + '</p>' +
        '<p class="words__n">' + esc(l.n) + '</p>' +
        '<button type="button" class="btn btn--ghost btn--sm words__listen" data-say="' + esc(w.ar) + '"' + (voice ? '' : ' hidden') + '>' + icon('sound') + '<span>' + esc(t('words.listen')) + '</span></button>' +
      '</div>';
    if (animate) swap(st);
  }

  /* ------------------------------------------------------------ food */
  function renderFood() {
    $('#foodTabs').innerHTML = D.food.map(function (f) {
      var on = f.id === S.food;
      return '<button type="button" class="food-tab" role="tab" id="ft-' + f.id + '" data-food="' + f.id + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" aria-controls="foodPanel">' +
        '<span class="food-tab__time">' + esc(f.time) + '</span><span class="food-tab__label">' + esc(L(f).label) + '</span></button>';
    }).join('');
    renderFoodPanel(false);
  }
  function renderFoodPanel(animate) {
    var f = D.food.filter(function (x) { return x.id === S.food; })[0];
    var p = $('#foodPanel');
    p.setAttribute('aria-labelledby', 'ft-' + f.id);
    p.innerHTML =
      '<figure class="food__img"><img src="' + IMG + f.img + '"' + pos(f.pos) + ' alt="' + esc(f.dishes.map(function (d) { return L(d).n; }).join(', ')) + '" loading="lazy" decoding="async"></figure>' +
      '<div><ul class="dishes">' + f.dishes.map(function (d) {
        var l = L(d);
        return '<li class="dish">' + tile(d.icon) + '<div><div class="dish__name"><h3>' + esc(l.n) + '</h3>' + ar(d.ar) + '</div><p>' + esc(l.d) + '</p></div></li>';
      }).join('') + '</ul>' +
      '<p class="food__tip">' + icon('clock') + '<span><strong>' + esc(t('food.tip')) + '</strong>' + esc(L(f).tip) + '</span></p></div>';
    if (animate) swap(p);
  }

  /* ------------------------------------------------------------ daily life */
  function renderLife() {
    var x = D.life;
    var fb = x.football.img;
    $('#bento').innerHTML =
      '<figure class="cell cell--photo" data-reveal><img src="' + IMG + 'ahwa.jpg" alt="' + esc(L(x.ahwa).t) + '" loading="lazy" decoding="async"></figure>' +
      '<article class="cell cell--accent c-ahwa" data-reveal style="--d:1">' + tile('tea') + '<h3>' + esc(L(x.ahwa).t) + '</h3><p>' + esc(L(x.ahwa).d) + '</p></article>' +
      '<article class="cell cell--pattern c-tawla" data-reveal style="--d:2"><div class="cell__big">' + ar(x.tawla.ar) + tile('dice') + '</div><h3>' + esc(L(x.tawla).t) + '</h3><p>' + esc(L(x.tawla).d) + '</p></article>' +
      (fb
        ? '<article class="cell cell--split c-football" data-reveal><figure><img src="' + IMG + x.football.img + '"' + pos(x.football.pos) + ' alt="' + esc(L(x.football).t) + '" loading="lazy" decoding="async"></figure><div class="cell__txt"><h3>' + esc(L(x.football).t) + '</h3><p>' + esc(L(x.football).d) + '</p></div></article>'
        : '<article class="cell c-football" data-reveal>' + tile('ball') + '<h3>' + esc(L(x.football).t) + '</h3><p>' + esc(L(x.football).d) + '</p></article>') +
      '<article class="cell c-jokes" data-reveal style="--d:1">' + tile('laugh') + '<h3>' + esc(L(x.jokes).t) + '</h3><p>' + esc(L(x.jokes).d) + '</p></article>' +
      '<article class="cell cell--quiet c-guests" data-reveal style="--d:2">' + tile('teapot') + '<h3>' + esc(L(x.guests).t) + '</h3><p>' + esc(L(x.guests).d) + '</p></article>';
  }

  /* ------------------------------------------------------------ feasts */
  function renderFeasts() {
    var r = D.ramadan, rl = L(r);
    $('#ramadan').innerHTML =
      '<figure class="ramadan__media" data-reveal><img src="' + IMG + r.img + '"' + pos(r.pos) + ' alt="' + esc(rl.t) + '" loading="lazy" decoding="async"></figure>' +
      '<div data-reveal style="--d:1"><h3>' + esc(rl.t) + '</h3><p class="ramadan__lede">' + esc(rl.d) + '</p>' +
      '<ul class="ramadan__facts">' + r.facts.map(function (f) {
        return '<li>' + tile(f.icon) + '<div><h4>' + esc(L(f).t) + '</h4><p>' + esc(L(f).d) + '</p></div></li>';
      }).join('') + '</ul></div>';
    $('#calendar').innerHTML = D.feasts.map(function (f, i) {
      var l = L(f);
      return '<article class="feast" data-reveal style="--d:' + i + '">' + tile(f.icon) +
        '<p class="feast__when">' + esc(l.w) + '</p><h3>' + esc(l.t) + '</h3>' + ar(f.ar) + '<p>' + esc(l.d) + '</p></article>';
    }).join('');
  }

  /* ------------------------------------------------------------ arts */
  var POSTER_WORD = { cinema: 'CINEMA', mahraganat: 'MAHRAGAN' };
  function renderArts() {
    $('#strips').innerHTML = D.arts.map(function (a, i) {
      var l = L(a), open = a.id === S.art;
      var media = a.img
        ? '<img src="' + IMG + a.img + '"' + pos(a.pos) + ' alt="' + esc(l.t) + '" loading="lazy" decoding="async">'
        : '<div class="poster' + (i % 2 ? ' poster--ink' : '') + '"><span class="poster__big" aria-hidden="true">' + (POSTER_WORD[a.id] || '') + '</span>' + ar(a.ar) + '</div>';
      return '<article class="strip' + (open ? ' is-open' : '') + '" data-art="' + a.id + '">' +
        '<button type="button" class="strip__head" aria-expanded="' + open + '" aria-controls="art-' + a.id + '">' + tile(a.icon, 'sm') +
          '<h3>' + esc(l.t) + '</h3><span class="strip__kind">' + esc(l.k) + '</span>' + icon('arrow', 'strip__chev') + '</button>' +
        '<div class="strip__content" id="art-' + a.id + '"><div class="strip__inner">' +
          '<figure class="strip__media">' + media + '</figure>' +
          '<div class="strip__body">' + ar(a.ar) + '<h3>' + esc(l.t) + '</h3><p>' + esc(l.d) + '</p></div>' +
        '</div></div></article>';
    }).join('');
  }
  function openArt(id) {
    var desktop = window.matchMedia('(min-width: 1000px)').matches;
    if (!desktop && id === S.art) id = null; /* tapping the open one on a phone closes it */
    S.art = id;
    $$('.strip').forEach(function (s) {
      var on = s.getAttribute('data-art') === id;
      s.classList.toggle('is-open', on);
      $('.strip__head', s).setAttribute('aria-expanded', String(on));
    });
    if (!S.art && desktop) S.art = D.arts[0].id;
  }

  /* ------------------------------------------------------------ places (map) */
  var MAP = {
    land: 'M39.2 18.4 L92.7 22.4 L142.6 33.6 L188.9 42.4 L242.4 64 L310.1 84 L352.8 72 L377.8 56 L406.3 46.4 L417 34.4 L459.8 24 L499 32 L516.8 30.4 L548.9 50.4 L577.4 67.2 L605.9 61.6 L641.5 60 L655.8 61.6 L685.7 46.4 L734.2 192.8 L723.5 224 L717.1 232 L705.7 272 L698.5 304 L691.4 320 L687.9 333.6 L659.3 308 L643 292.8 L613 248 L605.9 228 L577.4 184 L570.2 160 L566.7 154.4 L552.4 184 L573.8 224 L604.5 283.2 L620.1 304 L647.2 360 L656.5 372 L665.8 412.8 L690 464 L733.5 546.4 L755.6 592 L774.8 636 L798.3 638.4 L780.5 664 L784.1 701.6 L841.1 763.2 L858.2 774.4 L876.8 792 L28.5 792 L28.5 136 L10.7 80 L24.9 36 Z',
    lake: 'M484.7 792 L499 760 L534.6 728 L556 696 L577.4 664 L590.2 634.4',
    nile: 'M590.2 634.4 L591.6 624.8 L593.8 594.4 L589.5 553.6 L566.7 528.8 L573.1 496 L578.8 464 L544.6 468 L520.3 445.6 L506.1 427.2 L490.4 404 L469 377.6 L445.5 336 L438.4 304 L445.5 264 L463.3 226.4 L474 184 L473.3 148.8 L469 136',
    ros: 'M469 136 L449.1 104 L424.1 68 L414.9 36',
    dam: 'M469 136 L474 104 L488.3 72 L513.2 33.6',
    canal: 'M548.9 50.4 L551 104 L566.7 154.4'
  };
  var PIN_LABEL = { /* dx, dy, anchor */
    cairo: [-24, 9, 'end'], alexandria: [-6, -26, 'end'], siwa: [24, 9, 'start'], aswan: [-24, 9, 'end'], sinai: [24, 9, 'start']
  };
  function renderMap() {
    var pins = D.places.map(function (p) {
      var on = p.id === S.place, lb = PIN_LABEL[p.id] || [22, 8, 'start'];
      return '<g class="pin' + (on ? ' is-active' : '') + '" data-place="' + p.id + '" tabindex="0" role="button" aria-pressed="' + on + '" aria-label="' + esc(L(p).t) + '">' +
        '<circle class="pin__ring" cx="' + p.x + '" cy="' + p.y + '" r="14"></circle>' +
        '<circle class="pin__dot" cx="' + p.x + '" cy="' + p.y + '" r="' + (on ? 13 : 10) + '"></circle>' +
        '<text class="pin__name" x="' + (p.x + lb[0]) + '" y="' + (p.y + lb[1]) + '" text-anchor="' + lb[2] + '">' + esc(L(p).t) + '</text></g>';
    }).join('');
    var mapEl = $('#map');
    var wasIn = mapEl.classList.contains('in');
    mapEl.innerHTML =
      '<svg viewBox="-10 -76 910 880" role="img" aria-label="' + esc(t('places.title')) + '">' +
        '<path class="map__land" d="' + MAP.land + '"></path>' +
        '<text class="map__label map__label--sea" x="150" y="-28">' + esc(t('places.med')) + '</text>' +
        '<text class="map__label map__label--sea" x="770" y="420" transform="rotate(63 770 420)">' + esc(t('places.red')) + '</text>' +
        '<text class="map__label" x="120" y="470">' + esc(t('places.west')) + '</text>' +
        '<path class="map__lake" pathLength="1" d="' + MAP.lake + '"></path>' +
        '<path class="map__nile" pathLength="1" d="' + MAP.nile + '"></path>' +
        '<path class="map__nile map__branch" pathLength="1" style="stroke-width:3.5" d="' + MAP.ros + '"></path>' +
        '<path class="map__nile map__branch" pathLength="1" style="stroke-width:3.5" d="' + MAP.dam + '"></path>' +
        '<path class="map__canal" d="' + MAP.canal + '"></path>' +
        '<text class="map__label map__label--nile" x="508" y="352">' + esc(t('places.nile')) + '</text>' +
        pins +
      '</svg>';
    if (wasIn) mapEl.classList.add('in');
    $('#placeChips').innerHTML = D.places.map(function (p) {
      return '<button type="button" class="chip" data-place="' + p.id + '" aria-pressed="' + (p.id === S.place) + '">' + icon(p.icon) + esc(L(p).t) + '</button>';
    }).join('');
    renderPlace(false);
  }
  function renderPlace(animate) {
    var p = D.places.filter(function (x) { return x.id === S.place; })[0], l = L(p);
    var card = $('#placeCard');
    card.innerHTML =
      '<figure class="place__media"><img src="' + IMG + p.img + '"' + pos(p.pos) + ' alt="' + esc(l.t) + '" loading="lazy" decoding="async"></figure>' +
      '<div class="place__body"><div class="place__top"><span class="place__k">' + esc(l.k) + '</span>' + tile(p.icon, 'sm') + '</div>' +
      '<div class="place__title"><h3>' + esc(l.t) + '</h3>' + ar(p.ar) + '</div><p>' + esc(l.d) + '</p></div>';
    if (animate) swap(card);
  }
  function selectPlace(id) {
    if (id === S.place) return;
    S.place = id;
    $$('.pin').forEach(function (g) {
      var on = g.getAttribute('data-place') === id;
      g.classList.toggle('is-active', on);
      g.setAttribute('aria-pressed', String(on));
      $('.pin__dot', g).setAttribute('r', on ? 13 : 10);
    });
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-place') === id)); });
    renderPlace(true);
  }

  /* ------------------------------------------------------------ credits */
  function renderCredits() {
    var list = $('#credits');
    if (!D.credits.length) { list.closest('.credits').hidden = true; return; }
    list.innerHTML = '<li class="credits__note">' + esc(t('footer.creditsNote')) + '</li>' + D.credits.map(function (c) {
      return '<li>' + esc(c.subject) + ': <a href="' + esc(c.source) + '" target="_blank" rel="noopener">' + esc(c.author) + '</a>, ' + esc(c.license) + '</li>';
    }).join('');
  }

  /* ------------------------------------------------------------ ticket */
  var TICKET_KEY = 'eg.ticket.v1';
  function loadTicket() {
    try { var tk = JSON.parse(store.get(TICKET_KEY)); return tk && tk.code ? tk : null; } catch (e) { return null; }
  }
  function saveTicket(tk) { store.set(TICKET_KEY, JSON.stringify(tk)); }
  function newCode() {
    var A = 'ACDEFHJKMNPRTUVWXY34679', out = '', buf = new Uint32Array(4);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < 4; i++) out += A[buf[i] % A.length];
    return 'EG-' + out;
  }
  function locale() { return lang === 'zh' ? 'zh-CN' : 'en-GB'; }
  function fmtStamp(ms) { return new Date(ms).toLocaleString(locale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  function fmtClock(d) { return d.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); }

  function ticketHTML(tk, live) {
    var perfect = tk.score === tk.total;
    return '<div class="ticket' + (tk.redeemedAt ? ' is-redeemed' : '') + '"' + (live && !tk.redeemedAt ? ' data-live' : '') + '>' +
      '<div class="ticket__main">' +
        '<div class="ticket__top"><span class="ticket__title">' + esc(t('ticket.title')) + '</span>' + ar('هدية') + '</div>' +
        '<p class="ticket__code">' + esc(tk.code) + '</p>' +
        '<dl class="ticket__meta"><div><dt>' + esc(t('ticket.score')) + '</dt><dd>' + tk.score + ' / ' + tk.total + '</dd></div>' +
        '<div><dt>' + esc(t('ticket.time')) + '</dt><dd>' + esc(fmtStamp(tk.issuedAt)) + '</dd></div></dl>' +
        (perfect ? '<span class="ticket__perfect">' + icon('star') + esc(t('ticket.perfect')) + '</span>' : '') +
      '</div>' +
      '<div class="ticket__stub"><span class="ticket__seal">' + icon('star') + '</span><span class="ticket__clock" data-clock>' + esc(fmtClock(new Date())) + '</span></div>' +
      '<div class="ticket__stamp"' + (tk.redeemedAt ? '' : ' aria-hidden="true"') + '>' + esc(t('ticket.redeemed')) + '</div>' +
    '</div>';
  }
  function renderTicketPreview() {
    $('#ticketPreview').innerHTML = ticketHTML({ code: 'EG-7K4Q', score: 6, total: 6, issuedAt: Date.now() }, false);
  }

  /* ------------------------------------------------------------ quiz */
  var dlg = $('#quizDialog');
  var Q = { round: [], i: 0, score: 0, picks: [], view: 'q', earlier: false, lastScore: 0, clock: null };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function startRound() {
    var n = Math.min(C.questionsPerRound || 6, D.quiz.length);
    Q.round = shuffle(D.quiz.map(function (_, i) { return i; })).slice(0, n).map(function (qi) {
      return { qi: qi, order: shuffle([0, 1, 2]) };
    });
    Q.i = 0; Q.score = 0; Q.picks = []; Q.view = 'q'; Q.earlier = false;
    renderQuiz(true);
  }
  function openQuiz() {
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      document.documentElement.classList.add('quiz-open');
    }
    var tk = loadTicket();
    if (tk && Q.view !== 'q') { Q.view = 'result'; Q.earlier = true; Q.lastScore = tk.score; renderQuiz(true); }
    else if (tk && !Q.round.length) { Q.view = 'result'; Q.earlier = true; Q.lastScore = tk.score; renderQuiz(true); }
    else if (!Q.round.length || Q.view === 'result') startRound();
    else renderQuiz(false);
  }
  function closeQuiz() { if (dlg.open) dlg.close(); }

  function renderSteps() {
    $('#quizSteps').innerHTML = Q.round.map(function (_, k) {
      var cls = Q.picks[k] == null ? (k === Q.i && Q.view === 'q' ? 'is-now' : '') : (Q.picks[k] === D.quiz[Q.round[k].qi].a ? 'is-ok' : 'is-bad');
      return '<li class="' + cls + '"></li>';
    }).join('');
  }

  function renderQuiz(animate) {
    stopClock();
    renderSteps();
    var body = $('#quizBody');
    if (Q.view === 'result') { renderResult(body, animate); return; }

    var r = Q.round[Q.i], q = D.quiz[r.qi], l = L(q), pick = Q.picks[Q.i], answered = pick != null;
    var last = Q.i === Q.round.length - 1;
    body.innerHTML =
      '<div class="q">' +
        '<div class="q__top">' + tile(q.icon, 'lg') + '<p class="q__count">' + esc(t('quiz.progress', { n: Q.i + 1, t: Q.round.length })) + '</p></div>' +
        '<h2 class="q__text" id="qText">' + esc(l.q) + '</h2>' +
        '<div class="opts" role="group" aria-labelledby="qText">' + r.order.map(function (o, k) {
          var cls = '';
          if (answered) cls = o === q.a ? ' is-ok' : (o === pick ? ' is-bad' : ' is-dim');
          return '<button type="button" class="opt' + cls + '" data-o="' + o + '"' + (answered ? ' disabled' : '') + '>' +
            '<span class="opt__key">' + (k + 1) + '</span><span>' + esc(l.o[o]) + '</span>' +
            icon(answered && o === q.a ? 'check' : 'close', 'opt__mark') + '</button>';
        }).join('') + '</div>' +
        '<div class="fact" id="qFact"' + (answered ? '' : ' hidden') + ' aria-live="polite">' +
          (answered ? '<p class="fact__verdict ' + (pick === q.a ? 'is-ok' : 'is-bad') + '">' + esc(t(pick === q.a ? 'quiz.correct' : 'quiz.wrong')) + '</p><p>' + esc(l.f) + '</p>' : '') +
        '</div>' +
        '<div class="q__foot"><p class="q__hint">' + esc(t('quiz.keys')) + '</p>' +
          '<button type="button" class="btn btn--accent" data-next' + (answered ? '' : ' hidden') + '><span>' + esc(t(last ? 'quiz.finish' : 'quiz.next')) + '</span>' + icon('arrow') + '</button>' +
        '</div>' +
      '</div>';
    if (animate) { swap($('.q', body)); body.scrollTop = 0; }
  }

  function answer(o) {
    if (Q.view !== 'q' || Q.picks[Q.i] != null) return;
    var q = D.quiz[Q.round[Q.i].qi];
    Q.picks[Q.i] = o;
    if (o === q.a) Q.score++;
    renderQuiz(false);
    var next = $('[data-next]', dlg);
    if (next) next.focus({ preventScroll: true });
    var fact = $('#qFact');
    if (fact && fact.scrollIntoView) fact.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    if (navigator.vibrate && o !== q.a) navigator.vibrate(30);
  }

  function nextQuestion() {
    if (Q.picks[Q.i] == null) return;
    if (Q.i < Q.round.length - 1) { Q.i++; renderQuiz(true); return; }
    Q.lastScore = Q.score;
    var tk = loadTicket();
    if (!tk) {
      tk = { code: newCode(), score: Q.score, total: Q.round.length, issuedAt: Date.now(), redeemedAt: null };
      saveTicket(tk);
      Q.earlier = false;
    } else {
      Q.earlier = true;
    }
    Q.view = 'result';
    renderQuiz(true);
  }

  function renderResult(body, animate) {
    var tk = loadTicket();
    var total = tk ? tk.total : Q.round.length;
    var score = Q.lastScore;
    var msg = score === total ? t('result.perfect') : score >= Math.ceil(total / 2) ? t('result.good') : t('result.ok');
    var redeemed = tk && tk.redeemedAt;
    body.innerHTML =
      '<div class="result">' +
        '<h2 class="result__score">' + esc(t('result.score', { s: score, t: total })) + '</h2>' +
        '<p class="result__msg">' + esc(Q.earlier ? t('result.earlier') : msg) + '</p>' +
        (tk ? ticketHTML(tk, true) : '') +
        (redeemed
          ? '<p class="redeemed-note">' + icon('check') + esc(t('ticket.redeemedAt', { time: fmtStamp(tk.redeemedAt) })) + '</p>'
          : '<p class="ticket__live">' + icon('star') + '<span>' + esc(t('ticket.show')) + (lang === 'zh' ? '' : ' ') + esc(t('ticket.live')) + '</span></p>' +
            '<button type="button" class="hold" id="holdBtn" style="--hold:' + C.staffHoldMs + 'ms"><span class="hold__fill"></span><span>' + esc(t('ticket.hold')) + '</span></button>') +
        '<div class="result__actions">' +
          '<button type="button" class="btn btn--ghost" data-again>' + icon('replay') + '<span>' + esc(t('ticket.again')) + '</span></button>' +
          '<button type="button" class="btn btn--ghost" data-close-quiz>' + esc(t('ticket.back')) + '</button>' +
        '</div>' +
        '<p class="result__note">' + esc(t('ticket.note')) + '</p>' +
      '</div>';
    if (animate) { swap($('.result', body)); body.scrollTop = 0; }
    startClock();
    bindHold();
  }

  function startClock() {
    stopClock();
    var el = $('[data-clock]', dlg);
    if (!el) return;
    Q.clock = setInterval(function () { el.textContent = fmtClock(new Date()); }, 1000);
  }
  function stopClock() { if (Q.clock) { clearInterval(Q.clock); Q.clock = null; } }

  function bindHold() {
    var btn = $('#holdBtn');
    if (!btn) return;
    var timer = null;
    function start(e) {
      if (e.type === 'keydown') { if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return; }
      e.preventDefault();
      btn.classList.add('is-holding');
      timer = setTimeout(redeem, C.staffHoldMs);
    }
    function cancel() { clearTimeout(timer); timer = null; btn.classList.remove('is-holding'); }
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('keydown', start);
    ['pointerup', 'pointerleave', 'pointercancel', 'keyup', 'blur'].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }
  function redeem() {
    var tk = loadTicket();
    if (!tk || tk.redeemedAt) return;
    tk.redeemedAt = Date.now();
    saveTicket(tk);
    if (navigator.vibrate) navigator.vibrate([20, 40, 60]);
    renderQuiz(false);
  }

  /* ------------------------------------------------------------ events */
  function setLang(next) {
    if (next === lang) return;
    lang = next;
    store.set('eg.lang', lang);
    renderAll();
    if (dlg.open) renderQuiz(false);
  }

  function rovingKeys(e, selector, attr, onPick) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys) && e.key !== 'Home' && e.key !== 'End') return;
    var items = $$(selector);
    var idx = items.indexOf(document.activeElement);
    if (idx < 0) return;
    e.preventDefault();
    var n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (idx + keys[e.key] + items.length) % items.length;
    onPick(items[n].getAttribute(attr));
    var el = $(selector + '[' + attr + '="' + items[n].getAttribute(attr) + '"]');
    if (el) el.focus();
  }

  function pickWord(id) {
    S.word = id;
    $$('.word-btn').forEach(function (b) { var on = b.getAttribute('data-word') === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    renderWordStage(true);
  }
  function pickFood(id) {
    S.food = id;
    $$('.food-tab').forEach(function (b) { var on = b.getAttribute('data-food') === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    renderFoodPanel(true);
  }

  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-lang]'))) { setLang(el.getAttribute('data-lang')); return; }
    if ((el = e.target.closest('[data-open-quiz]'))) { location.href = 'index.html?lang=' + lang; return; }
    if ((el = e.target.closest('[data-close-quiz]'))) { closeQuiz(); return; }
    if ((el = e.target.closest('[data-word]'))) { if (el.getAttribute('data-word') !== S.word) pickWord(el.getAttribute('data-word')); return; }
    if ((el = e.target.closest('[data-say]'))) { say(el.getAttribute('data-say')); return; }
    if ((el = e.target.closest('[data-food]'))) { if (el.getAttribute('data-food') !== S.food) pickFood(el.getAttribute('data-food')); return; }
    if ((el = e.target.closest('.strip'))) {
      var desktop = window.matchMedia('(min-width: 1000px)').matches;
      if (desktop ? !el.classList.contains('is-open') : e.target.closest('.strip__head')) openArt(el.getAttribute('data-art'));
      return;
    }
    if ((el = e.target.closest('[data-place]'))) { selectPlace(el.getAttribute('data-place')); return; }
    if ((el = e.target.closest('.opt'))) { answer(Number(el.getAttribute('data-o'))); return; }
    if ((el = e.target.closest('[data-next]'))) { nextQuestion(); return; }
    if ((el = e.target.closest('[data-again]'))) { startRound(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('#wordList')) rovingKeys(e, '.word-btn', 'data-word', pickWord);
    else if (e.target.closest && e.target.closest('#foodTabs')) rovingKeys(e, '.food-tab', 'data-food', pickFood);
    else if (e.target.classList && e.target.classList.contains('pin') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectPlace(e.target.getAttribute('data-place')); }

    if (dlg.open && Q.view === 'q' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var n = { '1': 0, '2': 1, '3': 2 }[e.key];
      if (n != null && Q.picks[Q.i] == null) { e.preventDefault(); answer(Q.round[Q.i].order[n]); }
    }
  });

  dlg.addEventListener('close', function () { document.documentElement.classList.remove('quiz-open'); stopClock(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeQuiz(); }); /* backdrop click on desktop */

  /* header border + current section in nav */
  if (io) {
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (en) { $('.top').classList.toggle('is-stuck', !en[0].isIntersecting); }).observe(sentinel);

    var navLinks = $$('.nav a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* broken or missing photo: show the pattern instead of a broken icon */
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'IMG') { el.style.visibility = 'hidden'; if (el.parentElement) el.parentElement.classList.add('no-img'); }
  }, true);

  /* ------------------------------------------------------------ boot */
  function renderAll() {
    applyStatic();
    renderMarquee();
    renderWords();
    renderFood();
    renderLife();
    renderFeasts();
    renderArts();
    renderMap();
    renderCredits();
    renderTicketPreview();
    hydrate(document);
  }

  renderAll();
  booted = true;
  /* images that already failed before this script ran */
  $$('img').forEach(function (im) { if (im.complete && !im.naturalWidth && im.parentElement) { im.style.visibility = 'hidden'; im.parentElement.classList.add('no-img'); } });

  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.addEventListener ? window.speechSynthesis.addEventListener('voiceschanged', pickVoice) : (window.speechSynthesis.onvoiceschanged = pickVoice);
  }

  /* warm up the other food photos so tab switches feel instant */
  window.addEventListener('load', function () {
    setTimeout(function () { D.food.forEach(function (f) { var im = new Image(); im.src = IMG + f.img; }); }, 1500);
  });

  /* the quiz and gift ticket now live in the game (index.html) */
  if (location.hash === '#credits') {
    var cr = document.querySelector('.credits');
    if (cr && !cr.hidden) { cr.open = true; setTimeout(function () { cr.scrollIntoView(); }, 300); }
  }
})();
