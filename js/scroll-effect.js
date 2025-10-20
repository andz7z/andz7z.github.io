// scroll-effect.js — efect vizual de distorsiune la scroll
gsap.registerPlugin(ScrollTrigger);

// Proxy global pentru viteza de scroll
const velocityProxy = { v: 0, s: 0 };
const clamp = gsap.utils.clamp(-2000, 2000);

ScrollTrigger.create({
  start: 0,
  end: () => document.documentElement.scrollHeight - window.innerHeight,
  onUpdate(self) {
    const raw = clamp(self.getVelocity());
    const norm = raw / 1000; // -1..1
    const strength = Math.min(1, Math.abs(norm));

    if (Math.abs(strength) > Math.abs(velocityProxy.s)) {
      velocityProxy.v = norm;
      velocityProxy.s = strength;
      gsap.to(velocityProxy, {
        v: 0,
        s: 0,
        duration: 0.8,
        ease: "sine.inOut",
        overwrite: true,
      });
    }
  },
});

// Creează o scenă WebGL pe tot ecranul
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Shader simplu (fără imagine)
const uniforms = {
  uTime: { value: 0 },
  uScrollVelocity: { value: 0 },
  uVelocityStrength: { value: 0 },
};

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uVelocityStrength;

  void main() {
    // Fundal animat bazat pe viteză
    float wave = sin(vUv.y * 10.0 + uTime * 1.5) * 0.03 * uVelocityStrength;
    float distort = cos(vUv.x * 8.0 - uTime * 1.2) * 0.03 * uVelocityStrength;

    vec2 uv = vUv + vec2(wave, distort);

    // Gradient albastru-gri
    vec3 color = mix(vec3(0.05, 0.08, 0.15), vec3(0.1, 0.2, 0.5), uv.y);
    color += vec3(uVelocityStrength * 0.2, 0.0, 0.0); // mică tentă în funcție de direcția scrollului

    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vert,
  fragmentShader: frag,
});

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

function animate(now) {
  requestAnimationFrame(animate);
  uniforms.uTime.value = now * 0.001;
  uniforms.uScrollVelocity.value = velocityProxy.v;
  uniforms.uVelocityStrength.value = velocityProxy.s;
  renderer.render(scene, camera);
}
animate();

// Redimensionare
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});
