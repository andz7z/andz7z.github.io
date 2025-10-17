// === INTRO FADE & SOUND ===
window.addEventListener("load", () => {
  const intro = document.getElementById("loading-screen");
  const sound = new Audio("assets/sounds/notificare.mp3");

  setTimeout(() => {
    intro.classList.add("fade-out");
    sound.play().catch(() => {});
    initOrb();
  }, 2000);
});

// === ORB BACKGROUND EFFECT ===
function initOrb() {
  const container = document.getElementById("orb-container");
  if (!container) return;

  const { Renderer, Program, Mesh, Triangle, Vec3 } = OGL;

  const vert = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(in vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      float n = noise(uv * 3.0 + iTime * 0.2);
      vec3 col = vec3(0.3 + 0.3 * sin(iTime + n * 6.0),
                      0.1 + 0.5 * abs(sin(iTime * 0.7 + n * 3.0)),
                      0.8 + 0.2 * cos(iTime * 0.5));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const renderer = new Renderer({ alpha: false });
  const gl = renderer.gl;
  container.appendChild(gl.canvas);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Vec3() },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(container.clientWidth * dpr, container.clientHeight * dpr);
    program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 1);
  }

  window.addEventListener("resize", resize);
  resize();

  let start = performance.now();
  function update(t) {
    program.uniforms.iTime.value = (t - start) * 0.001;
    renderer.render({ scene: mesh });
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
