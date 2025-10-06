// === CONTACT PANEL ===
const contactBtn = document.getElementById('contactBtn');
const contactPanel = document.getElementById('contactPanel');
contactBtn.addEventListener('click', () => {
  contactPanel.style.display = contactPanel.style.display === 'block' ? 'none' : 'block';
});

// === SMOOTH SCROLL ===
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// === BURGER MENU ===
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// === BACKGROUND PARTICLES ===
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8
    });
  }
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, w, h);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#b30b3b";
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;
  });
  requestAnimationFrame(draw);
}
window.addEventListener("resize", resize);
resize();
draw();

// === MY WORK PREVIEW ===
const previewBox = document.getElementById("previewBox");
const previewText = document.getElementById("previewText");

document.querySelectorAll(".projects li").forEach(li => {
  li.addEventListener("mouseenter", (e) => {
    const text = li.getAttribute("data-preview");
    previewText.textContent = text;
    previewBox.classList.remove("hidden");
  });
  li.addEventListener("mousemove", (e) => {
    previewBox.style.left = e.pageX + 15 + "px";
    previewBox.style.top = e.pageY + 15 + "px";
  });
  li.addEventListener("mouseleave", () => {
    previewBox.classList.add("hidden");
  });
});
// Smooth scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Contact toggle
const contactBtn = document.getElementById('contactBtn');
const contactPanel = document.getElementById('contactPanel');

contactBtn.addEventListener('click', () => {
  contactPanel.style.display = contactPanel.style.display === 'block' ? 'none' : 'block';
});

// Music toggle
const musicFrame = document.getElementById('musicFrame');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = true;

musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    musicFrame.src = "";
    musicToggle.textContent = "▶️ Music";
  } else {
    musicFrame.src = "https://www.youtube.com/embed/2vjPBrBU-TM?autoplay=1&loop=1";
    musicToggle.textContent = "⏸️ Music";
  }
  isPlaying = !isPlaying;
});

