/* From Uiverse.io by dexter-st */
:root{
  --bg:#000;
  --text-dark:#0a0a0a;
  --accent-purple:#471eec;
  --accent-purple-dark:#311e80;
  --highlight-white:#ffffff;
  --slogan-color: #ffffff; /* Culoare de bază: Alb */
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{
  background:var(--bg);
  font-family: "Montserrat", "Inter", sans-serif;
  overflow:hidden;
  color:#fff;
  /* Activez perspective-ul pe body/app pentru animațiile 3D ale textului */
  perspective: 1000px;
}

/* Loader screen (Fără modificări) */
.loader-screen{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:var(--bg);
  z-index:50;
  transition:backdrop-filter 0.9s ease, opacity 0.9s ease;
}
.loader-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  font-family: "Inter", sans-serif;
  font-size: 1.2em;
  font-weight: 300;
  color: white;
  border-radius: 50%;
  background-color: transparent;
  user-select: none;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background-color: transparent;
  animation: loader-rotate 2s linear infinite;
  z-index: 0;
}

@keyframes loader-rotate {
  0% {
    transform: rotate(90deg);
    box-shadow:
      0 10px 20px 0 #fff inset,
      0 20px 30px 0 #ad5fff inset,
      0 60px 60px 0 #471eec inset;
  }
  50% {
    transform: rotate(270deg);
    box-shadow:
      0 10px 20px 0 #fff inset,
      0 20px 10px 0 #d60a47 inset,
      0 40px 60px 0 #311e80 inset;
  }
  100% {
    transform: rotate(450deg);
    box-shadow:
      0 10px 20px 0 #fff inset,
      0 20px 30px 0 #ad5fff inset,
      0 60px 60px 0 #471eec inset;
  }
}

.loader-letter {
  display: inline-block;
  opacity: 0.4;
  transform: translateY(0);
  animation: loader-letter-anim 2s infinite;
  z-index: 1;
  border-radius: 50ch;
  border: none;
  margin: 0 2px;
  font-weight:700;
  letter-spacing:2px;
}

.loader-letter:nth-child(1) { animation-delay: 0s; }
.loader-letter:nth-child(2) { animation-delay: 0.1s; }
.loader-letter:nth-child(3) { animation-delay: 0.2s; }
.loader-letter:nth-child(4) { animation-delay: 0.3s; }
.loader-letter:nth-child(5) { animation-delay: 0.4s; }
.loader-letter:nth-child(6) { animation-delay: 0.5s; }
.loader-letter:nth-child(7) { animation-delay: 0.6s; }
.loader-letter:nth-child(8) { animation-delay: 0.7s; }
.loader-letter:nth-child(9) { animation-delay: 0.8s }

@keyframes loader-letter-anim {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  20% { opacity: 1; transform: scale(1.12); }
  40% { opacity: 0.6; transform: translateY(0); }
}

/* Blur-out class */
.loader-screen.blur-out {
  opacity: 0;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

/* App */
.app{position:fixed;inset:0;overflow:hidden}
.app.hidden{display:none}

/* Canvas */
#starfield{position:absolute;inset:0;width:100%;height:100%;display:block;transform-style:preserve-3d;}

/* === HERO SECTION ȘI SLOGAN 3D === */
.hero {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 0 5%;
}

.hero-inner {
  display: flex;
  width: 100%;
  max-width: 1400px;
  align-items: center;
  justify-content: space-between;
}

.slogan-container {
  /* Aliniere stânga și pregătire 3D */
  text-align: left;
  transform-style: preserve-3d;
  perspective: 1000px;
  /* Setează o lățime maximă pentru a lăsa spațiu dreapta */
  max-width: 50%;
  padding-left: 20px;
}

.slogan-line {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(3.5rem, 8vw, 7.5rem); /* Responsive font size */
  font-weight: 900;
  line-height: 1.1;
  color: var(--slogan-color);
  
  /* Text Shadow / Glow alb-mov */
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.4), /* Glow alb */
    0 0 20px var(--accent-purple),    /* Glow mov */
    0 0 40px rgba(71, 30, 236, 0.7);
    
  /* Setări 3D */
  transform-style: preserve-3d;
  transform: rotateX(0deg) rotateY(0deg);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth transition */
  
  /* Efect de adâncime 3D (Text Stroke) */
  &::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    -webkit-text-stroke: 1px var(--accent-purple-dark); /* Contur mov */
    opacity: 0.8;
    /* Deplasare pe axa Z pentru a crea adâncimea */
    transform: translateZ(-5px); 
  }
}

/* Efect de hover pe container pentru a anima întregul text 3D */
.slogan-container:hover .slogan-line {
    transform: rotateX(5deg) rotateY(5deg) translateZ(10px);
}
.slogan-container:hover .slogan-line.line-1 { transform: rotateX(5deg) rotateY(5deg) translateZ(15px); }
.slogan-container:hover .slogan-line.line-2 { transform: rotateX(5deg) rotateY(5deg) translateZ(10px); }
.slogan-container:hover .slogan-line.line-3 { transform: rotateX(5deg) rotateY(5deg) translateZ(5px); }

.slogan-subtext {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.2rem, 2.5vw, 2.2rem);
  font-weight: 300;
  margin-top: 20px;
  color: #ffffff90;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
}

/* Placeholder pentru conținutul viitor din dreapta */
.right-content-placeholder {
  width: 45%;
  height: 50vh;
  /* Poți adăuga un fundal subtil aici pentru a vedea spațiul */
  /* background: rgba(71, 30, 236, 0.1); */
}

/* Responsive (Asigură o vizualizare bună pe mobil) */
@media (max-width: 900px) {
  .hero-inner {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  .slogan-container, .right-content-placeholder {
    max-width: 90%;
    width: 100%;
    text-align: center;
    padding-left: 0;
  }
  .slogan-line::before { -webkit-text-stroke: 0.5px var(--accent-purple-dark); }
}

/* Am eliminat stilurile .header-oval, .header-inner, .nav-btn, .brand-icon-gif */
