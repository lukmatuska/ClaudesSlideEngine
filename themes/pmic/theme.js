/* PMIC theme for Claude's Slide Engine: the look of a power-management talk (switching converters, supply rails).
   Transitions pwm-wipe (a PWM pulse train: bars whose duty cycle sweeps from 0 to 100 % cover the screen) and
   rail-sweep (supply rails power up one after another, a staircase like a power sequencer) · effect ripple (the
   element settles like a converter output after a load step: damped ringing, with a ring of ripples) ·
   ambient "rails" (faint PCB traces with pulses running along them) · data-dots="rails-dots" (the progress dots
   become a staircase of rising supply rails). Everything glows in the accent colour (data-accent).
   data-pmic-bg="#0b1f17" on <body> = the colour the wipes fill the screen with.
   Link it before engine.js:  <script src="themes/pmic/theme.js" defer></script>  Docs: README.md next to this file. */
(window.slideEngineThemes = window.slideEngineThemes || []).push({ name: 'pmic', setup(se) {
  const { W, H, fctx, sprite, clamp, sstep, layer, rafLoop, helper, sampled, ease } = se;
  const BG = se.body.dataset.pmicBg || '#0b1f17';

  /* ---------- pwm-wipe: a bar chart of duty cycles; each stripe is a PWM period whose "on" part grows to 100 % ---------- */
  se.transition('pwm-wipe', async (from, to, dir, reveal) => {
    const S = 60, n = Math.ceil(W / S);
    layer(from, 2);
    let swapped = false;
    await rafLoop(se.simple ? 600 : 1700, p => {
      fctx.clearRect(0, 0, W, H);
      const first = p < .5, q = first ? p / .5 : (p - .5) / .5;
      if (!first && !swapped) { swapped = true; from.classList.remove('se-on'); layer(to, 2); reveal(); }
      for (let i = 0; i < n; i++) {
        const x0 = i * S, order = dir > 0 ? x0 / W : 1 - (x0 + S) / W;      // the pulse train starts at the left (right when going back)
        const duty = sstep(clamp(q * 1.5 - order * .5));
        const w = (first ? duty : 1 - duty) * S;
        if (w < .5) continue;
        fctx.globalAlpha = 1; fctx.fillStyle = BG; fctx.fillRect(x0, 0, w + 1, H);
        if (w < S - 1) { fctx.fillStyle = se.ACCENT; fctx.globalAlpha = .9; fctx.fillRect(x0 + w - 4, 0, 4, H); }   // the rising edge
      }
      fctx.globalAlpha = 1;
    });
    fctx.clearRect(0, 0, W, H);
  });

  /* ---------- rail-sweep: twelve rails power up in sequence (like a PMIC sequencer), cover the screen, then switch off in the same order ---------- */
  se.transition('rail-sweep', async (from, to, dir, reveal) => {
    const N = 12, h = H / N;
    layer(from, 2);
    let swapped = false;
    await rafLoop(se.simple ? 600 : 1900, p => {
      fctx.clearRect(0, 0, W, H);
      const first = p < .5, q = first ? p / .5 : (p - .5) / .5;
      if (!first && !swapped) { swapped = true; from.classList.remove('se-on'); layer(to, 2); reveal(); }
      for (let k = 0; k < N; k++) {
        const lane = dir > 0 ? k : N - 1 - k;
        const f = sstep(clamp((q * 1.6 - lane * .055) / .6));                       // each rail starts a little after the previous one
        if (f < .002) continue;
        const y = k * h;
        fctx.globalAlpha = 1; fctx.fillStyle = BG;
        if (first) { fctx.fillRect(0, y, W * f, h + 1); } else { fctx.fillRect(W * f, y, W - W * f, h + 1); }
        const ex = W * f;
        if (f < .999) {                                                             // the front of the rail: bright edge + a glow dot
          fctx.fillStyle = se.ACCENT; fctx.globalAlpha = .9; fctx.fillRect(ex - 4, y + h * .15, 4, h * .7);
          fctx.globalAlpha = .8; fctx.drawImage(sprite, ex - h * .7, y + h * .5 - h * .7, h * 1.4, h * 1.4);
        }
      }
      fctx.globalAlpha = 1;
    });
    fctx.clearRect(0, 0, W, H);
  });

  /* ---------- ripple: the element settles like a rail after a load step (damped ringing), with a ring of ripples ---------- */
  se.build('ripple', { measure: true, nested: true, count: true, make(item, { el, delay, out, A }) {
    const g = item.geo, dur = 1500, amp = Math.min(60, g.h * .35);
    const y = t => { const u = t / dur; return -amp * Math.exp(-4.2 * u) * Math.cos(u * 17); };
    el._se.countDelay = delay + 250;
    A(el, sampled(dur, t => ({ transform: `translateY(${y(t)}px)`, opacity: Math.min(1, t / 160) }), 60), { duration: dur, easing: 'linear' });
    for (let i = 0; i < 3; i++) {
      const r = helper('se-ripple', '', { left: (g.x + g.w / 2 - 40) + 'px', top: (g.y + g.h / 2 - 40) + 'px', width: '80px', height: '80px',
        borderRadius: '50%', border: '3px solid var(--se-accent)', zIndex: 5, pointerEvents: 'none' });
      g.slide.appendChild(r);
      const sc = Math.max(g.w, g.h) / 80 * (1.1 + i * .25);
      out.push(r.animate([{ opacity: 0, transform: 'scale(.2)' }, { opacity: .8, transform: 'scale(.4)', offset: .15 }, { opacity: 0, transform: `scale(${sc})` }],
        { duration: 1300, delay: delay + 120 + i * 170, easing: ease.out, fill: 'both' }));
    }
  } });

  /* ---------- data-dots="rails-dots": the progress is a staircase of supply rails coming up ---------- */
  se.dots('rails-dots', { init(dots) {
    dots.classList.add('se-rails-dots');
    const bars = dots.querySelectorAll('i'), n = bars.length;
    bars.forEach((b, i) => { b.style.height = (8 + (i / Math.max(1, n - 1)) * 26) + 'px'; });
  } });
  se.css(`
#se-dots.se-rails-dots { align-items: flex-end; gap: 6px; }
#se-dots.se-rails-dots i { width: 12px; border-radius: 2px; background: var(--se-accent-a35); transform: none; }
#se-dots.se-rails-dots i.seen { background: var(--se-accent-a75); }
#se-dots.se-rails-dots i.cur { background: var(--se-accent-light); box-shadow: 0 0 10px 3px var(--se-accent-a90), 0 0 26px 8px var(--se-accent-a50); transform: none; }
`);

  /* ---------- ambient "rails": faint PCB traces (horizontal runs with 45 degree jogs) and pulses running along them ---------- */
  se.ambient('rails', {
    init() {
      const traces = [], lanes = 14;
      for (let k = 0; k < lanes; k++) {
        let y = 50 + k * ((H - 100) / (lanes - 1)), x = -40; const pts = [[x, y]];
        while (x < W + 40) {
          x += 160 + Math.random() * 300; pts.push([x, y]);
          if (Math.random() < .55) { const d = (Math.random() < .5 ? -1 : 1) * (40 + Math.random() * 60); x += Math.abs(d); y += d; pts.push([x, y]); y = Math.max(30, Math.min(H - 30, y)); }
        }
        let len = 0; const segs = [];
        for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); len += l; }
        traces.push({ pts, segs, len, speed: 90 + Math.random() * 160, ph: Math.random() * len, pad: Math.random() < .5 });
      }
      return { traces };
    },
    draw(g, st, t, dt, still) {
      g.clearRect(0, 0, W, H);
      g.lineWidth = 3; g.lineJoin = 'round'; g.strokeStyle = se.rgba(se.rgb, .09);
      for (const tr of st.traces) {
        g.beginPath(); tr.pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
        const [px, py] = tr.pts[Math.floor(tr.pts.length / 2)];
        if (tr.pad) { g.beginPath(); g.arc(px, py, 7, 0, 6.283); g.stroke(); }
        const pos = ((tr.ph + (still ? 0 : t * tr.speed)) % tr.len + tr.len) % tr.len;
        for (let k = 0; k < 3; k++) {                                              // a short pulse train
          let d = (pos - k * 70 + tr.len) % tr.len, i = 0;
          while (i < tr.segs.length && d > tr.segs[i]) { d -= tr.segs[i]; i++; }
          const a = tr.pts[i], b = tr.pts[i + 1] || a, f = tr.segs[i] ? d / tr.segs[i] : 0;
          g.globalAlpha = .55 - k * .17; g.drawImage(sprite, a[0] + (b[0] - a[0]) * f - 14, a[1] + (b[1] - a[1]) * f - 14, 28, 28);
        }
        g.globalAlpha = 1;
      }
    }
  });
} });
