// Efect de reflexie care urmărește mișcarea mouse-ului
document.addEventListener("mousemove", (e) => {
  const text = document.getElementById("metallicText");
  const { innerWidth, innerHeight } = window;
  const xPercent = (e.clientX / innerWidth) * 100;
  const yPercent = (e.clientY / innerHeight) * 100;

  // modificăm unghiul reflexiei în funcție de poziția mouse-ului
  text.style.background = `linear-gradient(${xPercent + 90}deg, #ffffff 0%, #c0c0c0 25%, #8a8a8a 50%, #c0c0c0 75%, #ffffff 100%)`;
});
