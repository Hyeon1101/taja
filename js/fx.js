/* Ink burst on click / tap — black-and-white splash */
(() => {
  const canvas = document.getElementById("ink-burst");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  const dots = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burst(x, y, power) {
    const n = power || 18;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const sp = 2.2 + Math.random() * 5.5;
      dots.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: 1.2 + Math.random() * 3.4,
        life: 1,
        fade: 0.018 + Math.random() * 0.02,
        ink: Math.random() > 0.35 ? 1 : 0
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (let i = dots.length - 1; i >= 0; i--) {
      const p = dots[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= p.fade;
      if (p.life <= 0) {
        dots.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.ink
        ? `rgba(245,245,245,${0.75 * p.life})`
        : `rgba(20,20,20,${0.55 * p.life})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("pointerdown", (e) => {
    burst(e.clientX, e.clientY, 22);
  }, { passive: true });

  resize();
  tick();
  window.inkBurst = burst;
})();
