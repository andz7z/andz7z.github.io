import LiquidEther from './LiquidEther.js';

// ===== INTRO TRANSITION =====
window.addEventListener("load", () => {
  const mainMenu = document.getElementById("mainMenu");
  const sound = document.getElementById("introSound");

  setTimeout(() => {
    // Redă sunetul
    sound.play().catch(err => console.log("Audio blocked:", err));

    // Afișează meniul
    mainMenu.classList.add("visible");

    // Pornește fundalul LiquidEther
    new LiquidEther({
      parent: document.getElementById("liquid-bg"),
      colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
      mouseForce: 20,
      cursorSize: 100,
      isViscous: false,
      viscous: 30,
      iterationsViscous: 32,
      iterationsPoisson: 32,
      resolution: 0.5,
      isBounce: false,
      autoDemo: true,
      autoSpeed: 0.5,
      autoIntensity: 2.2,
      takeoverDuration: 0.25,
      autoResumeDelay: 3000,
      autoRampDuration: 0.6
    });
  }, 2000);
});
