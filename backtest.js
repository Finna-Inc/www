/* THE BACK-TEST PLAYS ONCE (21 Oct 2026). The homepage's invest figure is FIG.backtest from the
   Learn films, "Thirty years, two mixes". It draws its four beats the first time it comes into
   view: the frame, listed shares and bonds, the family office mix, then "More, and steadier".
   The beats are CSS (home-v2.css); this only says when. With motion reduced, or no
   IntersectionObserver, nothing is added and the figure is simply drawn, finished. */
(function () {
  var figs = document.querySelectorAll('.invest-fig .fg');
  if (!figs.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('play'); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  figs.forEach(function (f) { f.classList.add('anim'); io.observe(f); });
})();
