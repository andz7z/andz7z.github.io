/* ANDZ — Lehadus Andrei */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Selectoare Globale ---
    const mainContainer = document.getElementById('main-container');
    const progressBar = document.getElementById('progress-bar');
    const mainNav = document.getElementById('main-nav');
    const secondaryNav = document.getElementById('secondary-nav');
    const goBackButton = document.getElementById('go-back-btn');
    const currentSectionIndicator = document.getElementById('current-section-indicator');
    const homeSection = document.getElementById('home');
    const sections = document.querySelectorAll('.fullscreen-section');
    const homeCTA = document.getElementById('cta-scroll');
    
    // Selectoare Modal
    const tosButton = document.getElementById('tos-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');

    // --- 2. Logică Scroll & Progress Bar ---
    
    // Variabilă pentru a urmări dacă CTA-ul de pe Home a fost ascuns
    let isHomeCtaHidden = false; 

    mainContainer.addEventListener('scroll', () => {
        const scrollTop = mainContainer.scrollTop;
        const scrollHeight = mainContainer.scrollHeight - mainContainer.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        // Actualizare Progress Bar
        progressBar.style.width = `${scrollPercentage}%`;

        // Logica pentru afișare/ascundere navigație
        // Considerăm "scrolled past home" după 50% din înălțimea 'home'
        const homeHeight = homeSection.clientHeight;
        
        if (scrollTop > homeHeight / 2) {
            // Utilizatorul A PLECAT de pe Home
            mainNav.classList.add('fade-out');
            secondaryNav.classList.add('is-visible');
        } else {
            // Utilizatorul S-A ÎNTORS pe Home
            mainNav.classList.remove('fade-out');
            secondaryNav.classList.remove('is-visible');
        }

        // Ascunde CTA-ul (Let's Start) de pe Home la primul scroll
        if (!isHomeCtaHidden && scrollTop > 50) {
            homeCTA.classList.add('fade-out');
            isHomeCtaHidden = true; // Setează flag-ul pentru a nu mai rula logica
        }
    });

    // Butonul Go Back (din navigația secundară)
    goBackButton.addEventListener('click', (e) => {
        e.preventDefault();
        mainContainer.scrollTo({
            top: 0,
            behavior: 'smooth' // Folosim scroll-ul smooth al containerului
        });
    });

    // --- 3. Intersection Observer (Fade-ins & "Currently on") ---
    
    const observerOptions = {
        root: mainContainer, // Scroll-ul se întâmplă în mainContainer
        rootMargin: '0px',
        threshold: 0.6 // Secțiunea trebuie să fie 60% vizibilă
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adaugă clasa 'is-visible' pentru animațiile fade-in din CSS
                entry.target.classList.add('is-visible');
                
                // Actualizează textul "Currently on"
                const sectionName = entry.target.dataset.sectionName;
                if (sectionName && sectionName !== "Home") {
                    currentSectionIndicator.textContent = `On: ${sectionName}`;
                } else {
                    currentSectionIndicator.textContent = ''; // Nu arătăm nimic pe Home
                }
            } else {
                // Opțional: elimină clasa când secțiunea iese (dacă vrei animații la fiecare intrare)
                // entry.target.classList.remove('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observă toate secțiunile
    sections.forEach(section => {
        observer.observe(section);
    });

    // --- 4. Logică Modal (Termeni și Condiții) ---
    const openModal = () => {
        modalOverlay.style.visibility = 'visible';
        modalOverlay.classList.add('is-visible');
        modalOverlay.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modalOverlay.style.visibility = 'hidden';
        modalOverlay.classList.remove('is-visible');
        modalOverlay.setAttribute('aria-hidden', 'true');
    };

    tosButton.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    
    // Închide la click pe overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Închide la tasta 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
            closeModal();
        }
    });

    // --- 5. Inițializare An An ---
    // Actualizează anul din copyright
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- 6. Inițializare scripturi modulare ---
    // Verificăm dacă funcțiile de inițializare există înainte de a le apela
    if (typeof initHomeAnimations === 'function') {
        initHomeAnimations();
    }
    if (typeof initPortfolioAnimations === 'function') {
        initPortfolioAnimations();
    }
    // ... (aici pot fi adăugate și altele: initAbout(), initServices(), etc.)
});
