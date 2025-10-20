// js/script.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

window.addEventListener("load", () => {
  const loaderWrapper = document.querySelector(".loader-wrapper");
  const ghostSection = document.querySelector(".ghost-section");

  // Fade-out loader
  setTimeout(() => {
    if (loaderWrapper) {
      loaderWrapper.style.transition = "opacity 1s ease, filter 1s ease";
      loaderWrapper.style.opacity = "0";
      loaderWrapper.style.filter = "blur(20px)";
    }

    setTimeout(() => {
      if (loaderWrapper) loaderWrapper.style.display = "none";
      if (ghostSection) {
        ghostSection.classList.remove("hidden");
        ghostSection.classList.add("visible");
      }
      initGhost();
    }, 1000);
  }, 2500);
});

// ===== Scroll lin între secțiuni =====
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: "smooth" });
}

// ===== Fade-in secțiuni =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible-scroll");
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".page-section").forEach(section => observer.observe(section));

// ===== GHOST 3D EFFECT =====
function initGhost() {
  const canvas = document.getElementById("ghostCanvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const ghost = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.4,
      metalness: 0.2
    })
  );
  scene.add(ghost);

  const light = new THREE.PointLight(0x88aaff, 1, 10);
  light.position.set(2, 3, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x222233, 0.5));

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    ghost.rotation.y += 0.01;
    ghost.position.y = Math.sin(Date.now() * 0.002) * 0.4;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}
