const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width, height;
let time = 0;
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let trail = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Efect principal
function draw() {
  time += 0.015;

  // fundal negru transparent pentru efect de dâră lungă
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, width, height);

  // adaugă poziția actuală a mouse-ului în trail
  trail.push({ x: mouse.x, y: mouse.y, t: time });
  if (trail.length > 80) trail.shift();

  // creează efectul de "aura trail"
  for (let i = 0; i < trail.length; i++) {
    const p = trail[i];
    const dist = (i / trail.length);
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 400 * dist + 100);
    glow.addColorStop(0, `rgba(180, 0, 255, ${0.25 * (1 - dist)})`);
    glow.addColorStop(0.4, `rgba(120, 0, 220, ${0.15 * (1 - dist)})`);
    glow.addColorStop(1, "transparent");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 300 * dist + 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // adaugă mișcare fluidă și distorsionată în fundal
  for (let i = 0; i < 10; i++) {
    const angle = time * 0.3 + i;
    const x = width / 2 + Math.cos(angle * 1.3) * 600 * Math.sin(time * 0.4 + i);
    const y = height / 2 + Math.sin(angle * 1.7) * 400 * Math.cos(time * 0.6 + i);
    const radius = 300 + 100 * Math.sin(time + i);

    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(140, 0, 255, 0.06)`);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // efect de highlight central în funcție de mișcare
  const mid = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 400);
  mid.addColorStop(0, "rgba(220,0,255,0.25)");
  mid.addColorStop(0.5, "rgba(80,0,180,0.05)");
  mid.addColorStop(1, "transparent");
  ctx.fillStyle = mid;
  ctx.fillRect(0, 0, width, height);

  requestAnimationFrame(draw);
}

draw();
