// --- STARFIELD BACKGROUND ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 150;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.2,
    });
  }
}

function drawStars(mouse) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let star of stars) {
    const dx = star.x - mouse.x;
    const dy = star.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(0, 150 - dist) / 150;

    star.x += (dx / dist) * force * 5;
    star.y += (dy / dist) * force * 5;

    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

let mouse = { x: -1000, y: -1000 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  drawStars(mouse);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars();
});

resizeCanvas();
createStars();
animate();
