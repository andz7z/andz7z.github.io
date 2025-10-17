const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width, height;
let time = 0;
const mouse = { x: 0.5, y: 0.5 };

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX / width;
  mouse.y = e.clientY / height;
});

function draw() {
  time += 0.01;
  ctx.clearRect(0, 0, width, height);

  // fundal de bază negru-violet
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0a0015");
  gradient.addColorStop(1, "#1a0035");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // efect "lichid" violet în mișcare
  for (let i = 0; i < 12; i++) {
    const angle = time * 0.6 + i;
    const x = width / 2 + Math.cos(angle + mouse.x * 2) * 400 * Math.sin(time * 0.5);
    const y = height / 2 + Math.sin(angle * 1.2 + mouse.y * 2) * 250 * Math.cos(time * 0.4);
    const radius = 250 + 80 * Math.sin(time * 1.5 + i);

    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(180, 0, 255, 0.15)`);
    g.addColorStop(0.5, `rgba(100, 0, 180, 0.08)`);
    g.addColorStop(1, `transparent`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // strat de glow eteric
  const glow = ctx.createRadialGradient(
    width * mouse.x,
    height * mouse.y,
    100,
    width / 2,
    height / 2,
    width * 0.8
  );
  glow.addColorStop(0, "rgba(200,0,255,0.25)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  requestAnimationFrame(draw);
}
draw();
