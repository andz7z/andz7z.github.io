// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const header = document.getElementById('main-header');
const logo = header.querySelector('.logo');
const desktopNav = header.querySelector('.desktop-nav');
const navItems = desktopNav.querySelectorAll('.nav-item');
const minimalNav = header.querySelector('.minimal-nav');
const currentSectionDisplay = minimalNav.querySelector('.current-section-display');
const backIcon = minimalNav.querySelector('.back-icon');
const scrollProgressBar = document.getElementById('scroll-progress-bar');
const scrollContainer = document.getElementById('scroll-container');
const sections = document.querySelectorAll('.section');
const discoverBtn = document.querySelector('.discover-btn');

// --- 1. INTRO ANIMATION (GSAP Timeline) ---
function runIntroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const homeTexts = document.querySelectorAll('#home .main-text, #home .tagline');
    const socialLinks = document.querySelectorAll('.social-link, .social-line');

    tl.to('body', { opacity: 1, duration: 0.1 }) // Ensure body is visible
      .from(logo, { opacity: 0, scale: 0.5, duration: 1.5, ease: "elastic.out(1, 0.5)" }, 0.5)
      .from(navItems, { opacity: 0, y: -20, stagger: 0.1, duration: 0.8 }, 0.8)
      .from(homeTexts, { opacity: 0, filter: 'blur(10px)', y: 50, stagger: 0.15, duration: 1.5 }, 0.5)
      .from(discoverBtn, { opacity: 0, filter: 'blur(5px)', y: 20, duration: 1 }, 1.5)
      .from(socialLinks, { opacity: 0, duration: 1.5, stagger: 0.1, ease: "power2.out" }, 1.2);
}

// --- 2. CUSTOM CURSOR & LINK HOVER ---
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, [data-cursor-target]');

document.addEventListener('mousemove', (e) => {
    // GSAP is highly performant for this
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0, ease: 'none' });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('link-hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('link-hover'));
});

// --- 3. SCROLL PROGRESS BAR ---
function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgressBar.style.width = `${progress}%`;
}

document.addEventListener('scroll', updateScrollProgress);

// --- 4. MAGNETIC SCROLL SNAP (ScrollTrigger) ---
let isScrolling = false;

sections.forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateActiveSection(section.id, 'enter'),
        onEnterBack: () => updateActiveSection(section.id, 'back'),
    });
});

// Function to handle the actual snapping logic
function magneticScrollTo(targetID) {
    if (isScrolling) return;

    isScrolling = true;
    const targetElement = document.getElementById(targetID);

    gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: targetElement.offsetTop, autoKill: false },
        ease: "power2.inOut",
        onComplete: () => {
            isScrolling = false;
        }
    });
}

// --- 5. NAVBAR TRANSITION LOGIC ---
let currentSection = 'home';
const sectionNames = {
    'home': 'Home',
    'about': 'About',
    'services': 'Services',
    'portfolio': 'Portfolio',
    'reviews': 'Reviews',
    'contact': 'Contact'
};

function updateActiveSection(id, direction) {
    // Only update if scrolling away from 'home' or back to 'home'
    const isHome = id === 'home';
    const isMobile = window.innerWidth <= 1024;

    currentSection = id;
    currentSectionDisplay.textContent = `Currently on: ${sectionNames[id]}`;

    // Apply Navbar transition
    if (isHome) {
        desktopNav.classList.remove('hidden');
        minimalNav.classList.remove('visible');
    } else {
        desktopNav.classList.add('hidden');
        if (!isMobile) { // Only show minimal nav on desktop
            minimalNav.classList.add('visible');
        }
    }

    // Update 'active-section' for styling/logic (optional)
    sections.forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
}

// Handle navigation clicks to trigger magnetic scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetID = this.getAttribute('href').substring(1);
        if (targetID) {
            magneticScrollTo(targetID);
            // Close mobile menu on click
            if(window.innerWidth <= 1024) toggleMobileMenu(false);
        }
    });
});

// Go Back (⬅) icon handler
backIcon.addEventListener('click', () => magneticScrollTo('home'));

// --- 6. PARALLAX EFFECT (for Home text) ---
const parallaxTargets = document.querySelectorAll('.parallax-target');

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    parallaxTargets.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        const yPos = scrollPos * speed; // Simple Y translation

        gsap.to(el, {
            y: yPos,
            duration: 0.5,
            ease: 'none',
            overwrite: true
        });
    });
});


// --- 7. SECTION REVEAL (Intersection Observer) ---
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of the section is visible
});

sections.forEach(section => {
    if (section.id !== 'home') { // Home is handled by the intro animation
        revealObserver.observe(section);
    }
});

// --- 8. MOBILE MENU LOGIC ---
const hamburger = document.querySelector('.hamburger-menu');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function toggleMobileMenu(forceState) {
    const shouldOpen = forceState !== undefined ? forceState : !hamburger.classList.contains('is-active');

    if (shouldOpen) {
        hamburger.classList.add('is-active');
        mobileOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent scroll underneath
    } else {
        hamburger.classList.remove('is-active');
        mobileOverlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
}

hamburger.addEventListener('click', () => toggleMobileMenu());

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    runIntroAnimation();
    updateScrollProgress(); // Initial check
    updateActiveSection('home'); // Set initial state
});

// Handle resize for mobile/desktop layout
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 1024;
    // Re-evaluate nav state on resize
    updateActiveSection(currentSection);
    // Ensure mobile menu is closed and scroll is reset
    if (!isMobile) toggleMobileMenu(false);
});
