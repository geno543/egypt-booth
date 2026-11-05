/*
  Tiny QR code encoder written for this project (no outside code).
  Follows the QR Code standard (ISO/IEC 18004): byte mode, error correction
  level M, versions 1 to 10 (up to 213 bytes, plenty for a web address),
  automatic mask choice by the standard penalty rules.

  Usage:  var m = EGQR.encode('https://...');   // m.size, m.get(x, y) -> true for dark
          el.innerHTML = EGQR.svg('https://...', { margin: 4, dark: '#131418', light: '#fff' });
*/
(function (root) {
  'use strict';

  /* Level M tables, index = version - 1 */
  var RAW_CODEWORDS = [26, 44, 70, 100, 134, 172, 196, 242, 292, 346];
  var ECC_PER_BLOCK = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
  var NUM_BLOCKS    = [1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  var ALIGN = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  var ECL_M_FORMAT_BITS = 0; /* L=1, M=0, Q=3, H=2 */

  /* ---------- Galois field GF(256), polynomial 0x11D ---------- */
  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
  function rsDivisor(degree) {
    var result = [];
    for (var i = 0; i < degree - 1; i++) result.push(0);
    result.push(1);
    var r = 1;
    for (i = 0; i < degree; i++) {
      for (var j = 0; j < result.length; j++) {
        result[j] = gfMul(result[j], r);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      r = gfMul(r, 0x02);
    }
    return result;
  }
  function rsRemainder(data, divisor) {
    var result = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ result.shift();
      result.push(0);
      divisor.forEach(function (coef, i) { result[i] ^= gfMul(coef, factor); });
    });
    return result;
  }

  /* ---------- text to bytes (UTF-8) ---------- */
  function utf8(str) {
    var out = [], s = unescape(encodeURIComponent(str));
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  /* ---------- data codewords ---------- */
  function buildCodewords(bytes, version) {
    var dataCapacity = RAW_CODEWORDS[version - 1] - ECC_PER_BLOCK[version - 1] * NUM_BLOCKS[version - 1];
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(0x4, 4);                                  /* byte mode */
    put(bytes.length, version < 10 ? 8 : 16);     /* character count */
    bytes.forEach(function (b) { put(b, 8); });
    var capBits = dataCapacity * 8;
    put(0, Math.min(4, capBits - bits.length));   /* terminator */
    put(0, (8 - bits.length % 8) % 8);            /* pad to a byte */
    var words = [];
    for (var i = 0; i < bits.length; i += 8) {
      var w = 0;
      for (var j = 0; j < 8; j++) w = (w << 1) | bits[i + j];
      words.push(w);
    }
    for (var pad = 0xEC; words.length < dataCapacity; pad ^= 0xEC ^ 0x11) words.push(pad);
    return words;
  }

  function addEccAndInterleave(data, version) {
    var numBlocks = NUM_BLOCKS[version - 1], eccLen = ECC_PER_BLOCK[version - 1], raw = RAW_CODEWORDS[version - 1];
    var numShort = numBlocks - raw % numBlocks;
    var shortLen = Math.floor(raw / numBlocks);
    var divisor = rsDivisor(eccLen);
    var blocks = [], k = 0;
    for (var i = 0; i < numBlocks; i++) {
      var dat = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1));
      k += dat.length;
      var ecc = rsRemainder(dat, divisor);
      if (i < numShort) dat.push(0); /* placeholder, skipped below */
      blocks.push(dat.concat(ecc));
    }
    var result = [];
    for (i = 0; i < blocks[0].length; i++) {
      for (var j = 0; j < blocks.length; j++) {
        if (i !== shortLen - eccLen || j >= numShort) result.push(blocks[j][i]);
      }
    }
    return result;
  }

  /* ---------- matrix ---------- */
  function Matrix(version) {
    this.version = version;
    this.size = version * 4 + 17;
    this.mod = []; this.fn = [];
    for (var y = 0; y < this.size; y++) {
      this.mod.push(new Array(this.size).fill(false));
      this.fn.push(new Array(this.size).fill(false));
    }
  }
  Matrix.prototype.setFn = function (x, y, dark) { this.mod[y][x] = dark; this.fn[y][x] = true; };

  Matrix.prototype.drawFunctionPatterns = function () {
    var size = this.size, i, j;
    for (i = 0; i < size; i++) { this.setFn(6, i, i % 2 === 0); this.setFn(i, 6, i % 2 === 0); }
    this.drawFinder(3, 3); this.drawFinder(size - 4, 3); this.drawFinder(3, size - 4);
    var pos = ALIGN[this.version - 1], n = pos.length;
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
        this.drawAlignment(pos[i], pos[j]);
      }
    }
    this.drawFormatBits(0); /* reserve the area; real bits drawn after masking */
    this.drawVersion();
  };
  Matrix.prototype.drawFinder = function (x, y) {
    for (var dy = -4; dy <= 4; dy++) {
      for (var dx = -4; dx <= 4; dx++) {
        var dist = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) this.setFn(xx, yy, dist !== 2 && dist !== 4);
      }
    }
  };
  Matrix.prototype.drawAlignment = function (x, y) {
    for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) this.setFn(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  };
  Matrix.prototype.drawFormatBits = function (mask) {
    var data = (ECL_M_FORMAT_BITS << 3) | mask, rem = data, size = this.size, i;
    for (i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    var bits = ((data << 10) | rem) ^ 0x5412;
    var bit = function (k) { return ((bits >>> k) & 1) !== 0; };
    for (i = 0; i <= 5; i++) this.setFn(8, i, bit(i));
    this.setFn(8, 7, bit(6)); this.setFn(8, 8, bit(7)); this.setFn(7, 8, bit(8));
    for (i = 9; i < 15; i++) this.setFn(14 - i, 8, bit(i));
    for (i = 0; i < 8; i++) this.setFn(size - 1 - i, 8, bit(i));
    for (i = 8; i < 15; i++) this.setFn(8, size - 15 + i, bit(i));
    this.setFn(8, size - 8, true); /* the always-dark module */
    return bits;
  };
  Matrix.prototype.drawVersion = function () {
    if (this.version < 7) return;
    var rem = this.version;
    for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    var bits = (this.version << 12) | rem;
    for (i = 0; i < 18; i++) {
      var dark = ((bits >>> i) & 1) !== 0, a = this.size - 11 + i % 3, b = Math.floor(i / 3);
      this.setFn(a, b, dark); this.setFn(b, a, dark);
    }
  };
  Matrix.prototype.drawData = function (codewords) {
    var size = this.size, i = 0, total = codewords.length * 8;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (var j = 0; j < 2; j++) {
          var x = right - j, upward = ((right + 1) & 2) === 0, y = upward ? size - 1 - vert : vert;
          if (!this.fn[y][x] && i < total) {
            this.mod[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
            i++;
          }
        }
      }
    }
  };
  var MASKS = [
    function (x, y) { return (x + y) % 2 === 0; },
    function (x, y) { return y % 2 === 0; },
    function (x, y) { return x % 3 === 0; },
    function (x, y) { return (x + y) % 3 === 0; },
    function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; },
    function (x, y) { return x * y % 2 + x * y % 3 === 0; },
    function (x, y) { return (x * y % 2 + x * y % 3) % 2 === 0; },
    function (x, y) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }
  ];
  Matrix.prototype.applyMask = function (m) {
    for (var y = 0; y < this.size; y++) for (var x = 0; x < this.size; x++) {
      if (!this.fn[y][x] && MASKS[m](x, y)) this.mod[y][x] = !this.mod[y][x];
    }
  };

  /* standard penalty score, used to pick the most readable mask */
  Matrix.prototype.penalty = function () {
    var size = this.size, mod = this.mod, result = 0, x, y;
    function addHistory(len, hist) { if (hist[0] === 0) len += size; hist.pop(); hist.unshift(len); }
    function countPatterns(h) {
      var n = h[1], core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n;
      return (core && h[0] >= n * 4 && h[6] >= n ? 1 : 0) + (core && h[6] >= n * 4 && h[0] >= n ? 1 : 0);
    }
    function terminate(color, len, hist) { if (color) { addHistory(len, hist); len = 0; } len += size; addHistory(len, hist); return countPatterns(hist); }
    function line(get) {
      var score = 0;
      for (var a = 0; a < size; a++) {
        var color = false, run = 0, hist = [0, 0, 0, 0, 0, 0, 0];
        for (var b = 0; b < size; b++) {
          if (get(a, b) === color) { run++; if (run === 5) score += 3; else if (run > 5) score++; }
          else { addHistory(run, hist); if (!color) score += countPatterns(hist) * 40; color = get(a, b); run = 1; }
        }
        score += terminate(color, run, hist) * 40;
      }
      return score;
    }
    result += line(function (a, b) { return mod[a][b]; });
    result += line(function (a, b) { return mod[b][a]; });
    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
      var c = mod[y][x];
      if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) result += 3;
    }
    var dark = 0;
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (mod[y][x]) dark++;
    var total = size * size;
    result += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
    return result;
  };

  /* ---------- public ---------- */
  function encode(text) {
    var bytes = utf8(text), version;
    for (version = 1; version <= 10; version++) {
      var cap = RAW_CODEWORDS[version - 1] - ECC_PER_BLOCK[version - 1] * NUM_BLOCKS[version - 1];
      if (4 + (version < 10 ? 8 : 16) + bytes.length * 8 <= cap * 8) break;
    }
    if (version > 10) throw new Error('Text too long for this QR encoder (max about 210 characters).');
    var codewords = addEccAndInterleave(buildCodewords(bytes, version), version);
    var best = null, bestScore = Infinity;
    for (var m = 0; m < 8; m++) {
      var mx = new Matrix(version);
      mx.drawFunctionPatterns();
      mx.drawData(codewords);
      mx.applyMask(m);
      mx.drawFormatBits(m);
      var s = mx.penalty();
      if (s < bestScore) { best = mx; bestScore = s; best.mask = m; }
    }
    return { size: best.size, version: version, mask: best.mask, get: function (x, y) { return best.mod[y][x]; } };
  }

  function svg(text, opt) {
    opt = opt || {};
    var q = encode(text), margin = opt.margin == null ? 4 : opt.margin, n = q.size + margin * 2, d = '';
    for (var y = 0; y < q.size; y++) {
      for (var x = 0; x < q.size; x++) {
        if (q.get(x, y)) d += 'M' + (x + margin) + ' ' + (y + margin) + 'h1v1h-1z';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges"' +
      (opt.label ? ' role="img" aria-label="' + String(opt.label).replace(/"/g, '&quot;') + '"' : ' aria-hidden="true"') + '>' +
      '<rect width="' + n + '" height="' + n + '" fill="' + (opt.light || '#ffffff') + '"/>' +
      '<path d="' + d + '" fill="' + (opt.dark || '#000000') + '"/></svg>';
  }

  root.EGQR = { encode: encode, svg: svg, _test: { gfMul: gfMul, rsDivisor: rsDivisor, rsRemainder: rsRemainder, Matrix: Matrix } };
})(typeof window !== 'undefined' ? window : this);
