/* ══ <finna-chat-clip> — the Freya clip, as the page carries it ══════════════════════════════
   The SCENE OF RECORD is lab/chat-clip.html (REV 40-corrected, 21 Sep 2026); this element is
   that scene packaged for the site: same SCRIPT, same engine, same tokens. Shadow DOM keeps
   the site's own .key/.card rules out and the clip's rules in; the design tokens (custom
   properties on :root) pass through. Autoplays, loops at 23s, takes no input, and holds the
   1.3s poster (the briefing, two lines) under prefers-reduced-motion. A DEMONSTRATION with
   placeholder figures — nothing here is a real balance or a real action. */
(function () {
  'use strict';
  const RING = "<svg viewBox=\"38.75 38.75 50.5 50.5\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"57\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"57\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M64 56.058A16.5 16.5 0 0 1 71.942 64A16.5 16.5 0 0 1 64 71.942A16.5 16.5 0 0 1 56.058 64A16.5 16.5 0 0 1 64 56.058Z\" fill=\"currentColor\"/></svg>";
  /* FREYA'S OWN MARK (Esben, 21 Sep 2026: "freya is not the right logo") — brand/logo/
     freya-mark.svg: the same four rings with the shape they all share LEFT OPEN. The
     company mark above is closed; Freya is open. Substitution stated: the ratified
     file is cropped 35.5/57, this carries the clip mark's crop so the two read at the
     same optical size side by side. */
  const FREYA = "<svg viewBox=\"38.75 38.75 50.5 50.5\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"57\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"57\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/></svg>";
  const CSS = "\n:host{display:block;aspect-ratio:9/16;background:var(--white,#fff);color:var(--text,#2C2C2C);\n  font:400 clamp(11px,3.4cqw,13.5px)/1.5 var(--font-sans,sans-serif);container-type:inline-size;\n  display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box;margin:0;padding:0}\n/* the bar \u2014 the shared clip chrome (lab/clip-chrome.css), REV 40 */\n.pbar{flex:none;display:flex;align-items:center;gap:10px;\n  margin:12px 12px 0;padding:10px 10px 10px 14px;border-radius:var(--r-card);\n  background:var(--bg-dark);color:#fff}\n.pbar .mk{width:26px;height:26px;flex:none;color:#fff}\n.pbar .mk svg{display:block;width:100%;height:100%}\n.pbar b{font-weight:var(--weight-heading);letter-spacing:-.01em;font-size:1.08em}\n.pbar .k{margin-left:auto;display:inline-flex;align-items:center;gap:6px;\n  padding:7px 12px;border-radius:var(--r-key);color:#fff;\n  background-color:var(--primary);background-image:var(--key-sheen);\n  letter-spacing:.01em;font-weight:var(--weight-heading);font-size:.86em;\n  box-shadow:0 3px 0 var(--primary-pressed)}\n.pbar .k svg{width:12px;height:12px}\n/* freya header */\n.fhead{flex:none;display:flex;align-items:center;gap:10px;\n  padding:14px 16px 12px;border-bottom:1px solid var(--border)}\n.fhead .av{width:26px;height:26px;flex:none;color:var(--primary)}\n.fhead .av svg{display:block;width:100%;height:100%}\n.fhead .who b{display:block;font-weight:var(--weight-heading);line-height:1.15}\n.fhead .who span{color:var(--text-tertiary);font-size:.86em}\n.fhead .tag{margin-left:auto;display:inline-flex;align-items:center;gap:6px;\n  font-size:.72em;font-weight:var(--weight-heading);letter-spacing:.1em;color:var(--text-tertiary)}\n.fhead .tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--primary)}\n/* the scroll */\n.scroll{flex:1;min-height:0;overflow:hidden;position:relative}\n.roll{position:absolute;left:0;right:0;top:0;padding:16px 16px 8px;\n  display:flex;flex-direction:column;gap:10px;\n  transition:transform .5s cubic-bezier(.22,1,.36,1)}\n.divider{align-self:center;margin:2px 0 6px;font-size:.72em;font-weight:var(--weight-heading);\n  letter-spacing:.13em;text-transform:uppercase;color:var(--text-tertiary)}\n.msg{max-width:78%;padding:10px 13px;border-radius:var(--r-card);line-height:1.5;\n  opacity:0;transform:translateY(8px);animation:pop .34s cubic-bezier(.22,1,.36,1) forwards}\n.msg.freya{align-self:flex-start;background:var(--bg-sunken);border-bottom-left-radius:6px}\n.msg.you{align-self:flex-end;background:var(--primary);color:#fff;border-bottom-right-radius:6px}\n.msg b{font-weight:var(--weight-heading)}\n.msg.you b{color:#fff}\n@keyframes pop{to{opacity:1;transform:none}}\n.turn{display:flex;gap:8px;align-items:flex-end}\n.turn .av{width:20px;height:20px;flex:none;color:var(--primary);margin-bottom:2px}\n.turn .av svg{display:block;width:100%;height:100%}\n.typing{align-self:flex-start;display:inline-flex;gap:4px;padding:12px 14px;border-radius:var(--r-card);\n  background:var(--bg-sunken);border-bottom-left-radius:6px;opacity:0;animation:pop .3s ease forwards}\n.typing i{width:6px;height:6px;border-radius:50%;background:var(--text-tertiary);animation:blink 1.1s infinite}\n.typing i:nth-child(2){animation-delay:.18s}.typing i:nth-child(3){animation-delay:.36s}\n@keyframes blink{0%,60%,100%{opacity:.3}30%{opacity:1}}\n.opts{align-self:flex-start;width:88%;display:flex;flex-direction:column;gap:7px;margin-top:2px}\n.opt{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;\n  padding:9px 11px;border:1px solid var(--border);border-radius:var(--r-key);background:var(--white);\n  opacity:0;transform:translateY(8px);animation:pop .3s cubic-bezier(.22,1,.36,1) forwards}\n.opt .n{width:20px;height:20px;border-radius:50%;border:1px solid var(--border);\n  display:grid;place-items:center;font-size:.8em;font-weight:var(--weight-heading);color:var(--text-tertiary)}\n.opt .b{min-width:0}\n.opt .b b{display:block;font-weight:var(--weight-heading);line-height:1.2}\n.opt .b span{color:var(--text-tertiary);font-size:.86em}\n.opt .go{width:16px;height:16px;color:var(--text-tertiary);opacity:0;transition:opacity .2s}\n.opt.press{transform:translateY(2px)}\n.opt.picked{background:var(--primary);border-color:var(--primary);color:#fff;\n  box-shadow:0 6px 16px -8px rgba(0,0,0,.4)}\n.opt.picked .n{border-color:rgba(255,255,255,.5);color:#fff}\n.opt.picked .b span{color:rgba(255,255,255,.8)}\n.opt.picked .go{opacity:1;color:#fff}\n.opt.dim{opacity:.32}\n.opts.gone{opacity:0;transform:translateY(-4px);transition:opacity .3s,transform .3s}\n.card{align-self:flex-start;width:90%;border:1px solid var(--border);border-radius:var(--r-card);\n  padding:13px 15px 14px;background:var(--white);\n  opacity:0;transform:translateY(8px);animation:pop .34s cubic-bezier(.22,1,.36,1) forwards}\n.card .kk{font-size:.72em;font-weight:var(--weight-heading);letter-spacing:.12em;text-transform:uppercase;\n  color:var(--text-tertiary);margin-bottom:9px}\n.card ol{list-style:none;display:flex;flex-direction:column;gap:9px}\n.card li{display:grid;grid-template-columns:16px 1fr;gap:9px;line-height:1.45;\n  opacity:0;transform:translateY(6px);animation:pop .3s cubic-bezier(.22,1,.36,1) forwards}\n.card li .n{color:var(--primary);font-weight:var(--weight-heading)}\n.card li b{font-weight:var(--weight-heading)}\n/* the composer: the estate INPUT (REV 40) + a round KEY */\n.pin{flex:none;display:flex;align-items:center;gap:10px;padding:10px 12px 12px;\n  border-top:1px solid var(--border)}\n.pin .field{flex:1;height:38px;border-radius:var(--r-card);background:var(--bg-sunken);\n  border:1px solid var(--text-tertiary);\n  display:flex;align-items:center;padding:0 14px;color:var(--text-tertiary);font-size:.94em}\n.pin .send{width:38px;height:38px;flex:none;border-radius:50%;background:var(--primary);\n  background-image:var(--key-sheen);box-shadow:0 3px 0 var(--primary-pressed);\n  display:grid;place-items:center;color:#fff}\n.pin .send svg{width:16px;height:16px}\n@media (prefers-reduced-motion:reduce){\n  .msg,.opt,.card,.card li,.typing{animation-duration:.001ms}\n  .typing i{animation:none;opacity:.5}\n}\n";
  const HTML = "\n<div class=\"pbar\"><span class=\"mk\"></span><b>Finna</b>\n  <span class=\"k\">Your family office <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/></svg></span></div>\n<div class=\"fhead\"><span class=\"av\"></span>\n  <span class=\"who\"><b>Freya</b><span>Chief of staff</span></span>\n  <span class=\"tag\">HOUSEHOLD</span></div>\n<div class=\"scroll\"><div class=\"roll\"></div></div>\n<div class=\"pin\"><span class=\"field\">Ask Freya anything</span>\n  <span class=\"send\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 19V5\"/><path d=\"m5 12 7-7 7 7\"/></svg></span></div>\n";

  const SCRIPT = {
    divider: 'Freya · Household briefing · Sunday, 23:14',
    duration: 23,
    beats: [
      { at:0.4,  kind:'freya', text:'The household is in order. One item wants a decision before the week starts.' },
      { at:1.2,  kind:'freya', text:'Your April tax bill is confirmed at **$84,200**, due on the 15th.' },
      { at:2.4,  kind:'ask',   text:'Can we cover it without selling the fund?', type:1.6 },
      { at:4.6,  kind:'freya', text:'Yes — without touching the fund. Four ways, in the order I would rank them.' },
      { at:5.6,  kind:'options',
                 pick:2, pressAt:11.4, sendAt:12.6, sendText:'Sell the money-market holding',
                 items:[
                   { title:'Pay it from cash',            cost:'Leaves the buffer at $18,000' },
                   { title:'Sell the money-market holding', cost:'No gain realised · settles in two days' },
                   { title:'Draw on the credit line',      cost:'Interest running until September' },
                   { title:'Sell part of the fund',        cost:'Realises a $41,000 gain this year' },
                 ] },
      { at:13.4, kind:'typing', until:14.4 },
      { at:14.4, kind:'card', title:'What happens now', stagger:0.85, lines:[
                   '**$84,200** leaves the money-market holding. It settles in two days.',
                   'No gain realised this year. The fund is untouched.',
                   'Your cash buffer holds at **$60,000** after the payment.',
                   'Drafted for your adviser of record to sign.',
                 ] },
    ],
  };
  const DUR = SCRIPT.duration * 1000;
  const md = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  class FinnaChatClip extends HTMLElement {
    connectedCallback() {
      if (this._made) return; this._made = true;
      if (!this.hasAttribute('role')) this.setAttribute('role','img');
      const root = this.attachShadow({ mode:'open' });
      root.innerHTML = '<style>' + CSS + '</style>' + HTML;
      root.querySelector('.mk').innerHTML = RING;
      root.querySelector('.av').innerHTML = FREYA;   /* the header avatar is Freya */

      const roll = root.querySelector('.roll'), scroll = root.querySelector('.scroll');
      const el = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; return d; };
      const avatar = () => { const a = el('av'); a.innerHTML = FREYA; return a; };

      const steps = [];
      const add = (t, fn) => steps.push({ t: t * 1000, fn });
      let playing = true;

      SCRIPT.beats.forEach(b => {
        if (b.kind === 'freya') {
          add(b.at, () => { const turn = el('turn'); turn.appendChild(avatar());
            turn.appendChild(el('msg freya', md(b.text))); roll.appendChild(turn); });
        } else if (b.kind === 'ask') {
          add(b.at, () => {
            const m = el('msg you', b.type ? '' : md(b.text)); roll.appendChild(m);
            if (b.type && playing) {
              const chars = b.text.length, ms = b.type * 1000, t0 = performance.now();
              (function tick(now) {
                const k = Math.min(1, (now - t0) / ms);
                m.textContent = b.text.slice(0, Math.round(k * chars));
                if (k < 1 && playing) requestAnimationFrame(tick); else m.innerHTML = md(b.text);
              })(t0);
            } else m.innerHTML = md(b.text);
          });
        } else if (b.kind === 'typing') {
          add(b.at, () => { const tp = el('typing', '<i></i><i></i><i></i>'); tp.dataset.typing = 1; roll.appendChild(tp); });
          add(b.until, () => { const tp = roll.querySelector('[data-typing]'); if (tp) tp.remove(); });
        } else if (b.kind === 'options') {
          const wrap = () => roll.querySelector('.opts');
          b.items.forEach((it, i) => {
            add(b.at + i * 0.32, () => {
              let w = wrap(); if (!w) { w = el('opts'); roll.appendChild(w); }
              const o = el('opt');
              o.innerHTML = '<span class="n">' + (i + 1) + '</span>' +
                '<span class="b"><b>' + it.title + '</b><span>' + it.cost + '</span></span>' +
                '<span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>';
              w.appendChild(o);
            });
          });
          add(b.pressAt, () => {
            const w = wrap(); if (!w) return;
            [...w.children].forEach((o, i) => {
              if (i === b.pick - 1) { o.classList.add('press');
                setTimeout(() => { o.classList.remove('press'); o.classList.add('picked'); }, 130); }
              else o.classList.add('dim');
            });
          });
          add(b.sendAt, () => {
            const w = wrap(); if (w) { w.classList.add('gone'); setTimeout(() => w.remove(), 320); }
            roll.appendChild(el('msg you', md(b.sendText)));
          });
        } else if (b.kind === 'card') {
          add(b.at, () => {
            const turn = el('turn'); turn.appendChild(avatar());
            const c = el('card', '<div class="kk">' + b.title + '</div><ol></ol>');
            turn.appendChild(c); roll.appendChild(turn); c.dataset.card = 1;
          });
          b.lines.forEach((ln, i) => {
            add(b.at + 0.35 + i * b.stagger, () => {
              const c = roll.querySelector('[data-card]'); if (!c) return;
              const li = document.createElement('li');
              li.innerHTML = '<span class="n">' + (i + 1) + '</span><span>' + md(ln) + '</span>';
              c.querySelector('ol').appendChild(li);
            });
          });
        }
      });
      steps.sort((a, b) => a.t - b.t);
      steps.unshift({ t: 0, fn: () => roll.appendChild(el('divider', SCRIPT.divider)) });

      const follow = () => {
        const over = roll.scrollHeight - scroll.clientHeight;
        roll.style.transform = over > 0 ? 'translateY(' + (-over - 12) + 'px)' : 'none';
      };
      let cursor = 0, startAt = 0, raf = 0;
      const clear = () => { roll.innerHTML = ''; roll.style.transform = 'none'; cursor = 0; };
      const seek = t => { clear(); for (const s of steps) if (s.t <= t) s.fn(); follow();
        cursor = steps.filter(s => s.t <= t).length; };

      const reduce = matchMedia('(prefers-reduced-motion:reduce)');
      const frame = now => {
        raf = 0;
        let t = now - startAt;
        if (t >= DUR) { startAt = now; t = 0; clear(); }
        while (cursor < steps.length && steps[cursor].t <= t) { steps[cursor].fn(); cursor++; }
        follow();
        if (playing) raf = requestAnimationFrame(frame);
      };
      const apply = () => {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (reduce.matches) { playing = false; seek(1300); }   /* the poster: the briefing, held */
        else { playing = true; clear(); startAt = performance.now(); raf = requestAnimationFrame(frame); }
      };
      reduce.addEventListener ? reduce.addEventListener('change', apply) : reduce.addListener(apply);
      apply();
    }
  }
  customElements.define('finna-chat-clip', FinnaChatClip);
})();
