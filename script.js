// === Active Glow on Click ===
document.querySelectorAll('.glass').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.glass').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
