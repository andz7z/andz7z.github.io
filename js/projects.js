// Date pentru proiecte
const projectsData = {
  web: [
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "A modern e-commerce solution with advanced filtering, user authentication, and secure payment processing.",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800",
        "https://images.unsplash.com/photo-1563013546-7e58a73f5c14?w=800"
      ],
      features: ["User Registration", "Shopping Cart", "Payment Gateway", "Product Reviews", "Admin Dashboard"],
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      shortDesc: "Full-featured online store"
    },
    {
      id: 2,
      name: "Portfolio Website",
      description: "A responsive portfolio website with smooth animations, project gallery, and contact form integration.",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
      ],
      features: ["Responsive Design", "Smooth Animations", "Contact Form", "Project Gallery", "SEO Optimized"],
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      shortDesc: "Creative portfolio showcase"
    },
    {
      id: 3,
      name: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration, and progress tracking.",
      images: [
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
        "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
      ],
      features: ["Real-time Updates", "Team Collaboration", "Progress Tracking", "File Sharing", "Mobile App"],
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
      shortDesc: "Team productivity tool"
    }
  ],
  brand: [
    {
      id: 1,
      name: "Coffee Shop Branding",
      description: "Complete branding package for a specialty coffee shop including logo, packaging, and merchandise design.",
      images: [
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800",
        "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
      ],
      features: ["Logo Design", "Packaging", "Merchandise", "Brand Guidelines", "Social Media Kit"],
      thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
      shortDesc: "Artisan coffee brand identity"
    },
    {
      id: 2,
      name: "Tech Startup Identity",
      description: "Modern and innovative branding for a technology startup focusing on AI and machine learning solutions.",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
        "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800"
      ],
      features: ["Logo & Identity", "Website Design", "Presentation Templates", "Product Mockups", "Brand Book"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
      shortDesc: "Innovative tech branding"
    },
    {
      id: 3,
      name: "Fashion Label",
      description: "Luxury fashion brand identity with elegant typography, sophisticated color palette, and premium packaging.",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800"
      ],
      features: ["Brand Identity", "Packaging Design", "Lookbook Design", "Social Media Assets", "Retail Materials"],
      thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      shortDesc: "Luxury fashion identity"
    }
  ],
  photo: [
    {
      id: 1,
      name: "Product Photography",
      description: "Professional product photography with advanced lighting techniques and post-processing for e-commerce.",
      images: [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
      ],
      features: ["Studio Lighting", "Color Correction", "Background Removal", "Detail Enhancement", "Multiple Angles"],
      thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
      shortDesc: "E-commerce product shots"
    },
    {
      id: 2,
      name: "Portrait Retouching",
      description: "Professional portrait retouching while maintaining natural features and enhancing overall image quality.",
      images: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
      ],
      features: ["Skin Retouching", "Color Grading", "Background Enhancement", "Detail Sharpening", "Natural Look"],
      thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      shortDesc: "Professional portrait editing"
    },
    {
      id: 3,
      name: "Real Estate Enhancement",
      description: "Real estate photography editing to make properties look their best with proper lighting and perspective correction.",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
      ],
      features: ["Perspective Correction", "HDR Blending", "Color Enhancement", "Window View Replacement", "Virtual Staging"],
      thumbnail: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
      shortDesc: "Property photo enhancement"
    }
  ]
};

// Variabile globale
let currentCategory = 'web';
let currentProjectIndex = 0;
let currentSlideIndex = 0;

// Inițializare
document.addEventListener('DOMContentLoaded', function() {
  initializeGallery();
  setupEventListeners();
  setupIntersectionObserver();
});

// Inițializare galerie
function initializeGallery() {
  renderCategoryProjects('web');
}

// Setare event listeners
function setupEventListeners() {
  // Butoane categorii
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function() {
      const category = this.dataset.category;
      switchCategory(category, this);
    });
  });
  
  // Închidere modal
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  
  // Navigare slide-uri
  document.querySelector('.slide-nav.prev').addEventListener('click', prevSlide);
  document.querySelector('.slide-nav.next').addEventListener('click', nextSlide);
  
  // Contact icon
  document.querySelector('.contact-icon').addEventListener('click', function() {
    // Redirecționare către secțiunea de contact
    alert('Redirecting to contact section...');
    // window.location.href = '#contact'; // Decomentează dacă ai o secțiune de contact
  });
}

// Observer pentru animații la scroll
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.project-item').forEach(item => {
    observer.observe(item);
  });
}

// Schimbare categorie
function switchCategory(category, button) {
  // Actualizare butoane active
  document.querySelectorAll('.button').forEach(btn => {
    btn.classList.remove('active');
  });
  button.classList.add('active');
  
  // Actualizare galerii active
  document.querySelectorAll('.gallery-category').forEach(gallery => {
    gallery.classList.remove('active');
  });
  document.getElementById(`${category}-gallery`).classList.add('active');
  
  // Re-render proiecte
  renderCategoryProjects(category);
  currentCategory = category;
}

// Randare proiecte pentru categorie
function renderCategoryProjects(category) {
  const gallery = document.querySelector(`#${category}-gallery .project-grid`);
  gallery.innerHTML = '';
  
  projectsData[category].forEach((project, index) => {
    const projectElement = document.createElement('div');
    projectElement.className = 'project-item';
    projectElement.innerHTML = `
      <img src="${project.thumbnail}" alt="${project.name}" class="project-thumbnail">
      <div class="project-overlay">
        <h3 class="project-title">${project.name}</h3>
        <p class="project-desc">${project.shortDesc}</p>
      </div>
      <div class="click-more">Click for more</div>
    `;
    
    projectElement.addEventListener('click', () => {
      openProjectModal(category, index);
    });
    
    gallery.appendChild(projectElement);
    
    // Animație de intrare întârziată
    setTimeout(() => {
      projectElement.classList.add('visible');
    }, index * 200);
  });
}

// Deschidere modal proiect
function openProjectModal(category, projectIndex) {
  const project = projectsData[category][projectIndex];
  currentProjectIndex = projectIndex;
  currentSlideIndex = 0;
  
  // Actualizare titlu modal în funcție de categorie
  const modalTitle = document.querySelector('.modal-title');
  if (category === 'web') {
    modalTitle.textContent = 'Web Development Projects';
  } else if (category === 'brand') {
    modalTitle.textContent = 'Brand Design Projects';
  } else {
    modalTitle.textContent = 'Photo Editing Projects';
  }
  
  // Actualizare conținut slideshow
  updateSlideshow(project);
  
  // Actualizare informații proiect
  updateProjectInfo(project);
  
  // Actualizare previzualizări
  updateProjectPreviews(category, projectIndex);
  
  // Afișare modal
  document.querySelector('.project-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Actualizare slideshow
function updateSlideshow(project) {
  const slidesWrapper = document.querySelector('.slides-wrapper');
  slidesWrapper.innerHTML = '';
  
  project.images.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = `slide ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `<img src="${image}" alt="${project.name} - Image ${index + 1}">`;
    slidesWrapper.appendChild(slide);
  });
}

// Actualizare informații proiect
function updateProjectInfo(project) {
  document.querySelector('.project-name').textContent = project.name;
  document.querySelector('.project-description').textContent = project.description;
  
  const featuresContainer = document.querySelector('.project-features');
  featuresContainer.innerHTML = '';
  
  project.features.forEach(feature => {
    const featureElement = document.createElement('div');
    featureElement.className = 'feature-tag';
    featureElement.textContent = feature;
    featuresContainer.appendChild(featureElement);
  });
}

// Actualizare previzualizări proiecte
function updateProjectPreviews(category, currentIndex) {
  const previewsContainer = document.querySelector('.project-previews');
  previewsContainer.innerHTML = '';
  
  const projects = projectsData[category];
  const totalProjects = projects.length;
  
  // Calculăm indicii pentru proiectele adiacente
  const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
  const nextIndex = (currentIndex + 1) % totalProjects;
  
  // Adăugăm previzualizări pentru proiectele adiacente
  [prevIndex, nextIndex].forEach(index => {
    const project = projects[index];
    const previewElement = document.createElement('div');
    previewElement.className = 'preview-item';
    previewElement.innerHTML = `
      <img src="${project.thumbnail}" alt="${project.name}" class="preview-thumbnail">
      <div class="preview-overlay">
        <div class="preview-title">${project.name}</div>
        <div class="preview-desc">${project.shortDesc}</div>
      </div>
    `;
    
    previewElement.addEventListener('click', () => {
      // Reîncărcare modal cu noul proiect
      openProjectModal(category, index);
    });
    
    previewsContainer.appendChild(previewElement);
  });
}

// Navigare slide anterior
function prevSlide() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;
  
  slides[currentSlideIndex].classList.remove('active');
  currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
  slides[currentSlideIndex].classList.add('active');
}

// Navigare slide următor
function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;
  
  slides[currentSlideIndex].classList.remove('active');
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  slides[currentSlideIndex].classList.add('active');
}

// Închidere modal
function closeModal() {
  document.querySelector('.project-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Navigare cu taste
document.addEventListener('keydown', function(e) {
  const modal = document.querySelector('.project-modal');
  if (!modal.classList.contains('active')) return;
  
  switch(e.key) {
    case 'Escape':
      closeModal();
      break;
    case 'ArrowLeft':
      prevSlide();
      break;
    case 'ArrowRight':
      nextSlide();
      break;
  }
});