// Text carousel (fade-out → switch → fade-in)
const roles = [
  "Front-end Developer",
  "UI/UX Designer",
  "Content Creator"
];

const switchText = document.querySelector(".switch-text");

let index = 0;

function changeRole() {
  // fade out
  switchText.style.opacity = 0;

  setTimeout(() => {
    switchText.innerHTML = roles[index];
    // fade in
    switchText.style.opacity = 1;

    index = (index + 1) % roles.length;
  }, 600);
}

// Start sequence after elements have appeared
setTimeout(() => {
  switchText.innerHTML = roles[0];
  switchText.style.opacity = 1;
  index = 1;

  setInterval(changeRole, 3000);
}, 3500);
