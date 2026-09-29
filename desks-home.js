/* HOME · 03 · THE FIVE DESKS, ONE BY ONE ON THE SCROLL (Christian, 29 Sep 2026). No library.
   Nothing to press: the desks come to the visitor as they scroll. The script chooses between two
   ways of showing them, by the room there is (styles: desks-home.css):
     THE STAGE   a desktop tall enough for the window: the five windows are moved into one held
                 frame on the right; the question nearest the middle of the screen decides which desk
                 the frame shows, and each change plays that desk (Freya thinks, answers, the picture
                 plays). The rail over the frame fills as you go.
     THE FLOW    everything else: each window stays under its question and plays once as it scrolls
                 in; the rail is held under the bar.
   The rail is also a way to jump to a desk. Reduced motion: the same order, nothing moves.
   Without the script every desk is simply there, in turn.
   THE MAP (Records and Investment) is the app's treemap, drawn here from the figures written into the
   page: select a block to open it, the path above goes back. Investment's blocks wear the asset-class
   colours, each class its own and what is inside it in shades of it (the app's Mix lab, SIMC). */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)'), WIDE = matchMedia('(min-width: 768px)');


  /* ══ THE MAP ══ the app's treemap (the platform's app.js, THE TREEMAPS): flat blocks, squarified,
     a block opens into what it is made of, and blocks travel between the two views rather than
     redraw. What you own: one green in six steps, the darkest the largest. Investments: the asset-
     class colours (Shares, Bonds, Private markets, Real estate, Infrastructure, Cash), and inside a
     class its accounts and funds in shades of that class's colour, the largest the fullest ═════ */
  var RAMP = ['--primary-pressed', '--primary', '--primary-hover', '--primary-72', '--primary-48', '--primary-24'],
      INK = ['--white', '--white', '--white', '--white', '--black', '--black'],
      FIT = ['fs', 'f1', 'f2', 'f3', 'f4', 'f5'],
      /* the class colours, as the app's Mix lab has them (SIMC): the key of a map's first level */
      CLASS = { eq: '--d-equities', fx: '--d-fixed', pr: '--d-private', re: '--d-real', inf: '--l-property', ca: '--d-cash' };
  /* a token's colour, read from the page, and the ink that reads on a colour (white from 3:1, as the
     app's ramp puts white words on Primary 72%) */
  function rgbOf(token) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    if (v.charAt(0) === '#') { if (v.length === 4) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]; return [1, 3, 5].map(function (i) { return parseInt(v.substr(i, 2), 16); }); }
    var m = v.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [36, 104, 83];
  }
  function lum(c) { return c.map(function (x) { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }).reduce(function (t, x, i) { return t + x * [0.2126, 0.7152, 0.0722][i]; }, 0); }
  function inkOn(c) { return 1.05 / (lum(c) + 0.05) >= 3 ? '--white' : '--black'; }
  /* shade i of n: a dark colour steps towards white (down to 40% of itself), a pale one (cash)
     towards black (up to a quarter) */
  function shade(c, i, n) {
    var t = n > 1 ? i / (n - 1) : 0, dark = lum(c) < 0.35, p = dark ? 1 - t * 0.6 : 1 - t * 0.26, to = dark ? 255 : 0;
    return c.map(function (x) { return Math.round(x * p + to * (1 - p)); });
  }
  function money(v) { return '$' + Math.round(v).toLocaleString('en-US'); }
  function short(v) {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    return v >= 1e3 ? '$' + Math.round(v / 1e3) + 'K' : money(v);
  }
  function pct(x) { return (x * 100).toFixed(1) + '%'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* squarified (Bruls, Huizing, van Wijk): rows along the short side while the worst ratio improves */
  function worst(row, side) {
    var sum = 0, max = 0, min = Infinity;
    row.forEach(function (n) { sum += n.a; if (n.a > max) max = n.a; if (n.a < min) min = n.a; });
    var s2 = side * side, q = sum * sum; return Math.max(s2 * max / q, q / (s2 * min));
  }
  function squarify(nodes, x, y, w, h) {
    var total = nodes.reduce(function (t, n) { return t + n.v; }, 0), out = [], i = 0;
    if (!(total > 0) || w <= 0 || h <= 0) return out;
    nodes.forEach(function (n) { n.a = n.v / total * w * h; });
    while (i < nodes.length) {
      var side = Math.min(w, h), row = [nodes[i]], j = i + 1;
      while (j < nodes.length && worst(row.concat([nodes[j]]), side) <= worst(row, side)) { row.push(nodes[j]); j++; }
      var rs = row.reduce(function (t, n) { return t + n.a; }, 0);
      if (w >= h) { var cw = rs / h, yy = y; row.forEach(function (n) { var hh = n.a / cw; out.push({ n: n, x: x, y: yy, w: cw, h: hh }); yy += hh; }); x += cw; w -= cw; }
      else { var rh = rs / w, xx = x; row.forEach(function (n) { var ww = n.a / rh; out.push({ n: n, x: xx, y: y, w: ww, h: rh }); xx += ww; }); y += rh; h -= rh; }
      i = j;
    }
    return out;
  }

  function FdMap(root) {
    var box = root.querySelector('.fd-tv'), crumbs = root.querySelector('.fd-crumbs'), sum = root.querySelector('.fd-map-sum'),
        hint = root.querySelector('.fd-map-hint'), moreEl = root.querySelector('.fd-map-more'),
        data = JSON.parse(root.querySelector('script[type="application/json"]').textContent),
        rootName = root.getAttribute('data-root'), of = root.getAttribute('data-of'),
        byClass = root.getAttribute('data-colors') === 'class', leafHint = root.getAttribute('data-leaf') || '',
        path = [], M = {};
    var flat = box.querySelector('.fd-tv-flat'); if (flat) flat.remove();
    box.classList.add('is-js');

    function view() {
      var nodes = data.nodes, trail = [];
      for (var i = 0; i < path.length; i++) {
        var n = nodes.filter(function (x) { return x.k === path[i]; })[0];
        if (!n || !n.kids) { path = path.slice(0, i); break; }
        trail.push(n); nodes = n.kids;
      }
      nodes = nodes.slice().sort(function (a, b) { return b.v - a.v; });
      return { nodes: nodes, trail: trail, shown: nodes.reduce(function (t, n) { return t + n.v; }, 0) };
    }
    function items(V) {
      var pre = path.length ? path.join('/') + '/' : '', base = byClass && path.length ? rgbOf(CLASS[path[0]] || '--d-equities') : null;
      return V.nodes.map(function (n, i) {
        var st = Math.min(i, RAMP.length - 1), sh = pct(n.v / data.total), c, ink;
        if (!byClass) { c = 'var(' + RAMP[st] + ')'; ink = INK[st]; }
        else { var rgb = base ? shade(base, i, V.nodes.length) : rgbOf(CLASS[n.k] || '--d-equities'); c = 'rgb(' + rgb.join(',') + ')'; ink = inkOn(rgb); }
        return { k: pre + n.k, key: n.k, v: n.v, label: n.l, sub: n.s || '', share: sh, c: c, ink: ink, open: !!n.kids,
          aria: n.l + (n.s ? ', ' + n.s : '') + ', ' + money(n.v) + ', ' + sh + ' of ' + of };
      });
    }
    function over(el) {
      var i = el.firstChild, n = el.querySelector('.n');
      return i.scrollHeight > i.clientHeight + 1 || i.scrollWidth > i.clientWidth + 1 || (n && (n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1));
    }
    function put(el, r) { el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px'; }
    function inner(it) {
      return '<span class="fd-b-in"><span class="n">' + esc(it.label) + '</span>' + (it.sub ? '<span class="s">' + esc(it.sub) + '</span>' : '') +
        '<span class="v"><span class="vf">' + money(it.v) + '</span><span class="vs">' + short(it.v) + '</span></span><span class="p">' + it.share + '</span></span>' +
        '<span class="x" aria-hidden="true">+' + (it.tail ? it.tail.length : 1) + '</span>';
    }
    /* fit a block's words at its size: step down until they fit, or name it under the map (xs) */
    function fit(el, r) {
      FIT.concat('xs').forEach(function (c) { el.classList.remove(c); });
      if (r.w < 52 || r.h < 38) { el.classList.add('xs'); return false; }
      for (var f = 0; f < FIT.length && over(el); f++) el.classList.add(FIT[f]);
      if (over(el)) { el.classList.add('xs'); return false; }
      return true;
    }
    /* a probe, out of sight, to know before drawing which blocks cannot carry their name */
    var probe = document.createElement('span'); probe.className = 'fd-b'; probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'visibility:hidden;pointer-events:none;transition:none'; box.appendChild(probe);
    function fits(it, r) { probe.innerHTML = inner(it); probe.style.setProperty('--c', 'transparent'); put(probe, r); return fit(probe, r); }
    /* draw the blocks: keyed, so a block that is there before and after travels; o.from is the block
       new ones grow out of, o.up the block we came out of, which shrinks back from the whole box */
    function draw(list, motion, o) {
      var W = box.clientWidth, H = box.clientHeight, gap = parseFloat(getComputedStyle(box).getPropertyValue('--fd-gap')) || 3;
      var old = {}, oldR = {}, keep = {}, small = [];
      [].forEach.call(box.querySelectorAll('.fd-b[data-k]:not([data-gone])'), function (el) {
        var k = el.getAttribute('data-k'); old[k] = el; oldR[k] = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      });
      /* rows: a tall box (a phone) whose squarified blocks are too narrow to name is laid in full-width
         bands instead, so each name has the whole width; whichever names more is used */
      function place(l, rows) {
        var tot = l.reduce(function (t, it) { return t + it.v; }, 0), at = 0;
        var rects = rows ? l.map(function (it) { var h = tot ? it.v / tot * H : 0, r = { n: { it: it }, x: 0, y: at, w: W, h: h }; at += h; return r; }) :
          W / H > 3 ? l.map(function (it) { var w = tot ? it.v / tot * W : 0, r = { n: { it: it }, x: at, y: 0, w: w, h: H }; at += w; return r; }) :
          squarify(l.map(function (it) { return { it: it, v: it.v }; }), 0, 0, W, H);
        return rects.map(function (r) {
          var x0 = Math.round(r.x + gap / 2), y0 = Math.round(r.y + gap / 2), x1 = Math.round(r.x + r.w - gap / 2), y1 = Math.round(r.y + r.h - gap / 2);
          return { it: r.n.it, r: { x: x0, y: y0, w: Math.max(0, x1 - x0), h: Math.max(0, y1 - y0) } };
        });
      }
      var rows = false, nodes = place(list);
      /* the tail in one block: two or more blocks that cannot carry their name become "2 more", named under the map */
      var tiny = nodes.filter(function (d) { return !fits(d.it, d.r); });
      if (tiny.length > 1 && H >= W * 0.8) {
        var alt = place(list, true), tiny2 = alt.filter(function (d) { return !fits(d.it, d.r); });
        if (tiny2.length < tiny.length) { rows = true; nodes = alt; tiny = tiny2; }
      }
      /* laid out again with the tail, a block may lose the room for its name: it joins the tail, and
         the map is laid out once more (a few rounds at most) */
      for (var round = 0, t = [], tk = {}; tiny.length && (tiny.length > 1 || t.length) && round < 4; round++) {
        tiny.forEach(function (d) { if (d.it.tail) return; if (!tk[d.it.k]) { tk[d.it.k] = true; t.push(d.it); } });
        var last = t[t.length - 1], tv = t.reduce(function (a, it) { return a + it.v; }, 0);
        nodes = place(list.filter(function (it) { return !tk[it.k]; }).concat([{ k: 'tail:' + t.map(function (it) { return it.k; }).join('+'), v: tv,
          label: t.length + ' more', sub: '', share: pct(tv / data.total), c: last.c, ink: last.ink, tail: t,
          aria: t.length + ' more, ' + money(tv) + ' together: ' + t.map(function (it) { return it.label; }).join(', ') }]), rows);
        tiny = nodes.filter(function (d) { return !d.it.tail && !fits(d.it, d.r); });
      }
      nodes.forEach(function (d, idx) {
        var it = d.it, el = old[it.k], isNew = !el;
        if (isNew) { el = document.createElement('button'); el.type = 'button'; el.className = 'fd-b'; el.setAttribute('data-k', it.k); box.appendChild(el); }
        keep[it.k] = true;
        el.style.setProperty('--c', it.c); el.style.setProperty('--ink', 'var(' + it.ink + ')'); el.style.setProperty('--i', idx);
        el.classList.toggle('is-tail', !!it.tail); el.classList.toggle('is-leaf', !it.open && !it.tail);
        if (it.open) { el.setAttribute('data-open', it.key); el.setAttribute('aria-label', it.aria + '. Open it'); el.removeAttribute('aria-disabled'); }
        else { el.removeAttribute('data-open'); el.setAttribute('aria-label', it.aria); el.setAttribute('aria-disabled', 'true'); }
        var html = inner(it);
        if (el.getAttribute('data-html') !== html) { el.innerHTML = html; el.setAttribute('data-html', html); if (motion) el.firstChild.classList.add('is-arriving'); }
        /* the words are fitted at the final size, then the block starts from where it was */
        el.style.transition = 'none'; put(el, d.r);
        var named = fit(el, d.r);
        if (it.tail) small = small.concat(it.tail);
        else if (!named) small.push(it);
        if (motion) {
          var start = !isNew ? oldR[it.k] : (o.up === it.k ? { x: 0, y: 0, w: W, h: H } : o.from && oldR[o.from]);
          if (start) put(el, start); else if (isNew) el.style.opacity = '0';
        }
      });
      var target = o.up && nodes.filter(function (d) { return d.it.k === o.up; })[0];
      Object.keys(old).forEach(function (k) {
        if (keep[k]) return;
        var el = old[k]; el.setAttribute('data-gone', ''); el.setAttribute('tabindex', '-1'); el.removeAttribute('data-open');
        if (!motion) { el.remove(); return; }
        el.style.transition = ''; el.style.opacity = '0'; if (target) put(el, target.r);
        setTimeout(function () { el.remove(); }, 700);
      });
      if (motion) void box.offsetWidth;
      nodes.forEach(function (d) {
        var el = box.querySelector('.fd-b[data-k="' + CSS.escape(d.it.k) + '"]:not([data-gone])'); if (!el) return;
        el.style.transition = motion ? '' : 'none'; put(el, d.r); el.style.opacity = '';
      });
      box.classList.add('ready');
      return small;
    }
    /* the path above the map, what is shown and its share, and what is too small to name */
    function head(V, small) {
      var its = [[rootName, 0]].concat(V.trail.map(function (n, i) { return [n.l, i + 1]; }));
      crumbs.innerHTML = its.map(function (x, i) {
        return i === its.length - 1 ? '<span aria-current="page">' + esc(x[0]) + '</span>' : '<button type="button" data-up="' + x[1] + '">' + esc(x[0]) + '</button>';
      }).join('<span class="sep" aria-hidden="true">›</span>');
      sum.textContent = money(V.shown) + (path.length ? ' · ' + pct(V.shown / data.total) : '');
      var leaf = V.nodes.length && !V.nodes[0].kids;
      if (hint) hint.textContent = leaf ? leafHint : 'Select a block to open it';
      moreEl.innerHTML = small.length ? '<span class="h">Also here</span>' + small.map(function (it) {
        return '<span><i style="--c:' + it.c + '"></i>' + esc(it.label) + ' <b>' + money(it.v) + '</b></span>';
      }).join('') : '';
      moreEl.hidden = !small.length;
    }
    function render(motion, o) {
      if (!box.clientWidth || !box.clientHeight) return;
      var V = view(); head(V, draw(items(V), motion, o || {}));
    }
    function open(k) { var from = (path.length ? path.join('/') + '/' : '') + k; path.push(k); render(!RM.matches, { from: from }); }
    function up(d) { if (d >= path.length) return; var came = path.slice(0, d + 1).join('/'); path = path.slice(0, d); render(!RM.matches, { up: came }); }
    box.addEventListener('click', function (ev) {
      var b = ev.target.closest('.fd-b'); if (!b || !b.hasAttribute('data-open')) return;
      open(b.getAttribute('data-open'));
    });
    crumbs.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-up]'); if (!b) return; up(+b.getAttribute('data-up'));
    });
    M.reset = function () { path = []; render(false); };
    M.refresh = function () { render(false); };
    M.box = box;
    if (window.ResizeObserver) { var rw = 0, rh = 0; new ResizeObserver(function () { if (box.clientWidth !== rw || box.clientHeight !== rh) { rw = box.clientWidth; rh = box.clientHeight; render(false); } }).observe(box); }
    render(false);
    return M;
  }

  document.querySelectorAll('[data-fd]').forEach(function (x) {
    var sec = x.closest('.fd'), flow = x.querySelector('.fd-flow'), rail = x.querySelector('.fd-rail'),
        stage = x.querySelector('.fd-stage'), deck = x.querySelector('.fd-deck'),
        chs = [].slice.call(x.querySelectorAll('.fd-c')),
        figs = chs.map(function (c) { return c.querySelector('.fd-screen'); }),
        links = [].slice.call(rail.querySelectorAll('a')),
        bars = links.map(function (a) { return a.querySelector('.fd-bar i'); }),
        mode = '', cur = -1, seen = false, near = false, ticking = false, played = [], rz = 0, hs = [];

    x.classList.add('is-js');
    if (!RM.matches) x.classList.add('is-anim');
    /* every picture waits until its desk arrives (without the script it all just shows) */
    figs.forEach(function (f) { f.classList.add('is-wait'); f._maps = [].map.call(f.querySelectorAll('[data-fd-map]'), FdMap); });

    /* the clearance under the bar: the bar itself, measured (its outer box has no height) */
    var bar = document.querySelector('.nav-outer .nav') || document.querySelector('.nav-outer');
    function clearance() { return bar ? Math.round(bar.getBoundingClientRect().bottom + 16) : 96; }
    function mark(f, s) { f.querySelectorAll('.fd-mk').forEach(function (m) { m.setAttribute('data-state', s); }); }

    /* numbers count up to what they say: the first number in the text, its prefix and suffix kept */
    function count(el) {
      var t = el.getAttribute('data-t') || el.textContent; el.setAttribute('data-t', t);
      var m = t.match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/); if (!m) return;
      var to = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1, t0 = 0;
      function fmt(v) { var s = v.toFixed(dec); if (comma) { var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = p.join('.'); } return m[1] + s + m[3]; }
      function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 900), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(step); else el.textContent = t; }
      requestAnimationFrame(step);
    }

    /* a desk arrives: Freya thinks, answers, and the picture plays */
    function stop(f) { (f._fd || []).forEach(clearTimeout); f._fd = []; }
    function rest(f) { stop(f); f.classList.remove('is-live'); f.classList.add('is-wait'); mark(f, 'ready'); f._maps.forEach(function (m) { m.reset(); }); }
    function play(f) {
      stop(f);
      f._maps.forEach(function (m) { m.reset(); });
      if (RM.matches) { f.classList.remove('is-wait'); f.classList.add('is-live'); return; }
      f.classList.remove('is-live'); f.classList.add('is-wait'); void f.offsetWidth;
      mark(f, 'thinking');
      f._fd.push(setTimeout(function () {
        mark(f, 'answering'); f.classList.remove('is-wait'); f.classList.add('is-live');
        f.querySelectorAll('.fd-n').forEach(count);
        /* the map rises block by block, the largest first */
        f._maps.forEach(function (m) { m.box.classList.remove('is-rise'); void m.box.offsetWidth; m.box.classList.add('is-rise'); });
        f._fd.push(setTimeout(function () { f._maps.forEach(function (m) { m.box.classList.remove('is-rise'); }); }, 1500));
      }, 700));
      f._fd.push(setTimeout(function () { mark(f, 'ready'); }, 1900));
    }

    /* the window's frame (padding and border), and its height for the desk it shows */
    function frame() {
      var cs = getComputedStyle(deck);
      return parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    }
    function fit() { if (mode === 'stage' && figs[cur]) deck.style.height = (figs[cur].offsetHeight + frame()) + 'px'; }

    /* which desk is open: the rail, the questions and, on the stage, the window */
    function open(i) {
      var was = cur; cur = i;
      links.forEach(function (a, k) {
        a.classList.toggle('is-on', k === i);
        if (k === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
      chs.forEach(function (c, k) { c.classList.toggle('is-on', k === i); c.classList.toggle('is-before', k < i); });
      if (mode !== 'stage') return;
      figs.forEach(function (f, k) {
        f.classList.toggle('is-on', k === i); f.classList.toggle('is-before', k < i); f.classList.toggle('is-after', k > i);
        if (k !== i) rest(f);
      });
      fit();
      if (seen && i !== was) play(figs[i]);
    }

    /* the two ways of showing the desks; the window is moved, never copied */
    function setMode(m) {
      if (m === mode) return;
      mode = m;
      if (m === 'stage') {
        stage.insertBefore(rail, deck);
        figs.forEach(function (f) { f.classList.remove('is-in'); deck.appendChild(f); });
        x.classList.add('is-stage');
      } else {
        [rail, deck].forEach(function (e) { e.style.zoom = ''; });
        deck.style.height = '';
        x.classList.remove('is-short');
        x.insertBefore(rail, flow);
        figs.forEach(function (f, k) { f.classList.remove('is-on', 'is-before', 'is-after'); chs[k].appendChild(f); rest(f); });
        played = [];
        x.classList.remove('is-stage');
      }
      var c = cur; cur = -1; open(Math.max(0, c));
    }
    /* the stage only when the window fits between the bar and the foot of the screen */
    function layout() {
      var top = clearance();
      x.style.setProperty('--fd-top', top + 'px');
      if (WIDE.matches) {
        setMode('stage');
        var parts = [rail, deck], room = innerHeight - top - 16;
        parts.forEach(function (e) { e.style.zoom = ''; });
        deck.style.transition = 'none'; deck.style.height = '';
        x.classList.remove('is-short');
        /* what the stage needs: the rail over the window at the height of its tallest desk */
        var need = function () { hs = figs.map(function (f) { return f.offsetHeight; }); return stage.offsetHeight - deck.offsetHeight + Math.max.apply(null, hs) + frame(); };
        var h = need();
        /* short: the line under Freya's answer goes, first */
        if (room / h < 0.92) { x.classList.add('is-short'); h = need(); }
        var z = Math.min(1, room / h);
        /* a little too tall: drawn a touch smaller; much too tall: the flow instead */
        if (z < 0.82) { deck.style.transition = ''; setMode('flow'); }
        else {
          if (z < 1) parts.forEach(function (e) { e.style.zoom = z.toFixed(3); });
          fit(); void deck.offsetHeight; deck.style.transition = '';
          var st = Math.round(top + Math.max(0, room - h * z) / 2);
          x.style.setProperty('--fd-st', st + 'px');
          /* the last question stays long enough for the window to be held while it is read */
          x.style.setProperty('--fd-last', Math.ceil(2 * (st + h * z - innerHeight / 2) + 24) + 'px');
        }
      } else setMode('flow');
      figs.forEach(function (f) { f._maps.forEach(function (m) { m.refresh(); }); });
      update();
    }

    /* on every scroll frame, while the section is near: which desk, how far through it, and in the
       flow, which windows have come in */
    function update() {
      ticking = false;
      var line = innerHeight * (mode === 'stage' ? 0.5 : 0.45), act = 0;
      chs.forEach(function (c, k) {
        var r = c.getBoundingClientRect();
        if (r.top <= line) act = k;
        bars[k].style.setProperty('--f', Math.min(1, Math.max(0, (line - r.top) / r.height)).toFixed(3));
      });
      if (act !== cur) open(act);
      if (mode === 'flow') figs.forEach(function (f, k) {
        if (played[k]) return;
        var r = f.getBoundingClientRect();
        if (r.top < innerHeight * 0.72 && r.bottom > 0) { played[k] = true; f.classList.add('is-in'); play(f); }
      });
    }
    addEventListener('scroll', function () {
      if (near && !ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(layout, 120); });
    if (WIDE.addEventListener) WIDE.addEventListener('change', layout);

    /* near: the section is within a screen of view. Seen: it is on screen (the loops run only then) */
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { near = en.isIntersecting; if (near) update(); });
    }, { rootMargin: '100% 0px 100% 0px' }).observe(x);
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        sec.classList.toggle('is-seen', en.isIntersecting);
        if (en.isIntersecting && !seen) { seen = true; if (mode === 'stage') play(figs[cur]); }
      });
    }, { threshold: 0.12 }).observe(x);

    /* the rail jumps: on the stage the question is brought to the middle, in the flow under the rail */
    links.forEach(function (a, k) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var c = chs[k], r = c.getBoundingClientRect(), y;
        if (mode === 'stage') y = scrollY + r.top + r.height / 2 - innerHeight / 2;
        else y = scrollY + r.top - clearance() - rail.offsetHeight - 8;
        if (window.lenis && !RM.matches) window.lenis.scrollTo(y, { duration: 1.2 });
        else scrollTo({ top: y, behavior: RM.matches ? 'auto' : 'smooth' });
        var h = c.querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      });
    });

    /* the window follows its desk's height as it settles (fonts, figures counting up) */
    if (window.ResizeObserver) { var ro = new ResizeObserver(function () { fit(); }); figs.forEach(function (f) { ro.observe(f); }); }
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    addEventListener('load', layout);
  });
})();
