/* === Loader fade out === */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("mainScene").style.opacity = "1";
    }, 1500);
  }, 3000);
});

/* === Text setup === */
const sloganEl = document.getElementById("slogan");
const words = ["CONCEPT.", "BUILD.", "LEAD."];
sloganEl.innerHTML = words.map(w => `<span>${w}</span>`).join("");

/* === Mouse parallax rotation === */
const slogan = document.querySelector('.slogan');
document.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX - innerWidth / 2) / innerWidth * 30;
  const y = (e.clientY - innerHeight / 2) / innerHeight * 30;
  slogan.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
});
document.addEventListener('mouseleave', () => {
  slogan.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

/* === Stars Background === */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({length: 150}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 2,
    twinkle: Math.random(),
  }));
}
resize();
window.addEventListener('resize', resize);

let mouse = {x: w/2, y: h/2};

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => {
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 150) {
      s.x += dx / dist * 0.5;
      s.y += dy / dist * 0.5;
    }
    s.twinkle += 0.02;
    const brightness = (Math.sin(s.twinkle) + 1) / 2;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + brightness * 0.7})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
