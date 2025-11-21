// reviews.js - Folosește Firebase deja inițializat din main.js
let db;

// Inițializare Firebase cu verificare
try {
  // Verifică dacă Firebase este disponibil
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded in reviews.js');
    // Nu folosi return aici, doar setează db pe null
    db = null;
  } else {
    db = firebase.firestore();
    console.log('Firestore database accessed in reviews.js');
  }
} catch (error) {
  console.error('Error accessing Firestore in reviews.js:', error);
  db = null;
}

// Elemente DOM
const openFormBtn = document.getElementById('open-form-btn');
const reviewForm = document.getElementById('review-form');
const backBtn = document.getElementById('back-btn');
const submitFormBtn = document.getElementById('submit-form-btn');
const reviewFormElement = document.getElementById('reviewForm');
const notification = document.getElementById('notification');
const charCount = document.querySelector('.char-count');
const messageTextarea = document.getElementById('message');
const avgRatingValue = document.getElementById('avg-rating-value');
const ratingFill = document.getElementById('rating-fill');
const totalVotes = document.getElementById('total-votes');

// Elemente pentru noul formular
const ratingSlider = document.getElementById('rating-slider');
const sliderFill = document.getElementById('slider-fill');
const sliderThumb = document.querySelector('.slider-thumb');
const ratingFeedback = document.getElementById('rating-feedback');

// Elemente pentru preview live
const livePreview = document.getElementById('live-preview');
const previewName = document.getElementById('preview-name');
const previewAvatar = document.getElementById('preview-avatar');
const previewInitials = document.getElementById('preview-initials');
const previewMessage = document.getElementById('preview-message');
const previewRating = document.getElementById('preview-rating');
const previewService = document.getElementById('preview-service');
const formLayout = document.querySelector('.form-layout');

// Variabile globale
let currentRating = 3;
let allReviews = [];
let stats = {
  averageRating: 0,
  totalReviews: 0
};

// Mesaje pentru rating
const ratingMessages = {
  1: { 
    text: "Poor - We're sorry to hear that", 
    color: "#ff6b6b",
    glowClass: "glow-poor"
  },
  2: { 
    text: "Fair - We appreciate your feedback", 
    color: "#ffa726",
    glowClass: "glow-fair"
  },
  3: { 
    text: "Good - Glad you had a decent experience", 
    color: "#ffc107",
    glowClass: "glow-good"
  },
  4: { 
    text: "Very Good - Happy to meet your expectations", 
    color: "#66bb6a",
    glowClass: "glow-very-good"
  },
  5: { 
    text: "Excellent - Thrilled to exceed your expectations!", 
    color: "#4CAF50",
    glowClass: "glow-excellent"
  }
};

// Servicii mapping pentru iconițe
const serviceIcons = {
  'web development': 'code-slash-outline',
  'brand design': 'color-palette-outline',
  'video editing': 'videocam-outline'
};

// Inițializare aplicație
document.addEventListener('DOMContentLoaded', function() {
  console.log('Reviews system initializing...');
  
  // Verifică dacă secțiunea de reviews există pe pagină
  const reviewsSection = document.getElementById('reviews');
  if (!reviewsSection) {
    console.log('Reviews section not found on this page');
    return;
  }
  
  // Verifică dacă db este disponibil
  if (!db) {
    console.error('Firestore not available, reviews system disabled');
    return;
  }
  
  console.log('Reviews section found, initializing system...');
  initEventListeners();
  initRatingSlider();
  loadReviews();
  initScrollAnimations();
  initLivePreview();
});

// Restul funcțiilor rămân exact la fel ca în versiunea anterioară...
// [TOATE FUNCȚIILE TALE ORIGINALE RĂMÂN NESCHIMBATE]

function initEventListeners() {
  console.log('Initializing event listeners...');
  
  if (openFormBtn) {
    openFormBtn.addEventListener('click', openForm);
    console.log('Open form button found');
  } else {
    console.log('Open form button NOT found');
  }
  
  if (backBtn) {
    backBtn.addEventListener('click', closeForm);
  }
  
  if (submitFormBtn) {
    submitFormBtn.addEventListener('click', submitForm);
  }
  
  if (messageTextarea) {
    messageTextarea.addEventListener('input', updateCharCount);
  }
  
  // Închidere formular cu Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reviewForm && reviewForm.classList.contains('active')) {
      closeForm();
    }
  });
  
  // Prevenire refresh la submit formular
  if (reviewFormElement) {
    reviewFormElement.addEventListener('submit', (e) => e.preventDefault());
  }
  
  // Gender selection events
  const genderInputs = document.querySelectorAll('input[name="gender"]');
  genderInputs.forEach(input => {
    input.addEventListener('change', handleGenderChange);
  });
  
  // Service selection events
  const serviceInputs = document.querySelectorAll('input[name="service"]');
  serviceInputs.forEach(input => {
    input.addEventListener('change', handleServiceChange);
  });
  
  // Input events pentru a activa tranziția layout-ului
  const formInputs = document.querySelectorAll('#fullName, #message, input[name="gender"], input[name="service"]');
  formInputs.forEach(input => {
    input.addEventListener('input', checkFormContent);
    input.addEventListener('change', checkFormContent);
  });
}

// Verifică dacă formularul are conținut pentru a activa tranziția
function checkFormContent() {
  if (!formLayout) return;
  
  const fullName = document.getElementById('fullName')?.value.trim() || '';
  const message = document.getElementById('message')?.value.trim() || '';
  const gender = document.querySelector('input[name="gender"]:checked');
  const service = document.querySelector('input[name="service"]:checked');
  
  if (fullName || message || gender || service) {
    formLayout.classList.add('has-content');
  } else {
    formLayout.classList.remove('has-content');
  }
}

// Inițializare preview live
function initLivePreview() {
  if (!livePreview) return;
  
  // Ascultă pentru schimbări în formular
  const fullNameInput = document.getElementById('fullName');
  const messageInput = document.getElementById('message');
  
  if (fullNameInput) {
    fullNameInput.addEventListener('input', updateLivePreview);
  }
  
  if (messageInput) {
    messageInput.addEventListener('input', updateLivePreview);
  }
  
  // Actualizare inițială
  updateLivePreview();
}

// Actualizare preview live
function updateLivePreview() {
  if (!livePreview) return;
  
  const fullName = document.getElementById('fullName')?.value.trim() || 'Your Name';
  const message = document.getElementById('message')?.value.trim() || 'Your message will appear here...';
  const gender = document.querySelector('input[name="gender"]:checked');
  const service = document.querySelector('input[name="service"]:checked');
  
  // Actualizare nume
  if (previewName) {
    previewName.textContent = fullName;
  }
  
  // Actualizare avatar și inițiale
  const nameParts = fullName.split(' ');
  const initials = nameParts.length >= 2 
    ? (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    : fullName.charAt(0).toUpperCase();
  
  if (previewInitials) {
    previewInitials.textContent = initials;
  }
  
  if (previewAvatar && gender) {
    previewAvatar.className = 'preview-avatar ' + gender.value;
  } else if (previewAvatar) {
    previewAvatar.className = 'preview-avatar';
  }
  
  // Actualizare mesaj
  if (previewMessage) {
    previewMessage.textContent = message;
  }
  
  // Actualizare rating
  updatePreviewRating();
  
  // Actualizare serviciu
  if (previewService) {
    previewService.textContent = service ? service.value : 'Service';
  }
  
  // Actualizare glow în funcție de rating
  updatePreviewGlow();
}

// Actualizare rating în preview
function updatePreviewRating() {
  if (!previewRating) return;
  
  previewRating.innerHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('ion-icon');
    star.className = 'star';
    star.name = i <= currentRating ? 'star' : 'star-outline';
    previewRating.appendChild(star);
  }
}

// Actualizare glow în funcție de rating
function updatePreviewGlow() {
  if (!livePreview) return;
  
  // Elimină toate clasele de glow
  livePreview.classList.remove('glow-poor', 'glow-fair', 'glow-good', 'glow-very-good', 'glow-excellent');
  
  // Adaugă clasa corespunzătoare
  if (ratingMessages[currentRating]) {
    livePreview.classList.add(ratingMessages[currentRating].glowClass);
  }
}

// Inițializare animații la scroll
function initScrollAnimations() {
  const reviewsSection = document.getElementById('reviews');
  const reviewsContent = document.querySelector('.reviews-content');
  const reviewsLeft = document.querySelector('.reviews-left');
  const reviewsRight = document.querySelector('.reviews-right');
  const reviewsTitle = document.querySelector('.reviews-title');
  const reviewsSubtitle = document.querySelector('.reviews-subtitle');
  const statsContainer = document.querySelector('.stats-container');
  const submitBtn = document.querySelector('.submit-review-btn');
  
  if (!reviewsSection) {
    console.log('Reviews section not found for scroll animations');
    return;
  }
  
  console.log('Initializing scroll animations for reviews section');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Reviews section entered viewport');
        // Animații pentru intrarea în secțiune
        if (reviewsContent) reviewsContent.classList.add('visible');
        if (reviewsLeft) reviewsLeft.classList.add('visible');
        if (reviewsRight) reviewsRight.classList.add('visible');
        
        // Animații secvențiale pentru elementele din stânga
        setTimeout(() => {
          if (reviewsTitle) reviewsTitle.classList.add('visible');
        }, 200);
        
        setTimeout(() => {
          if (reviewsSubtitle) reviewsSubtitle.classList.add('visible');
        }, 400);
        
        setTimeout(() => {
          if (statsContainer) statsContainer.classList.add('visible');
        }, 600);
        
        setTimeout(() => {
          if (submitBtn) submitBtn.classList.add('visible');
        }, 800);
      } else {
        // Animații pentru ieșirea din secțiune
        if (reviewsContent) reviewsContent.classList.remove('visible');
        if (reviewsLeft) reviewsLeft.classList.remove('visible');
        if (reviewsRight) reviewsRight.classList.remove('visible');
        if (reviewsTitle) reviewsTitle.classList.remove('visible');
        if (reviewsSubtitle) reviewsSubtitle.classList.remove('visible');
        if (statsContainer) statsContainer.classList.remove('visible');
        if (submitBtn) submitBtn.classList.remove('visible');
      }
    });
  }, observerOptions);
  
  sectionObserver.observe(reviewsSection);
}

// Handle gender change
function handleGenderChange(e) {
  updateLivePreview();
  checkFormContent();
}

// Handle service change
function handleServiceChange(e) {
  updateLivePreview();
  checkFormContent();
}

// Inițializare rating slider
function initRatingSlider() {
  if (!ratingSlider) return;
  
  // Setare valoare inițială
  updateSlider(currentRating);
  
  // Event pentru schimbare slider
  ratingSlider.addEventListener('input', (e) => {
    currentRating = parseInt(e.target.value);
    updateSlider(currentRating);
    updateLivePreview();
    checkFormContent();
  });
  
  // Drag events pentru thumb
  let isDragging = false;
  
  if (sliderThumb) {
    sliderThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    });
    
    sliderThumb.addEventListener('touchstart', (e) => {
      isDragging = true;
      document.addEventListener('touchmove', handleDrag);
      document.addEventListener('touchend', stopDrag);
    });
  }
  
  function handleDrag(e) {
    if (!isDragging) return;
    
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (!sliderWrapper) return;
    
    const sliderRect = sliderWrapper.getBoundingClientRect();
    let clientX;
    
    if (e.type.includes('mouse')) {
      clientX = e.clientX;
    } else {
      clientX = e.touches[0].clientX;
    }
    
    let percentage = (clientX - sliderRect.left) / sliderRect.width;
    percentage = Math.max(0, Math.min(1, percentage));
    
    currentRating = Math.round(percentage * 4) + 1;
    ratingSlider.value = currentRating;
    updateSlider(currentRating);
    updateLivePreview();
  }
  
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
}

// Actualizare slider
function updateSlider(rating) {
  const percentage = ((rating - 1) / 4) * 100;
  
  if (sliderFill) {
    sliderFill.style.width = `${percentage}%`;
  }
  
  if (sliderThumb) {
    sliderThumb.style.left = `${percentage}%`;
  }
  
  // Actualizare feedback
  if (ratingFeedback) {
    const feedback = ratingMessages[rating];
    ratingFeedback.textContent = feedback.text;
    ratingFeedback.style.borderColor = feedback.color + '40';
  }
}

// Deschidere formular
function openForm() {
  if (reviewForm) {
    reviewForm.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset layout la deschidere
    if (formLayout) {
      formLayout.classList.remove('has-content');
    }
  }
}

// Închidere formular
function closeForm() {
  if (reviewForm) {
    reviewForm.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetForm();
  }
}

// Actualizare contor caractere
function updateCharCount() {
  if (!charCount || !messageTextarea) return;
  
  const count = messageTextarea.value.length;
  charCount.textContent = `${count}/50`;
  
  // Schimbă culoarea când se apropie de limită
  if (count >= 45) {
    charCount.style.color = '#ff6b6b';
  } else if (count >= 40) {
    charCount.style.color = '#ffc107';
  } else {
    charCount.style.color = 'rgba(255, 255, 255, 0.7)';
  }
  
  updateLivePreview();
  checkFormContent();
}

// Resetare formular
function resetForm() {
  if (reviewFormElement) {
    reviewFormElement.reset();
  }
  
  currentRating = 3;
  updateSlider(currentRating);
  
  if (charCount) {
    charCount.textContent = '0/50';
    charCount.style.color = 'rgba(255, 255, 255, 0.7)';
  }
  
  // Reset layout
  if (formLayout) {
    formLayout.classList.remove('has-content');
  }
  
  updateLivePreview();
}

// Trimitere formular
function submitForm() {
  // Validare formular
  if (!validateForm()) {
    return;
  }
  
  // Colectare date
  const formData = new FormData(reviewFormElement);
  const fullName = formData.get('fullName').trim();
  
  const reviewData = {
    fullName: fullName,
    rating: currentRating,
    gender: formData.get('gender'),
    service: formData.get('service'),
    message: formData.get('message').trim(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  // Show loading state
  if (submitFormBtn) {
    submitFormBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span class="submit-text">Submitting...</span>';
    submitFormBtn.disabled = true;
  }
  
  // Salvare în Firebase
  db.collection('reviews').add(reviewData)
    .then(() => {
      // Succes
      closeForm();
      showNotification();
      // Reîncărcare reviews pentru a include noul review
      setTimeout(() => {
        loadReviews();
      }, 500);
    })
    .catch(error => {
      console.error('Error adding review: ', error);
      alert('There was an error submitting your review. Please try again.');
    })
    .finally(() => {
      // Reset buton
      if (submitFormBtn) {
        submitFormBtn.innerHTML = '<span class="submit-text">Submit Review</span><ion-icon name="checkmark-outline"></ion-icon>';
        submitFormBtn.disabled = false;
      }
    });
}

// Validare formular
function validateForm() {
  const fullName = document.getElementById('fullName')?.value.trim() || '';
  const message = document.getElementById('message')?.value.trim() || '';
  const gender = document.querySelector('input[name="gender"]:checked');
  const service = document.querySelector('input[name="service"]:checked');
  
  if (!fullName) {
    showFieldError('fullName', 'Please enter your name');
    return false;
  }
  
  if (!gender) {
    alert('Please select your gender');
    return false;
  }
  
  if (!service) {
    alert('Please select a service');
    return false;
  }
  
  if (!message) {
    showFieldError('message', 'Please enter a message');
    return false;
  }
  
  return true;
}

// Afișare eroare câmp
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorElement = field.parentElement.querySelector('.error-message') || 
                       document.createElement('div');
  
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.color = '#ff6b6b';
  errorElement.style.fontSize = '0.8rem';
  errorElement.style.marginTop = '5px';
  
  if (!field.parentElement.querySelector('.error-message')) {
    field.parentElement.appendChild(errorElement);
  }
  
  field.style.borderColor = '#ff6b6b';
  
  setTimeout(() => {
    if (errorElement.parentElement) {
      errorElement.remove();
    }
    field.style.borderColor = '';
  }, 3000);
}

// Afișare notificare top cu gradient
function showNotification() {
  if (!notification) return;
  
  const feedback = ratingMessages[currentRating];
  
  // Setare gradient de background în funcție de rating
  notification.style.background = `linear-gradient(to bottom, ${feedback.color}20, transparent)`;
  
  // Afișare notificare
  notification.classList.add('active');
  
  setTimeout(() => {
    notification.classList.remove('active');
  }, 3000);
}

// Încărcare reviews din Firebase pentru pagina principală
function loadReviews() {
  console.log('Loading reviews from Firebase...');
  
  const columns = [
    document.querySelector('.column-1'),
    document.querySelector('.column-2'),
    document.querySelector('.column-3')
  ];
  
  // Verifică dacă coloanele există
  const columnsExist = columns.filter(col => col !== null).length > 0;
  if (!columnsExist) {
    console.log('Review columns not found on this page');
    return;
  }
  
  console.log('Review columns found, loading data...');
  
  // Curățare coloane
  columns.forEach(column => {
    if (column) column.innerHTML = '';
  });
  
  // Obținere reviews din Firebase
  db.collection('reviews')
    .orderBy('timestamp', 'desc')
    .limit(15)
    .get()
    .then(querySnapshot => {
      console.log(`Found ${querySnapshot.size} reviews`);
      
      allReviews = [];
      let totalRating = 0;
      
      querySnapshot.forEach(doc => {
        const reviewData = doc.data();
        const review = {
          id: doc.id,
          ...reviewData,
          timestamp: reviewData.timestamp ? reviewData.timestamp.toDate() : new Date()
        };
        allReviews.push(review);
        totalRating += review.rating;
      });
      
      // Calculare statistici
      stats.totalReviews = allReviews.length;
      stats.averageRating = stats.totalReviews > 0 ? totalRating / stats.totalReviews : 0;
      
      console.log('Stats calculated:', stats);
      
      // Actualizare UI cu statistici
      updateStatsDisplay();
      
      // Distribuire reviews în coloane
      distributeReviews(columns);
    })
    .catch(error => {
      console.error('Error loading reviews: ', error);
      // Adaugă reviews de exemplu în caz de eroare
      addSampleReviews(columns);
      updateStatsDisplay();
    });
}

// Distribuire reviews în coloane pentru pagina principală
function distributeReviews(columns) {
  if (allReviews.length === 0) {
    console.log('No reviews found, adding sample reviews');
    addSampleReviews(columns);
    return;
  }
  
  console.log(`Distributing ${allReviews.length} reviews across columns`);
  
  let columnIndex = 0;
  
  allReviews.forEach((review, index) => {
    const reviewElement = createReviewElement(review);
    
    // Adăugare review în coloana curentă
    if (columns[columnIndex]) {
      columns[columnIndex].appendChild(reviewElement);
    }
    
    // Trecere la următoarea coloană
    columnIndex = (columnIndex + 1) % 3;
  });
}

// Creare element review pentru pagina principală
// CREARE ELEMENT REVIEW - STRUCTURA ORIGINALĂ corectată
function createReviewElement(review) {
  const reviewCard = document.createElement('div');
  reviewCard.className = 'review-card';
  
  // Folosește fullName
  const displayName = review.fullName || 'Anonymous';
  
  // Generare inițiale
  const nameParts = displayName.split(' ');
  const initials = nameParts.length >= 2 
    ? (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    : displayName.charAt(0).toUpperCase();
  
  // Iconița serviciului
  const serviceIcon = serviceIcons[review.service] || 'help-outline';
  
  // STRUCTURA ORIGINALĂ din codul inițial
  reviewCard.innerHTML = `
    <div class="review-header">
      <div class="review-avatar ${review.gender || ''}">${initials}</div>
      <div class="reviewer-name">${displayName}</div>
      <div class="review-quote">"</div>
      <div class="review-text">${review.message || 'No message provided'}</div>
    </div>
    <div class="review-footer">
      <div class="review-rating">
        <span class="rating-value">${review.rating || 5}</span>
        <ion-icon name="star" class="star-icon"></ion-icon>
      </div>
      <ion-icon name="${serviceIcon}" class="review-service-icon"></ion-icon>
    </div>
  `;
  
  return reviewCard;
}

// Adăugare reviews de exemplu pentru pagina principală
function addSampleReviews(columns) {
  console.log('Adding sample reviews');
  
  const sampleReviews = [
    {
      fullName: "Alex Johnson",
      rating: 5,
      gender: "male",
      service: "web development",
      message: "Exceptional work! The website surpassed all expectations."
    },
    {
      fullName: "Maria Garcia",
      rating: 4,
      gender: "female",
      service: "brand design",
      message: "Stunning design work. Professional and creative."
    },
    {
      fullName: "David Smith",
      rating: 5,
      gender: "male",
      service: "video editing",
      message: "Transformed our footage into a cinematic masterpiece!"
    },
    {
      fullName: "Sarah Wilson",
      rating: 4,
      gender: "female", 
      service: "web development",
      message: "Great communication and delivered on time. Highly recommend!"
    },
    {
      fullName: "Mike Brown",
      rating: 5,
      gender: "male",
      service: "brand design",
      message: "The branding perfectly captures our company vision."
    }
  ];
  
  allReviews = sampleReviews;
  
  let columnIndex = 0;
  
  sampleReviews.forEach(review => {
    const reviewElement = createReviewElement(review);
    if (columns[columnIndex]) {
      columns[columnIndex].appendChild(reviewElement);
    }
    columnIndex = (columnIndex + 1) % 3;
  });
}

// Actualizare afișaj statistici
function updateStatsDisplay() {
  console.log('Updating stats display:', stats);
  
  // Animație număr rating
  if (avgRatingValue) {
    animateValue(avgRatingValue, 0, stats.averageRating, 2000);
  }
  
  // Animație bara rating
  const fillPercentage = (stats.averageRating / 5) * 100;
  setTimeout(() => {
    if (ratingFill) {
      ratingFill.style.width = `${fillPercentage}%`;
    }
  }, 300);
  
  // Actualizare număr total reviews
  if (totalVotes) {
    totalVotes.textContent = `${stats.totalReviews} reviews in total`;
  }
}

// Animație număr
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = progress * (end - start) + start;
    element.textContent = value.toFixed(2);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}