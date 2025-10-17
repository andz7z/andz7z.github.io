// ===== INTRO TO MAIN MENU TRANSITION =====
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  const mainMenu = document.getElementById("main-menu");

  setTimeout(() => {
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.classList.add("hidden");
      mainMenu.classList.remove("hidden");
      startLiquidEffect();
    }, 1000);
  }, 3000);
});

// ===== LIQUID BACKGROUND EFFECT =====
function startLiquidEffect() {
  const canvas = document.getElementById("liquid-bg");
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const uniforms = {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 resolution;
      uniform float time;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float wave = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time * 1.2);
        vec3 color = mix(vec3(0.32, 0.15, 1.0), vec3(1.0, 0.63, 0.98), wave * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  function animate() {
    requestAnimationFrame(animate);
    uniforms.time.value += 0.02;
    renderer.render(scene, camera);
  }

  animate();
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  });
}
