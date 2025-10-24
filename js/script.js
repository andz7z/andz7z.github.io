// Progress Bar
window.onscroll = function() {
    updateProgressBar();
    toggleNavbarVisibility();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}

// Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Logo fallback
document.addEventListener('DOMContentLoaded', function() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.addEventListener('error', function() {
            this.style.display = 'none';
            const parent = this.parentElement;
            parent.textContent = 'LOGO';
            parent.style.fontFamily = 'Noverich, sans-serif';
        });
    }
});

// Favicon fallback
document.addEventListener('DOMContentLoaded', function() {
    const favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.addEventListener('error', function() {
            // Create a canvas favicon with letter A
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
