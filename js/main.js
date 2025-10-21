/* FILE: js/main.js (Global Logic) */

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const scrollContainer = document.getElementById('scroll-container');
    const hamburger = document.getElementById('hamburger-button');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.fullscreen-section');
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalOverlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal-content');
    const modalCloseButtons = document.querySelectorAll('.modal-close');

    // --- 1. Navbar Scroll & Hamburger ---

    // Micsorare navbar la scroll în container
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            if (scrollContainer.scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Deschidere/Închidere meniu hamburger
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Închide meniul mobil la click pe un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    });


    // --- 2. Scroll Interaction (Intersection Observers) ---

    // Observer pentru Navigarea Activă
    const navObserverOptions = {
        root: scrollContainer,
        threshold: 0.6 // Secțiunea trebuie să fie 60% vizibilă
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Dezactivează toate link-urile
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                // Activează link-ul corespunzător
                const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    // Observer pentru Animații la Scroll
    const animationObserverOptions = {
        root: scrollContainer,
        threshold: 0.2 // Elementul trebuie să fie 20% vizibil
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Oprește observarea după ce animația a rulat (opțional)
                // observer.unobserve(entry.target);
            } else {
                 // Resetează animația dacă iese din ecran (opțional)
                 // entry.target.classList.remove('is-visible');
            }
        });
    }, animationObserverOptions);

    // Atașează observatorii
    sections.forEach(section => {
        navObserver.observe(section);
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });


    // --- 3. Modal Logic ---

    // Deschide Modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetModalId = trigger.getAttribute('data-modal-target');
            const targetModal = document.getElementById(targetModalId);

            // Ascunde toate celelalte modale
            allModals.forEach(modal => modal.classList.remove('active'));
            
            // Afișează modal-ul țintă și overlay-ul
            if (targetModal) {
                targetModal.classList.add('active');
                modalOverlay.classList.add('active');
            }
        });
    });

    // Funcție de închidere
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        allModals.forEach(modal => modal.classList.remove('active'));
    }

    // Închide la click pe 'X'
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Închide la click pe overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

});
