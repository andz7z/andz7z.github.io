// === TEXT SPLIT INTO LETTERS ===
const title = document.getElementById('title');
const text = title.textContent;
title.textContent = '';
[...text].forEach(char => {
  const span = document.createElement('span');
  span.textContent = char;
  if (char !== ' ') {
    span.style.animation = `glowPulse 3s infinite ease-in-out ${Math.random()}s`;
  }
  title.appendChild(span);
});

// === THREE.JS STARFIELD ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.z = 800;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('starfield').appendChild(renderer.domElement);

// Create stars
const starCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 2000;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
  positions[i * 3 + 2] = -Math.random() * 2000;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 2,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Add twinkle effect
function twinkle() {
  material.opacity = 0.8 + Math.sin(Date.now() * 0.002) * 0.2;
}

// Handle mouse movement for parallax
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.002;
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  twinkle();

  camera.position.x += (mouseX * 100 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 100 - camera.position.y) * 0.02;

  stars.rotation.y += 0.0006;
  stars.rotation.x += 0.0002;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
