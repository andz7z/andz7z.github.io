// ===== SCRIPT PRINCIPAL - CONTROLE GLOBALE =====

// Inițializare la încărcarea DOM-ului
document.addEventListener('DOMContentLoaded', function() {
    // Elimină clasa de preîncărcare pentru a declanșa animațiile
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 500);
    
    // Inițializează funcționalitățile
    initNavbar();
    initScrollSnap();
    initModal();
    initScrollAnimations();
});

// ===== NAVBAR FUNCTIONALITY =====
function initNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Intersection Observer pentru a detecta secțiunea activă
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                setActiveNavLink(id);
            }
        });
    }, observerOptions);
    
    // Observă fiecare secțiune
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Funcție pentru setarea link-ului activ
    function setActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll pentru link-urile din navbar
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SCROLL SNAPPING =====
function initScrollSnap() {
    // Scroll snapping este implementat în CSS
    // Această funcție poate fi folosită pentru ajustări suplimentare
    const mainContent = document.querySelector('.main-content');
    
    // Asigură-te că scroll snapping funcționează corect
    mainContent.style.scrollSnapType = 'y mandatory';
}

// ===== MODAL FUNCTIONALITY =====
function initModal() {
    const modal = document.getElementById('modal');
    const modalBackdrop = modal.querySelector('.modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const privacyLink = document.getElementById('privacy-link');
    const tosLink = document.getElementById('tos-link');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    // Conținut pentru modal
    const modalContent = {
        privacy: {
            title: 'Privacy Policy',
            content: `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            `
        },
        tos: {
            title: 'Terms of Service',
            content: `
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
            `
        }
    };
    
    // Funcție pentru deschiderea modalului
    function openModal(type) {
        if (modalContent[type]) {
            modalTitle.textContent = modalContent[type].title;
            modalBody.innerHTML = modalContent[type].content;
            document.body.classList.add('modal-open');
        }
    }
    
    // Funcție pentru închiderea modalului
    function closeModal() {
        document.body.classList.remove('modal-open');
    }
    
    // Event listeners
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('privacy');
    });
    
    tosLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('tos');
    });
    
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Închide modalul cu tasta Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            closeModal();
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Intersection Observer pentru animații la scroll
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });
    
    // Observă elementele cu animații
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .services-grid, .reviews-grid, .contact-content');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
}

// ===== PERFORMANȚĂ ȘI OPTIMIZĂRI =====
// Debounce pentru event listeners care se declanșează frecvent
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Rezize observer pentru optimizări
window.addEventListener('resize', debounce(function() {
    // Recalculează layout-ul sau ajustări la redimensionare
}, 250));
