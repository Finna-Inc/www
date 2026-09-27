/* ══ THE DESK FIGURE · leader lines (27 Sep 2026) ══════════════════════════════════════
   On the five desk pages, "Inside the desk". Each takeaway is joined to its numbered pin on
   the screen by a dashed line — but only when the figure is wide enough to set the takeaways
   beside the screen (three columns). Narrower, the numbers alone pair them, and no line is
   drawn. Redrawn whenever the figure changes size, so the lines follow the text as it
   re-flows. The upper takeaway in each column turns close to the screen and the lower one
   further out, so two lines in the same gap never run over each other. */
(function () {
  function draw(fig) {
    var svg = fig.querySelector('.dfig-lead'), grid = fig.querySelector('.dfig-grid'), scr = fig.querySelector('.dfig-screen');
    if (!svg || !grid || !scr) return;
    var f = fig.getBoundingClientRect(), s = scr.getBoundingClientRect(), out = '';
    var three = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length === 3;
    if (three) {
      var gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      fig.querySelectorAll('.dfig-note').forEach(function (note) {
        var k = note.getAttribute('data-n'), pin = fig.querySelector('.dfig-pin[data-n="' + k + '"]');
        if (!pin) return;
        var nr = note.getBoundingClientRect(), b = note.querySelector('.dfig-n').getBoundingClientRect(), p = pin.getBoundingClientRect();
        var left = nr.right <= s.left;
        var turn = gap * (0.28 + 0.3 * (note.previousElementSibling ? 1 : 0));
        var sx = (left ? nr.right + gap * 0.12 : nr.left - gap * 0.12) - f.left, sy = b.top + b.height / 2 - f.top;
        var ex = (left ? s.left - turn : s.right + turn) - f.left;
        var px = (left ? p.left : p.right) - f.left, py = p.top + p.height / 2 - f.top;
        out += '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="3"/>' +
               '<path d="M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' H' + ex.toFixed(1) + ' V' + py.toFixed(1) + ' H' + px.toFixed(1) + '"/>';
      });
    }
    svg.setAttribute('viewBox', '0 0 ' + f.width.toFixed(1) + ' ' + f.height.toFixed(1));
    svg.innerHTML = out;
  }
  var figs = Array.prototype.slice.call(document.querySelectorAll('.dfig'));
  if (!figs.length) return;
  function all() { figs.forEach(draw); }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) { entries.forEach(function (en) { draw(en.target); }); });
    figs.forEach(function (f) { ro.observe(f); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all);
  window.addEventListener('load', all);
})();
