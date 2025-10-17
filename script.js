// Blur intro out
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const main = document.getElementById("mainContent");
  setTimeout(() => {
    intro.classList.add("blur-out");
    setTimeout(() => {
      intro.remove();
      main.classList.remove("hidden");
      main.classList.add("reveal");
    }, 900);
  }, 2000);
});

// --- Cosmic Network (3D depth + dense connections) ---
(() => {
  const canvas = document.getElementById("universe");
  const ctx = canvas.getContext("2d");
  let w, h;
  let stars = [];
  let depth = 0;
  const COUNT = 250;
  let mouse = { x: 0, y: 0 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * 0.9 + 0.1,
        offset: Math.random() * 2000
      });
    }
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX / w - 0.5;
    mouse.y = e.clientY / h - 0.5;
  });

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);

    for (let s of stars) {
      const zDepth = s.z * (1 + Math.sin(t * 0.0005 + s.offset) * 0.15);
      const px = s.x * (1 + mouse.x * 0.8 * zDepth);
      const py = s.y * (1 + mouse.y * 0.8 * zDepth);

      const size = (1 - zDepth) * 3 + 0.6;
      const alpha = 0.3 + (1 - zDepth) * 0.7;

      // Linii de conexiune
      for (let s2 of stars) {
        const dx = px - s2.x;
        const dy = py - s2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 140 * (1 + zDepth)) {
          const a = 0.05 + (1 - dist / 140) * 0.15;
          ctx.strokeStyle = `rgba(138,91,255,${a})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(s2.x, s2.y);
          ctx.stroke();
        }
      }

      // Punct luminos
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, size * 6);
      gradient.addColorStop(0, `rgba(138,91,255,${alpha})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// --- Glow Trail Cursor (linie stelară) ---
(() => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  let w, h;
  const trail = [];
  const maxTrail = 20;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > maxTrail) trail.shift();
  });

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      p.life -= 0.03;
      if (p.life <= 0) continue;
      const alpha = p.life;
      const size = 10 * alpha + 3;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
      grad.addColorStop(0, `rgba(138,91,255,${alpha})`);
      grad.addColorStop(0.5, `rgba(0,202,255,${alpha * 0.7})`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
