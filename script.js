// ================= LOADER =================
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hide');
  }, 3000); // loader 3 sec
});

// ================= PARTICULE + AURA =================
const canvas = document.querySelector('.particles');
const ctx = canvas.getContext('2d');
const aura = document.querySelector('.aura');

let particles = [];
const numParticles = 50;

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.3;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    hue: 270 + Math.random() * 40
  });
}

let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 40;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 40;
  aura.style.transform = `translate(${xPercent/3}px, ${yPercent/3}px) scale(1.1)`;
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    p.x += p.speedX;
    p.y += p.speedY;

    const dx = (mouse.x - (canvas.width*0.5)) * 0.002;
    const dy = (mouse.y - (canvas.height*0.5)) * 0.002;
    p.x += dx;
    p.y += dy;

    if(p.x<0) p.x = canvas.width;
    if(p.x>canvas.width) p.x = 0;
    if(p.y<0) p.y = canvas.height;
    if(p.y>canvas.height) p.y = 0;

    ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, 0.6)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
