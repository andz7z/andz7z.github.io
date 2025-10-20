gsap.registerPlugin(ScrollTrigger);

// Shared velocity proxy for all canvases
const velocityProxy = { v: 0, s: 0 }; // v = signed, s = strength (0..1)
const clamp = gsap.utils.clamp(-2000, 2000);

// A single ScrollTrigger to compute velocity and tween back to 0
ScrollTrigger.create({
  start: 0,
  end: () => document.documentElement.scrollHeight - window.innerHeight,
  onUpdate(self) {
    const raw = clamp(self.getVelocity()); // px/s-ish
    const norm = raw / 1000; // ~ -1..1
    const strength = Math.min(1, Math.abs(norm));

    if (Math.abs(strength) > Math.abs(velocityProxy.s)) {
      velocityProxy.v = norm;
      velocityProxy.s = strength;
      gsap.to(velocityProxy, {
        v: 0,
        s: 0,
        duration: 0.8,
        ease: "sine.inOut",
        overwrite: true
      });
    }
  }
});

// Vertex shader
const vert = /* glsl */ `
    varying vec2 vUv;
    varying vec2 vUvCover;
    uniform vec2 uTextureSize;
    uniform vec2 uQuadSize;

    void main(){
      vUv = uv;

      // "cover" mapping to preserve aspect ratio
      float texR = uTextureSize.x / uTextureSize.y;
      float quadR = uQuadSize.x / uQuadSize.y;
      vec2 s = vec2(1.0);
      if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }
      vUvCover = vUv * s + (1.0 - s) * 0.5;

      gl_Position = vec4(position, 1);
    }
  `;

// Fragment shader
const frag = `
    precision highp float;

    uniform sampler2D uTexture;
    uniform vec2 uTextureSize;
    uniform vec2 uQuadSize;
    uniform float uTime;
    uniform float uScrollVelocity;  // signed -1..1
    uniform float uVelocityStrength; // 0..1, decays to 0

    varying vec2 vUv;
    varying vec2 vUvCover;

    void main() {
      vec2 texCoords = vUvCover;

      // drive distortion amount from velocity strength
      float amt = 0.03 * uVelocityStrength;

      // small wave that doesn’t depend on mouse
      float t = uTime * 0.8;
      texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
      texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

      // optional directional tint: push R/G/B differently by scroll direction
      float dir = sign(uScrollVelocity);
      vec2 tc = texCoords;

      float r = texture2D(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
      float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
      float b = texture2D(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

// Build one tiny Three.js scene per frame
document.querySelectorAll(".frame").forEach(initFrame);

function initFrame(frameEl) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  frameEl.appendChild(renderer.domElement);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geom = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    uTexture: { value: null },
    uTextureSize: { value: new THREE.Vector2(1, 1) },
    uQuadSize: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uScrollVelocity: { value: 0 },
    uVelocityStrength: { value: 0 }
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true
  });

  const mesh = new THREE.Mesh(geom, mat);
  scene.add(mesh);

  // Load the image for this frame
  const url = frameEl.getAttribute("data-img");
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  loader.load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;

    uniforms.uTexture.value = tex;
    uniforms.uTextureSize.value.set(tex.image.width, tex.image.height);
    layout(); // size once we know texture size
  });

  function layout() {
    const { width, height } = frameEl.getBoundingClientRect();
    renderer.setSize(width, height, false);
    uniforms.uQuadSize.value.set(width, height);
  }

  // Animate this canvas
  let last = performance.now();
  function tick(now) {
    const dt = (now - last) * 0.001;
    last = now;
    uniforms.uTime.value += dt;

    // pull shared velocity state into our uniforms
    uniforms.uScrollVelocity.value = velocityProxy.v;
    uniforms.uVelocityStrength.value = velocityProxy.s;

    renderer.render(scene, camera);
  }
  gsap.ticker.add(tick);
}
