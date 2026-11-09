/* Scope theme for Claude's Slide Engine: an oscilloscope look, made for a talk about measuring impedance.
   Transitions scope-sweep (a glowing beam sweeps across and leaves the new slide behind it, like a trace being
   written) and crt (the old slide collapses into a bright line like a CRT switching off, the new one opens from it) ·
   ambient "scope-grid" (a graticule with two phosphor traces, a voltage and a phase-shifted current, written by a
   moving beam with afterglow) · element effect "trace" (every line of an <svg> draws itself, then its fills fade in).
   Glows in the accent colour. Options on <body>: data-scope-bg (screen colour, default #08110d).
   Docs: README.md next to this file. Link it before engine.js:  <script src="themes/scope/theme.js" defer></script> */
(window.slideEngineThemes = window.slideEngineThemes || []).push({ name: 'scope', setup(se) {
  const { W, H, fctx, clamp, sstep, layer, rafLoop, A, finished, ease } = se;
  const BG = se.body.dataset.scopeBg || '#08110d';

  /* ---------- scope-sweep: a vertical beam writes the new slide from left to right ---------- */
  se.transition('scope-sweep', async (from, to, dir, reveal) => {
    const dur = se.simple ? 600 : 1500;
    layer(from, 1); layer(to, 2);
    const [r, g, b] = se.rgb;
    A(from, [{ filter: 'brightness(1)' }, { filter: 'brightness(.35) saturate(.4)' }], { duration: dur, easing: ease.io });
    let shown = false;
    await rafLoop(dur, p => {
      const q = ease.io ? sstep(p) : p, x = dir > 0 ? q * (W + 80) - 40 : W + 40 - q * (W + 80);
      to.style.clipPath = dir > 0 ? `inset(0 ${Math.max(0, W - x)}px 0 0)` : `inset(0 0 0 ${Math.max(0, x)}px)`;
      if (!shown && p > .05) { shown = true; reveal(); }
      fctx.clearRect(0, 0, W, H);
      // afterglow band behind the beam, the beam itself, and a bright spot running up and down it like a trace
      const trail = fctx.createLinearGradient(x - dir * 220, 0, x, 0);
      trail.addColorStop(0, `rgba(${r},${g},${b},0)`); trail.addColorStop(1, `rgba(${r},${g},${b},.28)`);
      fctx.fillStyle = trail; fctx.fillRect(Math.min(x, x - dir * 220), 0, 220, H);
      fctx.fillStyle = `rgba(${r},${g},${b},.95)`; fctx.fillRect(x - 3, 0, 6, H);
      fctx.globalAlpha = .9; fctx.drawImage(se.sprite, x - 60, H / 2 + Math.sin(p * 26) * H * .38 - 60, 120, 120);
      fctx.globalAlpha = 1;
    });
    fctx.clearRect(0, 0, W, H);
    to.style.clipPath = '';
  });

  /* ---------- crt: the old slide collapses to a line and a dot, the new one opens from the line ---------- */
  se.transition('crt', async (from, to, dir, reveal) => {
    const dur = se.simple ? 500 : 1300, half = dur / 2;
    layer(from, 2); layer(to, 1); to.style.opacity = 0;
    const [r, g, b] = se.rgb;
    const a1 = A(from, [{ transform: 'scale(1,1)', filter: 'brightness(1)' },
      { transform: 'scale(1,.006)', filter: 'brightness(3)', offset: .7 },
      { transform: 'scale(0,.004)', filter: 'brightness(5)' }], { duration: half, easing: ease.in });
    const glow = p => {                       // the bright line / dot in the middle while the picture is thin
      fctx.clearRect(0, 0, W, H);
      const w = W * (1 - p), a = Math.sin(Math.PI * Math.min(1, p * 1.3 + .1));
      fctx.fillStyle = `rgba(${r},${g},${b},${.85 * a})`; fctx.fillRect(W / 2 - w / 2, H / 2 - 3, w, 6);
      fctx.globalAlpha = a; fctx.drawImage(se.sprite, W / 2 - 110, H / 2 - 110, 220, 220); fctx.globalAlpha = 1;
    };
    await rafLoop(half, p => glow(clamp((p - .55) / .45)));
    await finished(a1);
    from.style.opacity = 0; to.style.opacity = ''; layer(to, 2); reveal();
    const a2 = A(to, [{ transform: 'scale(0,.004)', filter: 'brightness(5)' },
      { transform: 'scale(1,.006)', filter: 'brightness(3)', offset: .3 },
      { transform: 'scale(1,1)', filter: 'brightness(1)' }], { duration: half, easing: ease.out });
    await rafLoop(half, p => glow(clamp(1 - p / .35)));
    fctx.clearRect(0, 0, W, H);
    await finished(a2);
    from.style.opacity = '';
  });

  /* ---------- trace: lines of an <svg> draw themselves, fills fade in after ---------- */
  se.build('trace', {
    make(item, { el, delay, out, A: anim }) {
      const strokes = [...el.querySelectorAll('path,line,polyline,polygon,circle,rect,ellipse')];
      anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
      strokes.forEach((s, i) => {
        let len = 0;
        try { len = s.getTotalLength(); } catch (e) { len = 0; }
        const hasStroke = getComputedStyle(s).stroke !== 'none';
        if (hasStroke && len > 0) {
          out.push(s.animate([{ strokeDasharray: `${len} ${len}`, strokeDashoffset: len },
            { strokeDasharray: `${len} ${len}`, strokeDashoffset: 0 }],
            { duration: 500 + Math.min(1100, len * .6), delay: delay + 120 + i * 45, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' }));
        }
        const fill = getComputedStyle(s).fill;
        if (fill && fill !== 'none' && !/rgba\(0, 0, 0, 0\)/.test(fill)) {
          out.push(s.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 400, delay: delay + 500 + i * 45, fill: 'both' }));
        }
      });
      el.querySelectorAll('text').forEach((t, i) => out.push(t.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 400, delay: delay + 600 + i * 60, fill: 'both' })));
    }
  });

  /* ---------- ambient: graticule + two phosphor traces with afterglow ---------- */
  se.ambient('scope-grid', {
    init(slide, canvas) {
      const trail = document.createElement('canvas'); trail.width = W; trail.height = H;
      return { trail, tg: trail.getContext('2d'), x: 0 };
    },
    draw(g, st, t, dt, still) {
      const [r, gg, b] = se.rgb, div = 120, cx = W / 2, cy = H / 2;
      g.clearRect(0, 0, W, H);
      g.fillStyle = BG; g.fillRect(0, 0, W, H);
      g.strokeStyle = `rgba(${r},${gg},${b},.10)`; g.lineWidth = 2;
      for (let x = cx % div; x < W; x += div) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = cy % div; y < H; y += div) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      g.strokeStyle = `rgba(${r},${gg},${b},.22)`;
      g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.moveTo(cx, 0); g.lineTo(cx, H); g.stroke();
      // the traces: written by a beam that sweeps across, fading behind it (persistence)
      const tg = st.tg, speed = 520;
      const u = x => cy + Math.sin(x / 190 + t * .35) * 230;
      const i = x => cy + Math.sin(x / 190 + t * .35 - 1.05) * 150;
      if (still) {
        tg.clearRect(0, 0, W, H);
        for (const [f, a] of [[u, .5], [i, .35]]) { tg.strokeStyle = `rgba(${r},${gg},${b},${a})`; tg.lineWidth = 4; tg.beginPath(); for (let x = 0; x <= W; x += 8) x ? tg.lineTo(x, f(x)) : tg.moveTo(x, f(x)); tg.stroke(); }
      } else {
        tg.globalCompositeOperation = 'destination-out'; tg.fillStyle = `rgba(0,0,0,${clamp(dt * .9)})`; tg.fillRect(0, 0, W, H);
        tg.globalCompositeOperation = 'source-over';
        const x0 = st.x, x1 = st.x + speed * dt;
        for (const [f, a, w] of [[u, .7, 5], [i, .5, 4]]) {
          tg.strokeStyle = `rgba(${r},${gg},${b},${a})`; tg.lineWidth = w; tg.beginPath();
          for (let x = x0; x <= x1 + 1; x += 4) { const xx = x % W; if (x === x0 || xx < 4) tg.moveTo(xx, f(xx)); else tg.lineTo(xx, f(xx)); }
          tg.stroke();
        }
        st.x = x1 % W;
        g.globalAlpha = .9; g.drawImage(se.sprite, st.x - 40, u(st.x) - 40, 80, 80); g.drawImage(se.sprite, st.x - 30, i(st.x) - 30, 60, 60); g.globalAlpha = 1;
      }
      g.drawImage(st.trail, 0, 0);
    }
  });
} });
