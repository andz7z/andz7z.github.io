/* Main JS: Three.js Starfield + Loader transition + interactions */

document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.getElementById('loader-screen');
  const app = document.getElementById('app');
  // const heroLines = document.querySelectorAll('.hero-line'); // Eliminat

  // Loader + fade-in app
  setTimeout(() => {
    loaderScreen.classList.add('blur-out');

    // după tranziția de blur
    setTimeout(() => {
      loaderScreen.style.display = 'none';
      
      // arată app și inițializează starfield
      app.classList.remove('hidden');
      initStarfield();
      animate();

      // fade-in pentru app (stele + hero content)
      setTimeout(() => {
        app.classList.add('active'); // clasa CSS .fade-in.active
        // Blocul setTimeout pentru header a fost eliminat
      }, 50);

    }, 900); // durata tranziției loader-ului
  }, 3000); // durata loader-ului

  let scene, camera, renderer, stars, starGeo;
  let raycaster, mouse;
  let hoverIndex = -1;

  function initStarfield(){
    const canvas = document.getElementById('starfield');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 2000);
    camera.position.z = 400;

    const starsCount = 1200;
    starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);

    for(let i=0;i<starsCount;i++){
      const r = 800;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos((Math.random()*2)-1);
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)*0.6;
      positions[i*3+2] = (Math.random()-0.5)*1200;
      sizes[i] = Math.random()*2.4+0.6;
      colors[i*3] = 1; colors[i*3+1]=1; colors[i*3+2]=1;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes,1));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors,3));

    const sprite = generateSprite();
    const material = new THREE.PointsMaterial({
      size:3,
      map:sprite,
      blending:THREE.AdditiveBlending,
      depthTest:true,
      transparent:true,
      vertexColors:true
    });

    stars = new THREE.Points(starGeo, material);
    scene.add(stars);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener('mousemove', onMouseMove);
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
    return new THREE.CanvasTexture(canvas);
  }

  let t=0;
  let mouseX=0, mouseY=0, targetX=0, targetY=0;

  function animate(){
    requestAnimationFrame(animate);
    t+=0.002;

    if(stars) stars.rotation.y += 0.0005;

    const positions = starGeo.attributes.position.array;
    for(let i=0;i<positions.length;i+=3){
      positions[i+2]+=0.3;
      if(positions[i+2]>800) positions[i+2]=-800;
    }
    starGeo.attributes.position.needsUpdate=true;

    targetX+=(mouseX-targetX)*0.02;
    targetY+=(mouseY-targetY)*0.02;
    camera.position.x = targetX*0.6;
    camera.position.y = -targetY*0.4;
    camera.lookAt(0,0,0);

    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObject(stars);
    
    // Logica if(intersects.length>0) care folosea heroLines a fost eliminată

    renderer.render(scene,camera);
  }

  function onMouseMove(e){
    mouseX = (e.clientX - window.innerWidth/2);
    mouseY = (e.clientY - window.innerHeight/2);
    mouse.x = (e.clientX / window.innerWidth)*2-1;
    mouse.y = -(e.clientY / window.innerHeight)*2+1;
  }

  function onWindowResize(){
    if(!camera||!renderer) return;
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

/* === BLOCUL JS PENTRU HEADER A FOST ELIMINAT === */
