const menuToggle = document.getElementById("menuToggle");
const fullscreenMenu = document.getElementById("fullscreenMenu");
const closeMenu = document.getElementById("closeMenu");
const navItems = document.querySelectorAll(".nav-item");
const letsTalkBtn = document.querySelector(".lets-talk-btn");
const menuBackground = document.querySelector(".menu-background");
const socialLinks = document.querySelectorAll(".social-link");

// Performance optimization
let isMenuAnimating = false;
let scrollTimeout = null;
let resizeTimeout = null;

// Index pentru navigarea de la tastatură
let currentFocusIndex = -1;

// Menu functions
function openFullscreenMenu() {
    if (isMenuAnimating) return;
    isMenuAnimating = true;
    
    fullscreenMenu.classList.add("active");
    menuToggle.classList.add("hidden");
    document.body.style.overflow = "hidden";

    // Setare focus pentru tastatură
    const activeItem = document.querySelector(".nav-item.active");
    if (activeItem) {
        currentFocusIndex = Array.from(navItems).indexOf(activeItem);
        if (currentFocusIndex !== -1) {
            setSelectedItem(currentFocusIndex);
        }
    } else {
        currentFocusIndex = 0;
        setSelectedItem(0);
    }
    
    // Animație de apariție pentru elementele din meniu
    animateMenuItems();
    
    setTimeout(() => {
        isMenuAnimating = false;
    }, 300);
}

function closeFullscreenMenu() {
    if (isMenuAnimating) return;
    isMenuAnimating = true;
    
    fullscreenMenu.classList.remove("active");
    menuToggle.classList.remove("hidden");
    document.body.style.overflow = "auto";

    // Resetare focus tastatură
    clearSelectedItem();
    currentFocusIndex = -1;
    
    setTimeout(() => {
        isMenuAnimating = false;
    }, 300);
}

// Funcții pentru navigarea cu taste
function setSelectedItem(index) {
    // Elimină selecția curentă
    clearSelectedItem();
    
    // Adaugă noua selecție
    if (navItems[index]) {
        navItems[index].classList.add("selected");
        currentFocusIndex = index;
        
        // Scroll la elementul selectat
        navItems[index].scrollIntoView({ 
            block: "center",
            behavior: "smooth" 
        });
    }
}

function clearSelectedItem() {
    navItems.forEach(item => item.classList.remove("selected"));
}

function navigateUp() {
    if (currentFocusIndex <= 0) {
        setSelectedItem(navItems.length - 1);
    } else {
        setSelectedItem(currentFocusIndex - 1);
    }
}

function navigateDown() {
    if (currentFocusIndex >= navItems.length - 1) {
        setSelectedItem(0);
    } else {
        setSelectedItem(currentFocusIndex + 1);
    }
}

function selectCurrentItem() {
    if (currentFocusIndex !== -1 && navItems[currentFocusIndex]) {
        navItems[currentFocusIndex].click();
    }
}

// Animație de apariție pentru elementele meniului
function animateMenuItems() {
    const menuElements = document.querySelectorAll('.nav-item, .menu-logo, .menu-header-buttons, .follow-me-section');
    
    menuElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

// Efect magnetic pentru iconițe
function initMagneticEffect() {
    socialLinks.forEach(link => {
        const iconWrapper = link.querySelector('.social-icon-wrapper');
        if (!iconWrapper) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let iconX = 0;
        let iconY = 0;
        let ease = 0.1;
        
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            mouseX = e.clientX - rect.left - rect.width / 2;
            mouseY = e.clientY - rect.top - rect.height / 2;
            
            iconX += (mouseX - iconX) * ease;
            iconY += (mouseY - iconY) * ease;
            
            const strength = 15;
            const moveX = (iconX / rect.width) * strength;
            const moveY = (iconY / rect.height) * strength;
            
            iconWrapper.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px) scale(1.1)`;
        });
        
        link.addEventListener('mouseleave', () => {
            // Animație smooth pentru revenire la poziția inițială
            iconWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            iconWrapper.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            // Reset după animație
            setTimeout(() => {
                iconWrapper.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 600);
            
            mouseX = 0;
            mouseY = 0;
            iconX = 0;
            iconY = 0;
        });
    });
}

// Event listeners
menuToggle.addEventListener("click", openFullscreenMenu);
closeMenu.addEventListener("click", closeFullscreenMenu);

fullscreenMenu.addEventListener("click", (e) => {
    if (e.target === fullscreenMenu || e.target === menuBackground) {
        closeFullscreenMenu();
    }
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    // ESC pentru închiderea meniului
    if (e.key === "Escape" && fullscreenMenu.classList.contains("active")) {
        closeFullscreenMenu();
    }
    
    // M pentru deschiderea meniului
    if ((e.key === "m" || e.key === "M") && !fullscreenMenu.classList.contains("active")) {
        openFullscreenMenu();
    }
    
    // Logica pentru Arrow Keys în meniu
    if (fullscreenMenu.classList.contains("active")) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            navigateDown();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            navigateUp();
        } else if (e.key === "Enter") {
            e.preventDefault();
            selectCurrentItem();
        }
    }
});

// Navigation
navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(item.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ 
                behavior: "smooth",
                block: "start"
            });
            closeFullscreenMenu();
            
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
        }
    });
});

letsTalkBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(letsTalkBtn.getAttribute("href"));
    if (target) {
        target.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
        });
        closeFullscreenMenu();
    }
});

// Intersection Observer pentru activarea secțiunilor
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const correspondingNav = document.querySelector(`.nav-item[href="#${id}"]`);
            
            if (correspondingNav) {
                navItems.forEach(item => item.classList.remove("active"));
                correspondingNav.classList.add("active");
            }
        }
    });
}, {
    root: null,
    rootMargin: "-20% 0px -20% 0px",
    threshold: 0.2,
});
sections.forEach(section => observer.observe(section));

// Funcție pentru actualizarea culorii iconiței meniului
function updateMenuIconColor() {
    if (isMenuAnimating || !menuToggle || menuToggle.classList.contains('hidden')) return;
    const menuRect = menuToggle.getBoundingClientRect();
    const elementBelow = document.elementFromPoint(menuRect.left + menuRect.width / 2, menuRect.top + menuRect.height / 2);
    if (elementBelow) {
        const computedStyle = window.getComputedStyle(elementBelow);
        const backgroundColor = computedStyle.backgroundColor;
        const rgb = backgroundColor.match(/\d+/g);
        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            menuToggle.style.mixBlendMode = brightness > 125 ? 'difference' : 'normal';
        }
    }
}

// Event listeners pentru scroll și resize
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateMenuIconColor, 10);
});

window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMenuIconColor, 100);
});

// Swipe pentru închiderea meniului
let startX = 0;
fullscreenMenu.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
fullscreenMenu.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) { closeFullscreenMenu(); }
    }
});

// Inițializare
document.addEventListener('DOMContentLoaded', () => {
    updateMenuIconColor();
    initMagneticEffect();
    
    // Adăugăm event listener pentru logo hover
    const menuLogo = document.querySelector('.menu-logo');
    if (menuLogo) {
        menuLogo.addEventListener('mouseenter', () => {
            const logoText = menuLogo.querySelector('.logo-text');
            
            if (logoText) {
                logoText.style.transform = 'scale(1.05)';
            }
        });
        
        menuLogo.addEventListener('mouseleave', () => {
            const logoText = menuLogo.querySelector('.logo-text');
            
            if (logoText) {
                logoText.style.transform = 'scale(1)';
            }
        });
    }
});
  const progressBar = document.getElementById('scrollProgress');
  const glow = document.getElementById('scrollGlow');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + '%';
  });