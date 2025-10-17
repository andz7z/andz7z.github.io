// Blur-out intro logic
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const main = document.getElementById("mainContent");

  setTimeout(() => {
    intro.classList.add("blur-out");
    setTimeout(() => {
      intro.remove();
      main.classList.remove("hidden");
      main.classList.add("reveal");
    }, 1000);
  }, 2000);
});

// --- Abstract Flow Grid ---
(() => {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, points = [];
  const COUNT = 180;
  let mouse = { x: 0, y: 0 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    points = [];
    for (let i = 0; i < COUNT; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 2 - 1,
        offset: Math.random() * 1000
      });
    }
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "rgba(138,91,255,0.35)");
    grad.addColorStop(1, "rgba(0,202,255,0.25)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.1;

    // Update points
    for (let p of points) {
      const n = Math.sin((t * 0.001 + p.offset) * 0.5);
      p.y += n * 0.15;
      p.x += Math.cos((t * 0.001 + p.offset) * 0.4) * 0.15;

      // wrap edges
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    }

    // Draw connecting lines (abstract network)
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = 0.2 - dist / 600;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(138,91,255,${alpha})`;
          ctx.stroke();
        }
      }
    }

    // Glow points
    for (let p of points) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - dist / 200);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4 + glow * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${138 - glow * 50}, ${91 + glow * 40}, 255, ${0.5 + glow * 0.5})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// Cursor logic
(() => {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("ring");
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pos = { x: mouse.x, y: mouse.y };
  let ringPos = { x: mouse.x, y: mouse.y };
  function lerp(a,b,t){return a+(b-a)*t}
  window.addEventListener("mousemove", (e)=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  function frame(){
    pos.x=lerp(pos.x,mouse.x,0.18);
    pos.y=lerp(pos.y,mouse.y,0.18);
    ringPos.x=lerp(ringPos.x,mouse.x,0.07);
    ringPos.y=lerp(ringPos.y,mouse.y,0.07);
    cursor.style.left=pos.x+'px';cursor.style.top=pos.y+'px';
    ring.style.left=ringPos.x+'px';ring.style.top=ringPos.y+'px';
    requestAnimationFrame(frame);
  }
  frame();
})();
