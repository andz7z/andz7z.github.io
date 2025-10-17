const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let width, height, time = 0;
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

function drawNoise() {
  const imageData = ctx.createImageData(width, height);
  const buffer = new Uint32Array(imageData.data.buffer);
  const base = Math.floor(255 * Math.abs(Math.sin(time * 0.1)));
  for (let i = 0; i < buffer.length; i++) {
    const noise = Math.random() * 50;
    buffer[i] =
      (255 << 24) | // alpha
      ((base + noise) << 16) |
      ((base * 0.2 + noise) << 8) |
      (base + noise);
  }
  ctx.putImageData(imageData, 0, 0);
}

function drawEther() {
  time += 0.005;
  ctx.clearRect(0, 0, width, height);

  // Gradient central care urmează mouse-ul
  const gradient = ctx.createRadialGradient(
    width * mouse.x,
    height * mouse.y,
    100,
    width / 2,
    height / 2,
    width * 0.8
  );
  gradient.addColorStop(0, `hsl(${280 + Math.sin(time) * 20}, 90%, 65%)`);
  gradient.addColorStop(0.5, `hsl(${260 + Math.cos(time * 2) * 20}, 70%, 25%)`);
  gradient.addColorStop(1, "#000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Efect lichid - cercuri în mișcare lentă
  for (let i = 0; i < 25; i++) {
    const angle = i * Math.PI * 0.25 + time * 0.8;
    const x = width / 2 + Math.cos(angle) * (300 + 50 * Math.sin(time + i));
    const y = height / 2 + Math.sin(angle * 1.5) * (250 + 40 * Math.cos(time + i));
    const r = 150 + 40 * Math.sin(time + i);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(160, 0, 255, 0.15)`);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Noise subtil peste tot
  ctx.globalAlpha = 0.04;
  drawNoise();
  ctx.globalAlpha = 1;

  requestAnimationFrame(drawEther);
}
drawEther();
