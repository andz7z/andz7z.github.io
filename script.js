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
    }, 900);
  }, 3000);
});

// --- Interactive Polygonal Grid ---
(() => {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, points = [];
  const spacing = 80;
  let mouse = { x: 0, y: 0 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    points = [];
    for (let y = 0; y <= h; y += spacing) {
      for (let x = 0; x <= w; x += spacing) {
        points.push({ x, y, ox: x, oy: y });
      }
    }
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(138,91,255,0.2)";
    ctx.lineWidth = 1.2;

    // move points based on mouse proximity
    for (let p of points) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const influence = Math.max(0, 150 - dist) / 150;
      p.x = p.ox + dx * 0.02 - dx * influence * 0.3;
      p.y = p.oy + dy * 0.02 - dy * influence * 0.3;
    }

    // draw grid lines
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const right = points.find(q => q.oy === p.oy && q.ox === p.ox + spacing);
      const down = points.find(q => q.ox === p.ox && q.oy === p.oy + spacing);
      if (right) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(right.x, right.y);
      }
      if (down) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(down.x, down.y);
      }
    }
    ctx.stroke();

    // glow points
    for (let p of points) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const glow = Math.max(0, 1 - dist / 200);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5 + glow * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(138,91,255,${0.4 + glow * 0.6})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// Cursor logic (same)
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
