document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.getElementById('loader-screen');
  const app = document.getElementById('app');

  // Loader transition
  setTimeout(() => {
    loaderScreen.classList.add('blur-out');
    setTimeout(() => {
      loaderScreen.style.display = 'none';
      app.classList.remove('hidden');
      initStarfield();
      animate();
    }, 900);
  }, 3000);

  let scene, camera, renderer, stars, starGeo;
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  function initStarfield(){
    const canvas = document.getElementById('starfield');
    renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
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

    for(let i=0;i<starsCount;i++){
      const r = 800;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos((Math.random()*2)-1);
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)*0.6;
      positions[i*3+2] = (Math.random()-0.5)*1200;
      colors[i*3] = 1; colors[i*3+1]=1; colors[i*3+2]=1;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
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

    window.addEventListener("resize", onWindowResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
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

  function animate(){
    requestAnimationFrame(animate);
    const positions = starGeo.attributes.position.array;
    for(let i=0;i<positions.length;i+=3){
      positions[i+2]+=0.3;
      if(positions[i+2]>800) positions[i+2]=-800;
    }
    starGeo.attributes.position.needsUpdate=true;
    stars.rotation.y += 0.0005;

    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;
    camera.position.x = targetX * 0.5;
    camera.position.y = -targetY * 0.3;
    camera.lookAt(0,0,0);

    renderer.render(scene,camera);
  }

  function onMouseMove(e){
    mouseX = (e.clientX - window.innerWidth/2)/100;
    mouseY = (e.clientY - window.innerHeight/2)/100;
  }

  function onTouchMove(e){
    if(e.touches.length>0){
      const t = e.touches[0];
      mouseX = (t.clientX - window.innerWidth/2)/100;
      mouseY = (t.clientY - window.innerHeight/2)/100;
    }
  }

  function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
