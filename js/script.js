// js/script.js (replace whole file)
(async function () {
  // helper: log safe
  const lg = (...s) => console.log("[ghost-script]", ...s);

  // find elements
  const loaderWrapper = document.querySelector(".loader-wrapper");
  const ghostSection = document.querySelector(".ghost-section");
  const ghostContainer = document.querySelector(".ghost-container");

  // safety: ensure ghostSection / container exist
  if (!ghostSection) lg("⚠️ .ghost-section not found in HTML");
  if (!ghostContainer) {
    lg("⚠️ .ghost-container not found — trying to create one inside ghost-section");
    if (ghostSection) {
      const c = document.createElement("div");
      c.className = "ghost-container";
      ghostSection.insertBefore(c, ghostSection.firstChild);
    }
  }

  // ensure canvas exists (create if missing)
  function ensureCanvas() {
    let canvas = document.getElementById("ghostCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "ghostCanvas";
      // make sure it fills the container
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      if (ghostContainer) ghostContainer.appendChild(canvas);
      else if (ghostSection) ghostSection.appendChild(canvas);
      else document.body.appendChild(canvas);
    }
    return canvas;
  }

  // fade out loader then init
  function hideLoaderAndInit() {
    // fade loader wrapper (if exists)
    if (loaderWrapper) {
      loaderWrapper.style.transition = "opacity 600ms ease, filter 600ms ease";
      loaderWrapper.style.opacity = "0";
      loaderWrapper.style.filter = "blur(8px)";
      setTimeout(() => {
        loaderWrapper.style.display = "none";
      }, 650);
    }

    // reveal ghost section
    if (ghostSection) {
      ghostSection.classList.remove("hidden");
      ghostSection.classList.add("visible");
    }

    // init Three
    initThree().catch((err) => {
      lg("❌ three init failed:", err);
      // if Three fails, ensure page is still usable
      if (ghostSection) {
        // hide any preloader area and leave overlay visible
        const pre = ghostSection.querySelector("#preloader");
        if (pre) pre.style.display = "none";
      }
    });
  }

  // wait then hide loader (keeps same timing as before)
  window.addEventListener("load", () => {
    setTimeout(hideLoaderAndInit, 2500);
  });

  // dynamic import of Three (tries multiple CDNs for resilience)
  async function loadThree() {
    if (window.THREE) {
      lg("Using already-loaded window.THREE");
      return window.THREE;
    }
    const candidates = [
      "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "https://unpkg.com/three@0.160.0/build/three.module.js"
    ];
    for (const url of candidates) {
      try {
        lg("Attempting to import THREE from", url);
        const mod = await import(url);
        // some CDNs export default as THREE or named exports
        const THREE = mod && (mod.THREE || mod.default || mod);
        if (!window.THREE) window.THREE = THREE;
        lg("Imported THREE from", url);
        return THREE;
      } catch (e) {
        lg("import failed from", url, e && e.message);
      }
    }
    throw new Error("Could not import Three.js from CDN");
  }

  // initialize Three scene
  async function initThree() {
    const THREE = await loadThree();

    // check WebGL support
    try {
      const canvasTest = document.createElement("canvas");
      const gl = canvasTest.getContext("webgl") || canvasTest.getContext("experimental-webgl");
      if (!gl) {
        lg("WebGL not available in this browser/device");
        return;
      }
    } catch (e) {
      lg("WebGL check error", e);
      return;
    }

    const canvas = ensureCanvas();
    // ensure canvas has explicit pixel size
    function resizeCanvasToDisplaySize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    // create renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.max(1, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0); // transparent background

    // scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    // simple ghost mesh (sphere + subtle material)
    const ghostGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0x223344,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide
    });
    const ghost = new THREE.Mesh(ghostGeo, ghostMat);
    scene.add(ghost);

    // lights
    const p1 = new THREE.PointLight(0x88aaff, 1.0, 15);
    p1.position.set(2, 3, 4);
    scene.add(p1);
    const ambient = new THREE.AmbientLight(0x222222, 0.6);
    scene.add(ambient);

    // small subtle particles (optional, light)
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    for (let i = 0; i < 12; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.03 + Math.random() * 0.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfff1cc, transparent: true, opacity: 0.6 })
      );
      s.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
      particleGroup.add(s);
    }

    // animation loop
    let last = performance.now();
    function animate(now) {
      requestAnimationFrame(animate);
      const dt = Math.min(50, now - last);
      last = now;

      // resize if needed
      const resized = resizeCanvasToDisplaySize();
      if (resized) {
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height, false);
      }

      // ghost float & rotate
      ghost.rotation.y += 0.002 * dt;
      ghost.rotation.x += 0.001 * dt;
      ghost.position.y = Math.sin(now * 0.0011) * 0.25;

      // small particle movement
      particleGroup.children.forEach((p, i) => {
        p.position.x += Math.sin(now * 0.0005 + i) * 0.0004;
        p.position.y += Math.cos(now * 0.0003 + i * 0.7) * 0.0006;
      });

      renderer.render(scene, camera);
    }
    animate(performance.now());

    // make overlay clickable (pointer events) while canvas stays interactive if needed
    canvas.style.pointerEvents = "none";

    // ensure canvas visible if CSS previously hidden
    canvas.classList.add("visible");

    // handle resize
    window.addEventListener("resize", () => {
      resizeCanvasToDisplaySize();
    });

    lg("Three initialized successfully");
  } // end initThree()

  // Helpful dev hint: if something still fails, open DevTools Console.
  lg("Ghost loader script ready. If ghost doesn't appear, check DevTools Console for errors.");
})();
