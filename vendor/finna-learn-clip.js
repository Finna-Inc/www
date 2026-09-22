/* ══ <finna-learn-clip> — the Learn clip, as the page carries it ══════════════════════════════
   The SCENE OF RECORD is lab/learn-clip.html (21 Sep 2026); this element is that scene packaged
   for the site, the same way <finna-chat-clip> carries the Freya one: same markup, same rules,
   same seek(t). Shadow DOM keeps the site's own .key/.card rules out and the clip's rules in;
   the design tokens (custom properties on :root) pass through. Autoplays, loops at 17.4s, takes
   no input, and holds the poster — the path, before anything is opened — under
   prefers-reduced-motion. A DEMONSTRATION: the lessons, the question and the answers stand in
   until the platform's own Learn map is ratified. ════════════════════════════════════════════ */
(function () {
  'use strict';
  const CSS = ":host{--clip-gutter:18px;display:block;aspect-ratio:390/693;container-type:inline-size;background:var(--white);color:var(--text);overflow:hidden;font:var(--weight-reading) clamp(10px,3.34cqw,13px)/1.5 var(--font-sans);-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}\n*{box-sizing:border-box;margin:0;padding:0}\n/* \u2550\u2550 CLIP CHROME \u2014 the ONE navigation implementation the clip scenes share \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   The landing bar as the clips carry it, corrected to REV 40 (21 Sep 2026): the ground is\n   --bg-dark (the mock-ups sampled a bare grey there, which is not a brand value), corners\n   --r-card, the exact ratified mark and icons from lab/clip-assets.js, the wordmark in\n   Lexend at --weight-heading, and the bar's key is the estate KEY, size S \u2014 primary face,\n   --key-sheen, the offset shadow 0 3px 0 --primary-pressed, --r-key corners, letter-spacing\n   .01em. Consumed by lab/chat-clip.html and lab/learn-clip.html: correct it HERE and both\n   clips follow. Scenes may map --spot/--key-drop; the defaults below are the tokens. */\n/* THE BAR SHARES THE SCENE'S GUTTER (Esben, 21 Sep 2026: the content inside the mockup is\n   not aligned). The bar was pinned at 12 while each scene set its own reading gutter, so the\n   bar's edges never lined up with the words and cards under it. Each scene now states its\n   gutter once as --clip-gutter and the bar takes it. */\n.pbar{flex:none;display:flex;align-items:center;gap:10px;\n  margin:12px var(--clip-gutter,12px) 0;padding:10px 10px 10px 11px;border-radius:var(--r-card);\n  background:var(--bg-dark);color:#fff}\n.pbar .mk{width:32px;height:32px;flex:none;color:#fff}   /* 22 -> 26 -> 32, Esben 21 Sep 2026 */\n.pbar .mk svg{display:block;width:100%;height:100%}\n.pbar b{font-weight:var(--weight-heading);letter-spacing:-.01em;font-size:1.08em}\n.pbar .key{margin-left:auto;display:inline-flex;align-items:center;gap:6px;\n  padding:7px 12px;border-radius:var(--key-radius-s);color:#fff;   /* size S's corner: 10, not 12 */\n  background-color:var(--spot,var(--primary));background-image:var(--key-sheen);\n  letter-spacing:.01em;font-weight:var(--weight-heading);font-size:.86em;\n  box-shadow:0 3px 0 var(--key-drop,var(--primary-pressed))}\n.pbar .key svg{width:12px;height:12px}\n\n\n/* \u2550\u2550 LEARN CLIP \u2014 the scene \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   home-07's clip: the path, the first quest, the path again \u2014 11.25s, looping. REBUILT\n   21 Sep 2026 from the storyboard (finna-learn-clip-storyboard.html) after the original\n   scene file was lost with its session; story, content and pacing are the storyboard's own\n   table, verbatim. Corrected to REV 40 as it was rebuilt: the bar is the shared clip\n   chrome (clip-chrome.css \u2014 ground --bg-dark, not the storyboard's sampled grey), the mark\n   and every icon are the exact ratified drawings (clip-assets.js), keys carry --key-sheen\n   and their own offsets, and every colour, size and radius is a token.\n\n   NO CSS ANIMATION AND NO BROWSER CLOCK: one window.seek(t) computes the whole picture\n   from t, so a capture can step frame by frame. Open plain and it plays itself and loops;\n   ?static=1 holds the poster. Authored at 390 \u00d7 693 (9:16), captured at 3x.\n\n   CORRECTED 21 Sep 2026: the chosen answer presses momentarily and comes back up\n   SELECTED \u2014 primary face, its own offset shadow \u2014 per the approved control behaviour\n   (selected is a state, not a held press). PROPOSED, NOT RATIFIED: the path lattice (diamond nodes, 1.5px wires, the door plate),\n   the quest anatomy (plate chip, answer keys, the take) \u2014 drawn from the tutorial's\n   wireframes' moment 6 and the estate's parts; the icon-to-lesson mapping stands in until\n   the tutorial's own cut is ratified. Lab \u00b7 demo. \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n\n/* \u2500\u2500 the two screens \u2500\u2500 */\n.view{flex:1;min-height:0;position:relative}\n.tree,.quest{position:absolute;inset:0;padding:14px 18px 0}\n.quest{background:var(--white)}\n\n/* \u2500\u2500 the tree \u2500\u2500 */\n.lrow{display:flex;align-items:center;gap:10px;padding:6px 0 2px}\n.lrow .eyebrow{font-size:var(--text-label);font-weight:var(--weight-heading);\n  letter-spacing:.12em;color:var(--text-tertiary)}\n.lrow .count{margin-left:auto;font-weight:var(--weight-heading);font-variant-numeric:tabular-nums}\n.pills{display:flex;gap:5px}\n.pills i{width:26px;height:7px;border-radius:var(--r-pill);background:var(--bg-sunken)}\n.pills i.lit{background:var(--primary)}\n.tree h1{font:var(--weight-heading) var(--text-title)/1.1 var(--font-sans);\n  letter-spacing:var(--track-heading);margin:8px 0 6px}\n.tree .lead{color:var(--text-secondary);max-width:34ch;margin-bottom:12px}\n.pathcard{position:relative;height:446px;border:1px solid var(--border);\n  border-radius:var(--r-card);background:var(--white)}\n.wires{position:absolute;inset:0;width:100%;height:100%}\n.wires path{fill:none;stroke:var(--border);stroke-width:1.5;stroke-linecap:round}\n.wires path.lit{stroke:var(--primary)}\n/* a lesson: the diamond is the slider's knob grown up \u2014 the same rotated square */\n.node{position:absolute;width:44px;height:44px;transform:translate(-50%,-50%) rotate(45deg);\n  border-radius:12px;background:var(--white);border:1.5px solid var(--border);\n  display:grid;place-items:center}\n.node svg{width:19px;height:19px;transform:rotate(-45deg);color:var(--text-tertiary)}\n.node.open{border-color:var(--primary)}\n.node.open svg{color:var(--text)}\n.node.lit{background:linear-gradient(160deg,var(--primary-hover),var(--primary-pressed));\n  border:0;box-shadow:0 10px 18px -8px rgba(13,35,27,.45)}\n.node.lit svg{color:#fff}\n.nlab{position:absolute;transform:translateX(-50%);width:116px;text-align:center;\n  color:var(--text-secondary);line-height:1.35;background:var(--white);border-radius:6px}\n.nlab b{display:block;color:var(--primary);font-weight:var(--weight-heading)}\n.ring{position:absolute;width:44px;height:44px;transform:translate(-50%,-50%) rotate(45deg);\n  border-radius:12px;border:2px solid var(--primary);pointer-events:none}\n.tick-w{position:absolute;transform:translate(-50%,-50%)}\n.tick-w svg{width:20px;height:20px;color:#fff;display:block}\n/* THE DOOR IS THE ESTATE KEY (Esben, 21 Sep 2026: \"the cta button is not in our button green\n   color\"). It was drawn on the dark surface, which made it the only green-less control on a\n   screen whose bar key and lit lesson are both primary. It now wears the key: the primary\n   face, --key-sheen, and the pressed offset in --primary-pressed. The lock stays \u2014 that, and\n   the line under it, are what say it is not open yet. He weighed the trade-off \u2014 a full key\n   says click me, and this one cannot be clicked \u2014 and kept the green: THIS CLIP IS A PROMO,\n   not the product, so reading as Finna beats reading as an accurate locked state. If the\n   scene is ever reused inside the platform, that call should be made again. */\n.door{position:absolute;left:50%;bottom:38px;white-space:nowrap;transform:translateX(-50%);\n  display:inline-flex;align-items:center;gap:10px;padding:13px 22px;\n  border-radius:var(--r-key);color:#fff;\n  background-color:var(--primary);background-image:var(--key-sheen);\n  font-weight:var(--weight-heading);font-size:var(--text-label);letter-spacing:.14em;\n  box-shadow:0 4px 0 var(--primary-pressed)}\n.door svg{width:15px;height:15px}\n.doorline{position:absolute;left:0;right:0;bottom:12px;text-align:center;color:var(--text-tertiary)}\n\n/* \u2500\u2500 the quest \u2500\u2500 */\n.qrow{display:flex;align-items:center;gap:9px;padding:6px 0 10px;\n  font-weight:var(--weight-heading);font-size:var(--text-label)}\n.qrow .segs{flex:1;display:flex;gap:7px}\n.qrow .segs i{flex:1;height:7px;border-radius:var(--r-pill);background:var(--bg-sunken)}\n.qrow .segs i.on{background:var(--primary)}\n.qcard{border:1px solid var(--border);border-radius:var(--r-card);padding:18px 16px 16px;\n  background:var(--white)}\n.plate{display:inline-flex;align-items:center;gap:8px;padding:9px 15px;margin-bottom:14px;\n  border-radius:var(--r-key);background-color:var(--primary);background-image:var(--key-sheen);\n  color:#fff;font-weight:var(--weight-heading);font-size:12px;letter-spacing:.14em;\n  box-shadow:0 3px 0 var(--primary-pressed)}\n.plate svg{width:14px;height:14px}\n.qcard h2{font:var(--weight-heading) var(--text-title)/1.12 var(--font-sans);\n  letter-spacing:var(--track-heading);margin:0 0 6px}\n.helper{color:var(--text-tertiary);margin-bottom:14px}\n/* an answer: a KEY on the sunken face; the pick goes down its offset and stays down */\n.slot{overflow:hidden}\n.ans{border-radius:var(--r-key);background:var(--bg-sunken);padding:12px 14px;\n  line-height:1.35;box-shadow:0 3px 0 var(--border-strong)}\n/* SELECTED is a state, not a held press (approved control behaviour): the key comes\n   back up wearing the primary face and its own offset shadow */\n.ans.on{background:var(--primary);color:#fff;box-shadow:0 3px 0 var(--primary-pressed)}\n.take{overflow:hidden}\n.take>div{border-radius:var(--r-key);background:var(--primary-12);padding:12px 14px;line-height:1.4}\n.take b{color:var(--primary);font-weight:var(--weight-heading)}\n/* the foot key: the estate KEY, size L, full width */\n.foot{position:absolute;left:18px;right:18px;bottom:18px}\n.fkey{position:relative;height:52px;border-radius:var(--r-key);\n  background-color:var(--primary);background-image:var(--key-sheen);color:#fff;\n  box-shadow:0 4px 0 var(--primary-pressed);\n  display:grid;place-items:center;font-weight:var(--weight-heading);font-size:16px;\n  letter-spacing:.01em}\n.fkey span{grid-area:1/1;display:inline-flex;align-items:center;gap:9px}\n.fkey svg{width:17px;height:17px}\n";
  const HTML = "\n<div class=\"pbar\">\n    <span class=\"mk\" id=\"markBar\"></span><b>Finna</b>\n    <span class=\"key\"><span id=\"keyIc\"></span>Learn</span>\n  </div>\n  <div class=\"view\">\n\n    <div class=\"tree\" id=\"tree\">\n      <div class=\"lrow\">\n        <span class=\"eyebrow\">LEARN</span>\n        <span class=\"count\"><span id=\"doneN\">0</span> of 5</span>\n        <span class=\"pills\" id=\"pills\"></span>\n      </div>\n      <h1>Your path in.</h1>\n      <p class=\"lead\">Finish a lesson and it opens the part of the platform it belongs to.</p>\n      <div class=\"pathcard\" id=\"card\"></div>\n    </div>\n\n    <div class=\"quest\" id=\"quest\">\n      <div class=\"qrow\"><span>Question 1 of 3</span>\n        <span class=\"segs\"><i class=\"on\"></i><i></i><i></i></span></div>\n      <div class=\"qcard\">\n        <span class=\"plate\"><span id=\"plateIc\"></span>INVESTING</span>\n        <h2>What does investing actually mean?</h2>\n        <p class=\"helper\">One answer. Getting it wrong costs nothing.</p>\n        <div id=\"answers\"></div>\n        <div class=\"take\" id=\"take\"><div><b>Right.</b> Investing is being paid to wait \u2014 for owning something, or for lending.</div></div>\n      </div>\n      <div class=\"foot\"><div class=\"fkey\" id=\"fkey\">\n        <span id=\"lab1\">Check my answer&nbsp;&nbsp;<span data-ic=\"arrow\"></span></span>\n        <span id=\"lab2\">Continue \u00b7 +20 xp&nbsp;&nbsp;<span data-ic=\"arrow\"></span></span>\n      </div></div>\n    </div>\n\n  </div>\n";

  /* ══ CLIP ASSETS — the exact ratified drawings, shared by the clip scenes ═══════════
     The four-ring mark verbatim from the logo work (wall 1.5), and the line icons
     VERBATIM from brand/icons.json (REV 40) — nothing here is redrawn. Consumed by
     lab/chat-clip.html and lab/learn-clip.html. */
  const FINNA=(function(){
    'use strict';
    var RING="<svg viewBox=\"38.75 38.75 50.5 50.5\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"57\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"57\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M64 56.058A16.5 16.5 0 0 1 71.942 64A16.5 16.5 0 0 1 64 71.942A16.5 16.5 0 0 1 56.058 64A16.5 16.5 0 0 1 64 56.058Z\" fill=\"currentColor\"/></svg>";
    /* FREYA — brand/logo/freya-mark.svg: the same four rings with the shape they all share
       LEFT OPEN. The company mark is closed, Freya is open. Substitution stated: the
       ratified file is cropped 35.5/57, this carries the clip mark's own crop
       (38.75/50.5) so Freya and the company mark read at the same optical size. */
    var FREYA="<svg viewBox=\"38.75 38.75 50.5 50.5\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"57\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"57\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"71\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/><circle cx=\"57\" cy=\"71\" r=\"16.5\" stroke=\"currentColor\" stroke-width=\"1.5\"/></svg>";
    var ICONS={"learn": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"learn\"><path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"/><path d=\"M22 10v6\"/><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"/></svg>", "lock": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"lock\"><rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></svg>", "check": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"check\"><path d=\"M20 6 9 17l-5-5\"/></svg>", "arrow": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"arrow\"><path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/></svg>", "calendar": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"calendar\"><path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/></svg>", "shield": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"shield\"><path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/></svg>", "wallet": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"wallet\"><path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/></svg>", "tier-office": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"tier-office\"><path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\"/><path d=\"M5 21h14\"/></svg>", "tier-pro": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"tier-pro\"><path d=\"M10.5 3 8 9l4 13 4-13-2.5-6\"/><path d=\"M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z\"/><path d=\"M2 9h20\"/></svg>", "statement": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"statement\"><path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"/><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/></svg>", "users": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"users\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><path d=\"M16 3.128a4 4 0 0 1 0 7.744\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/></svg>", "home": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" data-icon=\"home\"><path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></svg>"};
    return { RING:RING, FREYA:FREYA, icon:function(n){return ICONS[n]||"";} };
  })();

  const RM = matchMedia('(prefers-reduced-motion:reduce)');

  class FinnaLearnClip extends HTMLElement {
    connectedCallback() {
      if (this.__on) return;
      this.__on = true;
      const root = this.attachShadow({ mode: 'open' });
      const sheet = document.createElement('style'); sheet.textContent = CSS;
      root.append(sheet);
      root.innerHTML += HTML;
      root.getElementById = function (id) { return root.querySelector('#' + id); };
      let laid = 0;
      const seek = buildScene(root, () => laid, v => laid = v);
      /* the scene's one control, left on the element: a capture steps it frame by frame
         (lab/learn-clip.html does the same), and nothing on the page calls it */
      this.seek = seek; this.duration = seek.DUR;
      seek(0);
      /* REDUCED MOTION (22 Sep 2026) — the scene used to stop dead on frame 0. It is a
         DEMONSTRATION, not decoration, so it now plays with the travel taken out: the
         quest cross-fades over the path instead of sliding in from the side (see seek()).
         What is left is opacity and the 3–4px control presses. */
      /* the clock stops whenever the clip is off screen — a looping scene in a section nobody
         is looking at is a frame budget spent on nothing */
      let raf = 0, t0 = performance.now(), paused = 0;
      const loop = now => { seek(((now - t0) / 1000) % seek.DUR); raf = requestAnimationFrame(loop); };
      const io = new IntersectionObserver(es => {
        const vis = es[es.length - 1].isIntersecting;
        if (vis && !raf) { t0 = performance.now() - paused; raf = requestAnimationFrame(loop); }
        if (!vis && raf) { paused = performance.now() - t0; cancelAnimationFrame(raf); raf = 0; }
      }, { rootMargin: '200px' });
      io.observe(this);
    }
  }
  customElements.define('finna-learn-clip', FinnaLearnClip);

  function buildScene(root, getLaid, setLaid) {
  /* ══ THE SCENE — seek(t) computes the whole picture from t. No CSS animation,
     no browser clock. T is the storyboard's pacing table, verbatim. ══════════════════════════ */
  const T = {
    ringGo:0.90, ringEnd:1.80,
    touch1:2.20,                 // lesson 1 sits down 3pt and comes back
    questIn:2.65,                // quest pushes in over .5s; the tree steps back a quarter
    /* TIMING WIDENED for reading (21 Sep 2026, a departure from the storyboard's table):
       the question holds ~4.3s before the pick (was 2.7) and the feedback ~2.2s (was 1.4) —
       at the embedded size the take was gone before it could be read. Loop 11.25 -> 13.55s. */
    touchA:7.40,                 // the answer presses, and comes back up selected
    check:8.10,                  // the foot key goes down and comes back
    fold:8.35,  foldEnd:8.60,    // wrong answers fold to nothing
    label:8.55,                  // the key's label becomes Continue · +20 xp
    takeIn:8.60,
    cont:10.75,                  // Continue goes down
    questOut:11.15,              // the quest slides off right
    tick:11.70,                  // the tick draws; Start here goes
    wire1:11.85, wire2:11.93,    // the two wires light, 80ms apart
    openAt:12.20,                // lessons 2 and 4 open
    door:12.35,                  // the door's line; the first pill
    dissolve:13.15, END:13.55,
  };
  const DUR = T.END;

  /* the lattice: five lessons, two tracks, one door — a PROPOSAL (names from the
     tutorial's own quests); the platform's real Learn map may differ. */
  const NODES = [
    {x:195,y: 48, icon:'learn',       lab:'What investing is'},
    {x:100,y:150, icon:'wallet',      lab:'Owning and lending'},
    {x:100,y:258, icon:'calendar',    lab:'How long it could wait'},
    {x:290,y:150, icon:'tier-office', lab:'What a family office is'},
    {x:290,y:258, icon:'shield',      lab:'What Finna does for you'},
  ];
  const WIRES = [  // [from, to] by node index; 0->1 and 0->3 are the ones that light
    [0,1],[0,3],[1,2],[3,4],[2,'door'],[4,'door']
  ];
  const ANSWERS = [
    {t:'Hoping something goes up', h:46},
    {t:'Owning a piece of something, or lending, and being paid to wait', h:64},
    {t:'Guessing which shares will rise', h:46},
    {t:'Something only professionals do', h:46},
  ];
  const PICK = 1, GAP = 9;

  /* ── build ── */
  const F = FINNA;
  root.getElementById('markBar').innerHTML = F.RING;
  root.getElementById('keyIc').innerHTML  = F.icon('learn');
  root.getElementById('plateIc').innerHTML= F.icon('learn');
  root.querySelectorAll('[data-ic]').forEach(el=>el.innerHTML=F.icon(el.getAttribute('data-ic')));

  const card = root.getElementById('card');
  const doorY = 388;
  const G = 18, MID = 195;                       /* the gutter, and the authored centre line */
  const X = x => `calc(50% + ${x - MID}px)`;     /* authored x -> a position on the card */
  function wirePath(a,b){
    const A = a==='door'?{x:195,y:doorY}:NODES[a], B = b==='door'?{x:195,y:doorY}:NODES[b];
    const my=(A.y+B.y)/2;
    return `M${A.x} ${A.y} C ${A.x} ${my}, ${B.x} ${my}, ${B.x} ${B.y}`;
  }
  card.innerHTML =
    /* THE LATTICE IS AUTHORED IN THE PHONE'S OWN 390-WIDE SPACE, so its centre line is x=195.
       The card it is drawn in is narrower than the phone by the gutter on both sides, so a raw
       195 landed 18px right of the card's centre and the whole tree hung off the door, which is
       centred on the card. The view is shifted by the gutter instead of the drawing being
       retyped: x=195 is now the card's centre line, and the nodes below are placed from it. */
    `<svg class="wires" viewBox="${G} 0 354 446" preserveAspectRatio="none">`+
    WIRES.map(([a,b],i)=>`<path id="w${i}" d="${wirePath(a,b)}"/>`).join('')+`</svg>`+
    NODES.map((n,i)=>
      `<div class="node${i===0?' lit':''}" id="n${i}" style="left:${X(n.x)};top:${n.y}px">${F.icon(n.icon)}</div>`+
      `<div class="tick-w" id="tick${i}" style="left:${X(n.x)};top:${n.y}px;opacity:0">${F.icon('check')}</div>`+
      `<div class="nlab" style="left:${X(n.x)};top:${n.y+30}px">${n.lab}${i===0?'<b id="starthere">Start here</b>':''}</div>`
    ).join('')+
    `<div class="ring" id="pulse" style="left:${X(NODES[0].x)};top:${NODES[0].y}px;opacity:0"></div>`+
    `<div class="door"><span data-ic="lock"></span>PRIVATE MARKETS</div>`+
    `<p class="doorline" id="doorline">Opens when the path is done</p>`;
  card.querySelectorAll('[data-ic]').forEach(el=>el.innerHTML=F.icon(el.getAttribute('data-ic')));
  root.getElementById('pills').innerHTML='<i></i>'.repeat(5);

  root.getElementById('answers').innerHTML = ANSWERS.map((a,i)=>
    `<div class="slot" id="slot${i}"><div class="ans" id="ans${i}" style="margin-bottom:${GAP}px">${a.t}</div></div>`).join('');

  /* ── seek ── */
  const $=id=>root.getElementById(id);
  const els={tree:$('tree'),quest:$('quest'),pulse:$('pulse'),n0:$('n0'),tick0:$('tick0'),
    starthere:$('starthere'),doorline:$('doorline'),doneN:$('doneN'),
    take:$('take'),fkey:$('fkey'),lab1:$('lab1'),lab2:$('lab2')};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
  const io=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;   // easeInOut
  const out=p=>1-Math.pow(1-p,3);                   // easeOut

  const seek = function(t){
    t = clamp(t,0,DUR);
    const u = 1-seg(t,T.dissolve,T.END);            // 1 while walked, fades to 0 at the loop

    /* the pulse — the mark's own rule of motion: once, then rest */
    const pp = seg(t,T.ringGo,T.ringEnd);
    els.pulse.style.opacity = pp>0&&pp<1 ? String(.5*(1-pp)) : '0';
    const ps = 1+.55*pp;
    els.pulse.style.transform=`translate(-50%,-50%) rotate(45deg) scale(${ps.toFixed(3)})`;

    /* the touch on lesson 1: down 3pt and back */
    const tp = seg(t,T.touch1,T.touch1+.3), dy1 = 3*Math.sin(Math.PI*tp);
    els.n0.style.transform=`translate(-50%,calc(-50% + ${dy1.toFixed(2)}px)) rotate(45deg)`;

    /* quest in, out — the tree steps back a quarter */
    const qi = io(seg(t,T.questIn,T.questIn+.5)), qo = io(seg(t,T.questOut,T.questOut+.5));
    const q = qi*(1-qo);
    if (RM.matches) {                                  /* no travel: the two screens cross-fade */
      els.quest.style.transform = 'none';   els.quest.style.opacity = q.toFixed(2);
      els.tree.style.transform  = 'none';   els.tree.style.opacity  = (1-q).toFixed(2);
    } else {
      els.quest.style.transform = `translateX(${(100-100*qi+110*qo).toFixed(2)}%)`;
      els.tree.style.transform = `translateX(${(-25*q).toFixed(2)}%)`;
      els.quest.style.opacity = ''; els.tree.style.opacity = '';
    }
    els.quest.style.visibility = q>0||qi>0&&qo<1 ? 'visible':'hidden';

    /* the answer: a momentary press — down its 4pt and back — then SELECTED (primary face) */
    const on = t>=T.touchA+.12;
    const ap = Math.sin(Math.PI*seg(t,T.touchA,T.touchA+.3));
    const a = $('ans'+PICK);
    a.classList.toggle('on',on);
    a.style.transform = `translateY(${(4*ap).toFixed(2)}px)`;
    a.style.boxShadow = ap>.5?'0 0 0 var(--primary-pressed)':'';

    /* the foot key: down and back at check, and at continue */
    const kp = Math.sin(Math.PI*seg(t,T.check,T.check+.3)) + Math.sin(Math.PI*seg(t,T.cont,T.cont+.3));
    els.fkey.style.transform = `translateY(${(4*clamp(kp,0,1)).toFixed(2)}px)`;
    els.fkey.style.boxShadow = kp>.5?'0 0 0 var(--primary-pressed)':'';
    const swapped = t>=T.label;
    els.lab1.style.opacity = swapped?'0':'1';
    els.lab2.style.opacity = swapped?'1':'0';

    /* wrong answers fold to nothing */
    ANSWERS.forEach((ans,i)=>{
      if(i===PICK) return;
      const f = 1-out(seg(t,T.fold,T.foldEnd));
      $('slot'+i).style.height = ((ans.h+GAP)*f).toFixed(1)+'px';
      $('ans'+i).style.opacity = f.toFixed(2);
    });
    if(!getLaid()){ ANSWERS.forEach((ans,i)=>{ if(i!==PICK) $('slot'+i).style.height=(ans.h+GAP)+'px'; }); setLaid(1); }

    /* the take grows in under the right one */
    const tk = out(seg(t,T.takeIn,T.takeIn+.35));
    els.take.style.height = (74*tk).toFixed(1)+'px';
    els.take.style.opacity = tk.toFixed(2);
    els.take.style.marginTop = (6*tk).toFixed(1)+'px';

    /* back on the path — every delta multiplied by u so the loop dissolves home */
    const tickP = out(seg(t,T.tick,T.tick+.35))*u;
    els.tick0.style.opacity = tickP.toFixed(2);
    els.n0.querySelector('svg').style.opacity = (1-tickP).toFixed(2);
    els.starthere.style.opacity = (1-seg(t,T.tick,T.tick+.2)*u).toFixed(2);
    const w1 = out(seg(t,T.wire1,T.wire1+.4))*u, w2 = out(seg(t,T.wire2,T.wire2+.4))*u;
    $('w0').style.stroke = w1>.5?'var(--primary)':'var(--border)';
    $('w1').style.stroke = w2>.5?'var(--primary)':'var(--border)';
    const op = seg(t,T.openAt,T.openAt+.3)*u;
    ['n1','n3'].forEach(id=>{ const el=$(id);
      el.classList.toggle('open',op>.5);
    });
    const after = (t>=T.door)&&u>.5;
    els.doorline.textContent = after?'Four lessons to go':'Opens when the path is done';
    els.doneN.textContent = after?'1':'0';
    root.querySelectorAll('#pills i').forEach((p,i)=>p.classList.toggle('lit',i===0&&after));
  };
    seek.DUR = DUR;
    return seek;
  }
})();
