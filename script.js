const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 120;
const mouse = { x: width/2, y: height/2, trail: [] };

// Utilitar
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Particule
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = random(1, 3);
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
    this.alpha = random(0.1, 0.7);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
  }

  draw() {
    ctx.fillStyle = `rgba(123, 63, 228, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
for(let i=0; i<maxParticles; i++) {
  particles.push(new Particle());
}

// Mouse tracking
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.trail.push({x: e.clientX, y: e.clientY, alpha: 1});
  if(mouse.trail.length > 20) mouse.trail.shift();
});

// Animate
function animate() {
  // Gradient background animat
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  const time = Date.now() * 0.0003;
  gradient.addColorStop(0, `hsl(${200 + 50*Math.sin(time)}, 20%, 5%)`);
  gradient.addColorStop(1, `hsl(${280 + 50*Math.cos(time)}, 30%, 8%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw mouse trail
  for(let i = 0; i < mouse.trail.length; i++) {
    const t = mouse.trail[i];
    ctx.beginPath();
    ctx.arc(t.x, t.y, (i+1)*2, 0, Math.PI*2);
    ctx.fillStyle = `rgba(123,63,228,${t.alpha*0.3})`;
    ctx.fill();
    t.alpha -= 0.03;
  }

  // Glow radial around cursor
  const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
  glow.addColorStop(0, 'rgba(123,63,228,0.15)');
  glow.addColorStop(1, 'rgba(123,63,228,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Random sparkles
  if(Math.random() < 0.02) {
    const sparkle = new Particle();
    sparkle.x = random(0, width);
    sparkle.y = random(0, height);
    sparkle.size = random(1.5,3);
    sparkle.alpha = 1;
    particles.push(sparkle);
    if(particles.length > maxParticles) particles.shift();
  }

  requestAnimationFrame(animate);
}

animate();

// Resize canvas
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
