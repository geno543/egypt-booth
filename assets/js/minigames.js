/* Egypt Passport: the five mini-games.
   Each one gets a ctx from game.js and calls ctx.done(stars) when it ends (1 to 3 stars). */
(function () {
  'use strict';
  var M = window.EG_MINI = {};

  function rand(a, b) { return a + Math.random() * (b - a); }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
  function restart(node, cls) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }
  function flowerSVG(size) {
    var p = '';
    for (var i = 0; i < 5; i++) { var a = i * 72 * Math.PI / 180; p += '<ellipse cx="' + (10 + 5.2 * Math.cos(a)).toFixed(2) + '" cy="' + (10 + 5.2 * Math.sin(a)).toFixed(2) + '" rx="4.6" ry="3.4" transform="rotate(' + (i * 72) + ' ' + (10 + 5.2 * Math.cos(a)).toFixed(2) + ' ' + (10 + 5.2 * Math.sin(a)).toFixed(2) + ')" fill="#D7263D"/>'; }
    return '<svg viewBox="0 0 20 20" width="' + size + '" height="' + size + '" aria-hidden="true">' + p + '<circle cx="10" cy="10" r="2.6" fill="#F2B33D"/></svg>';
  }

  /* =================================================================
     1. ALEXANDRIA: match Egyptian words to their meanings
     ================================================================= */
  M.words = function (ctx) {
    var ids = ['ahlan', 'shukran', 'yalla', 'malesh', 'habibi', 'tamam', 'inshallah', 'khalas', 'izzayak'];
    var pool = ctx.shuffle(ctx.words.filter(function (w) { return ids.indexOf(w.id) > -1; })).slice(0, 5);
    var left = ctx.shuffle(pool), right = ctx.shuffle(pool);
    var selL = null, selR = null, matched = 0, mistakes = 0, over = false, hint = null, studying = true;
    var learned = pool.map(function (w) { return { ar: w.ar, tr: w.tr, m: ctx.L(w).m }; });
    function pill() { ctx.pill(ctx.icon('close') + '<span>' + ctx.esc(ctx.t('game.mistakes')) + ' ' + mistakes + '</span>'); ctx.warn(mistakes > 2); }

    /* step 1: study the five words (they are new to most players) */
    ctx.stage.innerHTML =
      '<p class="hint">' + ctx.esc(ctx.t('w.study')) + '</p>' +
      '<div class="w-study">' + pool.map(function (w) {
        return '<div class="w-card">' + ctx.ar(w.ar) + '<div><b>' + ctx.esc(w.tr) + '</b><span>' + ctx.esc(ctx.L(w).m) + '</span><small>' + ctx.esc(ctx.L(w).n) + '</small></div></div>';
      }).join('') + '</div>' +
      '<button type="button" class="btn btn--gold btn--wide" data-ready style="margin-top:12px">' + ctx.esc(ctx.t('w.ready')) + ctx.icon('arrow') + '</button>';
    ctx.pill(ctx.icon('words') + '<span>5</span>');

    /* step 2: match from memory */
    function startMatch() {
    studying = false;
    ctx.stage.innerHTML =
      '<p class="hint">' + ctx.esc(ctx.t('w.pairs', { n: 0 })) + '</p>' +
      '<div class="w-grid"><div class="w-col">' + left.map(function (w) {
        return '<button type="button" class="w-tile" data-side="L" data-id="' + w.id + '">' + ctx.ar(w.ar) + '<small>' + ctx.esc(w.tr) + '</small></button>';
      }).join('') + '</div><div class="w-col">' + right.map(function (w) {
        return '<button type="button" class="w-tile mean" data-side="R" data-id="' + w.id + '">' + ctx.esc(ctx.L(w).m) + '</button>';
      }).join('') + '</div></div>';
    hint = ctx.stage.querySelector('.hint');
    pill();
    }
    function tile(side, id) { return ctx.stage.querySelector('.w-tile[data-side="' + side + '"][data-id="' + id + '"]'); }
    function onClick(e) {
      if (studying) { if (e.target.closest('[data-ready]')) { ctx.sfx.good(); startMatch(); } return; }
      var b = e.target.closest('.w-tile'); if (!b || over || b.classList.contains('ok')) return;
      var side = b.getAttribute('data-side'), id = b.getAttribute('data-id');
      ctx.sfx.tap();
      if (side === 'L') { if (selL) tile('L', selL).classList.remove('sel'); selL = selL === id ? null : id; if (selL) b.classList.add('sel'); }
      else { if (selR) tile('R', selR).classList.remove('sel'); selR = selR === id ? null : id; if (selR) b.classList.add('sel'); }
      if (selL && selR) {
        var a = tile('L', selL), c = tile('R', selR);
        a.classList.remove('sel'); c.classList.remove('sel');
        if (selL === selR) {
          a.classList.add('ok'); c.classList.add('ok'); matched++; ctx.sfx.good();
          hint.textContent = ctx.t('w.pairs', { n: matched });
          if (matched === 5) { over = true; setTimeout(function () { ctx.done(mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1, learned); }, 500); }
        } else {
          restart(a, 'bad'); restart(c, 'bad'); mistakes++; pill(); ctx.sfx.bad(); ctx.buzz(40);
          setTimeout(function () { a.classList.remove('bad'); c.classList.remove('bad'); }, 450);
        }
        selL = selR = null;
      }
    }
    ctx.stage.addEventListener('click', onClick);
    ctx.onCleanup(function () { ctx.stage.removeEventListener('click', onClick); });
  };

  /* =================================================================
     2. CAIRO: build the koshari as the cook calls the layers
     ================================================================= */
  var ING = {
    rice:     { base: '#F2EAD6', mark: function (x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="2.6" ry="1.1" transform="rotate(' + rand(0, 180).toFixed(0) + ' ' + x + ' ' + y + ')" fill="#FFFDF5" stroke="#D3C6A6" stroke-width=".5"/>'; } },
    lentils:  { base: '#A0703F', mark: function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="1.8" fill="#6E4520"/>'; } },
    pasta:    { base: '#E7C77F', mark: function (x, y) { return '<rect x="' + (x - 3.6) + '" y="' + (y - 1.6) + '" width="7.2" height="3.2" rx="1.6" transform="rotate(' + rand(-50, 50).toFixed(0) + ' ' + x + ' ' + y + ')" fill="#F3DA9B" stroke="#B48D45" stroke-width=".6"/>'; } },
    chickpea: { base: '#DDAE55', mark: function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="#EDC872" stroke="#B3842E" stroke-width=".7"/>'; } },
    sauce:    { base: '#C2351F', mark: function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="1.3" fill="#E8644A"/>'; } },
    onion:    { base: '#8A5222', mark: function (x, y) { var a = rand(0, 6.28); return '<path d="M' + x + ' ' + y + ' q ' + (4 * Math.cos(a)).toFixed(1) + ' ' + (4 * Math.sin(a)).toFixed(1) + ' ' + (7 * Math.cos(a + .8)).toFixed(1) + ' ' + (7 * Math.sin(a + .8)).toFixed(1) + '" stroke="' + (Math.random() > .5 ? '#5B3412' : '#C98A3E') + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>'; } },
    cheese:   { base: '#F6D96B', mark: function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="#E3BC3F"/>'; } },
    fish:     { base: '#A9C2D6', mark: function () { return ''; } }
  };
  function swatch(id) {
    var g = ING[id], s = '<svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" fill="' + g.base + '" stroke="rgb(0 0 0 / .15)"/>';
    if (id === 'fish') s += '<svg x="8" y="8" width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#2A4560" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-fish"/></svg>';
    else for (var i = 0; i < 14; i++) { var a = rand(0, 6.28), r = Math.sqrt(Math.random()) * 15; s += g.mark((22 + r * Math.cos(a)).toFixed(1), (22 + r * Math.sin(a)).toFixed(1)); }
    return s + '</svg>';
  }
  M.koshari = function (ctx) {
    var K = ctx.data.koshari, order = K.layers, step = 0, mistakes = 0, t0 = performance.now(), over = false;
    var btns = ctx.shuffle(order.concat(K.decoys));
    ctx.stage.innerHTML =
      '<div class="k-top"><div class="k-cook">' + ctx.icon('bowl') + '</div><div class="bubble" id="kBubble"></div></div>' +
      '<div class="k-bowl"><svg viewBox="0 0 240 200" id="kBowl" role="img" aria-label="' + ctx.esc(ctx.t('k.bowl')) + '">' +
        '<ellipse cx="120" cy="104" rx="104" ry="16" fill="#3B2A1C"/>' +
        '<g id="kLayers"></g>' +
        '<path d="M16 104 Q 20 178 120 184 Q 220 178 224 104 Q 200 120 120 120 Q 40 120 16 104 Z" fill="#F7F4EC" stroke="#16171C" stroke-width="2.5"/>' +
        '<path d="M28 128 Q 120 150 212 128" fill="none" stroke="#2340A8" stroke-width="5"/>' +
        '<path d="M34 142 Q 120 162 206 142" fill="none" stroke="#2340A8" stroke-width="2" stroke-dasharray="6 5"/>' +
        '<ellipse cx="120" cy="190" rx="58" ry="6" fill="rgb(0 0 0 / .25)"/>' +
      '</svg></div>' +
      '<p class="k-note" id="kNote" aria-live="polite"></p>' +
      '<div class="k-btns">' + btns.map(function (g) {
        return '<button type="button" class="k-btn" data-ing="' + g.id + '">' + swatch(g.id) + '<b>' + ctx.esc(g[ctx.lang] || g.en) + '</b><small>' + ctx.esc(g.tr) + '</small></button>';
      }).join('') + '</div>';
    var bubble = ctx.stage.querySelector('#kBubble'), layers = ctx.stage.querySelector('#kLayers'), note = ctx.stage.querySelector('#kNote');
    var NOTES = ctx.data.layerNotes;
    var learned = order.map(function (l) { return { ar: l.ar, tr: l.tr, m: (l[ctx.lang] || l.en) + ': ' + (NOTES[l.id][ctx.lang] || NOTES[l.id].en) }; });
    function call() {
      var g = order[step];
      bubble.innerHTML = '<small>' + ctx.esc(ctx.t('k.cook')) + '</small><div class="bubble__call">' + ctx.ar(g.ar) + '<b>' + ctx.esc(g.tr) + '!</b></div>';
      restart(bubble, 'pop');
      ctx.sfx.tone(300 + step * 40, 0.12, 'square', 0.04);
    }
    function addLayer(i) {
      var id = order[i].id, g = ING[id], s = '';
      if (id === 'onion') {
        for (var k = 0; k < 26; k++) { var x = rand(76, 164), top = 104 - (18 + 4 * 13) * Math.sqrt(Math.max(0, 1 - Math.pow((x - 120) / 62, 2))); s += g.mark(x.toFixed(1), (top + rand(2, 14)).toFixed(1)); }
      } else {
        var w = 200 - i * 17, h = 18 + i * 13, x0 = 120 - w / 2, x1 = 120 + w / 2;
        s += '<path d="M' + x0 + ' 106 A ' + (w / 2) + ' ' + h + ' 0 0 1 ' + x1 + ' 106 Z" fill="' + g.base + '"/>';
        for (var j = 0; j < 40 + i * 4; j++) {
          var xx = rand(x0 + 6, x1 - 6), lim = h * Math.sqrt(Math.max(0, 1 - Math.pow((xx - 120) / (w / 2), 2)));
          s += g.mark(xx.toFixed(1), (106 - rand(2, Math.max(3, lim - 2))).toFixed(1));
        }
        if (id === 'sauce') { for (var d = 0; d < 5; d++) { var dx = x0 + 10 + d * (w - 20) / 4; s += '<rect x="' + dx.toFixed(1) + '" y="' + (106 - h * 0.3).toFixed(1) + '" width="5" height="' + rand(8, 16).toFixed(1) + '" rx="2.5" fill="#C2351F"/>'; } }
      }
      layers.insertAdjacentHTML('beforeend', '<g class="k-layer">' + s + '</g>');
    }
    var timer = setInterval(function () { ctx.pill(ctx.icon('clock') + '<span>' + ((performance.now() - t0) / 1000).toFixed(1) + 's</span>'); }, 100);
    ctx.onCleanup(function () { clearInterval(timer); });
    call();
    function onClick(e) {
      var b = e.target.closest('.k-btn'); if (!b || over || b.classList.contains('used')) return;
      var id = b.getAttribute('data-ing');
      if (id === order[step].id) {
        b.classList.add('used'); addLayer(step); ctx.sfx.plop(); ctx.sfx.good();
        var lay = order[step];
        note.innerHTML = ctx.ar(lay.ar) + '<span>' + ctx.esc(lay.tr) + ': ' + ctx.esc(NOTES[lay.id][ctx.lang] || NOTES[lay.id].en) + '</span>';
        restart(note, 'pop');
        step++;
        if (step === order.length) {
          over = true; clearInterval(timer);
          var secs = (performance.now() - t0) / 1000;
          bubble.innerHTML = '<div class="bubble__call">' + ctx.ar('بالهنا والشفا') + '<b>' + (ctx.lang === 'zh' ? '请慢用！' : 'Enjoy!') + '</b></div>';
          restart(bubble, 'pop');
          setTimeout(function () { ctx.done(mistakes === 0 && secs < 22 ? 3 : mistakes <= 2 && secs < 45 ? 2 : 1, learned); }, 900);
        } else call();
      } else {
        mistakes++; restart(b, 'bad'); ctx.sfx.bad(); ctx.buzz(40);
        var decoy = ctx.data.koshari.decoys.some(function (d) { return d.id === id; });
        ctx.toast(ctx.t(decoy ? 'k.nope' : 'k.wrong'), 'bad');
      }
    }
    ctx.stage.addEventListener('click', onClick);
    ctx.onCleanup(function () { ctx.stage.removeEventListener('click', onClick); });
  };

  /* =================================================================
     3. KHAN EL-KHALILI: roll the dice, call them the tawla way
     ================================================================= */
  var PIPS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
  var FACE_ROT = { 1: [0, 0], 6: [0, 180], 3: [0, -90], 4: [0, 90], 5: [-90, 0], 2: [90, 0] };
  function dieHTML() {
    var f = '';
    for (var v = 1; v <= 6; v++) {
      f += '<div class="die__f f' + v + '">' + PIPS[v].map(function (p) { return '<i style="grid-column:' + ((p - 1) % 3 + 1) + ';grid-row:' + (Math.floor((p - 1) / 3) + 1) + '"></i>'; }).join('') + '</div>';
    }
    return '<div style="position:relative"><div class="die">' + f + '</div><div class="die-shadow"></div></div>';
  }
  M.tawla = function (ctx) {
    var N = ctx.data.tawla.names, A = ctx.data.tawla.ar;
    function call(a, b) { var hi = Math.max(a, b), lo = Math.min(a, b); return N[hi - 1] + ' ' + N[lo - 1]; }
    function callAr(a, b) { var hi = Math.max(a, b), lo = Math.min(a, b); return A[hi - 1] + ' ' + A[lo - 1]; }
    function randPair(avoid) {
      var p; do { var a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6); p = [Math.max(a, b), Math.min(a, b)]; }
      while (p[0] === p[1] || avoid.some(function (q) { return q[0] === p[0] && q[1] === p[1]; }));
      return p;
    }
    var rolls = [[6, 5]]; rolls.push(randPair(rolls)); rolls.push(randPair(rolls));
    var round = 0, correct = 0, spins = [0, 0, 0, 0], busy = false, over = false;
    ctx.stage.innerHTML =
      '<div class="d-cheat" aria-label="' + ctx.esc(ctx.t('d.cheat')) + '">' + N.map(function (n, i) { return '<div><b>' + (i + 1) + '</b><span>' + ctx.esc(n) + '</span></div>'; }).join('') + '</div>' +
      '<div class="d-board"><div class="d-board__tri">' + new Array(12).join('<i></i>') + '<i></i></div><div class="dice">' + dieHTML() + dieHTML() + '</div></div>' +
      '<div id="dArea"></div><p class="d-msg" id="dMsg"></p>';
    var dice = ctx.stage.querySelectorAll('.die'), area = ctx.stage.querySelector('#dArea'), msg = ctx.stage.querySelector('#dMsg');
    function pill() { ctx.pill(ctx.icon('dice') + '<span>' + ctx.esc(ctx.t('d.round', { n: Math.min(round + 1, 3) })) + '</span>'); }
    pill();
    function showRoll() {
      msg.textContent = '';
      area.innerHTML = '<button type="button" class="btn btn--gold btn--wide" data-roll>' + ctx.icon('dice') + ctx.esc(ctx.t('d.roll')) + '</button>';
    }
    function setDie(d, v, k) {
      spins[k * 2] += 2 + Math.floor(Math.random() * 2); spins[k * 2 + 1] += 1 + Math.floor(Math.random() * 2);
      var r = FACE_ROT[v], x = spins[k * 2] * 360 + r[0], y = spins[k * 2 + 1] * 360 + r[1];
      d.style.transform = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
    }
    function roll() {
      if (busy) return; busy = true;
      var p = rolls[round];
      var order = Math.random() > 0.5 ? [p[0], p[1]] : [p[1], p[0]];
      setDie(dice[0], order[0], 0); setDie(dice[1], order[1], 1);
      ctx.sfx.dice(); ctx.buzz([10, 30, 10, 30, 10]);
      area.innerHTML = '<p class="hint">' + ctx.esc(ctx.t('d.rolling')) + '</p>';
      setTimeout(function () { ctx.sfx.tek(); ctx.sfx.tek(0.08); showOptions(p); }, ctx.reduce ? 350 : 1300);
    }
    function showOptions(p) {
      var right = call(p[0], p[1]), opts = [{ c: right, a: callAr(p[0], p[1]) }];
      while (opts.length < 3) {
        var q = randPair([p].concat(opts.map(function (o) { return o.p || [0, 0]; })));
        var c = call(q[0], q[1]); if (opts.some(function (o) { return o.c === c; })) continue;
        opts.push({ c: c, a: callAr(q[0], q[1]), p: q });
      }
      opts = ctx.shuffle(opts);
      area.innerHTML = '<p class="hint" style="margin-bottom:8px">' + ctx.esc(ctx.t('d.call')) + '</p><div class="d-opts">' + opts.map(function (o) {
        return '<button type="button" class="d-opt" data-call="' + ctx.esc(o.c) + '"><span>' + ctx.esc(o.c) + '!</span>' + ctx.ar(o.a) + '</button>';
      }).join('') + '</div>';
      area.setAttribute('data-right', right);
    }
    function pick(b) {
      var right = area.getAttribute('data-right'), ok = b.getAttribute('data-call') === right;
      ctx.stage.querySelectorAll('.d-opt').forEach(function (o) { o.disabled = true; if (o.getAttribute('data-call') === right) o.classList.add('ok'); });
      if (ok) { correct++; ctx.sfx.good(); msg.textContent = ctx.t('d.right'); }
      else { b.classList.add('bad'); ctx.sfx.bad(); ctx.buzz(40); msg.textContent = ctx.t('d.wrong', { c: right }); }
      round++;
      setTimeout(function () {
        busy = false;
        if (round >= 3) {
          over = true;
          var nums = ctx.lang === 'zh' ? ['一点', '二点', '三点', '四点', '五点', '六点'] : ['one', 'two', 'three', 'four', 'five', 'six'];
          ctx.done(correct === 3 ? 3 : correct === 2 ? 2 : 1, N.map(function (n, k) { return { ar: A[k], tr: n, m: (k + 1) + ' = ' + nums[k] + (k === 5 ? (ctx.lang === 'zh' ? '（shesh besh = 六和五）' : ' (shesh besh = six and five)') : '') }; }));
        }
        else { pill(); showRoll(); }
      }, ok ? 1100 : 1900);
    }
    showRoll();
    function onClick(e) {
      if (over) return;
      if (e.target.closest('[data-roll]')) { roll(); return; }
      var b = e.target.closest('.d-opt'); if (b && !b.disabled) pick(b);
    }
    ctx.stage.addEventListener('click', onClick);
    ctx.onCleanup(function () { ctx.stage.removeEventListener('click', onClick); });
  };

  /* =================================================================
     4. AL-MOEZ STREET: light the flickering Ramadan lanterns
     ================================================================= */
  M.lanterns = function (ctx) {
    var DURATION = 20000, COLORS = ['#F2B33D', '#E0533D', '#2EA36F', '#5B7CFF', '#F2B33D', '#E0533D', '#2EA36F', '#5B7CFF', '#F2B33D'];
    var spots = [[18, 9], [50, 4], [82, 9], [30, 38], [70, 38], [14, 64], [50, 60], [86, 64], [50, 32]];
    spots = [[17, 8], [50, 4], [83, 8], [17, 38], [50, 34], [83, 38], [17, 68], [50, 64], [83, 68]];
    var stars = '';
    for (var s = 0; s < 40; s++) stars += '<circle cx="' + rand(0, 100).toFixed(1) + '" cy="' + rand(0, 100).toFixed(1) + '" r="' + rand(.15, .45).toFixed(2) + '" fill="#fff" opacity="' + rand(.2, .8).toFixed(2) + '"/>';
    ctx.stage.innerHTML =
      '<p class="hint">' + ctx.esc(ctx.t('l.tap')) + '</p>' +
      '<div class="l-scene" id="lScene">' +
        '<svg class="l-stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + stars + '</svg>' +
        '<svg class="l-strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q 50 16 100 6"/><path d="M0 36 Q 50 46 100 36"/><path d="M0 66 Q 50 76 100 66"/></svg>' +
        '<svg width="0" height="0" style="position:absolute"><defs><radialGradient id="lanGlow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs></svg>' +
        spots.map(function (p, i) {
          return '<button type="button" class="lan" data-l="' + i + '" style="left:' + p[0] + '%;top:' + p[1] + '%;--c:' + COLORS[i] + '" aria-label="Lantern ' + (i + 1) + '">' +
            '<svg viewBox="0 0 62 100" aria-hidden="true"><circle class="halo" cx="31" cy="52" r="46"/>' +
            '<path class="metal" d="M31 0 V12"/><path d="M18 24 Q31 8 44 24 Z" fill="#3A3A44" stroke="#8E8670" stroke-width="2"/>' +
            '<path class="glass" d="M16 24 H46 L52 42 V62 L44 76 H18 L10 62 V42 Z"/>' +
            '<path class="metal" d="M16 24 H46 L52 42 V62 L44 76 H18 L10 62 V42 Z M31 24 V76 M10 42 H52 M10 62 H52 M20 24 L14 42 M42 24 L48 42"/>' +
            '<path class="metal" d="M20 76 L24 85 H38 L42 76 M31 85 V94"/></svg></button>';
        }).join('') +
      '</div>';
    var scene = ctx.stage.querySelector('#lScene'), lans = ctx.stage.querySelectorAll('.lan');
    var RW = ctx.data.ramadanWords;
    var lit = new Array(9).fill(false), flick = new Array(9).fill(0), count = 0, t0 = performance.now(), over = false, nextAt = t0 + 400, raf;
    function pill() { ctx.pill(ctx.icon('lantern') + '<span>' + ctx.esc(ctx.t('l.lit', { n: count })) + '</span>'); }
    pill();
    function end() {
      if (over) return; over = true; cancelAnimationFrame(raf);
      lans.forEach(function (l, i) { l.classList.remove('flick'); });
      if (count === 9) { scene.classList.add('glow'); ctx.sfx.win(); }
      setTimeout(function () { ctx.done(count === 9 ? 3 : count >= 6 ? 2 : 1, RW.map(function (w) { return { ar: w.ar, tr: w.tr, m: w[ctx.lang] || w.en }; })); }, count === 9 ? 1500 : 700);
    }
    function loop(now) {
      var elapsed = now - t0, left = 1 - elapsed / DURATION;
      ctx.time(left); ctx.warn(left < 0.25);
      if (elapsed >= DURATION) { end(); return; }
      var progress = elapsed / DURATION, life = 1350 - progress * 550, gap = 750 - progress * 380;
      for (var i = 0; i < 9; i++) if (flick[i] && now > flick[i]) { flick[i] = 0; lans[i].classList.remove('flick'); }
      var active = flick.filter(Boolean).length;
      if (now >= nextAt && active < 2) {
        var cands = []; for (var j = 0; j < 9; j++) if (!lit[j] && !flick[j]) cands.push(j);
        if (cands.length) { var k = cands[Math.floor(Math.random() * cands.length)]; flick[k] = now + life; lans[k].classList.add('flick'); ctx.sfx.tone(1400 + Math.random() * 400, 0.04, 'sine', 0.04); }
        nextAt = now + gap;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    function onTap(e) {
      var b = e.target.closest('.lan'); if (!b || over) return;
      e.preventDefault();
      var i = Number(b.getAttribute('data-l'));
      if (lit[i]) return;
      if (flick[i]) {
        lit[i] = true; flick[i] = 0; b.classList.remove('flick'); b.classList.add('lit'); count++; pill();
        b.insertAdjacentHTML('beforeend', '<span class="lan__word">' + ctx.esc(RW[i].tr) + '</span>');
        ctx.sfx.light(); ctx.buzz(15);
        if (count === 9) end();
      } else { restart(b, 'missed'); ctx.sfx.tap(); }
    }
    ctx.stage.addEventListener('pointerdown', onTap);
    ctx.onCleanup(function () { cancelAnimationFrame(raf); ctx.stage.removeEventListener('pointerdown', onTap); ctx.time(null); ctx.warn(false); });
  };

  /* =================================================================
     5. ASWAN: sail the felucca, dodge rocks, catch hibiscus
     ================================================================= */
  M.felucca = function (ctx) {
    var DURATION = 20000;
    ctx.stage.innerHTML = '<p class="hint">' + ctx.esc(ctx.t('f.drag')) + '</p><div class="f-canvas" id="fBox"><canvas id="fCv"></canvas></div>';
    var box = ctx.stage.querySelector('#fBox'), cv = ctx.stage.querySelector('#fCv'), c = cv.getContext('2d');
    var dpr = Math.min(2, window.devicePixelRatio || 1), W, H;
    function size() { var r = box.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    var boat = { x: W / 2, tx: W / 2, y: H - 92, hurt: 0 }, objs = [], decor = [], scroll = 0, flowers = 0, t0 = performance.now(), last = t0, spawnAt = 0, over = false, raf, shake = 0;
    function bankL(y) { return W * 0.14 + Math.sin((y - scroll) * 0.009) * W * 0.035; }
    function bankR(y) { return W * 0.86 + Math.sin((y - scroll) * 0.007 + 1.7) * W * 0.035; }
    for (var d = 0; d < 10; d++) decor.push({ side: d % 2, y: d * (H / 5), kind: Math.random() > 0.65 ? 'house' : 'palm', col: ['#F2B33D', '#7FB3E8', '#E58A7A', '#9FD3B5'][d % 4] });
    function pill() { ctx.pill(flowerSVG(18) + '<span>' + flowers + '</span>'); }
    pill();
    function spawn() {
      var rock = Math.random() < 0.42, r = rock ? rand(14, 22) : 12, y = -30;
      var x = rand(bankL(y) + r + 8, bankR(y) - r - 8);
      objs.push({ rock: rock, x: x, y: y, r: r, a: rand(0, 6), hit: false, pts: rock ? [0, 1, 2, 3, 4, 5, 6].map(function () { return rand(.78, 1.1); }) : null });
    }
    function drawPalm(x, y) {
      c.strokeStyle = '#6B4A2B'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y + 14); c.quadraticCurveTo(x + 2, y + 4, x, y - 6); c.stroke();
      c.fillStyle = '#3E8E57';
      for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; c.beginPath(); c.ellipse(x + Math.cos(a) * 9, y - 6 + Math.sin(a) * 6, 10, 3.6, a, 0, Math.PI * 2); c.fill(); }
    }
    function drawHouse(x, y, col) {
      c.fillStyle = col; c.fillRect(x - 12, y - 8, 24, 18); c.beginPath(); c.arc(x, y - 8, 9, Math.PI, 0); c.fill();
      c.fillStyle = 'rgb(0 0 0 / .25)'; c.fillRect(x - 3, y + 2, 6, 8);
    }
    function drawBoat(x, y, blink) {
      if (blink) c.globalAlpha = 0.45;
      c.strokeStyle = 'rgb(255 255 255 / .55)'; c.lineWidth = 2;
      for (var i = 1; i <= 3; i++) { c.beginPath(); c.moveTo(x - 6 - i * 4, y + 26 + i * 10); c.lineTo(x - 2, y + 22); c.lineTo(x + 6 + i * 4, y + 26 + i * 10); c.stroke(); }
      c.fillStyle = '#7A4A23'; c.beginPath(); c.moveTo(x, y - 30); c.quadraticCurveTo(x + 15, y - 6, x + 11, y + 24); c.lineTo(x - 11, y + 24); c.quadraticCurveTo(x - 15, y - 6, x, y - 30); c.fill();
      c.fillStyle = '#A8693A'; c.beginPath(); c.moveTo(x, y - 24); c.quadraticCurveTo(x + 10, y - 4, x + 7, y + 19); c.lineTo(x - 7, y + 19); c.quadraticCurveTo(x - 10, y - 4, x, y - 24); c.fill();
      c.fillStyle = '#FBF8EE'; c.strokeStyle = '#C9C2AE'; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(x - 2, y - 34); c.lineTo(x + 26, y + 10); c.lineTo(x - 2, y + 14); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#4A2E16'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 4, y - 38); c.lineTo(x + 28, y + 12); c.stroke();
      c.globalAlpha = 1;
    }
    function drawRock(o) {
      c.save(); c.translate(o.x, o.y); c.rotate(o.a);
      c.fillStyle = '#8C6E66'; c.beginPath();
      o.pts.forEach(function (k, i) { var a = i / o.pts.length * Math.PI * 2, rr = o.r * k; if (i) c.lineTo(rr * Math.cos(a), rr * Math.sin(a)); else c.moveTo(rr * Math.cos(a), rr * Math.sin(a)); });
      c.closePath(); c.fill();
      c.fillStyle = '#B79A90'; c.beginPath(); c.ellipse(-o.r * .25, -o.r * .3, o.r * .45, o.r * .25, -.4, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgb(255 255 255 / .35)'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, o.r + 5, 0.4, 2.2); c.stroke();
      c.restore();
    }
    function drawFlower(o) {
      c.save(); c.translate(o.x, o.y); c.rotate(o.a);
      c.fillStyle = '#D7263D';
      for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2; c.beginPath(); c.ellipse(Math.cos(a) * 6.5, Math.sin(a) * 6.5, 6, 4.4, a, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#F2B33D'; c.beginPath(); c.arc(0, 0, 3.4, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var elapsed = now - t0, left = 1 - elapsed / DURATION;
      ctx.time(left); ctx.warn(left < 0.25);
      if (elapsed >= DURATION && !over) { over = true; ctx.sfx.win(); setTimeout(function () { ctx.done(flowers >= 12 ? 3 : flowers >= 6 ? 2 : 1, ctx.data.feluccaWords.map(function (w) { return { ar: w.ar, tr: w.tr, m: w[ctx.lang] || w.en }; })); }, 700); }
      var speed = 150 + 120 * Math.min(1, elapsed / DURATION);
      if (!over) {
        scroll += speed * dt;
        if (now > spawnAt) { spawn(); spawnAt = now + rand(420, 640); }
        boat.x += (boat.tx - boat.x) * Math.min(1, dt * 10);
        boat.x = Math.max(bankL(boat.y) + 18, Math.min(bankR(boat.y) - 18, boat.x));
        objs.forEach(function (o) { o.y += speed * dt; if (!o.rock) o.a += dt; });
        decor.forEach(function (o) { o.y += speed * dt; if (o.y > H + 30) { o.y -= H + 60; o.kind = Math.random() > 0.65 ? 'house' : 'palm'; } });
        objs.forEach(function (o) {
          if (o.hit) return;
          var dx = o.x - boat.x, dy = o.y - boat.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < o.r + 16) {
            if (o.rock) { if (boat.hurt <= 0) { o.hit = true; flowers = Math.max(0, flowers - 1); boat.hurt = 0.9; shake = 0.35; ctx.sfx.bad(); ctx.buzz(60); pill(); } }
            else {
              o.hit = true; o.gone = true; flowers++; ctx.sfx.flower(); pill();
              if (flowers === 5) ctx.toast(ctx.t('f.k5'), 'good');
              if (flowers === 10) ctx.toast(ctx.t('f.k10'), 'good');
            }
          }
        });
        objs = objs.filter(function (o) { return o.y < H + 40 && !o.gone; });
        boat.hurt -= dt; shake = Math.max(0, shake - dt);
      }
      /* draw */
      c.save();
      if (shake > 0) c.translate(rand(-4, 4), rand(-3, 3));
      c.fillStyle = '#E3CB93'; c.fillRect(0, 0, W, H);
      var step = 14, y;
      c.fillStyle = '#7FB069';
      c.beginPath(); c.moveTo(0, 0); for (y = 0; y <= H; y += step) c.lineTo(bankL(y) + 2, y); c.lineTo(0, H); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(W, 0); for (y = 0; y <= H; y += step) c.lineTo(bankR(y) - 2, y); c.lineTo(W, H); c.closePath(); c.fill();
      c.fillStyle = '#E3CB93';
      c.beginPath(); c.moveTo(0, 0); for (y = 0; y <= H; y += step) c.lineTo(bankL(y) - 16, y); c.lineTo(0, H); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(W, 0); for (y = 0; y <= H; y += step) c.lineTo(bankR(y) + 16, y); c.lineTo(W, H); c.closePath(); c.fill();
      var grad = c.createLinearGradient(0, 0, W, 0); grad.addColorStop(0, '#2E64B3'); grad.addColorStop(0.5, '#3D7BD0'); grad.addColorStop(1, '#2E64B3');
      c.fillStyle = grad; c.beginPath(); c.moveTo(bankL(0), 0);
      for (y = 0; y <= H; y += step) c.lineTo(bankL(y), y);
      for (y = H; y >= 0; y -= step) c.lineTo(bankR(y), y);
      c.closePath(); c.fill();
      c.strokeStyle = 'rgb(255 255 255 / .18)'; c.lineWidth = 2;
      for (var k = 0; k < 9; k++) { var wy = ((k * 90 + scroll * 1.0) % (H + 60)) - 30, wx = W * (0.3 + (k * 37 % 40) / 100); c.beginPath(); c.moveTo(wx, wy); c.quadraticCurveTo(wx + 10, wy - 4, wx + 20, wy); c.stroke(); }
      decor.forEach(function (o) {
        var x = o.side ? bankR(o.y) + 34 : bankL(o.y) - 34;
        if (x < 10 || x > W - 10) x = o.side ? W - 18 : 18;
        if (o.kind === 'palm') drawPalm(x, o.y); else drawHouse(x, o.y, o.col);
      });
      objs.forEach(function (o) { if (o.rock) drawRock(o); else drawFlower(o); });
      drawBoat(boat.x, boat.y, boat.hurt > 0 && Math.floor(now / 90) % 2 === 0);
      c.restore();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    function setTarget(e) { var r = cv.getBoundingClientRect(); boat.tx = e.clientX - r.left; }
    function onDown(e) { e.preventDefault(); setTarget(e); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } }
    function onMove(e) { if (e.buttons || e.pointerType === 'touch') setTarget(e); }
    function onKey(e) {
      if (e.key === 'ArrowLeft') { boat.tx -= W * 0.12; e.preventDefault(); }
      if (e.key === 'ArrowRight') { boat.tx += W * 0.12; e.preventDefault(); }
    }
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', size);
    ctx.onCleanup(function () {
      cancelAnimationFrame(raf);
      cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKey); window.removeEventListener('resize', size);
      ctx.time(null); ctx.warn(false);
    });
  };
})();
