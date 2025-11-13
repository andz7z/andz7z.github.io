const video = document.getElementById("bg-video");

video.addEventListener("ended", function() {
  this.pause();
  this.currentTime = this.duration;
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(timer);
      current = target;
    }
    
    if (element.classList.contains('percent')) {
      element.textContent = `${current.toFixed(1)}%`;
    } else if (element.classList.contains('multiplier')) {
      element.textContent = `${Math.floor(current)}x`;
    } else if (element.classList.contains('support')) {
      element.textContent = `${Math.floor(current)}/7`;
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', function() {
  const statItems = document.querySelectorAll('.stat-item');
  
  statItems.forEach(item => {
    const target = parseFloat(item.getAttribute('data-target'));
    const delay = parseInt(item.getAttribute('data-delay'));
    const numberElement = item.querySelector('.stat-number');
    
    // Add classes for different formatting
    if (item.textContent.includes('%')) numberElement.classList.add('percent');
    if (item.textContent.includes('x')) numberElement.classList.add('multiplier');
    if (item.textContent.includes('/7')) numberElement.classList.add('support');
    
    // Start animation after delay
    setTimeout(() => {
      item.style.animation = 'fadeInUp 1s ease-out forwards';
      animateCounter(numberElement, target);
    }, 1500 + delay); // Start after main text animations
  });
});