// JavaScript pentru sectiunea CV - Denumiri specifice
document.addEventListener('DOMContentLoaded', function() {
  // Date proiecte
  const cvProjects = [
    {
      title: "Season Changer Mod",
      video: "https://www.youtube.com/embed/HbAOwc0uuog",
      description: "LUA language mod for the game GTA: San Andreas that makes it possible to change the season, from winter to summer or from summer to winter",
      features: [
        "Real-time transition",
        "Files easy to replace",
        "No FPS Drops",
        "LUA Mod"
      ]
    },
    {
      title: "Name Tags Mod",
      video: "https://www.youtube.com/embed/YvrohFDwgvs",
      description: "LUA language mod for the game GTA: San Andreas that changes those basic name-tags into completely modern ones, featuring minimalist icons",
      features: [
        "Real-time transition",
        "Files easy to replace",
        "No FPS Drops",
        "LUA Mod"
      ]
    },
    {
      title: "Time Changer Mod",
      video: "https://www.youtube.com/embed/5Cg6yKZDJrM",
      description: "LUA language mod for the game GTA: San Andreas that fluently changes the weather. Any hour from 0 to 24 can be selected, the transition is smooth, taking the game through every minute",
      features: [
        "Real-time transition",
        "Files easy to replace",
        "No FPS Drops",
        "LUA Mod"
      ]
    },
    {
      title: "Complete Pack Mods",
      video: "https://www.youtube.com/embed/Kp3XfO1PtHY",
      description: "It is a complete mod pack, which contains files of type: Lua, Asi, CS, .txt, and many others; it is a full/complete mod package",
      features: [
        "Full Archive",
        "Files easy to replace",
        "No FPS Drops",
        "LUA/CS/ASI Mods"
      ]
    }
  ];

  // Elemente DOM cu prefix cv
  const cvProjectItems = document.querySelectorAll('.cv-project-item');
  const cvProjectModal = document.querySelector('.cv-project-modal');
  const cvModalBackdrop = document.querySelector('.cv-modal-backdrop');
  const cvBackBtn = document.querySelector('.cv-back-btn');
  const cvContactBtn = document.querySelector('.cv-contact-btn');
  const cvModalTitle = document.querySelector('.cv-modal-title');
  const cvProjectName = document.querySelector('.cv-project-name-full');
  const cvProjectVideo = document.getElementById('cv-project-video');
  const cvProjectDescription = document.querySelector('.cv-project-description-full');
  const cvProjectFeatures = document.querySelector('.cv-key-features-full ul');
  const cvRelatedProjects = document.querySelector('.cv-related-projects');
  const cvLastVideoPreview = document.querySelector('.cv-last-video-preview');

  // Funcție pentru a obține 2 proiecte aleatorii (excluzând proiectul curent)
  function getRandomRelatedProjects(currentIndex) {
    const availableProjects = cvProjects.filter((_, index) => index !== currentIndex);
    const shuffled = [...availableProjects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }

  // Deschidere modal proiect
  cvProjectItems.forEach(item => {
    item.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      cvOpenProjectModal(index);
    });
  });

  // Închidere modal
  cvBackBtn.addEventListener('click', cvCloseProjectModal);
  cvModalBackdrop.addEventListener('click', cvCloseProjectModal);

  // Funcție deschidere modal
  function cvOpenProjectModal(index) {
    const project = cvProjects[index];
    const relatedProjects = getRandomRelatedProjects(index);
    
    // Setare conținut
    cvModalTitle.textContent = 'Project Details';
    cvProjectName.textContent = project.title;
    cvProjectVideo.src = project.video;
    
    // Setare descriere
    cvProjectDescription.innerHTML = '';
    const paragraphs = project.description.split('. ');
    paragraphs.forEach(para => {
      if (para.trim()) {
        const p = document.createElement('p');
        p.textContent = para + '.';
        cvProjectDescription.appendChild(p);
      }
    });
    
    // Setare features
    cvProjectFeatures.innerHTML = '';
    project.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="cv-feature-text">${feature}</span>
      `;
      cvProjectFeatures.appendChild(li);
    });

    // Setare related projects (doar din cele 4 proiecte existente)
    cvRelatedProjects.innerHTML = '';
    relatedProjects.forEach((relatedProject, relatedIndex) => {
      const originalIndex = cvProjects.findIndex(p => p.title === relatedProject.title);
      const relatedProjectElement = document.createElement('div');
      relatedProjectElement.className = 'cv-related-project';
      relatedProjectElement.setAttribute('data-index', originalIndex);
      relatedProjectElement.innerHTML = `
        <img src="https://images.unsplash.com/photo-${['1555066931-4365d14bab8c', '1551650975-87deedd944c3', '1551288049-bebda4e38f71', '1547658719-da2b51169166'][originalIndex]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
             alt="${relatedProject.title}" class="cv-related-image">
        <div class="cv-related-overlay">
          <h4 class="cv-related-title">${relatedProject.title}</h4>
        </div>
      `;
      cvRelatedProjects.appendChild(relatedProjectElement);

      // Adăugare event listener pentru related projects
      relatedProjectElement.addEventListener('click', function() {
        cvOpenProjectModal(originalIndex);
      });
    });
    
    // Afișare modal
    cvProjectModal.classList.add('cv-active');
    document.body.classList.add('cv-modal-open');
    document.body.style.overflow = 'hidden';
    
    // Animații de intrare pentru conținut
    setTimeout(() => {
      cvAnimateModalContent();
    }, 300);
  }

  // Funcție închidere modal
  function cvCloseProjectModal() {
    cvProjectModal.classList.remove('cv-active');
    document.body.classList.remove('cv-modal-open');
    document.body.style.overflow = 'auto';
    
    // Oprire video
    cvProjectVideo.src = '';
  }

  // Animație conținut modal
  function cvAnimateModalContent() {
    const elements = [
      cvProjectName,
      ...cvProjectDescription.querySelectorAll('p'),
      ...cvProjectFeatures.querySelectorAll('li'),
      ...cvProjectFeatures.querySelectorAll('.cv-feature-text')
    ];
    
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translate(0)';
        el.style.transition = 'all 0.5s ease';
      }, index * 100);
    });

    // Animație pentru related projects
    const relatedProjectElements = document.querySelectorAll('.cv-related-project');
    relatedProjectElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'all 0.6s ease';
      }, 600 + index * 200);
    });
  }

  // Închidere cu ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cvProjectModal.classList.contains('cv-active')) {
      cvCloseProjectModal();
    }
  });

  // Contact button action
  cvContactBtn.addEventListener('click', function() {
    alert('Contact functionality would go here!');
  });

  // Last video preview click
  cvLastVideoPreview.addEventListener('click', function() {
    window.open('https://youtu.be/HbAOwc0uuog', '_blank');
  });

  // Hover effects pentru timeline items
  const cvTimelineItems = document.querySelectorAll('.cv-timeline-item');
  cvTimelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('.cv-timeline-marker').style.transform = 'scale(1.2)';
    });
    
    item.addEventListener('mouseleave', function() {
      if (!this.classList.contains('cv-timeline-active')) {
        this.querySelector('.cv-timeline-marker').style.transform = 'scale(1)';
      }
    });
  });

  // Animare la scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('[style*="animation"]').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // YouTube API mock (ultimul videoclip)
  function cvFetchYouTubeData() {
    // În practică, aici ai face un request la API-ul tău YouTube
    const mockData = {
      channelName: "visuals",
      avatar: "https://images.unsplash.com/photo-1746608943506-bb1663f3f61a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      viewCount: "25.234",
      subscriberCount: "175",
      videoCount: "5",
      lastVideo: {
        title: "Season Changer [LUA Mod]",
        thumbnail: "https://i.ytimg.com/vi/HbAOwc0uuog/hqdefault.jpg",
        date: "2 days ago",
        views: "1.2K views",
        url: "https://www.youtube.com/watch?v=8bU_tI3SKmA&t=3s"
      }
    };
    
    document.getElementById('cv-channel-name').textContent = mockData.channelName;
    document.getElementById('cv-avatar').src = mockData.avatar;
    document.getElementById('cv-view-count').textContent = mockData.viewCount;
    document.getElementById('cv-subscriber-count').textContent = mockData.subscriberCount;
    document.getElementById('cv-video-count').textContent = mockData.videoCount;
  }

  cvFetchYouTubeData();
});