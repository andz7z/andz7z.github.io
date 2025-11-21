// About Section JavaScript - Proper Animation System
class AboutSection {
  constructor() {
    this.section = document.getElementById('about');
    this.contactBtn = document.getElementById('contactBtn');
    this.timeValue = document.getElementById('timeValue');
    this.timeStatus = document.getElementById('timeStatus');
    this.hasAnimated = false;
    
    this.workStartHour = 8; // 8:00 AM
    this.workEndHour = 20;  // 8:00 PM
    this.timeUpdateInterval = null;
    
    this.init();
  }
  
  init() {
    this.setupScrollObserver();
    this.startTimeUpdate();
    this.setupContactButton();
  }
  
  setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateIn();
          this.hasAnimated = true;
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(this.section);
  }
  
  animateIn() {
    // Add animated class to trigger CSS animations
    this.section.classList.add('animated');
    
    console.log('Animating about section...');
  }
  
  setupContactButton() {
    this.contactBtn.addEventListener('click', () => {
      // Add your contact action here
      console.log('Contact button clicked!');
      // Example: window.location.href = 'mailto:your@email.com';
    });
  }
  
  startTimeUpdate() {
    this.updateTime();
    this.timeUpdateInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  
  updateTime() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    
    // Check if it's Sunday
    if (currentDay === 0) {
      this.timeStatus.textContent = 'Busy, try again tomorrow';
      this.timeValue.textContent = '';
      this.contactBtn.classList.add('time-expired');
      return;
    }
    
    // Calculate remaining time in work day (UTC+2 timezone)
    let remainingHours, remainingMinutes, remainingSeconds;
    
    if (currentHour < this.workStartHour) {
      // Before work hours
      remainingHours = this.workStartHour - currentHour - 1;
      remainingMinutes = 60 - currentMinute - 1;
      remainingSeconds = 60 - currentSecond;
      this.timeStatus.textContent = 'Available in';
    } else if (currentHour >= this.workStartHour && currentHour < this.workEndHour) {
      // During work hours
      remainingHours = this.workEndHour - currentHour - 1;
      remainingMinutes = 60 - currentMinute - 1;
      remainingSeconds = 60 - currentSecond;
      this.timeStatus.textContent = 'Available for';
    } else {
      // After work hours
      remainingHours = (24 - currentHour) + this.workStartHour - 1;
      remainingMinutes = 60 - currentMinute - 1;
      remainingSeconds = 60 - currentSecond;
      this.timeStatus.textContent = 'Available in';
    }
    
    // Handle negative values
    if (remainingMinutes < 0) {
      remainingHours -= 1;
      remainingMinutes += 60;
    }
    if (remainingSeconds < 0) {
      remainingMinutes -= 1;
      remainingSeconds += 60;
    }
    
    // Ensure we don't show negative time
    if (remainingHours < 0) remainingHours = 0;
    if (remainingMinutes < 0) remainingMinutes = 0;
    if (remainingSeconds < 0) remainingSeconds = 0;
    
    // Update time display
    const timeString = `${remainingHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.timeValue.textContent = timeString;
    
    // Update colors based on remaining time
    this.updateTimeAppearance(remainingHours, remainingMinutes);
  }
  
  updateTimeAppearance(hours, minutes) {
    // Remove all color classes
    this.contactBtn.classList.remove('time-green', 'time-yellow', 'time-orange', 'time-red', 'time-expired');
    
    if (hours >= 8) {
      this.contactBtn.classList.add('time-green');
    } else if (hours >= 6) {
      this.contactBtn.classList.add('time-green');
    } else if (hours >= 4) {
      this.contactBtn.classList.add('time-yellow');
    } else if (hours >= 2) {
      this.contactBtn.classList.add('time-orange');
    } else if (hours >= 1 || (hours === 0 && minutes > 0)) {
      this.contactBtn.classList.add('time-red');
    } else {
      this.contactBtn.classList.add('time-expired');
      this.timeStatus.textContent = 'Busy, try again tomorrow';
      this.timeValue.textContent = '';
    }
  }
  
  destroy() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AboutSection();
});