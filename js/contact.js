// contact.js - Folosește Firebase deja inițializat din main.js

// Folosește db global din main.js fără a-l redeclara
function initContactSystem() {
  // Verifică dacă db este disponibil
  if (typeof db === 'undefined' || !db) {
    console.error('Firestore database not available in contact.js');
    return;
  }

  console.log('Contact system initializing...');
  initContactForm();
  initSocialInteractions();
  addNotificationStyles();
}

// DOM Elements
const contactForm = document.getElementById('contact-form');
const socialItems = document.querySelectorAll('.social-item');

// Inițializare aplicație contact
document.addEventListener('DOMContentLoaded', function() {
  initContactSystem();
});

// Restul funcțiilor rămân la fel...
function initContactForm() {
  if (!contactForm) {
    console.log('Contact form not found on this page');
    return;
  }

  console.log('Contact form found, initializing...');

  // Form submission handler
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    
    try {
      // Get form values
      const firstName = contactForm.querySelector('#firstName')?.value || '';
      const lastName = contactForm.querySelector('#lastName')?.value || '';
      const email = contactForm.querySelector('#email')?.value || '';
      const phone = contactForm.querySelector('#phone')?.value || '';
      const message = contactForm.querySelector('#message')?.value || '';
      
      console.log('Form values:', { firstName, lastName, email, phone, message });
      
      // Validare de bază
      if (!firstName.trim()) {
        showNotification('Please enter your first name.', 'error');
        return;
      }
      if (!lastName.trim()) {
        showNotification('Please enter your last name.', 'error');
        return;
      }
      if (!email.trim()) {
        showNotification('Please enter your email address.', 'error');
        return;
      }
      if (!message.trim()) {
        showNotification('Please enter your message.', 'error');
        return;
      }
      
      // Validare email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Create contact data object
      const contactData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        message: message.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
      };
      
      console.log('Saving contact data:', contactData);
      
      // Save to Firebase in 'contacts' collection
      await db.collection('contacts').add(contactData);
      
      // Show success message
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      
      // Reset form
      contactForm.reset();
      
    } catch (error) {
      console.error('Error saving contact:', error);
      showNotification('An error occurred while sending your message. Please try again.', 'error');
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function initSocialInteractions() {
  socialItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'scale(1)';
    });
  });
}

function showNotification(message, type) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button>
      <ion-icon name="close-outline"></ion-icon>
    </button>
  `;
  
  // Add basic styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#1a1a1a' : '#331a1a'};
    color: #fff;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1.5px solid ${type === 'success' ? '#00ff88' : '#ff4444'};
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    max-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;
  
  notification.querySelector('button').style.cssText = `
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  `;
  
  // Close button functionality
  notification.querySelector('button').addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  });
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 4000);
}

function addNotificationStyles() {
  if (document.getElementById('notification-styles')) return;
  
  const notificationStyles = document.createElement('style');
  notificationStyles.id = 'notification-styles';
  notificationStyles.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .notification button:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
    
    .notification.success {
      background: #1a1a1a !important;
      border-color: #00ff88 !important;
    }
    
    .notification.error {
      background: #331a1a !important;
      border-color: #ff4444 !important;
    }
  `;
  document.head.appendChild(notificationStyles);
}

// Validare formular în timp real (opțional)
function initRealTimeValidation() {
  const inputs = contactForm?.querySelectorAll('input[required], textarea[required]');
  
  if (inputs) {
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });
      
      input.addEventListener('input', () => {
        clearFieldError(input);
      });
    });
  }
}

function validateField(field) {
  const value = field.value.trim();
  
  if (!value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }
  }
  
  clearFieldError(field);
  return true;
}

function showFieldError(field, message) {
  clearFieldError(field);
  
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    color: #ff6b6b;
    font-size: 0.8rem;
    margin-top: 5px;
    font-family: 'Sora', sans-serif;
  `;
  
  field.parentNode.appendChild(errorElement);
  field.style.borderColor = '#ff6b6b';
}

function clearFieldError(field) {
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  field.style.borderColor = '';
}

// Export functions for global access (dacă este necesar)
window.contactSystem = {
  showNotification,
  initContactForm,
  initSocialInteractions
};