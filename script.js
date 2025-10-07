// === MUSIC CONTROL ===
const bgMusic = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volumeControl");
bgMusic.volume = 0.5;

volumeControl.addEventListener("input", () => {
  bgMusic.volume = volumeControl.value;
});

// === CLICK SOUND ===
const clickSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

// === MENU LOGIC ===
const title = document.getElementById("title");
const menu = document.getElementById("menu");
const sections = document.querySelectorAll(".section");

title.addEventListener("mouseenter", () => {
  title.style.transform = "translateY(-100px)";
  menu.classList.remove("hidden");
});

function openSection(id) {
  clickSound.currentTime = 0;
  clickSound.play();

  sections.forEach(sec => sec.style.display = "none");
  const active = document.getElementById(id);
  active.style.display = "block";
  active.style.opacity = "1";
}

// === LOADER ===
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    }, 600);
  }, 1500);
});
