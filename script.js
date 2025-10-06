// Show main buttons when hovering ANDZ
const brand = document.getElementById('brand');
const mainButtons = document.getElementById('main-buttons');
brand.addEventListener('mouseenter', () => mainButtons.classList.remove('hidden'));
brand.addEventListener('mouseleave', () => mainButtons.classList.add('hidden'));

// Sections toggle
const buttons = document.querySelectorAll('#main-buttons .btn');
const sections = document.querySelectorAll('.section');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(target).style.display = 'block';
    // Hide buttons after click
    mainButtons.classList.add('hidden');
  });
});

// Contact modal
const contactBtn = document.querySelector('[data-section="contact"]');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.getElementById('close-modal');
contactBtn.addEventListener('click', () => contactModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => contactModal.classList.add('hidden'));

// Close modal by clicking outside content
contactModal.addEventListener('click', e => {
  if(e.target === contactModal) contactModal.classList.add('hidden');
});
