// Fade out intro & fade in main
setTimeout(() => {
  document.querySelector(".loader-wrapper").style.filter = "blur(15px)";
  document.querySelector(".loader-wrapper").style.opacity = "0";
  setTimeout(() => {
    document.querySelector(".loader-wrapper").style.display = "none";
    document.querySelector(".main").classList.remove("hidden");
    document.querySelector(".main").classList.add("visible");
  }, 1000);
}, 3000);

// ----- STARFIELD -----
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let mouse = { x: 0, y: 0 };
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Creează stelele
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.5,
    twinkle: Math.random() * 100,
  });
}

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // doar stelele apropiate se "mișcă"
    if (dist < 120 && Math.random() < 0.15) {
      s.x += dx * 0.015;
      s.y += dy * 0.015;
    }

    s.twinkle += 0.05;
    const brightness = 0.5 + Math.sin(s.twinkle) * 0.5;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

drawStars();
