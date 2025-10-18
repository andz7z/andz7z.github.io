// main.js
// starfield + letter splitting + interactions

// ---------- Utility: split slogan into letter spans ----------
function setupLetters() {
  const h = document.getElementById('slogan');
  const text = h.textContent.trim();
  h.textContent = '';

  // create spans for each character (preserve spaces)
  const frag = document.createDocumentFragment();
  let idx = 0;
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'letter';
    span.setAttribute('data-char', ch);
    span.setAttribute('data-i', idx);
    span.style.setProperty('--i', idx);
    // put visible char for accessibility & for cursor area
    span.textContent = ch;
    // add inner glow layer
    const glow = document.createElement('div');
    glow.className = 'glow';
    glow.textContent = ch;
    span.appendChild(glow);

    // add hover pointer
    span.style.cursor = 'pointer';

    // on hover we already have CSS scale; also optionally add a small JS scale for subtle motion
    span.addEventListener('mouseenter', () => {
      // optional: push starfield a bit
      starfieldPush(0.015);
    });
    frag.appendChild(span);
    idx++;
  }
  h.appendChild(frag);
}
setupLetters();

// ---------- Three.js starfield ----------
import * as THREE from 'three';

const container = document.getElementById('bg-canvas-wrap');

const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.display = 'block';
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
container.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 400;

// Create two layers: small distant stars, and larger glowing stars
const starCount = 6000;
const glowCount = 160;

function createStars(count, radius, sizeRange, isGlow=false) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // random sphere-ish distribution, more spread on Z for depth
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = radius * (0.5 + Math.random() * 0.8);
    const x = Math.sin(phi) * Math.cos(theta) * r;
    const y = Math.sin(phi) * Math.sin(theta) * r * 0.65;
    const z = Math.cos(phi) * r * 0.9 - 200; // shift back
    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
    seeds[i] = Math.random() * 1000;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
  // material
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: isGlow ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0.0 },
      uPixelRatio: { value: window.devicePixelRatio || 1.0 },
      uSize: { value: 1.0 },
    },
    vertexShader: `
      attribute float size;
      attribute float seed;
      uniform float uTime;
      varying float vSeed;
      void main() {
        vSeed = seed;
        vec3 pos = position;
        // small subtle oscillation for twinkle
        float tw = sin(uTime * 0.8 + seed) * 0.6;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (size + tw) * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vSeed;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, d);
        // some seeds brighter
        float spark = smoothstep(0.0, 1.0, fract(sin(vSeed*12.9898) * 43758.5453));
        gl_FragColor = vec4(vec3(1.0), alpha * (0.6 + 0.8 * spark));
      }
    `
  });

  const points = new THREE.Points(geometry, material);
  return points;
}

const stars = createStars(starCount, 1400, [0.6, 1.8], false);
scene.add(stars);
const glows = createStars(glowCount, 900, [6.5, 12.0], true);
scene.add(glows);

// handle resizing
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// mouse-driven camera/parallax
let mouse = { x: 0, y: 0 };
let target = { x: 0, y: 0 };
let ease = 0.06;

window.addEventListener('pointermove', (e) => {
  // normalize to -1..1
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

// small push when hovering letters
let pushForce = 0;
function starfieldPush(v) {
  pushForce = Math.max(pushForce, v);
  // decay later in animation loop
}

// animate
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // smooth target from mouse, with slight push decay
  target.x += (mouse.x - target.x) * ease;
  target.y += (mouse.y - target.y) * ease;

  // slowly reduce pushForce
  pushForce *= 0.94;

  // move camera slightly based on target and push
  camera.position.x += ((target.x * 60) - camera.position.x) * 0.08;
  camera.position.y += ((target.y * 50) - camera.position.y) * 0.08;
  camera.lookAt(0, 0, -200);

  // slowly rotate the star clusters for a subtle wave effect
  stars.rotation.y = t * 0.002 + target.x * 0.02;
  stars.rotation.x = target.y * 0.03;
  glows.rotation.y = -t * 0.0012 + target.x * 0.01;
  glows.rotation.x = -target.y * 0.02;

  // anim uniforms
  stars.material.uniforms.uTime.value = t + pushForce * 12.0;
  glows.material.uniforms.uTime.value = t * 1.4 + pushForce * 12.0;

  renderer.render(scene, camera);
}
animate();

// make the canvas behind everything and not catch pointer events except pointermove for parallax - we already use window pointermove
renderer.domElement.style.zIndex = 0;
renderer.domElement.style.pointerEvents = 'none';

// Accessibility: allow keyboard focus to slogan (so it's discoverable)
const sloganEl = document.getElementById('slogan');
sloganEl.setAttribute('tabindex', '0');
-
