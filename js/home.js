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
// Custom cursor simplu și rapid
const cursor = document.querySelector('.custom-cursor');

// Mișcare cursor INSTANT
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  const isInHomeSection = e.target.closest('#home');
  if (isInHomeSection) {
    document.body.classList.add('home-cursor-active');
  } else {
    document.body.classList.remove('home-cursor-active');
  }
});

// Ascunde cursorul când părăsește fereastra
document.addEventListener('mouseleave', () => {
  document.body.classList.remove('home-cursor-active');
});

document.addEventListener('mouseenter', () => {
  const isInHomeSection = document.querySelector('#home:hover');
  if (isInHomeSection) {
    document.body.classList.add('home-cursor-active');
  }
});