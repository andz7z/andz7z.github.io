const PROJECTS_DATA = {
  'ui-ux-design': [
    {
      id: 1,
      name: 'CORELLE | Nail Brand Template',
      description: 'Personal template for the CORELLE brand, category: nail products. It is a fully responsive website, optimized for both mobile and desktop. It includes systems such as Register, Login, Reviews, Favourites, History, and an Order System.',
      features: ['Advanced User Registration System', 'Interactive Review & Rating System', 'Real-time Chat Functionality', 'Payment Integration System', 'Advanced Analytics Dashboard'],
      images: [
        'https://andz7z.github.io/assets/corelle/poza1.png', 'https://andz7z.github.io/assets/corelle/poza2.png', 'https://andz7z.github.io/assets/corelle/poza3.png',
        'https://andz7z.github.io/assets/corelle/poza4.png', 'https://andz7z.github.io/assets/corelle/poza5.png', 'https://andz7z.github.io/assets/corelle/poza6.png',
        'https://andz7z.github.io/assets/corelle/poza7.png', 'https://andz7z.github.io/assets/corelle/poza8.png', 'https://andz7z.github.io/assets/corelle/poza9.png',
        'https://andz7z.github.io/assets/corelle/poza10.png', 'https://andz7z.github.io/assets/corelle/poza11.png'
      ],
      thumbnail: 'https://andz7z.github.io/assets/corelle/poza1.png'
    },
    {
      id: 2,
      name: 'Website Template 2',
      description: 'A modern portfolio website showcasing creative work with smooth animations and interactive elements to engage visitors.',
      features: ['Smooth Scroll Animations', 'Interactive Gallery', 'Contact Form with Validation', 'Responsive Design', 'SEO Optimization'],
      images: Array(3).fill('https://andz7z.github.io/assets/photos/altele/project_one.jpg'),
      thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_one.jpg'
    },
    {
      id: 3,
      name: 'Website Template 3',
      description: 'A comprehensive business dashboard with real-time data visualization and reporting tools for informed decision-making.',
      features: ['Real-time Data Visualization', 'Custom Reporting Tools', 'User Management System', 'Data Export Functionality', 'Multi-level Access Control'],
      images: Array(3).fill('https://andz7z.github.io/assets/photos/altele/project_two.jpg'),
      thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_two.jpg'
    },
    {
      id: 4,
      name: 'Website Template 4',
      description: 'A user-friendly mobile banking application with intuitive navigation and secure transaction features.',
      features: ['Intuitive Navigation Design', 'Secure Transaction Flow', 'Biometric Authentication', 'Personalized Dashboard', 'Bill Payment System'],
      images: Array(3).fill('https://andz7z.github.io/assets/photos/altele/project_three.jpg'),
      thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_three.jpg'
    },
    {
      id: 5,
      name: 'Website Template 5',
      description: 'A comprehensive fitness tracking application with personalized workout plans and progress monitoring features.',
      features: ['Personalized Workout Plans', 'Progress Tracking Dashboard', 'Social Sharing Features', 'Nutrition Tracking', 'Goal Setting System'],
      images: Array(3).fill('https://andz7z.github.io/assets/photos/altele/project_four.jpg'),
      thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_four.jpg'
    },
    {
      id: 6,
      name: 'Website Template 6',
      description: 'An intuitive travel booking platform with seamless booking flow and personalized recommendations for travelers.',
      features: ['Seamless Booking Flow', 'Personalized Recommendations', 'Interactive Maps Integration', 'Review & Rating System', 'Multi-language Support'],
      images: Array(3).fill('https://andz7z.github.io/assets/photos/altele/project_five.jpg'),
      thumbnail: 'https://andz7z.github.io/assets/photos/altele/project_five.jpg'
    }
  ]
};

class ProjectManager {
  constructor() {
    this.dom = {
      section: document.getElementById('projects'),
      gallery: document.querySelector('.projects-gallery'),
      modal: document.querySelector('.project-modal'),
      modalContent: document.querySelector('.modal-content'),
      slidesContainer: document.querySelector('.gallery-slides'),
      related: document.querySelector('.related-projects'),
      details: {
        title: document.querySelector('.modal-title'),
        name: document.querySelector('.project-name'),
        desc: document.querySelector('.project-description p'),
        features: document.querySelector('.key-features')
      },
      btns: {
        cats: document.querySelectorAll('.category-btn'),
        close: document.querySelector('.back-btn'),
        contact: document.querySelector('.contact-btn'),
        prev: document.querySelector('.prev-btn'),
        next: document.querySelector('.next-btn')
      }
    };

    this.state = {
      category: 'ui-ux-design',
      idx: 0,
      slideIdx: 0,
      modalOpen: false,
      animating: false,
      typingTimeouts: []
    };

    if (!this.dom.section) return;
    this.init();
  }

  init() {
    this.renderGallery();
    this.setupInteractions();
  }

  getProjects() {
    return PROJECTS_DATA[this.state.category] || [];
  }

  renderGallery() {
    const projects = this.getProjects();
    this.dom.gallery.innerHTML = projects.map((p, i) => `
      <div class="project-slide ${this.getSlideClass(i)}" data-id="${p.id}" data-index="${i}">
        <img src="${p.thumbnail}" alt="${p.name}" class="project-thumbnail" loading="lazy">
        <div class="project-overlay">
          <a href="#" class="view-more" data-id="${p.id}">VIEW MORE DETAILS</a>
        </div>
      </div>
    `).join('');
  }

  getSlideClass(idx) {
    const total = this.getProjects().length;
    const current = this.state.idx;
    const diff = (idx - current + total) % total;

    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === total - 1) return 'prev';
    if (diff === 2) return 'far-next';
    if (diff === total - 2) return 'far-prev';
    return 'hidden';
  }

  updateGalleryClasses() {
    const slides = Array.from(this.dom.gallery.children);
    slides.forEach((slide, i) => {
      slide.className = `project-slide ${this.getSlideClass(i)}`;
    });
  }

  moveGallery(dir) {
    const total = this.getProjects().length;
    this.state.idx = (this.state.idx + (dir === 'next' ? 1 : -1) + total) % total;
    this.updateGalleryClasses();
  }

  openModal(id) {
    const project = this.getProjects().find(p => p.id === id);
    if (!project) return;

    this.state.modalOpen = true;
    document.documentElement.classList.add('modal-open');
    this.dom.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.updateModalContent(project);
    
    requestAnimationFrame(() => {
      this.dom.modalContent.scrollTop = 0;
      this.animateText();
    });
  }

  closeModal() {
    this.state.modalOpen = false;
    this.dom.modal.classList.add('closing');
    this.clearTyping();
    
    setTimeout(() => {
      this.dom.modal.classList.remove('active', 'closing');
      document.body.style.overflow = '';
      document.documentElement.classList.remove('modal-open');
    }, 600);
  }

  updateModalContent(project) {
    this.dom.details.title.textContent = 'UI/UX Design Projects';
    this.dom.details.name.textContent = project.name;
    this.dom.details.desc.textContent = project.description;
    
    this.dom.details.features.innerHTML = project.features.map(f => `
      <li><ion-icon name="checkmark-circle"></ion-icon><span class="feature-text">${f}</span></li>
    `).join('');

    this.renderModalSlides(project.images);
    this.renderRelated(project.id);
  }

  renderModalSlides(images) {
    this.dom.slidesContainer.innerHTML = images.map((img, i) => `
      <div class="gallery-slide ${i === 0 ? 'active' : ''}">
        <img src="${img}" alt="Slide ${i}" class="gallery-image" loading="lazy">
      </div>
    `).join('');
    this.state.slideIdx = 0;
  }

  changeModalSlide(dir) {
    const slides = this.dom.slidesContainer.children;
    if (!slides.length) return;

    slides[this.state.slideIdx].classList.remove('active');
    this.state.slideIdx = (this.state.slideIdx + (dir === 'next' ? 1 : -1) + slides.length) % slides.length;
    slides[this.state.slideIdx].classList.add('active');
  }

  renderRelated(currentId) {
    const all = this.getProjects();
    const currentIdx = all.findIndex(p => p.id === currentId);
    const related = [1, 2].map(offset => all[(currentIdx + offset) % all.length]);

    this.dom.related.innerHTML = related.map(p => `
      <div class="related-project" data-id="${p.id}">
        <img src="${p.thumbnail}" alt="${p.name}" class="related-image" loading="lazy">
        <div class="related-overlay"><h4 class="related-title">${p.name}</h4></div>
      </div>
    `).join('');
  }

  animateText() {
    const elements = [
      this.dom.details.name, 
      this.dom.details.desc, 
      ...this.dom.details.features.children
    ];

    elements.forEach(el => el.classList.remove('typing'));
    
    // Staggered animation using CSS classes driven by JS timing
    let delay = 300;
    elements.forEach(el => {
      const timeout = setTimeout(() => {
        el.classList.add('typing');
        const textSpan = el.querySelector('.feature-text');
        if (textSpan) textSpan.classList.add('typing');
      }, delay);
      
      this.state.typingTimeouts.push(timeout);
      delay += 150;
    });
  }

  clearTyping() {
    this.state.typingTimeouts.forEach(t => clearTimeout(t));
    this.state.typingTimeouts = [];
  }

  handleCategory(btn) {
    this.dom.btns.cats.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.state.category = btn.dataset.category;
    this.state.idx = 0;
    this.renderGallery();
  }

  setupInteractions() {
    // Gallery Navigation (Delegation)
    this.dom.gallery.addEventListener('click', (e) => {
      const slide = e.target.closest('.project-slide');
      if (!slide) return;
      
      const idx = parseInt(slide.dataset.index);
      const isViewBtn = e.target.closest('.view-more');

      if (isViewBtn || idx === this.state.idx) {
        e.preventDefault();
        this.openModal(parseInt(slide.dataset.id));
      } else {
        this.state.idx = idx;
        this.updateGalleryClasses();
      }
    });

    // Category Buttons
    this.dom.btns.cats.forEach(btn => 
      btn.addEventListener('click', () => this.handleCategory(btn))
    );

    // Modal Controls
    this.dom.btns.close.addEventListener('click', () => this.closeModal());
    this.dom.btns.prev.addEventListener('click', () => this.changeModalSlide('prev'));
    this.dom.btns.next.addEventListener('click', () => this.changeModalSlide('next'));

    this.dom.related.addEventListener('click', (e) => {
      const item = e.target.closest('.related-project');
      if (!item) return;
      
      this.dom.modalContent.classList.add('changing');
      setTimeout(() => {
        this.updateModalContent(this.getProjects().find(p => p.id === parseInt(item.dataset.id)));
        this.dom.modalContent.scrollTop = 0;
        this.dom.modalContent.classList.remove('changing');
        this.animateText();
      }, 300);
    });

    this.dom.btns.contact.addEventListener('click', () => {
      this.closeModal();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (this.state.modalOpen) {
        if (e.key === 'Escape') this.closeModal();
        if (e.key === 'ArrowLeft') this.changeModalSlide('prev');
        if (e.key === 'ArrowRight') this.changeModalSlide('next');
      } else {
        if (e.key === 'ArrowLeft') this.moveGallery('prev');
        if (e.key === 'ArrowRight') this.moveGallery('next');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new ProjectManager());