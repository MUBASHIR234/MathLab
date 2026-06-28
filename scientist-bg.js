/* =========================================================
   MathLab — Play Zone Background
   Glowing scientist silhouettes + floating equations + particles
   Self-contained, draws onto #bgCanvas (same canvas id as bg.js,
   so include this INSTEAD OF bg.js on pages that want this theme).
   ========================================================= */

(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  function rand(min, max) { return Math.random() * (max - min) + min; }

  const GLOW_COLORS = ['#FF4D4D', '#FF6B35', '#E8336B'];

  /* ---------------------------------------------------------
     SILHOUETTES — simple iconic vector paths drawn with canvas,
     not photographs. Stylized busts that evoke each thinker
     through hair/shape rather than literal likeness.
  --------------------------------------------------------- */

  // Each silhouette is a function(ctx, size) drawing centered at (0,0),
  // scaled so the bust roughly fits a [-1,1] box, plus a short label.
  const SILHOUETTES = [
    { label: 'E = mc²', draw: drawEinstein },
    { label: 'F = ma', draw: drawNewton },
    { label: 'AC ⚡', draw: drawTesla },
    { label: 'λ = h/p', draw: drawGenericThinker }
  ];

  function drawEinstein(c, s) {
    c.beginPath();
    // head
    c.ellipse(0, -0.15 * s, 0.42 * s, 0.5 * s, 0, 0, Math.PI * 2);
    c.fill();
    // wild hair (a ring of little tufts around upper head)
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 1.5) * (i / 14) - Math.PI * 1.15;
      const tx = Math.cos(angle) * 0.46 * s;
      const ty = -0.15 * s + Math.sin(angle) * 0.5 * s;
      const tipx = Math.cos(angle) * (0.46 + 0.22) * s;
      const tipy = -0.15 * s + Math.sin(angle) * (0.5 + 0.22) * s;
      c.beginPath();
      c.moveTo(tx, ty);
      c.quadraticCurveTo(tipx + rand(-4, 4), tipy + rand(-4, 4), tipx * 0.96, tipy * 0.96);
      c.lineWidth = s * 0.045;
      c.stroke();
    }
    // mustache
    c.beginPath();
    c.ellipse(0, 0.18 * s, 0.22 * s, 0.05 * s, 0, 0, Math.PI * 2);
    c.fill();
    // shoulders/bust
    c.beginPath();
    c.moveTo(-0.55 * s, 0.95 * s);
    c.quadraticCurveTo(-0.5 * s, 0.4 * s, 0, 0.32 * s);
    c.quadraticCurveTo(0.5 * s, 0.4 * s, 0.55 * s, 0.95 * s);
    c.closePath();
    c.fill();
  }

  function drawNewton(c, s) {
    // wig silhouette: head + big curled side-wig shape + bust
    c.beginPath();
    c.ellipse(0, -0.1 * s, 0.34 * s, 0.42 * s, 0, 0, Math.PI * 2);
    c.fill();
    // wig — two big curl lobes either side, plus top
    c.beginPath();
    c.ellipse(-0.42 * s, 0.05 * s, 0.26 * s, 0.42 * s, 0.15, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(0.42 * s, 0.05 * s, 0.26 * s, 0.42 * s, -0.15, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(0, -0.42 * s, 0.4 * s, 0.22 * s, 0, 0, Math.PI * 2);
    c.fill();
    // bust
    c.beginPath();
    c.moveTo(-0.5 * s, 0.95 * s);
    c.quadraticCurveTo(-0.45 * s, 0.5 * s, 0, 0.42 * s);
    c.quadraticCurveTo(0.45 * s, 0.5 * s, 0.5 * s, 0.95 * s);
    c.closePath();
    c.fill();
    // a little falling apple to the side
    c.beginPath();
    c.arc(0.85 * s, -0.55 * s, 0.07 * s, 0, Math.PI * 2);
    c.fill();
  }

  function drawTesla(c, s) {
    // slick side-parted hair, sharper jaw, bust with a stylized "coil" collar
    c.beginPath();
    c.ellipse(0, -0.12 * s, 0.32 * s, 0.46 * s, 0, 0, Math.PI * 2);
    c.fill();
    // hair sweep
    c.beginPath();
    c.moveTo(-0.3 * s, -0.5 * s);
    c.quadraticCurveTo(0.05 * s, -0.66 * s, 0.34 * s, -0.4 * s);
    c.quadraticCurveTo(0.1 * s, -0.5 * s, -0.3 * s, -0.5 * s);
    c.closePath();
    c.fill();
    // bust
    c.beginPath();
    c.moveTo(-0.48 * s, 0.95 * s);
    c.quadraticCurveTo(-0.42 * s, 0.42 * s, 0, 0.36 * s);
    c.quadraticCurveTo(0.42 * s, 0.42 * s, 0.48 * s, 0.95 * s);
    c.closePath();
    c.fill();
    // coil rings beneath, evoking electricity/induction
    c.lineWidth = s * 0.035;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.ellipse(0, (0.55 + i * 0.13) * s, (0.3 + i * 0.05) * s, 0.05 * s, 0, 0, Math.PI * 2);
      c.stroke();
    }
  }

  function drawGenericThinker(c, s) {
    // round glasses + neat hair, generic "scholar" bust used for variety
    c.beginPath();
    c.ellipse(0, -0.1 * s, 0.36 * s, 0.46 * s, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(0, -0.5 * s, 0.36 * s, 0.2 * s, 0, Math.PI, 0);
    c.fill();
    // round glasses (drawn as negative space via stroke only)
    c.lineWidth = s * 0.035;
    c.beginPath();
    c.arc(-0.15 * s, -0.08 * s, 0.12 * s, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(0.15 * s, -0.08 * s, 0.12 * s, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(-0.03 * s, -0.08 * s);
    c.lineTo(0.03 * s, -0.08 * s);
    c.stroke();
    // bust
    c.beginPath();
    c.moveTo(-0.5 * s, 0.95 * s);
    c.quadraticCurveTo(-0.45 * s, 0.45 * s, 0, 0.38 * s);
    c.quadraticCurveTo(0.45 * s, 0.45 * s, 0.5 * s, 0.95 * s);
    c.closePath();
    c.fill();
  }

  /* ---------------------------------------------------------
     LAYOUT — place a few silhouettes softly in the background,
     mostly toward the edges so they don't fight page content.
  --------------------------------------------------------- */
  let busts = [];
  function layoutBusts() {
    const positions = [
      { xPct: 0.08, yPct: 0.22 },
      { xPct: 0.92, yPct: 0.30 },
      { xPct: 0.14, yPct: 0.82 },
      { xPct: 0.88, yPct: 0.86 }
    ];
    busts = positions.map((p, i) => {
      const sil = SILHOUETTES[i % SILHOUETTES.length];
      return {
        x: w * p.xPct,
        y: h * p.yPct,
        size: Math.min(w, h) * rand(0.085, 0.11),
        color: GLOW_COLORS[i % GLOW_COLORS.length],
        sil,
        phase: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.003, 0.006)
      };
    });
  }
  layoutBusts();

  /* ---------------------------------------------------------
     FLOATING EQUATIONS — same drifting-symbol approach as the
     site's main background, but using famous formulas.
  --------------------------------------------------------- */
  const EQUATIONS = [
    'E = mc²', 'F = ma', 'a² + b² = c²', 'F = G(m₁m₂)/r²',
    'v = u + at', 'PV = nRT', 'λ = h/p', 'e^(iπ) + 1 = 0',
    '∇ × E = -∂B/∂t', 'KE = ½mv²'
  ];

  const COUNT = Math.min(16, Math.max(8, Math.floor((window.innerWidth * window.innerHeight) / 70000)));

  function makeParticle() {
    return {
      x: rand(0, w),
      y: rand(0, h),
      text: EQUATIONS[Math.floor(Math.random() * EQUATIONS.length)],
      size: rand(15, 24),
      color: GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)],
      baseOpacity: rand(0.14, 0.28),
      driftX: rand(-0.08, 0.08),
      driftY: rand(-0.18, -0.04),
      phase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.004, 0.01)
    };
  }
  let particles = Array.from({ length: COUNT }, makeParticle);

  // tiny ambient dust particles for extra depth
  const DUST_COUNT = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 26000));
  function makeDust() {
    return {
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 1.8),
      color: GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)],
      baseOpacity: rand(0.15, 0.4),
      driftY: rand(-0.12, -0.02),
      phase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.025)
    };
  }
  let dust = Array.from({ length: DUST_COUNT }, makeDust);

  let mouseX = w / 2, mouseY = h / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // 1) Silhouettes (drawn first, furthest back)
    busts.forEach((b) => {
      b.phase += b.pulseSpeed;
      const glow = 0.16 + Math.sin(b.phase) * 0.05;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalAlpha = Math.max(0.08, Math.min(0.26, glow));
      ctx.fillStyle = b.color;
      ctx.strokeStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 26;
      b.sil.draw(ctx, b.size);
      ctx.restore();

      // label beneath, very faint
      ctx.save();
      ctx.globalAlpha = Math.max(0.05, Math.min(0.16, glow * 0.7));
      ctx.fillStyle = b.color;
      ctx.font = `600 ${Math.max(11, b.size * 0.16)}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(b.sil.label, b.x, b.y + b.size * 1.25);
      ctx.restore();
    });

    // 2) Floating equations
    particles.forEach((p) => {
      p.phase += p.pulseSpeed;
      const opacity = p.baseOpacity + Math.sin(p.phase) * 0.06;

      p.x += p.driftX;
      p.y += p.driftY;

      const dx = (mouseX - w / 2) * 0.003;
      const dy = (mouseY - h / 2) * 0.003;

      if (p.y < -30) { p.y = h + 30; p.x = rand(0, w); }
      if (p.x < -80) p.x = w + 80;
      if (p.x > w + 80) p.x = -80;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(0.34, opacity));
      ctx.font = `600 ${p.size}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fillText(p.text, p.x + dx, p.y + dy);
      ctx.restore();
    });

    // 3) Ambient dust/particles
    dust.forEach((d) => {
      d.phase += d.pulseSpeed;
      const opacity = d.baseOpacity + Math.sin(d.phase) * 0.15;
      d.y += d.driftY;
      if (d.y < -10) { d.y = h + 10; d.x = rand(0, w); }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(0.5, opacity));
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  let started = false;
  function startDraw() {
    if (started) return;
    started = true;
    draw();
  }

  if (reduceMotion) {
    particles.forEach(p => p.baseOpacity *= 0.6);
    busts.forEach(b => {});
    startDraw();
  } else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startDraw).catch(startDraw);
    setTimeout(startDraw, 400);
  } else {
    startDraw();
  }

  window.addEventListener('resize', () => {
    resize();
    layoutBusts();
    const newCount = Math.min(16, Math.max(8, Math.floor((window.innerWidth * window.innerHeight) / 70000)));
    particles = Array.from({ length: newCount }, makeParticle);
    const newDustCount = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 26000));
    dust = Array.from({ length: newDustCount }, makeDust);
  });
})();
