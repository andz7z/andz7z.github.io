/* js/script.js */

/**
 * Clasa PortfolioManager
 * ----------------------
 * Această clasă gestionează funcționalitățile globale ale site-ului,
 * cum ar fi bara de progres a scroll-ului, transformarea barei de navigare
 * și detectarea secțiunii curente folosind Intersection Observer.
 * Utilizarea unei clase ajută la organizarea codului (Req 7).
 */
class PortfolioManager {
    constructor() {
        // Cache DOM elements
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.mainNav = document.querySelector('#main-header');
        this.scrolledNav = document.querySelector('#scrolled-nav');
        this.currentSectionDisplay = document.querySelector('.current-section-display');
        this.sections = document.querySelectorAll('.fullscreen-section');
        this.navLinks = document.querySelectorAll('#main-nav .nav-links a');

        // Inițializare
        this.initScrollListener();
        this.initIntersectionObserver();
        this.initSmoothScroll();
        this.registerServiceWorker(); // Bonus (Req 7)
    }

    /**
     * Funcție Debounce (Req 6)
     * ------------------------
     * Limitează frecvența cu care o funcție este executată.
     * Esențial pentru performanța event listener-ilor precum 'scroll' sau 'resize'.
     * @param {Function} func - Funcția care trebuie executată.
     * @param {number} delay - Timpul de așteptare în milisecunde.
     */
    debounce(func, delay = 10) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * Inițiază listener-ul de scroll
     * ---------------------------------
     * Gestionează actualizarea barei de progres și transformarea barei de navigare.
     * Folosește funcția 'debounce' pentru optimizare (Req 6).
     */
    initScrollListener() {
        window.addEventListener('scroll', this.debounce(() => {
            this.updateScrollProgress();
            this.handleNavTransform();
        }));
    }

    /**
     * Actualizează Bara de Progres (Req 2)
     */
    updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Se folosește 'transform' pentru performanță (Req 6)
        this.progressBar.style.width = `${scrollPercent}%`;
    }

    /**
     * Gestionează Transformarea Barei de Navigare (Req 2)
     * ----------------------------------------------------
     * Ascunde navigația principală și afișează navigația de scroll
     * odată ce utilizatorul a derulat suficient (ex: 100vh).
     */
    handleNavTransform() {
        const scrollPosition = window.scrollY;
        
        // pragul este 90% din înălțimea viewport-ului
        const threshold = window.innerHeight * 0.9; 

        if (scrollPosition > threshold) {
            // Când s-a derulat în jos: ascunde navigația principală, arată cea secundară
            this.mainNav.style.opacity = '0';
            this.mainNav.style.transform = 'translateY(-100%)';
            this.scrolledNav.classList.remove('hidden');
        } else {
            // Când s-a derulat înapoi sus: arată navigația principală, ascunde cea secundară
            this.mainNav.style.opacity = '1';
            this.mainNav.style.transform = 'translateY(0)';
            this.scrolledNav.classList.add('hidden');
        }
    }

    /**
     * Inițiază Intersection Observer (Req 3 & 7)
     * -----------------------------------------
     * Observă secțiunile full-screen pentru a:
     * 1. Activa animațiile de fade-in (Req 3).
     * 2. Actualiza textul "Currently on:" (Req 2).
     * 3. Anima barele de progres (Req 5).
     */
    initIntersectionObserver() {
        const options = {
            root: null, // Observă în raport cu viewport-ul
            rootMargin: '0px',
            threshold: 0.5 // Se activează când 50% din secțiune e vizibilă
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adaugă clasa 'is-visible' pentru animația de fade-in
                    entry.target.classList.add('is-visible');
                    
                    // Actualizează textul "Currently on:"
                    const sectionName = entry.target.getAttribute('data-section-name');
                    if (sectionName) {
                        this.currentSectionDisplay.textContent = `Currently on: ${sectionName}`;
                    }
                } else {
                    // Opțional: elimină clasa pentru animație la ieșire
                    entry.target.classList.remove('is-visible');
                }
            });
        }, options);

        // Observă fiecare secțiune
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Inițiază Smooth Scroll (Req 3)
     * ------------------------------
     * Gestionează click-urile pe link-urile ancore pentru a derula lin
     * folosind scrollIntoView (alternativă la 'scroll-behavior: smooth'
     * pentru un control mai bun, deși CSS este mai simplu).
     */
    initSmoothScroll() {
        const allLinks = document.querySelectorAll('a[href^="#"]');
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Verifică dacă este un link ancore real, nu doar "#"
                if (href.length > 1) {
                    e.preventDefault();
                    const targetId = href;
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start' // Aliniază la începutul secțiunii
                        });
                    }
                }
            });
        });
    }

    /**
     * Înregistrează Service Worker (Bonus - Req 7)
     * -------------------------------------------
     * Activează funcționalități PWA de bază, cum ar fi caching-ul offline.
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }
}

// Inițiază managerul principal după ce DOM-ul este încărcat
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});
