// script.js
// 3D starfield with parallax & twinkle (three.js shader points)

(() => {
  const container = document.getElementById('canvas-container');

  // Scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
  camera.position.z = 0;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Uniforms for shader
  const uniforms = {
    u_time: { value: 0.0 },
    u_mouse: { value: new THREE.Vector2(0, 0) }, // normalized -1..1
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  // Parameters
  const COUNT = 7000;           // total stars
  const PURPLE_RATIO = 0.10;    // % of stars that are purple twinklers
  const STAR_FIELD_DEPTH = 1200; // depth range (0 .. -depth)

  // Geometry buffers
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const aRandom = new Float32Array(COUNT);      // random seed per star
  const aScale = new Float32Array(COUNT);       // base scale
  const aIsPurple = new Float32Array(COUNT);    // 0 = white, 1 = purple twinkle

  // Fill buffers: distribute stars in a wide box in front of camera
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;

    // Spread X and Y wider near camera, but we can use uniform range
    positions[i3 + 0] = (Math.random() * 2 - 1) * 1400; // x
    positions[i3 + 1] = (Math.random() * 2 - 1) * 900;  // y
    positions[i3 + 2] = -Math.random() * STAR_FIELD_DEPTH - 10; // z (negative)
    
    aRandom[i] = Math.random() * 10.0;
    aScale[i] = (Math.random() * 0.8 + 0.3); // small base sizes
    aIsPurple[i] = Math.random() < PURPLE_RATIO ? 1.0 : 0.0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(aScale, 1));
  geometry.setAttribute('aIsPurple', new THREE.BufferAttribute(aIsPurple, 1));

  // Shader material for points
  const vertexShader = `
    attribute float aRandom;
    attribute float aScale;
    attribute float aIsPurple;
    varying float vRandom;
    varying float vIsPurple;
    varying float vDepth;

    uniform vec2 u_mouse;
    uniform float u_time;

    void main(){
      vRandom = aRandom;
      vIsPurple = aIsPurple;
      vDepth = -position.z; // positive value: farther => larger

      // depth factor 0..1
      float depthFactor = clamp(vDepth / ${STAR_FIELD_DEPTH.toFixed(1)}, 0.0, 1.0);

      // Parallax: move XY a bit depending on mouse and depth (closer = more movement)
      vec3 pos = position;
      float parallaxStrength = mix(1.4, 0.2, depthFactor); // close stars move more
      pos.xy += u_mouse * parallaxStrength * (10.0 * (1.0 - depthFactor));

      // Slight longitudinal flicker (very subtle positional wobble)
      float wobble = sin(u_time * 0.6 + aRandom * 2.3) * 0.6 * (1.0 - depthFactor) * 0.4;
      pos.xy += vec2(cos(aRandom * 12.3), sin(aRandom * 7.7)) * wobble;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      // Size attenuation: make points bigger when closer
      float sizeAtten = (aScale * 20.0) * ( (200.0) / -mvPosition.z );
      // Clamp to avoid too large
      sizeAtten = clamp(sizeAtten, 1.0, 68.0);

      gl_PointSize = sizeAtten;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    precision highp float;
    varying float vRandom;
    varying float vIsPurple;
    varying float vDepth;

    uniform float u_time;

    void main(){
      // make round points
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      // soft circular falloff
      float alpha = smoothstep(0.5, 0.05, dist);

      // twinkle factor: base + pulsation depending on random seed and time
      float tw = 0.9 + 0.6 * sin(u_time * 3.0 + vRandom * 6.2831);
      // depth-based dimmer for far stars
      float depthFade = mix(1.0, 0.45, clamp(vDepth / ${STAR_FIELD_DEPTH.toFixed(1)}, 0.0, 1.0));
      float brightness = tw * depthFade;

      // base color white, mix to purple if flagged
      vec3 white = vec3(1.0, 1.0, 1.0);
      vec3 purple = vec3(0.75, 0.27, 1.0); // slightly warm purple
      vec3 color = mix(white, purple, vIsPurple);

      // subtle halo: multiply color by a smooth radial ramp for glow
      float halo = smoothstep(0.55, 0.0, dist);
      float glow = pow(halo, 1.6);

      // Compose final color
      vec3 finalColor = color * brightness * (0.6 + 0.4 * glow);
      float finalAlpha = alpha * (0.55 + 0.45 * glow);

      // Very small additive boost for purple twinkles so they pop
      if(vIsPurple > 0.5){
        finalColor += vec3(0.08, 0.03, 0.15) * glow;
      }

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Mouse handling: convert to normalized -1..1
  const mouse = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -((e.clientY / window.innerHeight) * 2 - 1);
    // smooth update for nicer effect
    mouse.x = THREE.MathUtils.lerp(mouse.x, nx, 0.12);
    mouse.y = THREE.MathUtils.lerp(mouse.y, ny, 0.12);
  });

  // touch support
  window.addEventListener('touchmove', (e) => {
    if(e.touches && e.touches.length){
      const t = e.touches[0];
      const nx = (t.clientX / window.innerWidth) * 2 - 1;
      const ny = -((t.clientY / window.innerHeight) * 2 - 1);
      mouse.x = THREE.MathUtils.lerp(mouse.x, nx, 0.18);
      mouse.y = THREE.MathUtils.lerp(mouse.y, ny, 0.18);
    }
  }, { passive: true });

  // subtle gentle camera forward movement to create 'moving through stars' feel
  let camZOffset = 0;
  let lastTime = performance.now();

  function animate(time) {
    const t = time * 0.001;
    uniforms.u_time.value = t;
    // smooth mouse uniform (slightly scaled)
    uniforms.u_mouse.value.x = THREE.MathUtils.lerp(uniforms.u_mouse.value.x, mouse.x * 1.2, 0.08);
    uniforms.u_mouse.value.y = THREE.MathUtils.lerp(uniforms.u_mouse.value.y, mouse.y * 1.2, 0.08);
    // small forward/back movement
    const dt = (time - lastTime) * 0.001;
    lastTime = time;
    camZOffset += dt * 18.0; // forward velocity
    camera.position.z = Math.sin(t * 0.07) * 12.0 + Math.sin(t * 0.11) * 6.0; // gentle drift
    // rotate the points cloud slowly for depth variation (very subtle)
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Resize handling
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.u_resolution.value.set(w, h);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // kick off
  onResize();
  animate(performance.now());
})();
