// JavaScript pentru functionalitatea sectiunii Projects
document.addEventListener('DOMContentLoaded', function() {
  // Datele proiectelor
  const projectsData = {
    'web-development': [
      {
        id: 1,
        name: 'Website Template 1',
        description: 'A fully responsive e-commerce platform with advanced features designed to provide a seamless shopping experience across all devices. This project includes a sophisticated product management system, secure payment processing, and personalized user recommendations. The platform is optimized for performance and SEO, ensuring maximum visibility and conversion rates for online businesses.',
        features: [
          'Advanced User Registration System',
          'Interactive Review & Rating System',
          'Real-time Chat Functionality',
          'Payment Integration System',
          'Advanced Analytics Dashboard'
        ],
        images: [
          'https://andz7z.github.io/assets/photos/altele/entry_project_slide.jpg',
          'https://andz7z.github.io/assets/photos/altele/entry_project_slide1.jpg',
          'https://andz7z.github.io/assets/photos/altele/entry_project_slide2.jpg'
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/altele/entry_project_slide.jpg'
      },
      {
        id: 2,
        name: 'Website Template 2',
        description: 'A modern portfolio website showcasing creative work with smooth animations and interactive elements to engage visitors. The design emphasizes visual storytelling and user experience, with carefully crafted transitions and micro-interactions. The site is fully responsive and optimized for fast loading times across all devices and connection speeds.',
        features: [
          'Smooth Scroll Animations',
          'Interactive Gallery',
          'Contact Form with Validation',
          'Responsive Design',
          'SEO Optimization'
        ],
        images: [
          'https://andz7z.github.io/assets/photos/altele/project_one.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_one.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_one.jpg'
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_one.jpg'
      },
      {
        id: 3,
        name: 'Website Template 3',
        description: 'A comprehensive business dashboard with real-time data visualization and reporting tools for informed decision-making. This project features customizable widgets, interactive charts, and advanced filtering options. The dashboard integrates with multiple data sources and provides actionable insights through intuitive visual representations of complex business metrics.',
        features: [
          'Real-time Data Visualization',
          'Custom Reporting Tools',
          'User Management System',
          'Data Export Functionality',
          'Multi-level Access Control'
        ],
        images: [
          'https://andz7z.github.io/assets/photos/altele/project_two.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_two.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_two.jpg'
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_two.jpg'
      }
    ],
    'ui-ux-design': [
      {
        id: 1,
        name: 'Brand Design Template 1',
        description: 'A user-friendly mobile banking application with intuitive navigation and secure transaction features for modern banking needs. The design focuses on simplifying complex financial operations while maintaining the highest security standards. The app includes personalized dashboards, spending analytics, and seamless integration with banking services for a comprehensive financial management experience.',
        features: [
          'Intuitive Navigation Design',
          'Secure Transaction Flow',
          'Biometric Authentication',
          'Personalized Dashboard',
          'Bill Payment System'
        ],
        images: [
          'https://andz7z.github.io/assets/photos/altele/project_three.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_three.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_three.jpg'
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_three.jpg'
      },
      {
        id: 2,
        name: 'Brand Design Template 2',
        description: 'A comprehensive fitness tracking application with personalized workout plans and progress monitoring features. The design emphasizes motivation and consistency through gamification elements and social features. Users can track various metrics, set goals, and connect with friends for a more engaging fitness journey. The interface is clean, energetic, and easy to navigate during workouts.',
        features: [
          'Personalized Workout Plans',
          'Progress Tracking Dashboard',
          'Social Sharing Features',
          'Nutrition Tracking',
          'Goal Setting System'
        ],
        images: [
          'https://andz7z.github.io/assets/photos/altele/project_four.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_four.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_four.jpg'
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_four.jpg'
      },
      {
        id: 3,
        name: 'Brand Design Template 3',
        description: 'An intuitive travel booking platform with seamless booking flow and personalized recommendations for travelers. The design focuses on reducing friction in the booking process while providing comprehensive information about destinations and accommodations. Visual elements are carefully selected to evoke wanderlust while maintaining clarity and usability throughout the customer journey.',
        features: [
          'Seamless Booking Flow',
          'Personalized Recommendations',
          'Interactive Maps Integration',
          'Review & Rating System',
          'Multi-language Support'
        ],
        images: [
          'https://andz7z.github.io/assets/photos/altele/project_five.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_five.jpg',
          'https://andz7z.github.io/assets/photos/altele/project_five.jpg'
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_five.jpg'
      }
    ],
    'video-editing': [
      {
        id: 1,
        name: 'Corporate Brand Video',
        description: 'A professional corporate brand video showcasing company values and services with high-quality visuals and engaging storytelling. This project involved extensive pre-production planning, including script development and storyboarding. The final video effectively communicates the brand identity through carefully crafted visuals, sound design, and narrative structure that resonates with the target audience and strengthens brand recognition.',
        features: [
          'High-Quality Visuals',
          'Engaging Storytelling',
          'Professional Voiceover',
          'Motion Graphics',
          'Color Grading'
        ],
        images: [
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1439&q=80',
          'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1439&q=80'
      },
      {
        id: 2,
        name: 'Product Launch Video',
        description: 'An engaging product launch video with dynamic transitions and compelling visuals to showcase new product features. This project required close collaboration with the product team to highlight key benefits and differentiators. The video combines live-action footage with animated elements to create an exciting and informative presentation that generates buzz and drives pre-orders for the new product launch.',
        features: [
          'Dynamic Transitions',
          'Compelling Visuals',
          'Sound Design',
          'Product Demonstrations',
          'Call-to-Action Elements'
        ],
        images: [
          'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80'
      },
      {
        id: 3,
        name: 'Event Highlights Reel',
        description: 'A dynamic event highlights reel capturing key moments with creative editing and energetic pacing. This project involved sorting through hours of footage to identify the most impactful moments that tell the story of the event. The final video combines multiple camera angles, audience reactions, and speaker highlights to create an engaging recap that can be shared across social media platforms to extend the event reach.',
        features: [
          'Creative Editing',
          'Energetic Pacing',
          'Music Synchronization',
          'Highlight Selection',
          'Social Media Optimization'
        ],
        images: [
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80'
      }
    ]
  };

  // Variabile globale
  let currentCategory = 'web-development';
  let currentProjectIndex = 0;
  let currentSlideIndex = 0;
  let isChangingProject = false;

  // Elemente DOM
  const projectsSection = document.getElementById('projects');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const projectMain = document.querySelector('.project-main');
  const projectModal = document.querySelector('.project-modal');
  const modalTitle = document.querySelector('.modal-title');
  const gallerySlides = document.querySelector('.gallery-slides');
  const projectName = document.querySelector('.project-name');
  const projectDescription = document.querySelector('.project-description p');
  const keyFeatures = document.querySelector('.key-features');
  const relatedProjects = document.querySelector('.related-projects');
  const backBtn = document.querySelector('.back-btn');
  const contactBtn = document.querySelector('.contact-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const modalContent = document.querySelector('.modal-content');

  // Inițializare
  function init() {
    // Încarcă proiectele inițiale
    loadProjects(currentCategory);
    
    // Adaugă event listeners
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', handleCategoryChange);
    });
    
    backBtn.addEventListener('click', handleBack);
    contactBtn.addEventListener('click', handleContact);
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // Adaugă event listener pentru proiectele conexe (se va adăuga dinamic)
    document.addEventListener('click', function(e) {
      if (e.target.closest('.view-more')) {
        e.preventDefault();
        const projectId = parseInt(e.target.closest('.view-more').dataset.projectId);
        openModal(currentCategory, projectId);
      }
      
      if (e.target.closest('.related-project')) {
        if (isChangingProject) return;
        const projectId = parseInt(e.target.closest('.related-project').dataset.projectId);
        changeProject(currentCategory, projectId);
      }
    });
    
    // Navigare cu tastatura
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Gestionează scroll-ul pentru animație
    window.addEventListener('scroll', handleScroll);
  }

  // Gestionează scroll-ul pentru animație
  function handleScroll() {
    const sectionTop = projectsSection.offsetTop;
    const sectionHeight = projectsSection.offsetHeight;
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Calculează cât de mult este vizibilă secțiunea
    const sectionStart = sectionTop - windowHeight;
    const sectionEnd = sectionTop + sectionHeight;
    
    if (scrollPosition > sectionStart && scrollPosition < sectionEnd) {
      // Secțiunea este în viewport - setează opacitatea normală
      projectsSection.style.opacity = '1';
    } else {
      // Secțiunea nu este în viewport - setează opacitatea redusă
      projectsSection.style.opacity = '0.3';
    }
  }

  // Navigare cu tastatura
  function handleKeyboardNavigation(e) {
    if (!projectModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        showPrevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        showNextSlide();
        break;
      case 'Escape':
        e.preventDefault();
        handleBack();
        break;
    }
  }

  // Schimbă categoria
  function handleCategoryChange(e) {
    const category = e.target.dataset.category;
    
    // Actualizează butoanele active
    categoryButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Schimbă categoria curentă
    currentCategory = category;
    currentProjectIndex = 0;
    
    // Animație de tranziție pentru thumbnail
    projectMain.classList.add('thumbnail-changing');
    
    setTimeout(() => {
      // Încarcă proiectele noi
      loadProjects(category);
    }, 300);
  }

  // Încarcă proiectele pentru o categorie
  function loadProjects(category) {
    const projects = projectsData[category];
    
    if (projects && projects.length > 0) {
      // Afișează primul proiect
      displayProject(projects[0], category);
    }
  }

  // Afișează un proiect în secțiunea principală
  function displayProject(project, category) {
    // Actualizează thumbnail-ul
    projectMain.innerHTML = `
      <img src="${project.thumbnail}" alt="${project.name}" class="project-thumbnail">
      <div class="project-overlay">
        <a href="#" class="view-more" data-project-id="${project.id}">VIEW MORE TEMPLATES</a>
      </div>
    `;
  }

  // Deschide modalul cu detaliile proiectului
  function openModal(category, projectId) {
    const projects = projectsData[category];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Actualizează indexul proiectului curent
    currentProjectIndex = projects.findIndex(p => p.id === projectId);
    currentCategory = category;
    
    // Adaugă clasa pentru scrollbar mai subțire
    document.documentElement.classList.add('modal-open');
    
    // Actualizează titlul modalului
    modalTitle.textContent = `${getCategoryName(category)} Projects`;
    
    // Încarcă galeria de imagini
    loadGallery(project.images);
    
    // Actualizează informațiile proiectului
    projectName.textContent = project.name;
    projectDescription.textContent = project.description;
    
    // Actualizează caracteristicile cheie
    keyFeatures.innerHTML = '';
    project.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `
        <ion-icon name="checkmark-circle"></ion-icon>
        <span class="feature-text">${feature}</span>
      `;
      keyFeatures.appendChild(li);
    });
    
    // Încarcă proiectele conexe
    loadRelatedProjects(category, projectId);
    
    // Afișează modalul
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Scroll automat la începutul modalului
    setTimeout(() => {
      modalContent.scrollTop = 0;
      
      // Activează animațiile de intrare
      animateModalContent();
    }, 100);
  }

  // Schimbă proiectul în modal
  function changeProject(category, projectId) {
    if (isChangingProject) return;
    
    isChangingProject = true;
    const projects = projectsData[category];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Actualizează indexul proiectului curent
    currentProjectIndex = projects.findIndex(p => p.id === projectId);
    
    // Animație de ieșire
    modalContent.classList.add('changing');
    
    setTimeout(() => {
      // Actualizează conținutul
      modalTitle.textContent = `${getCategoryName(category)} Projects`;
      loadGallery(project.images);
      projectName.textContent = project.name;
      projectDescription.textContent = project.description;
      
      // Actualizează caracteristicile cheie
      keyFeatures.innerHTML = '';
      project.features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `
          <ion-icon name="checkmark-circle"></ion-icon>
          <span class="feature-text">${feature}</span>
        `;
        keyFeatures.appendChild(li);
      });
      
      // Încarcă proiectele conexe
      loadRelatedProjects(category, projectId);
      
      // Scroll la început
      modalContent.scrollTop = 0;
      
      // Animație de intrare
      modalContent.classList.remove('changing');
      
      setTimeout(() => {
        animateModalContent();
        isChangingProject = false;
      }, 50);
    }, 500);
  }

  // Animație pentru conținutul modalului
  function animateModalContent() {
    // Resetează clasele pentru animații
    projectName.classList.remove('typing');
    projectDescription.classList.remove('typing');
    keyFeatures.querySelectorAll('li').forEach(li => {
      li.classList.remove('typing');
      li.querySelector('.feature-text').classList.remove('typing');
    });
    
    // Activează animațiile
    setTimeout(() => {
      projectName.classList.add('typing');
      
      setTimeout(() => {
        projectDescription.classList.add('typing');
        
        keyFeatures.querySelectorAll('li').forEach((li, index) => {
          setTimeout(() => {
            li.classList.add('typing');
            
            setTimeout(() => {
              li.querySelector('.feature-text').classList.add('typing');
            }, 150);
          }, index * 200);
        });
      }, 300);
    }, 300);
  }

  // Gestionează butonul de back
  function handleBack() {
    closeModal();
  }

  // Închide modalul
  function closeModal() {
    projectModal.classList.add('closing');
    
    setTimeout(() => {
      projectModal.classList.remove('active', 'closing');
      document.body.style.overflow = 'auto';
      document.documentElement.classList.remove('modal-open');
    }, 600);
  }

  // Încarcă galeria de imagini
  function loadGallery(images) {
    gallerySlides.innerHTML = '';
    currentSlideIndex = 0;
    
    images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
      slide.innerHTML = `<img src="${image}" alt="Project image ${index + 1}" class="gallery-image">`;
      gallerySlides.appendChild(slide);
    });
  }

  // Afișează slide-ul anterior
  function showPrevSlide() {
    const slides = document.querySelectorAll('.gallery-slide');
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
  }

  // Afișează slide-ul următor
  function showNextSlide() {
    const slides = document.querySelectorAll('.gallery-slide');
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('active');
  }

  // Încarcă proiectele conexe
  function loadRelatedProjects(category, currentProjectId) {
    const projects = projectsData[category];
    const related = projects.filter(p => p.id !== currentProjectId);
    
    relatedProjects.innerHTML = '';
    
    related.forEach(project => {
      const projectEl = document.createElement('div');
      projectEl.className = 'related-project';
      projectEl.dataset.projectId = project.id;
      projectEl.innerHTML = `
        <img src="${project.thumbnail}" alt="${project.name}" class="related-image">
        <div class="related-overlay">
          <h4 class="related-title">${project.name}</h4>
        </div>
      `;
      relatedProjects.appendChild(projectEl);
    });
  }

  // Gestionează butonul de contact
  function handleContact() {
    // Animație de ieșire
    projectModal.classList.add('closing');
    
    setTimeout(() => {
      // Închide modalul
      projectModal.classList.remove('active', 'closing');
      document.body.style.overflow = 'auto';
      document.documentElement.classList.remove('modal-open');
      
      // Redirecționează către secțiunea de contact
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          alert('Contact section not found!');
        }
      }, 300);
    }, 600);
  }

  // Obține numele categoriei pentru afișare
  function getCategoryName(category) {
    const names = {
      'web-development': 'Web Development',
      'ui-ux-design': 'UI/UX Design',
      'video-editing': 'Video Editing'
    };
    
    return names[category] || category;
  }

  // Pornește aplicația
  init();
});