// ===== LOADING TRANSITION =====
setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  loader.classList.add('fade-out');
  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelector('.mainpage').classList.add('active');
  }, 800);
}, 3000);

// ===== DISTORTION / WAVE EFFECT =====
const canvas = document.getElementById("distortion");
const ctx = canvas.getContext("2d");
let w, h;
let t = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function drawWave() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#050005";
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "rgba(100,0,255,0.05)");
  grad.addColorStop(1, "rgba(150,0,255,0.1)");
  ctx.fillStyle = grad;

  const waveHeight = 40;
  const waveLength = 0.015;
  const waveSpeed = 0.03;

  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const y =
      h / 2 +
      Math.sin(x * waveLength + t) * waveHeight * Math.sin(t * 0.5) +
      Math.cos(x * waveLength * 0.8 + t * 1.2) * waveHeight * 0.5;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  t += waveSpeed;
  requestAnimationFrame(drawWave);
}
drawWave();

// ===== REACTIVE LIGHT =====
document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  document.body.style.background = `
    radial-gradient(circle at ${x}px ${y}px, rgba(150,0,255,0.15), transparent 60%),
    radial-gradient(circle at 50% 50%, #0a0015, #000 90%)`;
});
