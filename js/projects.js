// JavaScript pentru functionalitatea sectiunii Projects
document.addEventListener('DOMContentLoaded', function() {
  // Datele proiectelor - toate 6 proiecte într-o singură categorie
  const projectsData = {
    'ui-ux-design': [
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
          'https://andz7z.github.io/assets/photos/corelle/poza1.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza2.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza3.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza4.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza5.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza6.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza7.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza8.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza9.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza10.jpg',
          'https://andz7z.github.io/assets/photos/corelle/poza11.jpg',
        ],
        thumbnail: 'https://andz7z.github.io/assets/photos/corelle/poza1.jpg'
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
      },
      {
        id: 4,
        name: 'Website Template 4',
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
        id: 5,
        name: 'Website Template 5',
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
        id: 6,
        name: 'Website Template 6',
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
    ]
  };

  // Variabile globale
  let currentCategory = 'ui-ux-design';
  let currentProjectIndex = 0;
  let currentSlideIndex = 0;
  let isChangingProject = false;

  // Elemente DOM
  const projectsSection = document.getElementById('projects');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const projectsGallery = document.querySelector('.projects-gallery');
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
    // Încarcă galeria inițială cu toate cele 6 proiecte
    loadGallery();
    
    // Adaugă event listeners
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', handleCategoryChange);
    });
    
    backBtn.addEventListener('click', handleBack);
    contactBtn.addEventListener('click', handleContact);
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
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
    if (!projectModal.classList.contains('active')) {
      // Navigare între proiecte în afara modalului
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateGallery('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateGallery('next');
      }
    } else {
      // Navigare în modal
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
    
    // Reîncarcă galeria
    loadGallery();
  }

  // Încarcă galeria pentru categoria curentă
  function loadGallery() {
    const projects = projectsData[currentCategory];
    projectsGallery.innerHTML = '';
    
    if (projects && projects.length > 0) {
      // Creează slide-urile pentru galerie - toate cele 6 proiecte
      projects.forEach((project, index) => {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        slide.dataset.projectId = project.id;
        slide.dataset.index = index;
        
        // Setează poziția slide-ului pentru toate cele 6
        if (index === 0) {
          slide.classList.add('active');
        } else if (index === 1) {
          slide.classList.add('next');
        } else if (index === 2) {
          slide.classList.add('far-next');
        } else if (index === 5) {
          slide.classList.add('prev');
        } else if (index === 4) {
          slide.classList.add('far-prev');
        } else {
          slide.classList.add('hidden');
        }
        
        slide.innerHTML = `
          <img src="${project.thumbnail}" alt="${project.name}" class="project-thumbnail">
          <div class="project-overlay">
            <a href="#" class="view-more" data-project-id="${project.id}">VIEW MORE DETAILS</a>
          </div>
        `;
        
        projectsGallery.appendChild(slide);
        
        // Adaugă event listener pentru click pe slide
        slide.addEventListener('click', function(e) {
          if (!e.target.closest('.view-more')) {
            const clickedIndex = parseInt(this.dataset.index);
            if (clickedIndex !== currentProjectIndex) {
              navigateToProject(clickedIndex);
            } else {
              // Dacă se dă click pe proiectul activ, deschide modalul
              openModal(project.id);
            }
          }
        });
      });
      
      // Adaugă event listener pentru butoanele "VIEW MORE"
      document.addEventListener('click', function(e) {
        if (e.target.closest('.view-more')) {
          e.preventDefault();
          const projectId = parseInt(e.target.closest('.view-more').dataset.projectId);
          openModal(projectId);
        }
      });
    }
  }

  // Navighează la un proiect specific în galerie
  function navigateToProject(targetIndex) {
    const projects = projectsData[currentCategory];
    const slides = document.querySelectorAll('.project-slide');
    
    // Actualizează indexul curent
    currentProjectIndex = targetIndex;
    
    // Actualizează clasele pentru toate slide-urile
    slides.forEach((slide, index) => {
      const slideIndex = parseInt(slide.dataset.index);
      slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
      
      // Calculează pozițiile relative pentru toate cele 6 proiecte
      const diff = slideIndex - targetIndex;
      const totalSlides = projects.length;
      
      if (diff === 0) {
        slide.classList.add('active');
      } else if (diff === 1 || diff === 1 - totalSlides) {
        slide.classList.add('next');
      } else if (diff === -1 || diff === totalSlides - 1) {
        slide.classList.add('prev');
      } else if (diff === 2 || diff === 2 - totalSlides) {
        slide.classList.add('far-next');
      } else if (diff === -2 || diff === totalSlides - 2) {
        slide.classList.add('far-prev');
      } else {
        slide.classList.add('hidden');
      }
    });
  }

  // Navighează în galerie (prev/next)
  function navigateGallery(direction) {
    const projects = projectsData[currentCategory];
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
    } else {
      newIndex = (currentProjectIndex + 1) % projects.length;
    }
    
    navigateToProject(newIndex);
  }

  // Deschide modalul cu detaliile proiectului
  function openModal(projectId) {
    const project = findProjectById(projectId);
    
    if (!project) return;
    
    // Adaugă clasa pentru scrollbar mai subțire
    document.documentElement.classList.add('modal-open');
    
    // Actualizează titlul modalului
    modalTitle.textContent = 'UI/UX Design Projects';
    
    // Încarcă galeria de imagini
    loadModalGallery(project.images);
    
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
    
    // Încarcă proiectele conexe (următoarele 2 proiecte în loop)
    loadRelatedProjects(projectId);
    
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
  function changeProject(projectId) {
    if (isChangingProject) return;
    
    isChangingProject = true;
    const project = findProjectById(projectId);
    
    if (!project) return;
    
    // Animație de ieșire
    modalContent.classList.add('changing');
    
    setTimeout(() => {
      // Actualizează conținutul
      modalTitle.textContent = 'UI/UX Design Projects';
      loadModalGallery(project.images);
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
      loadRelatedProjects(projectId);
      
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

  // Încarcă galeria de imagini pentru modal
  function loadModalGallery(images) {
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

  // Încarcă proiectele conexe (următoarele 2 proiecte în loop)
  function loadRelatedProjects(currentProjectId) {
    const projects = projectsData[currentCategory];
    const currentIndex = projects.findIndex(p => p.id === currentProjectId);
    
    // Calculează următoarele 2 proiecte în loop
    const related = [];
    for (let i = 1; i <= 2; i++) {
      const nextIndex = (currentIndex + i) % projects.length;
      related.push(projects[nextIndex]);
    }
    
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
      
      // Adaugă event listener pentru proiectele conexe
      projectEl.addEventListener('click', function() {
        if (isChangingProject) return;
        const projectId = parseInt(this.dataset.projectId);
        changeProject(projectId);
      });
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

  // Găsește un proiect după ID
  function findProjectById(projectId) {
    for (const category in projectsData) {
      const project = projectsData[category].find(p => p.id === projectId);
      if (project) return project;
    }
    return null;
  }

  // Pornește aplicația
  init();

});
