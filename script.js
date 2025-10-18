// === Setup scena ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === Funcție pentru a crea un strat de stele ===
function createStarLayer(count, spread, size) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * spread;
    const z = (Math.random() - 0.5) * spread;
    positions.set([x, y, z], i * 3);
    colors.set([1, 1, 1], i * 3);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);
  points.userData = { geometry };
  scene.add(points);

  return points;
}

// === Creăm 3 straturi pentru efectul de adâncime ===
const layers = [
  createStarLayer(1000, 1500, 2.0),  // aproape
  createStarLayer(1500, 2500, 1.5),  // mijlociu
  createStarLayer(2000, 3500, 1.0),  // îndepărtat
];

// === Mouse ===
let mouseX = 0, mouseY = 0;
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// === Efect de sclipire random ===
function twinkle() {
  layers.forEach(layer => {
    const colors = layer.userData.geometry.getAttribute("color");
    for (let i = 0; i < colors.count; i++) {
      if (Math.random() < 0.004) {
        const intensity = 0.5 + Math.random() * 0.5;
        const hueShift = Math.random() < 0.5 ? 1 : 0.7;
        colors.setXYZ(i, hueShift * intensity, 0.7 * intensity, intensity);
      } else {
        colors.setXYZ(i, 1, 1, 1);
      }
    }
    colors.needsUpdate = true;
  });
}

// === Poziționare cameră ===
camera.position.z = 500;

// === Animație ===
function animate() {
  requestAnimationFrame(animate);

  camera.position.x += (mouseX * 100 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 100 - camera.position.y) * 0.05;

  layers.forEach((layer, i) => {
    layer.rotation.y += 0.0002 * (i + 1);
    layer.rotation.x += 0.0001 * (i + 1);
  });

  twinkle();
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

// === Resize ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
