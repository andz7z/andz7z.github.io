document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
    proximity: 300,        
    magneticForce: 0.4,    
    smoothness: 0.1,       
    tiltStrength: 15,      
    scaleOnHover: 1.02     
  };

  // --- Global State ---
  let mouseX = 0;
  let mouseY = 0;
  let isMobile = window.innerWidth <= 768;

  // Handle Resize to update state
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    // Force physics reset on mobile resize
    if(isMobile) {
       document.querySelectorAll('.smart-badge').forEach(el => el.style.transform = '');
    }
  });

  // Track mouse globally
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // --- PHYSICS ENGINE CLASS ---
  class MagneticBadge {
    constructor(el) {
      this.el = el;
      this.x = 0;
      this.y = 0;
      this.isHovering = false;
      this.animate();
      
      this.el.addEventListener('mouseenter', () => this.isHovering = true);
      this.el.addEventListener('mouseleave', () => this.isHovering = false);
      
      // Add Touch Feedback for Mobile
      this.el.addEventListener('touchstart', () => {
        if(isMobile) this.el.style.transform = 'scale(0.96)';
      }, {passive: true});
      
      this.el.addEventListener('touchend', () => {
        if(isMobile) this.el.style.transform = '';
      }, {passive: true});
    }

    lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    animate() {
      if (!isMobile) {
        const rect = this.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = mouseX - centerX;
        const distanceY = mouseY - centerY;
        const dist = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // Spotlight Logic
        if (dist < CONFIG.proximity * 1.5) {
          const relX = mouseX - rect.left;
          const relY = mouseY - rect.top;
          this.el.style.setProperty('--x', `${relX}px`);
          this.el.style.setProperty('--y', `${relY}px`);
        }

        let targetX = 0;
        let targetY = 0;
        let rotateX = 0;
        let rotateY = 0;

        // Magnetic Logic
        if (dist < CONFIG.proximity) {
          const pull = (CONFIG.proximity - dist) / CONFIG.proximity;
          
          targetX = distanceX * CONFIG.magneticForce * pull;
          targetY = distanceY * CONFIG.magneticForce * pull;

          rotateY = (distanceX / (rect.width / 2)) * CONFIG.tiltStrength * pull;
          rotateX = -(distanceY / (rect.height / 2)) * CONFIG.tiltStrength * pull;
        }

        // Apply Physics (Lerp)
        this.x = this.lerp(this.x, targetX, CONFIG.smoothness);
        this.y = this.lerp(this.y, targetY, CONFIG.smoothness);
        
        const currentRotateX = parseFloat(this.el.dataset.rotateX || 0);
        const currentRotateY = parseFloat(this.el.dataset.rotateY || 0);
        
        const newRotateX = this.lerp(currentRotateX, rotateX, CONFIG.smoothness);
        const newRotateY = this.lerp(currentRotateY, rotateY, CONFIG.smoothness);
        
        this.el.dataset.rotateX = newRotateX;
        this.el.dataset.rotateY = newRotateY;

        this.el.style.transform = `
          translate3d(${this.x}px, ${this.y}px, 0)
          perspective(1000px)
          rotateX(${newRotateX}deg)
          rotateY(${newRotateY}deg)
          scale(${this.isHovering ? CONFIG.scaleOnHover : 1})
        `;
      } 
      // Note: Mobile transform reset handled by touch events or CSS
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize Physics
  const badges = document.querySelectorAll('.smart-badge');
  badges.forEach(badgeEl => new MagneticBadge(badgeEl));


  // --- VIDEO LOGIC (Left Badge Only) ---
  const projectBadge = document.querySelector('.project-badge');
  const previewVideos = document.querySelectorAll('.badge-video');
  const progressFill = document.querySelector('.progress-fill');
  
  if (projectBadge && previewVideos.length > 0) {
    let currentVideoIndex = 0;
    let progressInterval;
    let isVideoHovering = false;

    const resetProgress = () => {
      if (progressFill) progressFill.style.width = '0%';
      clearInterval(progressInterval);
    };

    const startProgress = (duration) => {
      if (!progressFill) return;
      let width = 0;
      const intervalTime = 50; 
      const step = 100 / (duration / intervalTime);
      
      clearInterval(progressInterval);
      progressFill.style.width = '0%';
      
      progressInterval = setInterval(() => {
        width += step;
        if (width >= 100) width = 100;
        progressFill.style.width = `${width}%`;
      }, intervalTime);
    };

    const playNextVideo = () => {
      if (!isVideoHovering) return;

      const currentVideo = previewVideos[currentVideoIndex];
      const nextIndex = (currentVideoIndex + 1) % previewVideos.length;
      const nextVideo = previewVideos[nextIndex];

      nextVideo.currentTime = 0;
      nextVideo.style.zIndex = "2";
      currentVideo.style.zIndex = "1";

      nextVideo.play().then(() => {
        nextVideo.classList.add('active');
        const duration = (nextVideo.duration || 4) * 1000;
        startProgress(duration);

        setTimeout(() => {
          currentVideo.classList.remove('active');
          currentVideo.pause();
        }, 800);
        
        currentVideoIndex = nextIndex;
        nextVideo.onended = () => playNextVideo();
      }).catch(e => {});
    };

    projectBadge.addEventListener('mouseenter', () => {
      if (isMobile) return;
      isVideoHovering = true;
      const firstVideo = previewVideos[currentVideoIndex];
      firstVideo.classList.add('active');
      firstVideo.play().catch(e => {});
      
      const duration = (firstVideo.duration || 4) * 1000;
      startProgress(duration);
      firstVideo.onended = () => playNextVideo();
    });

    projectBadge.addEventListener('mouseleave', () => {
      isVideoHovering = false;
      resetProgress();
      previewVideos.forEach(v => {
        v.pause(); v.currentTime = 0; v.classList.remove('active');
        v.onended = null; v.style.zIndex = "";
      });
      currentVideoIndex = 0;
      previewVideos[0].classList.add('active');
    });
  }

  // --- SCROLL LOGIC ---
  let lastScrollTop = 0;
  const wrappers = document.querySelectorAll('.smart-badge-wrapper');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 50) {
      wrappers.forEach(w => w.classList.add('scroll-hide'));
    } else {
      wrappers.forEach(w => w.classList.remove('scroll-hide'));
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

});