/* Lab-only: threads — <finna-threads amplitude="1" distance="0" color="#EAF3EE" mouse
   controls-into="#sel">
   Forty stacked lines, each displaced by per-pixel Perlin noise and multiplied together so they
   read as woven filaments. Shader ported from the React Bits "Threads" background (OGL) to a plain
   custom element; renders full-bleed inside its own container (not square-blitted like the orbs),
   with the internal resolution capped so the per-pixel noise stays cheap.
   Live API: setParam(k,v), setColor(hex). */
(function () {
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* The shader is per-pixel Perlin noise run once per line, so its cost is the pixel count
     times the line count — at 1600px across and 40 lines that is 64M noise samples a frame,
     which is what made the header stutter (Rose, 3 Sep: "it's janky"). The lines are soft
     and blurred, so rendering below the display's resolution and scaling up costs nothing
     visible. `max-dim` and `fps` on the element override both. */
  var MAX_DIM = 1500;
  var MAX_DPR = 1.5;
  var FPS = 30;

  var PAL = {
    Bone:  '#EAF3EE',
    Mint:  '#7CBE9B',
    Brand: '#1FBE84',
    Ink:   '#5A6B62'
  };

  var VERT = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';

  var FRAG = [
    'precision highp float;',
    'uniform float iTime;uniform vec3 iResolution;uniform vec3 uColor;',
    'uniform float uAmplitude;uniform float uDistance;uniform vec2 uMouse;',
    'uniform float uLineWidth;uniform float uLineBlur;uniform float uCount;uniform float uSpeed;',
    '#define PI 3.1415926538',
    'float Perlin2D(vec2 P){',
    ' vec2 Pi=floor(P);',
    ' vec4 Pf_Pfmin1=P.xyxy-vec4(Pi,Pi+1.0);',
    ' vec4 Pt=vec4(Pi.xy,Pi.xy+1.0);',
    ' Pt=Pt-floor(Pt*(1.0/71.0))*71.0;',
    ' Pt+=vec2(26.0,161.0).xyxy;',
    ' Pt*=Pt;',
    ' Pt=Pt.xzxz*Pt.yyww;',
    ' vec4 hash_x=fract(Pt*(1.0/951.135664));',
    ' vec4 hash_y=fract(Pt*(1.0/642.949883));',
    ' vec4 grad_x=hash_x-0.49999;',
    ' vec4 grad_y=hash_y-0.49999;',
    ' vec4 grad_results=inversesqrt(grad_x*grad_x+grad_y*grad_y)*(grad_x*Pf_Pfmin1.xzxz+grad_y*Pf_Pfmin1.yyww);',
    ' grad_results*=1.4142135623730950;',
    ' vec2 blend=Pf_Pfmin1.xy*Pf_Pfmin1.xy*Pf_Pfmin1.xy*(Pf_Pfmin1.xy*(Pf_Pfmin1.xy*6.0-15.0)+10.0);',
    ' vec4 blend2=vec4(blend,vec2(1.0-blend));',
    ' return dot(grad_results,blend2.zxzx*blend2.wwyy);}',
    'float pixel(float count,vec2 resolution){return (1.0/max(resolution.x,resolution.y))*count;}',
    'float lineFn(vec2 st,float width,float perc,float offset,vec2 mouse,float time,float amplitude,float distance){',
    ' float split_offset=(perc*0.4);',
    ' float split_point=0.1+split_offset;',
    ' float amplitude_normal=smoothstep(split_point,0.7,st.x);',
    ' float finalAmplitude=amplitude_normal*0.5*amplitude*(1.0+(mouse.y-0.5)*0.2);',
    ' float time_scaled=time/10.0+(mouse.x-0.5)*1.0;',
    ' float blur=smoothstep(split_point,split_point+0.05,st.x)*perc;',
    ' float xnoise=mix(Perlin2D(vec2(time_scaled,st.x+perc)*2.5),',
    '                  Perlin2D(vec2(time_scaled,st.x+time_scaled)*3.5)/1.5,st.x*0.3);',
    ' float y=0.5+(perc-0.5)*distance+xnoise/2.0*finalAmplitude;',
    ' float line_start=smoothstep(y+(width/2.0)+(uLineBlur*pixel(1.0,iResolution.xy)*blur),y,st.y);',
    ' float line_end=smoothstep(y,y-(width/2.0)-(uLineBlur*pixel(1.0,iResolution.xy)*blur),st.y);',
    ' return clamp((line_start-line_end)*(1.0-smoothstep(0.0,1.0,pow(perc,0.3))),0.0,1.0);}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/iResolution.xy;',
    ' float line_strength=1.0;',
    ' float count=max(1.0,uCount);',
    ' for(int i=0;i<80;i++){',
    '  if(float(i)>=count)break;',
    '  float p=float(i)/count;',
    '  line_strength*=(1.0-lineFn(uv,uLineWidth*pixel(1.0,iResolution.xy)*(1.0-p),p,',
    '                             (PI*1.0)*p,uMouse,iTime*uSpeed,uAmplitude,uDistance));',
    ' }',
    ' float colorVal=1.0-line_strength;',
    ' gl_FragColor=vec4(uColor*colorVal,colorVal);',
    '}'
  ].join('\n');

  function hex2rgb(hx) {
    hx = (hx || '').replace('#', '');
    if (hx.length === 3) hx = hx[0] + hx[0] + hx[1] + hx[1] + hx[2] + hx[2];
    var n = parseInt(hx, 16);
    if (isNaN(n)) return [1, 1, 1];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /* one context per instance here: the effect is full-bleed at the container's own aspect,
     so a single shared square offscreen would distort it */
  function makeGL(canvas) {
    var gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return null;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); return null; }
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['iTime', 'iResolution', 'uColor', 'uAmplitude', 'uDistance', 'uMouse',
     'uLineWidth', 'uLineBlur', 'uCount', 'uSpeed'].forEach(function (k) {
      U[k] = gl.getUniformLocation(prog, k);
    });
    return { gl: gl, U: U };
  }

  var LIVE = [], raf = null, lastVis = 0, idle = false, lastWake = 0;

  function refreshVis(ts) {
    if (ts - lastVis < 200) return;
    lastVis = ts;
    var vh = window.innerHeight || 800, M = 120;
    for (var i = 0; i < LIVE.length; i++) {
      var r = LIVE[i].el.getBoundingClientRect();
      LIVE[i].rect = r;
      LIVE[i].vis = !LIVE[i].el._paused &&
                    r.height > 0 && r.bottom > -M && r.top < vh + M;
    }
  }

  function sizeTo(o) {
    var w = o.el.clientWidth || 1, h = o.el.clientHeight || 1;
    var base = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    var cap = o.maxDim || MAX_DIM;
    var longest = Math.max(w, h) * base;
    var dpr = longest > cap ? (base * cap) / longest : base;
    var cw = Math.max(1, Math.round(w * dpr)), ch = Math.max(1, Math.round(h * dpr));
    if (o.cv.width !== cw || o.cv.height !== ch) {
      o.cv.width = cw; o.cv.height = ch;
      o.ctxGL.gl.viewport(0, 0, cw, ch);
    }
  }

  function renderOne(o, time) {
    var gl = o.ctxGL.gl, U = o.ctxGL.U, P = o.P;
    sizeTo(o);
    gl.uniform1f(U.iTime, time);
    gl.uniform3f(U.iResolution, o.cv.width, o.cv.height, o.cv.width / o.cv.height);
    gl.uniform3fv(U.uColor, o.COL);
    gl.uniform1f(U.uAmplitude, P.amplitude);
    gl.uniform1f(U.uDistance, P.distance);
    gl.uniform2f(U.uMouse, o.mx, o.my);
    gl.uniform1f(U.uLineWidth, P.lineWidth);
    gl.uniform1f(U.uLineBlur, P.lineBlur);
    gl.uniform1f(U.uCount, P.count);
    gl.uniform1f(U.uSpeed, P.speed);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  var PT = { x: 0, y: 0, has: false };
  window.addEventListener('pointermove', function (e) { PT.x = e.clientX; PT.y = e.clientY; PT.has = true; }, { passive: true });

  function loop(ts) {
    raf = null;
    var time = ts * 0.001;
    refreshVis(ts);
    var anyVis = false;
    for (var i = 0; i < LIVE.length; i++) {
      var o = LIVE[i];
      if (!o.vis) continue;
      anyVis = true;
      /* a drift this slow reads the same at 30fps as at 120, at a quarter of the work */
      if (ts - o.last < o.minFrame) continue;
      o.last = ts;
      if (o.P.mouse > 0.5 && PT.has && o.rect) {
        var tx = (PT.x - o.rect.left) / Math.max(1, o.rect.width);
        var ty = 1 - (PT.y - o.rect.top) / Math.max(1, o.rect.height);
        if (tx < -0.2 || tx > 1.2 || ty < -0.2 || ty > 1.2) { tx = 0.5; ty = 0.5; }
        o.mx += (tx - o.mx) * 0.05;
        o.my += (ty - o.my) * 0.05;
      } else { o.mx = 0.5; o.my = 0.5; }
      renderOne(o, time);
    }
    /* nothing on screen: let the loop die rather than spin. A scroll, a resize or the tab
       coming back wakes it, and refreshVis on that first frame decides again. */
    if (LIVE.length && (anyVis || ts - lastWake < 400)) raf = requestAnimationFrame(loop);
    else idle = true;
  }
  function wake() { idle = false; lastWake = performance.now(); kick(); }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
  addEventListener('scroll', function () { if (idle) wake(); }, { passive: true });
  addEventListener('resize', wake, { passive: true });

  /* ---------- controls ---------- */
  var PANEL_CSS =
    '.thp{border-radius:14px;border:1px solid rgba(255,255,255,.14);background:#0E1512;padding:16px;' +
      'font-family:Inter,sans-serif;color:#EAF3EE;display:flex;flex-direction:column;gap:14px}' +
    '.thp h4{margin:0;font:600 10.5px/1 Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(191,224,207,.85)}' +
    '.thp .g{display:flex;flex-direction:column;gap:8px}' +
    '.thp .ch{display:flex;flex-wrap:wrap;gap:6px}' +
    '.thp button{min-height:32px;padding:0 13px;border-radius:999px;border:1px solid rgba(255,255,255,.18);' +
      'background:rgba(255,255,255,.05);color:#EAF3EE;font:600 12px/1 Inter,sans-serif;cursor:pointer;' +
      'transition:background 200ms,color 200ms,border-color 200ms}' +
    '.thp button:hover{background:rgba(255,255,255,.14)}' +
    '.thp button.on{background:#DCF3E6;border-color:#DCF3E6;color:#08301F}' +
    '.thp .sl{display:grid;grid-template-columns:72px minmax(0,1fr) 46px;gap:10px;align-items:center;' +
      'font:400 12px/1 Inter,sans-serif;color:rgba(234,243,238,.8)}' +
    '.thp .sl b{font:600 12px/1 Inter,sans-serif;color:#FFFFFF;text-align:right;font-variant-numeric:tabular-nums}' +
    '.thp input[type=range]{width:100%;accent-color:#7CBE9B}' +
    '.thp input[type=color]{width:100%;height:28px;padding:0;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:none;cursor:pointer}' +
    '.thp .out{border-radius:8px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.35);padding:9px 10px;' +
      'font:500 11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#BFE0CF;word-break:break-all;user-select:all}';

  var SLIDERS = [
    ['amplitude', 'Amplitude', 0,   4,   0.05],
    ['distance',  'Spread',    0,   1.5, 0.02],
    ['count',     'Lines',     4,   80,  1],
    ['lineWidth', 'Weight',    1,   24,  0.5],
    ['lineBlur',  'Softness',  0,   30,  0.5],
    ['speed',     'Speed',     0,   4,   0.05],
    ['mouse',     'Mouse',     0,   1,   1]
  ];

  function buildPanel(el, host) {
    var st = document.createElement('style');
    st.textContent = PANEL_CSS; host.appendChild(st);
    var p = document.createElement('div'); p.className = 'thp'; host.appendChild(p);
    function group(title) {
      var g = document.createElement('div'); g.className = 'g';
      var h = document.createElement('h4'); h.textContent = title;
      g.appendChild(h); p.appendChild(g); return g;
    }
    var gc = group('Colour');
    var inp = document.createElement('input');
    inp.type = 'color'; inp.value = el._HEX;
    inp.addEventListener('input', function () { el.setColor(inp.value); readout(); });
    gc.appendChild(inp);
    var prow = document.createElement('div'); prow.className = 'ch';
    Object.keys(PAL).forEach(function (name) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = name;
      b.addEventListener('click', function () { el.setColor(PAL[name]); inp.value = el._HEX; readout(); });
      prow.appendChild(b);
    });
    gc.appendChild(prow);

    var gm = group('Threads');
    var rows = {};
    SLIDERS.forEach(function (s) {
      var row = document.createElement('div'); row.className = 'sl';
      var lab = document.createElement('label'); lab.textContent = s[1];
      var r = document.createElement('input');
      r.type = 'range'; r.min = s[2]; r.max = s[3]; r.step = s[4]; r.value = el._P[s[0]];
      var val = document.createElement('b');
      val.textContent = s[0] === 'mouse' ? (+r.value ? 'on' : 'off') : (+r.value).toFixed(2);
      r.addEventListener('input', function () {
        el.setParam(s[0], parseFloat(r.value));
        val.textContent = s[0] === 'mouse' ? (+r.value ? 'on' : 'off') : (+r.value).toFixed(2);
        readout();
      });
      row.appendChild(lab); row.appendChild(r); row.appendChild(val);
      gm.appendChild(row); rows[s[0]] = { r: r, val: val };
    });

    var go = group('Settings string');
    var out = document.createElement('div'); out.className = 'out'; go.appendChild(out);
    function readout() {
      var P = el._P;
      out.textContent = 'threads: amp=' + (+P.amplitude).toFixed(2) +
        ' spread=' + (+P.distance).toFixed(2) + ' lines=' + Math.round(P.count) +
        ' weight=' + (+P.lineWidth).toFixed(1) + ' soft=' + (+P.lineBlur).toFixed(1) +
        ' speed=' + (+P.speed).toFixed(2) + ' mouse=' + (P.mouse > 0.5 ? 'on' : 'off') +
        ' colour=' + el._HEX;
    }
    readout();
  }

  if (customElements.get('finna-threads')) return;
  var Threads = class extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      var root = this.attachShadow({ mode: 'open' });
      this.setAttribute('aria-hidden', 'true');
      if (!this.style.display) this.style.display = 'block';
      var st = document.createElement('style');
      st.textContent = ':host{position:relative;display:block;width:100%;height:100%}' +
        'canvas{display:block;width:100%;height:100%}';
      root.appendChild(st);
      var cv = document.createElement('canvas');
      root.appendChild(cv);

      var hex = this.getAttribute('color') || PAL.Bone;
      var P = {
        amplitude: 1, distance: 0, count: 40, lineWidth: 7, lineBlur: 10, speed: 1,
        mouse: this.hasAttribute('mouse') ? 1 : 0
      };
      var el = this;
      Object.keys(P).forEach(function (k) {
        var a = el.getAttribute(k.toLowerCase());
        if (a === null || a === '') a = el.getAttribute(k);
        if (a !== null && a !== '') P[k] = parseFloat(a);
      });

      var maxDim = parseFloat(this.getAttribute('max-dim')) || MAX_DIM;
      var fps = parseFloat(this.getAttribute('fps')) || FPS;

      var ctxGL = makeGL(cv);
      var o = {
        el: this, cv: cv, ctxGL: ctxGL, P: P, COL: hex2rgb(hex),
        mx: 0.5, my: 0.5, vis: true, rect: null, maxDim: maxDim, baseDim: maxDim, minFrame: 1000 / fps, baseFrame: 1000 / fps, last: -1e9
      };
      this._P = P; this._o = o; this._HEX = hex;
      if (!ctxGL) { cv.style.background = 'linear-gradient(180deg, transparent, rgba(234,243,238,.06), transparent)'; return; }
      LIVE.push(o);
      renderOne(o, 0);
      if (!REDUCE) kick();

      var sel = this.getAttribute('controls-into');
      if (sel) { var host = document.querySelector(sel); if (host) buildPanel(this, host); }
    }

    setParam(k, v) { if (this._P && k in this._P) this._P[k] = v; }
    /* A caller that puts something OVER the canvas — a menu panel, a modal — can stop the
       draw while it is there. The shader is the most expensive thing on the page, and it is
       not being looked at behind an opaque panel; leaving it running costs the panel's own
       animation its frames. */
    /* Something on top of the canvas needs the frame budget. Dropping FRAMES was tried first
       and read as a stutter — the eye catches an uneven cadence immediately. Dropping
       RESOLUTION does not: every frame is still drawn, on time, just at half the width, so
       the motion stays smooth and the only cost is a softness nobody is looking at while a
       panel is over it. Half the width is a quarter of the pixels, and this shader's cost is
       per pixel. */
    pause() { if (this._o) { this._o.maxDim = this._o.baseDim / 2; wake(); } }
    resume() { if (this._o) { this._o.maxDim = this._o.baseDim; wake(); } }
    setColor(hexv) { this._HEX = hexv; if (this._o) this._o.COL = hex2rgb(hexv); }
    disconnectedCallback() {
      var i = LIVE.indexOf(this._o);
      if (i >= 0) LIVE.splice(i, 1);
    }
  };
  Threads.PAL = PAL;
  window.FinnaThreads = Threads;
  customElements.define('finna-threads', Threads);
})();
