/* =========================================================
   MathLab — Live Wallpaper Background
   Floating math symbols & equations, canvas-based, performant
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
  window.addEventListener('resize', resize);

  const SYMBOLS = ['π','√x','∑','∫','x²','Δ','∞','θ','÷','×','αβ','f(x)','½','³√','≈','≠','sin θ','log','x³','y=mx+c'];
  const COLORS = ['#4FD1E8', '#8B7FE0', '#F2A93B', '#EDEFF5'];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  const COUNT = Math.min(46, Math.max(18, Math.floor((window.innerWidth * window.innerHeight) / 24000)));

  function makeParticle() {
    return {
      x: rand(0, w),
      y: rand(0, h),
      sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      size: rand(22, 52),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      baseOpacity: rand(0.18, 0.38),
      driftX: rand(-0.1, 0.1),
      driftY: rand(-0.22, -0.05),
      phase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.004, 0.012)
    };
  }

  let particles = Array.from({ length: COUNT }, makeParticle);

  let mouseX = w / 2, mouseY = h / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      t += 0;
      p.phase += p.pulseSpeed;
      const opacity = p.baseOpacity + Math.sin(p.phase) * 0.05;

      // gentle drift
      p.x += p.driftX;
      p.y += p.driftY;

      // parallax toward mouse, very subtle
      const dx = (mouseX - w / 2) * 0.004;
      const dy = (mouseY - h / 2) * 0.004;

      if (p.y < -40) { p.y = h + 40; p.x = rand(0, w); }
      if (p.x < -60) p.x = w + 60;
      if (p.x > w + 60) p.x = -60;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(0.42, opacity));
      ctx.font = `600 ${p.size}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14;
      ctx.fillText(p.sym, p.x + dx, p.y + dy);
      ctx.restore();
    });

    if (!reduceMotion) {
      requestAnimationFrame(draw);
    }
  }

  let started = false;
  function startDraw() {
    if (started) return;
    started = true;
    draw();
  }

  if (reduceMotion) {
    // Draw a single static, very faint frame and stop.
    particles.forEach(p => p.baseOpacity *= 0.6);
    startDraw();
  } else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startDraw).catch(startDraw);
    // Fallback in case fonts.ready hangs
    setTimeout(startDraw, 400);
  } else {
    startDraw();
  }

  function rebuild() {
    const newCount = Math.min(34, Math.floor((window.innerWidth * window.innerHeight) / 38000));
    particles = Array.from({ length: newCount }, makeParticle);
  }
  window.addEventListener('resize', () => {
    resize();
    rebuild();
  });
})();
