function openSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  window.scrollTo({ top: document.getElementById(id).offsetTop - 50, behavior: 'smooth' });
}
