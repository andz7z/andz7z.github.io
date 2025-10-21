// JavaScript Global (Preloader, Cursor, Navigație, Modal, Teme)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTIONAREA PRELOADER-ULUI ---
    window.addEventListener('load', () => {
        // Simulează o mică întârziere după ce totul s-a încărcat (ex. 2s de la animatia CSS)
        setTimeout(() => {
            document.body.classList.add('preload-finished');
            document.body.classList.remove('preload');
        }, 2200); // Trebuie să corespundă cu animația 'load' din CSS
    });


    // --- 2. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });

    // Adaugă clasa 'cursor-hover' pe body când mouse-ul e peste elemente interactive
    const interactiveElements = document.querySelectorAll('a, button, [data-magnetic], .modal-trigger');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    // --- 3. BUTOANE MAGNETICE ---
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    const magneticStrength = 0.4; // Puterea de atracție (0-1)

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();
            
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const deltaX = (clientX - centerX) * magneticStrength;
            const deltaY = (clientY - centerY) * magneticStrength;

            // Folosim GSAP dacă ar fi importat, dar pentru Vanilla JS folosim transform
            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });


    // --- 4. THEME TOGGLE (Light/Dark Mode) ---
    const themeToggle = document.querySelector('.theme-toggle');
    const rootHtml = document.documentElement;

    themeToggle.addEventListener('click', () => {
        if (rootHtml.classList.contains('dark-mode')) {
            rootHtml.classList.remove('dark-mode');
            rootHtml.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            rootHtml.classList.remove('light-mode');
            rootHtml.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Verifică tema salvată la încărcare
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        rootHtml.classList.remove('dark-mode');
        rootHtml.classList.add('light-mode');
    } // Dark este default


    // --- 5. SCROLLSPY (Navigare) ȘI ANIMAȚII (Scroll-Triggered) ---
    const sections = document.querySelectorAll('section, footer#footer');
    const navLinks = document.querySelectorAll('header nav a');
    const mainScrollContainer = document.getElementById('scroll-container');

    const observerOptions = {
        root: mainScrollContainer,
        rootMargin: '0px',
        threshold: 0.5 // 50% vizibil
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                // Adaugă clasa .in-view pentru a porni animațiile
                entry.target.classList.add('in-view');
                
                // Actualizează link-ul activ din nav
                navLinks.forEach(link => link.classList.remove('active'));
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            } else {
                // Opțional: elimină clasa pentru a re-anima la fiecare scroll
                // entry.target.classList.remove('in-view'); 
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // --- 6. GESTIONAREA MODALULUI (POP-UP) ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalTitleElement = document.getElementById('modal-title');

    const toggleModal = (show, title = 'Informații') => {
        document.body.classList.toggle('modal-open', show);
        
        if(show) {
            modalTitleElement.textContent = title;
        }
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalTitle = trigger.getAttribute('data-modal-title');
            toggleModal(true, modalTitle);
        });
    });

    modalCloseBtn.addEventListener('click', () => toggleModal(false));
    modalBackdrop.addEventListener('click', () => toggleModal(false));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            toggleModal(false);
        }
    });

});
