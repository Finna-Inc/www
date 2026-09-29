/* HOME · 03 · THE FIVE DESKS, ONE AT A TIME (Christian, 29 Sep 2026). No library.
   Five keys over a track of five desks. A key, an arrow key, the pager or a swipe opens a desk; the
   track keeps the one in view and the keys follow it. Each time a desk opens while the section is on
   screen, Freya thinks, then answers, and the desk's picture plays. Reduced motion: the desk simply
   shows. Without the script every desk is still there, scrolled sideways, the first in view.
   ?desk=policy opens Home on a desk. Styles: desks-home.css. */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  var qs = new URLSearchParams(location.search);

  document.querySelectorAll('[data-fd]').forEach(function (x) {
    var sec = x.closest('.fd'), tabs = [].slice.call(x.querySelectorAll('[role="tab"]')),
        panels = [].slice.call(x.querySelectorAll('[role="tabpanel"]')), track = x.querySelector('.fd-track'),
        dots = [].slice.call(x.querySelectorAll('.fd-pg-n i')), prevL = x.querySelector('[data-prev]'), nextL = x.querySelector('[data-next]'),
        names = tabs.map(function (t) { return t.querySelector('b').textContent; }),
        cur = 0, seen = false, timers = [], settle = 0, steering = false;

    /* everything that moves waits hidden until the section is first seen (without script it all just shows) */
    panels.forEach(function (p) { p.classList.add('is-wait'); });

    function stacked() { return innerWidth < 1100; }
    function fit() { track.style.height = stacked() ? panels[cur].offsetHeight + 'px' : ''; }
    function leftOf(i) { return panels[i].offsetLeft - panels[0].offsetLeft; }

    function mark(p, s) { p.querySelectorAll('.fd-mk').forEach(function (m) { m.setAttribute('data-state', s); }); }
    function clear() { timers.forEach(clearTimeout); timers = []; }

    /* numbers count up to what they say: the first number in the text, its prefix and suffix kept */
    function count(el) {
      var t = el.getAttribute('data-t') || el.textContent; el.setAttribute('data-t', t);
      var m = t.match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/); if (!m) return;
      var to = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1, t0 = 0;
      function fmt(v) { var s = v.toFixed(dec); if (comma) { var parts = s.split('.'); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = parts.join('.'); } return m[1] + s + m[3]; }
      function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 900), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(step); else el.textContent = t; }
      requestAnimationFrame(step);
    }

    /* a desk opens: Freya thinks, answers, and the picture plays */
    function play(i) {
      clear();
      var p = panels[i];
      panels.forEach(function (q, k) { if (k !== i) { q.classList.remove('is-live'); q.classList.add('is-wait'); mark(q, 'ready'); } });
      if (RM.matches) { p.classList.remove('is-wait'); p.classList.add('is-live'); return; }
      p.classList.remove('is-live'); p.classList.add('is-wait'); void p.offsetWidth;
      mark(p, 'thinking');
      timers.push(setTimeout(function () {
        mark(p, 'answering'); p.classList.remove('is-wait'); p.classList.add('is-live');
        p.querySelectorAll('.fd-n').forEach(count);
      }, 700));
      timers.push(setTimeout(function () { mark(p, 'ready'); }, 1900));
    }

    function select(i, how) {
      i = (i + panels.length) % panels.length;
      var changed = i !== cur; cur = i;
      tabs.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach(function (p, k) {
        var on = k === i; p.setAttribute('aria-hidden', String(!on));
        p.querySelectorAll('a,button').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
      });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      if (prevL) prevL.textContent = names[(i + names.length - 1) % names.length];
      if (nextL) nextL.textContent = names[(i + 1) % names.length];
      /* the key row follows, on a phone where it scrolls */
      var tb = tabs[i], row = tb.parentNode;
      if (row.scrollWidth > row.clientWidth + 1) {
        var a = tb.getBoundingClientRect(), r = row.getBoundingClientRect();
        if (a.left < r.left + 16 || a.right > r.right - 16) row.scrollTo({ left: row.scrollLeft + (a.left - r.left) - 16, behavior: RM.matches ? 'auto' : 'smooth' });
      }
      if (how !== 'swipe') { steering = true; track.scrollTo({ left: leftOf(i), behavior: RM.matches || how === 'jump' ? 'auto' : 'smooth' }); clearTimeout(settle); settle = setTimeout(function () { steering = false; }, 700); }
      fit();
      if (seen && changed) play(i);
    }

    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k, 'key'); });
      t.addEventListener('keydown', function (ev) {
        var to = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: tabs.length - 1 }[ev.key];
        if (to === undefined) return;
        ev.preventDefault(); select(to, 'key'); tabs[cur].focus();
      });
    });
    x.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () { select(cur + parseInt(b.getAttribute('data-step'), 10), 'key'); });
    });
    /* a desk at the edge, tapped, opens (a phone and a tablet show the next one there) */
    panels.forEach(function (p, k) {
      p.addEventListener('click', function (ev) { if (k !== cur) { ev.preventDefault(); select(k, 'key'); } }, true);
    });

    /* a swipe: when the track comes to rest on a desk, that desk is the open one */
    track.addEventListener('scroll', function () {
      if (steering) { clearTimeout(settle); settle = setTimeout(function () { steering = false; }, 160); return; }
      clearTimeout(settle);
      settle = setTimeout(function () {
        var w = panels.length > 1 ? leftOf(1) : 1, i = Math.round(track.scrollLeft / w);
        if (i !== cur) select(Math.max(0, Math.min(panels.length - 1, i)), 'swipe');
      }, 120);
    }, { passive: true });

    /* keep the open desk in place when the window changes size */
    var rz = 0;
    addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { track.scrollTo({ left: leftOf(cur), behavior: 'auto' }); fit(); }, 80); });
    if (window.ResizeObserver) new ResizeObserver(function () { fit(); }).observe(panels[0].parentNode);

    /* the section on screen: play the open desk the first time, and let the loops run only while it shows */
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        sec.classList.toggle('is-seen', en.isIntersecting);
        if (en.isIntersecting && !seen) { seen = true; play(cur); }
      });
    }, { threshold: 0.25 }).observe(x);

    var start = Math.max(0, tabs.map(function (t) { return t.getAttribute('data-k'); }).indexOf(qs.get('desk')));
    select(start, 'jump');
  });
})();
