/* --- JS/MAIN.JS --- */
/* Logica globală, inițializări și listeners */

// Așteptăm ca DOM-ul să fie complet încărcat
document.addEventListener('DOMContentLoaded', () => {

    console.log("Portofoliu Inițializat. DOM gata.");

    // Inițializăm toate sistemele principale
    initThemeSwitcher();
    initScrollAnimations();
    initNavbarActiveState();
    initFooterCopyright();

});


/**
 * 1. SISTEM AVANSAT DE TEMĂ (NIGHT/LIGHT MODE)
 * Gestionează comutarea temei și salvarea preferinței.
 */
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Funcție pentru a aplica tema (dark/light)
    const applyTheme = (theme) => {
        body.classList.toggle('dark-mode', theme === 'dark');
        // Salvăm preferința în localStorage
        localStorage.setItem('theme', theme);
    };

    // Verificăm tema salvată în localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verificăm preferința de sistem a utilizatorului (matchMedia)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Stabilim tema inițială:
    // 1. Prioritate: Tema salvată de utilizator
    // 2. Fallback: Preferința de sistem
    // 3. Default: 'light'
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // Adăugăm listener pe butonul de toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // ---
        // 1. TRANZIȚIE ANIMATĂ (VIEW TRANSITIONS API)
        // Verificăm dacă browser-ul suportă View Transitions API
        // Acest API oferă un cross-fade fluid (Cerința 1)
        // ---
        if (document.startViewTransition) {
            // API-ul este suportat
            document.startViewTransition(() => {
                applyTheme(newTheme);
            });
        } else {
            // Fallback pentru browsere mai vechi (ex. Firefox)
            // Tranziția CSS din main.css (cea simplă) va fi folosită
            applyTheme(newTheme);
        }
    });
}


/**
 * 2. ANIMAȚII DE INTRARE/IEȘIRE (IN/OUT EFFECTS)
 * Folosește Intersection Observer pentru a adăuga clasa '.visible'
 * elementelor cu clasa '.reveal-*' când intră în viewport.
 */
function initScrollAnimations() {
    // Selectăm toate elementele pe care dorim să le animăm
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');

    // Opțiuni pentru observer:
    // root: null (viewport-ul browser-ului)
    // threshold: 0.1 (declanșează când 10% din element e vizibil)
    const observerOptions = {
        root: null, 
        threshold: 0.1 
    };

    // Callback-ul care se execută când vizibilitatea se schimbă
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Elementul a intrat în viewport, adăugăm clasa 'visible'
                entry.target.classList.add('visible');
                
                // Life-Hack: Odată animat, nu mai trebuie să-l observăm.
                // Acest lucru îmbunătățește performanța.
                observer.unobserve(entry.target);
            }
            // Nu facem nimic când iese (conform cerinței de "In Effect")
        });
    };

    // Creăm și pornim observer-ul
    const animationObserver = new IntersectionObserver(observerCallback, observerOptions);
    revealElements.forEach(el => animationObserver.observe(el));
}


/**
 * 7. NAVBAR INTELIGENT (ACTIVE STATE)
 * Folosește Intersection Observer pentru a detecta ce secțiune 
 * este vizibilă și a actualiza link-ul activ din navbar.
 */
function initNavbarActiveState() {
    const sections = document.querySelectorAll('.full-section');
    const navLinks = document.querySelectorAll('.main-header nav a');
    
    // Convertim NodeList într-un Map pentru căutare rapidă (href -> link element)
    const linkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            linkMap.set(href, link);
        }
    });

    // Opțiuni pentru observer:
    // root: .scroll-container (container-ul nostru cu scroll-snap)
    // threshold: 0.5 (declanșează când 50% din secțiune e vizibilă)
    // Acest 'threshold' de 0.5 asigură că doar o secțiune e activă la un moment dat.
    const observerOptions = {
        root: document.querySelector('.scroll-container'),
        threshold: 0.5 
    };

    // Callback-ul observer-ului
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Identificăm ID-ul secțiunii vizibile
                const id = entry.target.getAttribute('id');
                const href = `#${id}`;
                
                // Găsim link-ul corespunzător
                const activeLink = linkMap.get(href);

                if (activeLink) {
                    // Înlăturăm clasa 'active' de la toate link-urile
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Adăugăm clasa 'active' link-ului curent
                    activeLink.classList.add('active');
                }
            }
        });
    };

    // Creăm și pornim observer-ul
    const navObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => navObserver.observe(section));
}


/**
 * 8. FOOTER (An Curent)
 * Actualizează anul curent în footer pentru copyright.
 */
function initFooterCopyright() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
