// js/script.js
// module entry — needs <script type="module" src="js/script.js"></script>
import * as THREE from "https://esm.sh/three@0.160.0";
import { EffectComposer } from "https://esm.sh/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "https://esm.sh/three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "https://esm.sh/three/examples/jsm/postprocessing/ShaderPass.js";

/* ---------------- Preloader manager (flexibil, folosește .loader-wrapper) ---------------- */
class PreloaderManager {
  constructor() {
    this.outerLoader = document.querySelector(".loader-wrapper");
    this.innerDemoPreloader = document.getElementById("demo-preloader"); // inside ghost-section
    this.mainContent = document.getElementById("main-content"); // ghost-section id
    this.progressBar = document.querySelector(".progress-bar");
    this.loadingSteps = 0;
    this.totalSteps = 5;
    this.isComplete = false;
  }
  updateProgress(step) {
    this.loadingSteps = Math.min(step, this.totalSteps);
    const pct = (this.loadingSteps / this.totalSteps) * 100;
    if (this.progressBar) this.progressBar.style.width = pct + "%";
  }
  complete(canvasEl) {
    if (this.isComplete) return;
    this.isComplete = true;
    this.updateProgress(this.totalSteps);
    // fade outer loader first
    if (this.outerLoader) {
      this.outerLoader.classList.add("fade-out");
      setTimeout(() => {
        if (this.outerLoader) this.outerLoader.style.display = "none";
      }, 900);
    }
    // hide inner demo preloader (if present) and reveal main content canvas + quote
    setTimeout(() => {
      if (this.innerDemoPreloader) this.innerDemoPreloader.style.display = "none";
      if (this.mainContent) this.mainContent.classList.remove("hidden");
      if (canvasEl) canvasEl.classList.add("visible");
    }, 900);
  }
}
const preloader = new PreloaderManager();
preloader.updateProgress(1);

/* ---------------- Three scene + postprocessing setup ---------------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 20;

preloader.updateProgress(2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.setClearColor(0x000000, 0);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "1";
renderer.domElement.style.pointerEvents = "none";

// append renderer canvas into the .canvas-wrap inside ghost-section
const canvasWrap = document.querySelector(".canvas-wrap");
if (canvasWrap) {
  canvasWrap.appendChild(renderer.domElement);
} else {
  document.body.appendChild(renderer.domElement);
}

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.25, 0.9, 0.2);
composer.addPass(bloomPass);

const analogDecayShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAnalogIntensity: { value: 0.6 },
    uAnalogGrain: { value: 0.35 },
    uAnalogBleeding: { value: 1.0 },
    uAnalogScanlines: { value: 1.0 },
    uLimboMode: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAnalogIntensity;
    uniform float uAnalogGrain;
    uniform float uAnalogBleeding;
    uniform float uAnalogScanlines;
    uniform float uLimboMode;
    uniform vec2 uResolution;
    varying vec2 vUv;
    float rand(vec2 co){ return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec2 uv = vUv;
      vec4 col = texture2D(tDiffuse,uv);
      // grain
      float g = rand(uv * uTime) * uAnalogGrain * 0.06;
      col.rgb += g * uAnalogIntensity;
      // subtle scanlines
      float scan = sin(uv.y * (uAnalogScanlines * 600.0)) * 0.02;
      col.rgb *= 1.0 - scan * uAnalogIntensity;
      // bleeding (simple chroma offset)
      if (uAnalogBleeding > 0.01){
        float off = 0.0015 * uAnalogBleeding;
        float r = texture2D(tDiffuse, uv + vec2(off,0.) ).r;
        float b = texture2D(tDiffuse, uv - vec2(off*0.8,0.) ).b;
        col = vec4(r, col.g, b, col.a);
      }
      if (uLimboMode > 0.5){
        float gray = dot(col.rgb, vec3(0.299,0.587,0.114));
        col.rgb = vec3(gray);
      }
      gl_FragColor = col;
    }
  `
};
const analogPass = new ShaderPass(analogDecayShader);
composer.addPass(analogPass);
const outputPass = new OutputPass();
composer.addPass(outputPass);

preloader.updateProgress(3);

/* ---------------- Scene content: ghost, eyes, fireflies, particles ---------------- */
const ghostGroup = new THREE.Group();
scene.add(ghostGroup);

// ghost body
const ghostGeometry = new THREE.SphereGeometry(2.0, 64, 64);
// make organic bottom
const posAttr = ghostGeometry.getAttribute("position");
const arr = posAttr.array;
for (let i = 0; i < arr.length; i += 3){
  if (arr[i+1] < -0.2){
    const x = arr[i], z = arr[i+2];
    arr[i+1] = -2.0 + Math.sin(x*4.5)*0.35 + Math.cos(z*3.7)*0.25;
  }
}
ghostGeometry.computeVertexNormals();

const ghostMaterial = new THREE.MeshStandardMaterial({
  color: 0x0f2027,
  transparent: true,
  opacity: 0.92,
  emissive: new THREE.Color(0xff7a2a),
  emissiveIntensity: 4.2,
  roughness: 0.02,
  metalness: 0.0,
  side: THREE.DoubleSide,
  alphaTest: 0.05
});
const ghostBody = new THREE.Mesh(ghostGeometry, ghostMaterial);
ghostGroup.add(ghostBody);

// rim lights
const rim1 = new THREE.DirectionalLight(0x4a90e2, 1.2);
rim1.position.set(-8,6,-4);
scene.add(rim1);
const rim2 = new THREE.DirectionalLight(0x50e3c2, 0.9);
rim2.position.set(8,-4,-6);
scene.add(rim2);

// atmosphere plane (dark reveal)
const atmGeom = new THREE.PlaneGeometry(400, 400);
const atmMat = new THREE.ShaderMaterial({
  transparent:true,
  depthWrite:false,
  uniforms:{
    ghostPosition:{value:new THREE.Vector3(0,0,0)},
    revealRadius:{value:43},
    fadeStrength:{value:2.2},
    baseOpacity:{value:0.35},
    revealOpacity:{value:0.0},
    time:{value:0}
  },
  vertexShader: `
    varying vec3 vWorld;
    varying vec2 vUv;
    void main(){
      vUv = uv;
      vec4 w = modelMatrix * vec4(position,1.0);
      vWorld = w.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 ghostPosition;
    uniform float revealRadius;
    uniform float fadeStrength;
    uniform float baseOpacity;
    uniform float revealOpacity;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vWorld;
    void main(){
      float dist = distance(vWorld.xy, ghostPosition.xy);
      float dynR = revealRadius + sin(time*2.0)*5.0;
      float stepv = smoothstep(dynR*0.2, dynR, dist);
      stepv = pow(stepv, fadeStrength);
      float opacity = mix(revealOpacity, baseOpacity, stepv);
      gl_FragColor = vec4(0.001,0.001,0.002, opacity);
    }
  `
});
const atmosphere = new THREE.Mesh(atmGeom, atmMat);
atmosphere.position.z = -50;
atmosphere.renderOrder = -100;
scene.add(atmosphere);

// eyes (small emissive orbs)
function createEyes(){
  const g = new THREE.Group();
  ghostGroup.add(g);
  const socketGeo = new THREE.SphereGeometry(0.45, 16,16);
  const socketMat = new THREE.MeshBasicMaterial({color:0x000000});
  const leftSocket = new THREE.Mesh(socketGeo, socketMat);
  leftSocket.position.set(-0.7, 0.6, 1.9); leftSocket.scale.set(1.1,1.0,0.6); g.add(leftSocket);
  const rightSocket = leftSocket.clone(); rightSocket.position.set(0.7,0.6,1.9); g.add(rightSocket);

  const eyeGeo = new THREE.SphereGeometry(0.3, 12,12);
  const eyeMat = new THREE.MeshBasicMaterial({ color:0x00ff80, transparent:true, opacity:0.0 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat); leftEye.position.set(-0.7,0.6,2.0); g.add(leftEye);
  const rightEye = leftEye.clone(); rightEye.position.set(0.7,0.6,2.0); g.add(rightEye);

  const outerGeo = new THREE.SphereGeometry(0.525,12,12);
  const outerMat = new THREE.MeshBasicMaterial({color:0x00ff80, transparent:true, opacity:0.0, side:THREE.BackSide});
  const lo = new THREE.Mesh(outerGeo, outerMat); lo.position.set(-0.7,0.6,1.95); g.add(lo);
  const ro = lo.clone(); ro.position.set(0.7,0.6,1.95); g.add(ro);

  return { leftEye, rightEye, outerLeft:lo, outerRight:ro, leftEyeMat:eyeMat, rightEyeMat:eyeMat, outerMat };
}
const eyes = createEyes();

// fireflies
const fireflies = [];
const fireflyGroup = new THREE.Group();
scene.add(fireflyGroup);
function createFireflies(){
  for(let i=0;i<20;i++){
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.03,6,6), new THREE.MeshBasicMaterial({color:0xffff44, transparent:true, opacity:0.9}));
    s.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*30, (Math.random()-0.5)*20);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8), new THREE.MeshBasicMaterial({color:0xffff88, transparent:true, opacity:0.4, side:THREE.BackSide}));
    s.add(glow);
    const light = new THREE.PointLight(0xffff44, 0.8, 3, 2);
    s.add(light);
    s.userData = { velocity: new THREE.Vector3((Math.random()-0.5)*0.04, (Math.random()-0.5)*0.04, (Math.random()-0.5)*0.04), phase: Math.random()*Math.PI*2, glowMat: glow.material, light };
    fireflyGroup.add(s);
    fireflies.push(s);
  }
}
createFireflies();

// particles pool
const particles = [];
const particleGroup = new THREE.Group();
scene.add(particleGroup);
const particlePool = [];
const particleGeoms = [ new THREE.SphereGeometry(0.05,6,6), new THREE.TetrahedronGeometry(0.04,0), new THREE.OctahedronGeometry(0.045,0) ];
const particleBaseMat = new THREE.MeshBasicMaterial({ color:0xff4500, transparent:true, opacity:0 });
function initParticlePool(n=100){
  for(let i=0;i<n;i++){
    const g = particleGeoms[Math.floor(Math.random()*particleGeoms.length)];
    const m = particleBaseMat.clone();
    const p = new THREE.Mesh(g,m); p.visible=false; particleGroup.add(p); particlePool.push(p);
  }
}
initParticlePool(120);

function createParticle(){
  let p;
  if (particlePool.length>0){ p = particlePool.pop(); p.visible=true; }
  else { p = new THREE.Mesh(particleGeoms[Math.floor(Math.random()*particleGeoms.length)], particleBaseMat.clone()); particleGroup.add(p); }
  p.position.copy(ghostGroup.position);
  p.position.z -= 0.8 + Math.random()*0.6;
  p.position.x += (Math.random()-0.5)*3.5;
  p.position.y += (Math.random()-0.5)*3.5 - 0.8;
  const size = 0.6 + Math.random()*0.7; p.scale.set(size,size,size);
  p.userData = { life:1.0, decay: Math.random()*0.003 + 0.005, vel: {x:(Math.random()-0.5)*0.012, y:(Math.random()-0.5)*0.012 - 0.002, z:(Math.random()-0.5)*0.012 - 0.006}, rotSpeed:{x:(Math.random()-0.5)*0.015, y:(Math.random()-0.5)*0.015, z:(Math.random()-0.5)*0.015} };
  p.material.opacity = Math.random()*0.9;
  particles.push(p);
  return p;
}

/* ---------------- Pre-init and render forcing ---------------- */
preloader.updateProgress(4);

// make sure composer does a few renders before revealing
let isInitialized = false;
function forceInitialRender(){
  for(let i=0;i<3;i++) composer.render();
  for(let i=0;i<10;i++) createParticle();
  composer.render();
  isInitialized = true;
  // pass the renderer.domElement to preloader.complete so it reveals
  preloader.complete(renderer.domElement);
}
preloader.updateProgress(5);
setTimeout(forceInitialRender, 120);

/* ---------------- Input / movement tracking ---------------- */
const mouse = new THREE.Vector2();
const prevMouse = new THREE.Vector2();
const mouseSpeed = new THREE.Vector2();
let lastMouseUpdate = 0;
let isMouseMoving = false;
let mouseMovementTimer;

window.addEventListener("mousemove", (e) => {
  const now = performance.now();
  if (now - lastMouseUpdate > 12) {
    prevMouse.copy(mouse);
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseSpeed.x = mouse.x - prevMouse.x;
    mouseSpeed.y = mouse.y - prevMouse.y;
    isMouseMoving = true;
    if (mouseMovementTimer) clearTimeout(mouseMovementTimer);
    mouseMovementTimer = setTimeout(() => isMouseMoving = false, 80);
    lastMouseUpdate = now;
  }
});

/* ---------------- Animation loop ---------------- */
let lastTime = 0;
let time = 0;
let currentMovement = 0;
let lastParticleTime = 0;
let frameCount = 0;

function animate(now){
  requestAnimationFrame(animate);
  if (!isInitialized) return;
  const delta = now - (lastTime || now);
  lastTime = now;
  if (delta > 200) return;
  const dtFactor = delta / 16.67;
  time += dtFactor * 0.01;
  frameCount++;

  // update atmosphere time
  atmMat.uniforms.time.value = time;
  analogPass.uniforms.uTime.value = time;
  analogPass.uniforms.uAnalogGrain.value = 0.35;

  // ghost follow mouse
  const targetX = mouse.x * 11;
  const targetY = mouse.y * 7;
  const prevPos = ghostGroup.position.clone();
  ghostGroup.position.x += (targetX - ghostGroup.position.x) * 0.075;
  ghostGroup.position.y += (targetY - ghostGroup.position.y) * 0.075;

  atmosphere.material && atmosphere.material.uniforms && (atmosphere.material.uniforms.ghostPosition.value.copy(ghostGroup.position));

  const movementAmount = prevPos.distanceTo(ghostGroup.position);
  currentMovement = currentMovement * 0.95 + movementAmount * (1 - 0.95);

  // floating + breathing
  ghostGroup.position.y += Math.sin(time * 1.6) * 0.015;
  const pulse = Math.sin(time * 1.6) * 0.6;
  ghostMaterial.emissiveIntensity = 4.2 + pulse * 0.8;

  // eye glow behavior
  const normalizedSpeed = Math.sqrt(mouseSpeed.x*mouseSpeed.x + mouseSpeed.y*mouseSpeed.y) * 8;
  const moving = currentMovement > 0.07;
  const targetGlow = moving ? 1.0 : 0.0;
  const changeSpeed = moving ? 0.31*2 : 0.31;
  const newOp = eyes.leftEyeMat ? (eyes.leftEyeMat.opacity + (targetGlow - (eyes.leftEyeMat.opacity || 0)) * changeSpeed) : 0;
  if (eyes.leftEyeMat) { eyes.leftEyeMat.opacity = newOp; eyes.rightEyeMat.opacity = newOp; eyes.outerLeft && (eyes.outerLeft.material.opacity = newOp * 0.3); eyes.outerRight && (eyes.outerRight.material.opacity = newOp * 0.3); }

  // fireflies move
  fireflies.forEach((f,i)=>{
    const ud = f.userData;
    ud.velocity.x += (Math.random()-0.5)*0.0008;
    ud.velocity.y += (Math.random()-0.5)*0.0008;
    ud.velocity.z += (Math.random()-0.5)*0.0008;
    ud.velocity.clampLength && ud.velocity.clampLength(0, 0.04);
    f.position.add(ud.velocity);
    const pulsePhase = time + ud.phase;
    const pul = Math.sin(pulsePhase * (2 + (i%3))) * 0.4 + 0.6;
    ud.glowMat.opacity = 0.4 * pul;
    ud.light.intensity = 0.8 * pul;
  });

  // create particles when moving
  if ((currentMovement > 0.005) && (now - lastParticleTime > 100)){
    const rate = Math.min(5, Math.max(1, Math.floor(normalizedSpeed * 3)));
    for(let i=0;i<rate;i++) createParticle();
    lastParticleTime = now;
  }

  // update particles
  for (let i = particles.length -1; i >= 0; i--){
    const p = particles[i];
    p.userData.life -= p.userData.decay;
    p.material.opacity = Math.max(0, p.userData.life * 0.85);
    if (p.userData.vel){
      p.position.x += p.userData.vel.x;
      p.position.y += p.userData.vel.y;
      p.position.z += p.userData.vel.z;
    }
    if (p.userData.rotationSpeed){
      p.rotation.x += p.userData.rotationSpeed.x;
      p.rotation.y += p.userData.rotationSpeed.y;
      p.rotation.z += p.userData.rotationSpeed.z;
    }
    if (p.userData.life <= 0){
      p.visible=false;
      p.material.opacity = 0;
      particlePool.push(p);
      particles.splice(i,1);
    }
  }

  composer.render();
}
requestAnimationFrame(animate);

/* ---------------- Window resize ---------------- */
let resizeTO;
window.addEventListener("resize", () => {
  if (resizeTO) clearTimeout(resizeTO);
  resizeTO = setTimeout(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    bloomPass.setSize(window.innerWidth, window.innerHeight);
    analogPass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }, 120);
});

// kick initial fake mouse
window.dispatchEvent(new MouseEvent("mousemove", {clientX: window.innerWidth/2, clientY: window.innerHeight/2}));
