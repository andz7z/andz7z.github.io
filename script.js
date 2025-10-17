// ====== INTRO TO MAIN TRANSITION ======
setTimeout(() => {
  document.querySelector('.loader-wrapper').classList.add('fade-out');
  setTimeout(() => {
    document.querySelector('.loader-wrapper').style.display = 'none';
    document.querySelector('.mainpage').classList.add('active');
  }, 800);
}, 3000);

// ====== REACTIVE BACKGROUND (nebuloasă mouse effect) ======
document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  document.body.style.background = `
    radial-gradient(circle at ${x}px ${y}px, rgba(180,0,255,0.15), transparent 60%),
    radial-gradient(circle at 80% 70%, #3b0066, transparent 70%),
    radial-gradient(circle at 20% 30%, #6a00ff, transparent 70%),
    #000`;
});
