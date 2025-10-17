// Loader fade out
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main-content");
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.filter = "blur(20px)";
    setTimeout(() => {
      loader.style.display = "none";
      main.classList.remove("hidden");
      showText();
    }, 1000);
  }, 3000);
});

// Animate slogan words
function showText() {
  const lines = document.querySelectorAll(".slogan h1");
  lines.forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), i * 800);
  });
}

// Stars background
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [], w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({length: 200}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    blink: Math.random()
  }));
}
window.addEventListener("resize", resize);
resize();

canvas.addEventListener("mousemove", e => {
  const mx = e.clientX, my = e.clientY;
  stars.forEach(s => {
    let dx = s.x - mx, dy = s.y - my, dist = Math.sqrt(dx*dx+dy*dy);
    if (dist < 100) {
      s.x += dx / dist * 0.5;
      s.y += dy / dist * 0.5;
    }
  });
});

function animateStars() {
  ctx.clearRect(0,0,w,h);
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0 || s.x > w) s.dx *= -1;
    if (s.y < 0 || s.y > h) s.dy *= -1;
    s.blink += (Math.random() - 0.5) * 0.02;
    const intensity = 0.7 + 0.3 * Math.sin(s.blink * Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${intensity})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}
animateStars();
