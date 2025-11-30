class ContactManager {
  constructor() {
    this.db = window.db || (typeof firebase !== 'undefined' ? firebase.firestore() : null);
    this.firebase = window.firebase;
    this.dom = {
      form: document.getElementById('contact-form'),
      socials: document.querySelectorAll('.social-item')
    };

    if (this.dom.form) this.init();
  }

  init() {
    this.injectStyles();
    this.setupForm();
    this.setupSocials();
  }

  injectStyles() {
    if (document.getElementById('contact-sys-styles')) return;
    const css = `
      .sys-notif { position: fixed; top: 20px; right: 20px; padding: 12px 16px; border-radius: 10px; display: flex; align-items: center; gap: 12px; z-index: 10000; font-family: 'Sora', sans-serif; font-size: 0.9rem; max-width: 300px; color: #fff; animation: slideInRight 0.3s ease-out forwards; box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: all; }
      .sys-notif.success { background: #1a1a1a; border: 1.5px solid #00ff88; }
      .sys-notif.error { background: #331a1a; border: 1.5px solid #ff4444; }
      .sys-notif.hiding { animation: slideOutRight 0.3s ease-in forwards; }
      .sys-notif button { background: none; border: none; color: #fff; cursor: pointer; padding: 4px; border-radius: 50%; display: flex; }
      .sys-notif button:hover { background: rgba(255,255,255,0.1); }
      .field-error { color: #ff6b6b; font-size: 0.8rem; margin-top: 5px; font-family: 'Sora', sans-serif; display: block; }
      .input-error { border-color: #ff6b6b !important; }
      @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    const style = document.createElement('style');
    style.id = 'contact-sys-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  setupForm() {
    // Real-time validation (Delegated)
    this.dom.form.addEventListener('focusout', (e) => {
      if(e.target.hasAttribute('required')) this.checkField(e.target);
    });
    
    this.dom.form.addEventListener('input', (e) => {
      if(e.target.classList.contains('input-error')) {
         e.target.classList.remove('input-error');
         const err = e.target.parentNode.querySelector('.field-error');
         if(err) err.remove();
      }
    });

    this.dom.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!this.db) return this.showNotification('Database unavailable', 'error');

      const btn = this.dom.form.querySelector('.submit-btn');
      const originalContent = btn.innerHTML;

      if (!this.validateForm()) return;

      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span>';

      try {
        const fd = new FormData(this.dom.form);
        await this.db.collection('contacts').add({
          firstName: fd.get('firstName').trim(),
          lastName: fd.get('lastName').trim(),
          email: fd.get('email').trim(),
          phone: fd.get('phone')?.trim() || '',
          message: fd.get('message').trim(),
          timestamp: this.firebase.firestore.FieldValue.serverTimestamp(),
          read: false
        });

        this.showNotification("Message sent successfully!", 'success');
        this.dom.form.reset();
        this.dom.form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
      } catch (err) {
        console.error(err);
        this.showNotification('Error sending message.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
    });
  }

  validateForm() {
    let isValid = true;
    this.dom.form.querySelectorAll('[required]').forEach(field => {
      if (!this.checkField(field)) isValid = false;
    });
    return isValid;
  }

  checkField(field) {
    const val = field.value.trim();
    // Remove old error
    field.classList.remove('input-error');
    const existingErr = field.parentNode.querySelector('.field-error');
    if(existingErr) existingErr.remove();

    let error = '';
    if (!val) error = 'Required';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Invalid email';

    if (error) {
      field.classList.add('input-error');
      const div = document.createElement('div');
      div.className = 'field-error';
      div.textContent = error;
      field.parentNode.appendChild(div);
      return false;
    }
    return true;
  }

  setupSocials() {
    this.dom.socials.forEach(item => {
      item.addEventListener('mouseenter', () => item.style.transform = 'scale(1.05)');
      item.addEventListener('mouseleave', () => item.style.transform = 'scale(1)');
    });
  }

  showNotification(msg, type) {
    const notif = document.createElement('div');
    notif.className = `sys-notif ${type}`;
    notif.innerHTML = `<span>${msg}</span><button type="button"><ion-icon name="close-outline"></ion-icon></button>`;
    
    notif.querySelector('button').onclick = () => {
       notif.classList.add('hiding');
       setTimeout(() => notif.remove(), 300);
    };

    document.body.appendChild(notif);
    setTimeout(() => { if(notif.parentNode) notif.querySelector('button').click(); }, 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => new ContactManager());