import * as THREE from 'three';

// Scenă și cameră
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Stele albe
const starGeometry = new THREE.BufferGeometry();
const starCount = 1200; // mai puține
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 3000;
  const y = (Math.random() - 0.5) * 3000;
  const z = (Math.random() - 0.5) * 3000; // stele și în spate
  positions.set([x, y, z], i * 3);
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Stele mov care sclipesc
const purpleGeometry = new THREE.BufferGeometry();
const purpleCount = 40;
const purplePos = new Float32Array(purpleCount * 3);
for (let i = 0; i < purpleCount; i++) {
  purplePos.set([
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000
  ], i * 3);
}
purpleGeometry.setAttribute('position', new THREE.BufferAttribute(purplePos, 3));
const purpleMaterial = new THREE.PointsMaterial({ color: 0xaa66ff, size: 3, transparent: true, opacity: 0.8 });
const purpleStars = new THREE.Points(purpleGeometry, purpleMaterial);
scene.add(purpleStars);

// Mouse parallax
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Animație
function animate() {
  requestAnimationFrame(animate);

  // Parallax mic
  camera.position.x += (mouseX * 200 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 200 - camera.position.y) * 0.02;

  // Stelele mov sclipesc
  const time = Date.now() * 0.002;
  purpleMaterial.opacity = 0.5 + Math.sin(time * 1.2) * 0.5; // fade in/out fluent

  stars.rotation.y += 0.0005;
  purpleStars.rotation.y += 0.0006;

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
