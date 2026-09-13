/* ══ TEXT ROLL ═════════════════════════════════════════════════════════════════════
   Every character rotates on its own axis, one after the next: the old glyph flips away
   about a line a quarter down its box while the new one flips in about its baseline. Two
   faces of the same 3D cell, staggered along the string.

       <script src="vendor/text-roll.js" defer></script>

   Two ways to use it:

     · a flourish on hover — mark the element and it rolls in place
           <a data-text-roll>Service levels</a>
     · a value that CHANGES — call it and the new text rolls in over the old
           TextRoll.roll(el, { to: '$10' })

   Options, and the estate's defaults (the reference ships 0.5 / 0.1 / 0.2 / ease-in):

       duration    0.25s   each character's flip
       stagger     0.01s   added per character index — the wave
       exitOffset  0.10s   the incoming face starts this much after the outgoing one
       ease        ease-out

   ── HOW IT WORKS, and why this way ──────────────────────────────────────────────────
   · A character becomes one cell with three children: the face that leaves, the face that
     arrives, and an invisible copy of the widest of the two that holds the width open. The
     two faces are absolutely positioned and backface-hidden; the cell carries the
     perspective. That is the reference's structure, transcribed from its source.
   · The faces are driven by CSS transitions with per-character delays rather than a
     JavaScript animation loop: the browser runs them off the main thread, so a long string
     costs nothing and the whole thing survives a busy frame.
   · When the roll finishes, the arriving face becomes the resting face and both transforms
     are reset with transitions suppressed for one frame. So the element can roll again, and
     again, without drifting.
   · The real string is kept in one visually-hidden copy and the cells are aria-hidden, so a
     screen reader reads the text once, not letter by letter. The text is also the element's
     own content before the script runs, so nothing depends on the script.
   · Anyone whose machine asks for less motion gets the swap with no rotation at all: the
     new text simply replaces the old.
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* the estate's numbers (Rose, 3 Sep, set on the Lab bench): a quarter-second flip, a
     near-simultaneous wave, the incoming face a tenth behind, easing out. The reference
     ships 0.5 / 0.1 / 0.2 / ease-in — slower and more theatrical than a figure that just
     changed needs to be. */
  var D = { duration: 0.25, stagger: 0.01, exitOffset: 0.10, ease: 'ease-out' };

  /* A face turned to exactly 90° is seen edge-on and antialiases to a bright one-pixel
     line — the sliver Rose spotted under the text. Turned a couple of degrees PAST edge-on
     it presents its back instead, which backface-visibility hides outright. */
  var FLAT = 'rotateX(92deg)';

  function nbsp(ch) { return ch === ' ' ? ' ' : ch; }

  /* build (or rebuild) the cells for a string */
  function wrap(el, text) {
    var chars = text.split('');
    var frag = document.createDocumentFragment();
    for (var i = 0; i < chars.length; i++) {
      var cell = document.createElement('span');
      cell.className = 'tr-cell';
      cell.setAttribute('aria-hidden', 'true');
      var out = document.createElement('span'); out.className = 'tr-out'; out.textContent = nbsp(chars[i]);
      var inn = document.createElement('span'); inn.className = 'tr-in'; inn.textContent = nbsp(chars[i]);
      var pad = document.createElement('span'); pad.className = 'tr-pad'; pad.textContent = nbsp(chars[i]);
      cell.appendChild(out); cell.appendChild(inn); cell.appendChild(pad);
      frag.appendChild(cell);
    }
    var sr = document.createElement('span');
    sr.className = 'tr-sr';
    sr.textContent = text;
    frag.appendChild(sr);
    el.textContent = '';
    el.appendChild(frag);
    el.classList.add('tr');
    el.dataset.trText = text;
  }

  function ensure(el) {
    if (!el.dataset.trText) wrap(el, (el.textContent || '').trim());
    return el;
  }

  function opts(el, o) {
    o = o || {};
    return {
      duration: o.duration != null ? o.duration : parseFloat(el.getAttribute('data-duration')) || D.duration,
      stagger: o.stagger != null ? o.stagger : parseFloat(el.getAttribute('data-stagger')) || D.stagger,
      exitOffset: o.exitOffset != null ? o.exitOffset : (el.hasAttribute('data-exit-offset')
        ? parseFloat(el.getAttribute('data-exit-offset')) : D.exitOffset),
      ease: o.ease || el.getAttribute('data-ease') || D.ease
    };
  }

  /* roll the element. `to` rolls a NEW string in; omit it to roll the same text in place. */
  function roll(el, o) {
    ensure(el);
    o = o || {};
    var cfg = opts(el, o);
    var from = el.dataset.trText || '';
    var to = o.to != null ? String(o.to) : from;

    if (REDUCED) { wrap(el, to); return; }

    /* the cell count is the longer of the two strings, so nothing is dropped mid-roll */
    var n = Math.max(from.length, to.length);
    if (el.querySelectorAll('.tr-cell').length !== n) wrap(el, from.length >= to.length ? from : to);
    var cells = el.querySelectorAll('.tr-cell');

    /* transitions off for one frame while the resting state is set */
    el.classList.add('tr-still');
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i], out = c.firstChild, inn = out.nextSibling, pad = inn.nextSibling;
      var a = i < from.length ? from.charAt(i) : ' ';
      var b = i < to.length ? to.charAt(i) : ' ';
      out.textContent = nbsp(a);
      inn.textContent = nbsp(b);
      /* the pad is what gives the cell its width, and that width is TWEENED from the
         outgoing character's to the incoming one's, on the incoming face's own clock — so a
         proportional face reflows fluidly under the roll instead of holding max-width gaps
         ("Billed a nnuall y") and snapping shut at the end. */
      pad.textContent = nbsp(b);
      pad.style.transition = 'none';
      /* Two measurements, both taken on UNTRANSFORMED boxes. The target is the pad's own
         natural width with the new character in it — the exact value it will have when the
         width is handed back to auto at the end, so the hand-back cannot move anything. The
         start is the outgoing face at rotateX(0). Measuring the incoming face instead, as an
         earlier version did, read a box already turned 92 degrees under perspective: a hair
         narrower than its layout width, and that hair was the shuffle at the end. */
      pad.style.width = '';
      pad.dataset.w = pad.getBoundingClientRect().width;
      pad.style.width = out.getBoundingClientRect().width + 'px';
      out.style.transition = 'none'; inn.style.transition = 'none';
      out.style.transform = 'rotateX(0deg)'; out.style.opacity = '1';
      inn.style.transform = FLAT; inn.style.opacity = '0';
    }
    el.querySelector('.tr-sr').textContent = to;

    /* next frame: arm the transitions and go */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.remove('tr-still');
        for (var i = 0; i < cells.length; i++) {
          var c = cells[i], out = c.firstChild, inn = out.nextSibling;
          /* Opacity is switched, not faded: each face is opaque only while it is actually
             turning. backface-visibility alone left a faint squashed ghost of the parked
             face under the line — the second row of letters Rose saw. A 0s step at the
             right moment removes it without touching the motion. */
          var dOut = i * cfg.stagger, dIn = i * cfg.stagger + cfg.exitOffset;
          out.style.transition = 'transform ' + cfg.duration + 's ' + cfg.ease + ' ' + dOut + 's, ' +
                                 'opacity 0s linear ' + (dOut + cfg.duration) + 's';
          inn.style.transition = 'transform ' + cfg.duration + 's ' + cfg.ease + ' ' + dIn + 's, ' +
                                 'opacity 0s linear ' + dIn + 's';
          out.style.transform = FLAT; out.style.opacity = '0';
          inn.style.transform = 'rotateX(0deg)'; inn.style.opacity = '1';
          var pad = inn.nextSibling;
          pad.style.transition = 'width ' + cfg.duration + 's ' + cfg.ease + ' ' + dIn + 's';
          pad.style.width = pad.dataset.w + 'px';
        }
        /* when the last face has arrived, make it the resting face — IN PLACE. Rebuilding
           the cells here tore the whole string down and put it back in one frame, which is
           the jump Rose saw at the end of every roll. */
        var settle = (cfg.duration + (cells.length - 1) * cfg.stagger + cfg.exitOffset) * 1000 + 40;
        clearTimeout(el._trT);
        el._trT = setTimeout(function () {
          el.classList.add('tr-still');
          for (var j = 0; j < cells.length; j++) {
            var cc = cells[j], oo = cc.firstChild, ii = oo.nextSibling, pp = ii.nextSibling;
            var ch = ii.textContent;
            oo.textContent = ch;
            pp.textContent = ch;
            pp.style.transition = 'none'; pp.style.width = '';
            oo.style.transition = 'none'; ii.style.transition = 'none';
            oo.style.transform = 'rotateX(0deg)'; oo.style.opacity = '1';
            ii.style.transform = FLAT; ii.style.opacity = '0';
          }
          el.dataset.trText = to;
          requestAnimationFrame(function () { el.classList.remove('tr-still'); });
        }, settle);
      });
    });
  }

  /* hover: roll in place, and never restart a roll that is still running */
  function hover(el) {
    if (el.dataset.trHover) return;
    el.dataset.trHover = '1';
    ensure(el);
    var busy = false;
    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch' || busy) return;
      var cfg = opts(el, {});
      busy = true;
      roll(el, {});
      setTimeout(function () { busy = false; },
        (cfg.duration + cfg.exitOffset) * 1000 + el.dataset.trText.length * cfg.stagger * 1000 + 60);
    });
  }

  window.TextRoll = { roll: roll, wrap: wrap, hover: hover, defaults: D };

  function init() {
    document.querySelectorAll('[data-text-roll]').forEach(hover);
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
