import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  const ghostSection = document.querySelector(".ghost-section");

  // Asigură-te că ghostSection există și e ascuns la start
  ghostSection.classList.add("hidden");

  // După 2.5 secunde — dispare loaderul și apare ghost-ul
  setTimeout(() => {
    if (loader) {
      loader.style.transition = "opacity 1s ease, filter 1s ease";
      loader.style.opacity = "0";
      loader.style.filter = "blur(20px)";
    }

    setTimeout(() => {
      if (loader) loader.style.display = "none";

      // ✅ Activează ghost section
      if (ghostSection) {
        ghostSection.classList.remove("hidden");
        ghostSection.classList.add("visible");
      }

      // Inițializează animația 3D
      initGhost();
    }, 1000);
  }, 2500);
});

// Smooth scroll pentru butoane
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: "smooth" });
}

// Fade-in pentru secțiuni
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible-scroll");
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".page-section").forEach(section => {
  observer.observe(section);
});

// ==================== 3D GHOST ====================
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

  const ghostGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const ghostMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.5,
    metalness: 0.1
  });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  scene.add(ghost);

  const light = new THREE.PointLight(0x88aaff, 1, 10);
  light.position.set(2, 3, 4);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x222233, 0.5);
  scene.add(ambient);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    ghost.rotation.y += 0.01;
    ghost.position.y = Math.sin(Date.now() * 0.002) * 0.5;
    renderer.render(scene, camera);
  }
  animate();

  // Redimensionare automată
  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}
