/* The household ledger card (index · promise 01 "Bring it all together").
   <finna-ledger> — one source of truth: the Lab renders this same element.
   Design: no coloured title bar, no green footer bar, one hue in four steps,
   percent pinned bottom-right, tabs as a gliding pill. Numbers are illustrative. */
(function () {
  if (customElements.get('finna-ledger')) return;

  const CAT = [
    { n: 'Primary residence', v: '$2,140,000', s: '37.3%', box: [0, 0, 37.3, 100] },
    { n: 'Operating business', v: '$1,650,000', s: '28.8%', box: [37.3, 0, 28.8, 74.6] },
    { n: 'Global equities', v: '$1,214,000', s: '21.2%', box: [66.1, 0, 33.9, 74.6] },
    { n: 'Bonds & pension', v: '$729,000', s: '12.7%', box: [37.3, 74.6, 62.7, 25.4] }
  ];
  const ENT = [
    { n: 'Held jointly', v: '$2,140,000', s: '37.3% · Household', box: [0, 0, 37.3, 100] },
    { n: 'Family holding company', v: '$1,650,000', s: '28.8% · Household’s share', box: [37.3, 0, 62.7, 40] },
    { n: 'Sarah Whitman, personally', v: '$1,388,000', s: '24.2% · Sole name', box: [37.3, 40, 62.7, 32] },
    { n: 'Family trust', v: '$555,000', s: '9.7% · Heirs', box: [37.3, 72, 62.7, 28] }
  ];
  const OWED = { n: 'Primary mortgage', s: 'fixed to 2031', v: '$1,405,000' };
  const NW = { v: '$4,328,000', sub: 'Owned $5,733,000 − owed $1,405,000' };
  const RECON = 'Reconciled this morning · eleven sources';

  const LABEL = {
    cat: 'Household wealth grouped by asset class: primary residence, operating business, global equities, bonds and pension',
    ent: 'Household wealth grouped by the entity that holds it: held jointly, family holding company, in a sole name, family trust'
  };

  /* one hue family, four steps — darkest holds the largest share. All carry white ink. */
  const RAMP = ['#0F3A31', '#1B5546', '#246853', '#2F7A63'];
  const SUB = 'rgba(255,255,255,.92)';

  const BASE = `
    :host{display:block;
      /* one curve, one clock — every part of the switch moves on these */
      --e-morph:cubic-bezier(.4,0,.22,1);   /* eased both ends: no snap at the start, no stop at the end */
      --t-morph:560ms;                      /* a tile travelling and resizing */
      --t-thumb:360ms;                      /* the pill's thumb */
      --t-out:140ms;                        /* text clearing before the move */
      --t-in:260ms;                         /* text arriving during the tail */
      --t-step:45ms}                        /* each tile a beat behind the one before */
    *{box-sizing:border-box}
    .card{width:100%; max-width:620px; margin:0 auto; container-type:inline-size;
      border-radius:20px; overflow:hidden; background:#FFFFFF; border:1px solid #E4E9E7;
      box-shadow:0 1px 2px rgba(16,26,20,.05), 0 24px 44px -34px rgba(8,27,23,.35)}
    h3{margin:0; font:500 22px/1.2 'Lexend Variable',Arial,sans-serif; letter-spacing:-.02em; color:#081B17}
    .meta{font:400 12.5px/1.4 'Lexend Variable',Arial,sans-serif; color:#647974}
    /* the switch: a pill track with a thumb that glides, labels crossfading over it */
    .seg{position:relative; display:inline-grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); margin:18px 0 0;
      padding:3px; border-radius:999px; background:#101511}
    .seg .thumb{position:absolute; top:3px; bottom:3px; left:3px; width:calc(50% - 3px); border-radius:999px;
      background:#FFFFFF; box-shadow:0 1px 2px rgba(8,27,23,.28);
      transition:transform var(--t-thumb) var(--e-morph)}
    .seg[data-view="ent"] .thumb{transform:translateX(100%)}
    .seg button{position:relative; appearance:none; background:none; border:0; cursor:pointer;
      min-height:30px; padding:0 15px; border-radius:999px; white-space:nowrap;
      font:600 12px/1 'Lexend Variable',Arial,sans-serif; color:#C9D6D1;
      transition:color var(--t-thumb) var(--e-morph)}
    .seg button:hover{color:#FFFFFF}
    .seg button[aria-pressed="true"]{color:#101511}
    .seg button:focus-visible{outline:2px solid #FFFFFF; outline-offset:3px}
    .map{position:relative; width:100%; aspect-ratio:1.45; margin:16px 0 0}
    .tw{position:absolute; padding:4px}
    /* the whole box glides — position AND size. Both are set inline as percentages of
       .map, which holds a fixed aspect ratio, so a percentage transition has something
       stable to land on. Declared in treemap mode only: the stacked rule below releases
       these values with !important and nothing should animate to auto. */
    @container (min-width:520.001px){
      .tw{transition:left var(--t-morph) var(--e-morph), top var(--t-morph) var(--e-morph),
                    width var(--t-morph) var(--e-morph), height var(--t-morph) var(--e-morph)}
      /* NO stagger on the boxes. They tile the card exactly, so a delay between them
         opens a gap on one edge and an overlap on the other while they fly. The four
         travel as one; only the words below arrive a beat apart. */
    }
    /* one tile, one rule: label and amount top-left, percent pinned bottom-right */
    .t{position:relative; width:100%; height:100%; padding:9px 12px; display:flex; flex-direction:column; gap:2px;
      overflow:hidden; border-radius:10px}
    .t::before{content:''; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
      background:radial-gradient(560px circle at var(--mx,50%) var(--my,0%), rgba(191,224,207,.22), transparent 42%);
      opacity:0; transition:opacity 480ms cubic-bezier(.16,1,.3,1)}
    .t:hover::before{opacity:1}
    .t > *{position:relative}
    .t .ft{position:absolute; right:12px; bottom:7px}
    .t b{font:500 13.5px/1.25 'Lexend Variable',Arial,sans-serif; overflow-wrap:break-word;
      display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden}
    .t i{display:block; font-style:normal; font:400 12.5px/1.3 'Lexend Variable',Arial,sans-serif; margin-top:2px;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:${SUB}}
    /* figures track the card's width, not the viewport, so the narrowest tile never overflows */
    .t s{display:block; text-decoration:none; white-space:nowrap; margin-top:9px; padding-right:clamp(38px,13cqw,58px);
      font:400 clamp(17px,4.2cqw,25px)/1.1 'Lexend Variable',Arial,sans-serif; font-variant-numeric:tabular-nums}
    .t em{font-style:normal; white-space:nowrap;
      font:400 clamp(14px,2.9cqw,17px)/1.15 'Lexend Variable',Arial,sans-serif; font-variant-numeric:tabular-nums}
    .t .hd, .t .ft{transition:opacity var(--t-in) var(--e-morph) calc(var(--i,0) * var(--t-step) + 80ms)}
    .swap .t .hd, .swap .t .ft{opacity:0; transition:opacity var(--t-out) var(--e-morph) 0ms}
    .row{display:flex; align-items:baseline; gap:12px; justify-content:space-between}
    .num{font-variant-numeric:tabular-nums}
    .nw{font:500 clamp(30px,6.2cqw,38px)/1 'Lexend Variable',Arial,sans-serif; letter-spacing:-.02em;
      font-variant-numeric:tabular-nums; color:#0F2923}
    .lab{font:500 13.5px/1.4 'Lexend Variable',Arial,sans-serif; color:#081B17}
    /* accounting double rule closing the total */
    .dbl{margin-top:5px; height:3px; border-top:1px solid #C9D5D0; border-bottom:1px solid #C9D5D0}
    .val{font:500 17px/1 'Lexend Variable',Arial,sans-serif; color:#081B17}
    /* narrow: the treemap becomes a stack, largest first — tiles keep their type.
       A container query, so it holds with frames suspended (print, background tab);
       the geometry transition is declared only in treemap mode, above. */
    @container (max-width:520px){
      .map{position:static; aspect-ratio:auto; display:flex; flex-direction:column; gap:8px}
      .tw{position:static !important; left:auto !important; top:auto !important;
        width:100% !important; height:auto !important; padding:0}
      .t{min-height:96px; padding:11px 14px}
      .t s{padding-right:64px}
    }
    @media (prefers-reduced-motion:reduce){*{transition-duration:0ms !important}}
  `;

  /* '28.8% · Household’s share' → [percent, qualifier] */
  const split = s => {
    const i = s.indexOf(' · ');
    return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 3)];
  };

  const treemap = rows => rows.map((r, i) => {
    const [l, t, w, h] = r.box;
    const [pct, note] = split(r.s);
    return `<div class="tw" style="--i:${i}; left:${l}%; top:${t}%; width:${w}%; height:${h}%">
      <div class="t" style="background:${RAMP[i]}; color:#FFFFFF">
        <div class="hd"><b>${r.n}</b><i>${note}</i><s>${r.v}</s></div>
        <div class="ft"><em>${pct}</em></div>
      </div></div>`;
  }).join('');

  /* the text's exit, in ms — the same number as --t-out above. The move begins the
     instant the words are gone, so nothing is read mid-slide. */
  const T_OUT = 140;

  /* re-point the existing tiles at the other dataset so they glide instead of redrawing */
  function morph(root, rows) {
    const map = root.querySelector('.map');
    if (!map) return;
    clearTimeout(map._swapT);          /* a second click mid-move takes over cleanly */
    map.classList.add('swap');
    const tws = [...map.querySelectorAll('.tw')];
    map._swapT = setTimeout(() => {
      tws.forEach((tw, i) => {
        const r = rows[i], [l, t, w, h] = r.box;
        tw.style.left = l + '%'; tw.style.top = t + '%';
        tw.style.width = w + '%'; tw.style.height = h + '%';
        const tile = tw.firstElementChild;
        const [pct, note] = split(r.s);
        tile.querySelector('b').textContent = r.n;
        tile.querySelector('i').textContent = note;
        tile.querySelector('s').textContent = r.v;
        tile.querySelector('em').textContent = pct;
      });
      map.classList.remove('swap');
    }, T_OUT);
  }

  const card = view => `<div class="card">
    <div style="padding:26px 26px 24px">
      <div class="row">
        <h3>What Finna shows you</h3>
      </div>
      <div class="seg" data-view="${view}" role="group" aria-label="Group everything owned by">
        <i class="thumb" aria-hidden="true"></i>
        <button data-tab="cat" aria-pressed="${view === 'cat'}">By category</button>
        <button data-tab="ent" aria-pressed="${view === 'ent'}">By entity</button>
      </div>
      <div class="map" role="img" aria-label="${LABEL[view]}">${treemap(view === 'cat' ? CAT : ENT)}</div>
      <div class="row" style="margin:22px 0 0; padding:0 0 14px; border-bottom:1px solid #E4E9E7">
        <span class="lab">${OWED.n} <span style="font-weight:400; color:#647974">· ${OWED.s}</span></span>
        <span class="val"><span class="num">${OWED.v}</span></span>
      </div>
      <div class="row" style="align-items:flex-end; margin:18px 0 0">
        <div>
          <div class="lab">Net worth</div>
          <div class="meta" style="margin-top:3px">${NW.sub}</div>
        </div>
        <div class="nw">${NW.v}</div>
      </div>
      <div class="dbl" aria-hidden="true"></div>
    </div>
  </div>`;

  customElements.define('finna-ledger', class extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      this._view = 'cat';
      this._root = this.attachShadow({ mode: 'open' });
      this._root.innerHTML = `<style>${BASE}</style>${card(this._view)}`;
      this._root.addEventListener('click', e => {
        const b = e.target.closest('button[data-tab]');
        if (!b || b.dataset.tab === this._view) return;
        this._view = b.dataset.tab;
        const seg = this._root.querySelector('.seg');
        seg.dataset.view = this._view;
        seg.querySelectorAll('button[data-tab]').forEach(x =>
          x.setAttribute('aria-pressed', String(x.dataset.tab === this._view)));
        this._root.querySelector('.map').setAttribute('aria-label', LABEL[this._view]);
        morph(this._root, this._view === 'cat' ? CAT : ENT);
      });
      this._root.addEventListener('pointermove', e => {
        const t = e.target.closest('.t');
        if (!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }
  });
})();
