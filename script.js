// ---------- LOADER ---------- //
setTimeout(()=>{
  const loader = document.getElementById('loader');
  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";
  setTimeout(()=>{
    loader.style.display = "none";
    const main = document.getElementById('main');
    main.classList.remove("hidden");
    main.classList.add("visible");
  },1000);
},3000);

// ---------- STARS ---------- //
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let mouse = { x:0, y:0 };
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

for(let i=0;i<150;i++){
  stars.push({
    x: Math.random()*width,
    y: Math.random()*height,
    size: Math.random()*1.5,
    twinkle: Math.random()*100,
  });
}

canvas.addEventListener("mousemove",(e)=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawStars(){
  ctx.clearRect(0,0,width,height);
  for(let s of stars){
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist<120 && Math.random()<0.15){
      s.x += dx*0.015;
      s.y += dy*0.015;
    }
    s.twinkle += 0.05;
    const brightness = 0.5 + Math.sin(s.twinkle)*0.5;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${brightness})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

drawStars();
