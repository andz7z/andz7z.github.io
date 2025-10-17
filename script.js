// STARFIELD WITH SUBTLE MOTION + PURPLE TWINKLE

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 200;

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
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      twinkleSpeed: Math.random() * 0.05 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let star of stars) {
    // move slowly
    star.x += star.speedX;
    star.y += star.speedY;

    // wrap around edges
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    // twinkle movement
    star.twinklePhase += star.twinkleSpeed;
    const twinkle = (Math.sin(star.twinklePhase) + 1) / 2; // 0 → 1

    // subtle purple glow
    const baseColor = 200 + twinkle * 55;
    ctx.fillStyle = `rgba(${baseColor}, ${180 + twinkle * 40}, 255, ${0.4 + twinkle * 0.6})`;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function animate() {
  drawStars();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars();
});

resizeCanvas();
createStars();
animate();
