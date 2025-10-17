// Intro dispare după 3 secunde
setTimeout(() => {
  document.getElementById("intro").style.display = "none";
}, 3000);

// Canvas setup pentru efect de stele
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let w, h, mouse = { x: 0, y: 0 };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3
  }));
}
window.addEventListener("resize", resize);
resize();

canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "white";

  stars.forEach(star => {
    const dx = mouse.x - star.x;
    const dy = mouse.y - star.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Stelele "fug" ușor de mouse
    if (dist < 100) {
      star.x -= dx * 0.02;
      star.y -= dy * 0.02;
    }

    star.x += star.vx;
    star.y += star.vy;

    // Reapariție margini
    if (star.x < 0) star.x = w;
    if (star.x > w) star.x = 0;
    if (star.y < 0) star.y = h;
    if (star.y > h) star.y = 0;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();
