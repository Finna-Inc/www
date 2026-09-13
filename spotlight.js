/* ══ THE SPOTLIGHT CARD ═════════════════════════════════════════════════════════════
   Lifted 1:1 from the 2026-09 site. The card's light follows the pointer — two custom
   properties written on the card itself, read by its ::before. The rect is measured once
   per card and refreshed on scroll and resize rather than on every move (measuring inside
   a move handler forces a reflow on each one), and the write lands in one animation frame
   however fast the pointer travels. Nothing runs until a pointer is actually over a card,
   and a touch never starts it.
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const cards = document.querySelectorAll('.card-dark');
  if (!cards.length || !matchMedia('(hover:hover)').matches) return;

  let boxes = [], pending = null;
  const measure = () => { boxes = [...cards].map(c => c.getBoundingClientRect()); };
  measure();
  addEventListener('scroll', () => { boxes.length = 0; }, { passive: true });
  addEventListener('resize', () => { boxes.length = 0; }, { passive: true });

  cards.forEach((card, i) => {
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      if (!boxes.length) measure();
      const r = boxes[i], x = e.clientX, y = e.clientY;
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = null;
        card.style.setProperty('--mx', ((x - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((y - r.top) / r.height * 100) + '%');
      });
    }, { passive: true });
  });
})();
