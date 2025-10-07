// 🎵 Muzica de fundal cu fade-in
const music = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volume");
const volumeLabel = document.getElementById("volumeLabel");

// Pornire graduală (fade-in până la 20%)
music.volume = 0;
let targetVolume = 0.2;
let currentVolume = 0;
const fadeIn = setInterval(() => {
  if (currentVolume < targetVolume) {
    currentVolume += 0.01;
    music.volume = currentVolume;
    volumeSlider.value = currentVolume;
    volumeLabel.textContent = `🔊 ${Math.round(currentVolume * 100)}%`;
  } else {
    clearInterval(fadeIn);
  }
}, 150);

// Slider volum
volumeSlider.addEventListener("input", () => {
  music.volume = volumeSlider.value;
  volumeLabel.textContent = `🔊 ${Math.round(volumeSlider.value * 100)}%`;
});

// 💬 Typewriter Effect
const text = "I provide professional video, photo editing & modding services for games.";
let index = 0;
const speed = 50;

function typeWriter() {
  if (index < text.length) {
    document.getElementById("subtitle").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = () => {
  typeWriter();
  music.play();
};

// 🖱️ Arată secțiuni la click
function showInfo(id) {
  const items = document.querySelectorAll(".info-item");
  items.forEach((item) => {
    if (item.id === id) {
      item.style.display = "block";
      item.style.opacity = "0";
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transition = "opacity 0.6s ease";
      }, 50);
    } else {
      item.style.display = "none";
    }
  });
}

// 🎨 Butoane efect click
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.9)";
    setTimeout(() => (btn.style.transform = "scale(1)"), 150);
  });
});
