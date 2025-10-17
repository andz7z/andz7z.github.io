/* Main JS: Three.js Starfield + Loader transition + interactions */

// Wait DOM
document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.getElementById('loader-screen');
  const app = document.getElementById('app');

  // Show app after 3s with blur-out transition
  setTimeout(() => {
    loaderScreen.classList.add('blur-out');
    // remove after transition
    setTimeout(() => {
      loaderScreen.style.display = 'none';
      app.classList.remove('hidden');
      initStarfield();
      animate();
    }, 900);
  }, 3000);

  // Three.js starfield
  let scene, camera, renderer, stars, starGeo;
  let raycaster, mouse;
  let hoverIndex = -1;
  const hoverColor = new THREE.Color(0x2a1460); // dark purple glow
  const baseColor = new THREE.Color(0xffffff);

  function initStarfield(){
    const canvas = document.getElementById('starfield');
    // renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    // scene + camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 2000);
    camera.position.z = 400;

    // create stars as Points
    const starsCount = 1200;
    starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);
    const colors = new Float32Array(starsCount * 3);

    for(let i=0;i<starsCount;i++){
      const r = 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random()*2)-1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6; // flatten slightly
      const z = (Math.random() - 0.5) * 1200;
      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      sizes[i] = Math.random() * 2.4 + 0.6;
      const c = baseColor;
      colors[i*3] = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // material
    const sprite = generateSprite();
    const material = new THREE.PointsMaterial({
      size: 3,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      transparent: true,
      vertexColors: true
    });

    stars = new THREE.Points(starGeo, material);
    scene.add(stars);

    // raycaster & mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Parallax based on mouse
    document.addEventListener('mousemove', onMouseMove);

    // resize
    window.addEventListener('resize', onWindowResize);
  }

  function generateSprite(){
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32,32,2,32,32,30);
    grad.addColorStop(0,'rgba(255,255,255,1)');
    grad.addColorStop(0.2,'rgba(255,255,255,0.9)');
    grad.addColorStop(0.6,'rgba(200,170,255,0.5)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32,32,30,0,Math.PI*2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // animation
  let t = 0;
  let mouseX = 0, mouseY = 0, targetX=0, targetY=0;

  function animate(){
    requestAnimationFrame(animate);
    t += 0.002;

    // rotate whole scene slowly for depth
    if(stars) stars.rotation.y += 0.0005;

    // move stars slowly to create motion
    const positions = starGeo.attributes.position.array;
    for(let i=0;i<positions.length;i+=3){
      positions[i+2] += 0.3; // move towards camera
      if(positions[i+2] > 800){
        positions[i+2] = -800;
      }
    }
    starGeo.attributes.position.needsUpdate = true;

    // parallax camera movement
    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;
    camera.position.x = targetX * 0.6;
    camera.position.y = -targetY * 0.4;
    camera.lookAt(0,0,0);

    // hover detection for glow
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(stars);
    if(intersects.length > 0){
      const idx = intersects[0].index;
      highlightStar(idx);
    } else {
      if(hoverIndex !== -1) restoreStar(hoverIndex);
      hoverIndex = -1;
    }

    renderer.render(scene, camera);
  }

  function highlightStar(index){
    if(hoverIndex === index) return;
    // change color to purple
    const colors = starGeo.attributes.color.array;
    // restore previous
    if(hoverIndex !== -1) restoreStar(hoverIndex);
    hoverIndex = index;
    const i3 = index * 3;
    colors[i3] = hoverColor.r;
    colors[i3+1] = hoverColor.g;
    colors[i3+2] = hoverColor.b;
    starGeo.attributes.color.needsUpdate = true;
    // enlarge the point slightly by modifying size attribute if present (not used by PointsMaterial here)
  }

  function restoreStar(index){
    const colors = starGeo.attributes.color.array;
    const i3 = index * 3;
    colors[i3] = baseColor.r;
    colors[i3+1] = baseColor.g;
    colors[i3+2] = baseColor.b;
    starGeo.attributes.color.needsUpdate = true;
  }

  function onMouseMove(e){
    // normalized device coords
    mouseX = (e.clientX - window.innerWidth/2);
    mouseY = (e.clientY - window.innerHeight/2);
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onWindowResize(){
    if(!camera || !renderer) return;
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

});
