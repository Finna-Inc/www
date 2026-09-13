/* ══ THE BILLING SWITCH ═════════════════════════════════════════════════════════════
   Lifted 1:1 from the 2026-09 site. Two honest buttons; the script only flips
   aria-pressed, and CSS reads that with :has() to slide the white pill. The figures roll
   to their new value (vendor/text-roll.js) and fall back to a plain swap if that script
   is not there, so the switch never depends on the flourish.
   ═════════════════════════════════════════════════════════════════════════════════ */
(function () {
  const tabs = document.querySelectorAll('.toggle button');
  if (!tabs.length) return;

  const set = (el, to) => {
    if (window.TextRoll) TextRoll.roll(el, { to });
    else el.textContent = to;
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const annual = btn.dataset.bill === 'annual';
      tabs.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      document.querySelectorAll('[data-price]').forEach(el => {
        set(el, '$' + (annual ? el.dataset.annual : el.dataset.price));
      });
      document.querySelectorAll('[data-billed]').forEach(el => {
        set(el, annual ? 'Billed annually' : 'Billed monthly');
      });
    });
  });
})();
