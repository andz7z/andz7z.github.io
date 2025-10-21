// JavaScript Global (Navigație, Modal, Intro)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTIONAREA ANIMAȚIEI DE INTRO ---
    // Elimină clasa .preload de pe body după ce pagina s-a încărcat
    // Aceasta va declanșa animațiile CSS definite în style.css
    window.addEventListener('load', () => {
        document.body.classList.remove('preload');
    });


    // --- 2. SCROLLSPY PENTRU BARA DE NAVIGARE (Intersection Observer) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const mainScrollContainer = document.getElementById('scroll-container');

    const observerOptions = {
        root: mainScrollContainer, // Observăm scroll-ul în containerul principal
        rootMargin: '0px',
        threshold: 0.6 // Secțiunea trebuie să fie vizibilă 60% pentru a fi "activă"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`header nav a[href="#${id}"]`);

                // Elimină clasa 'active' de la toate link-urile
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Adaugă clasa 'active' la link-ul corespunzător
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observă fiecare secțiune
    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- 3. GESTIONAREA MODALULUI (POP-UP) ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalTitleElement = document.getElementById('modal-title');

    const toggleModal = (show, title = 'Informații') => {
        document.body.classList.toggle('modal-open', show);
        
        if(show) {
            modalTitleElement.textContent = title;
            // Aici s-ar putea adăuga logică pentru a încărca conținut diferit
            // ex. fetch(`content/${title.toLowerCase().replace(' ', '-')}.txt`)
        }
    };

    // Deschide modalul la click pe link-urile din footer
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault(); // Previne saltul paginii la href="#"
            const modalTitle = trigger.getAttribute('data-modal-title');
            toggleModal(true, modalTitle);
        });
    });

    // Închide modalul la click pe butonul 'X'
    modalCloseBtn.addEventListener('click', () => {
        toggleModal(false);
    });

    // Închide modalul la click pe fundal (backdrop)
    modalBackdrop.addEventListener('click', () => {
        toggleModal(false);
    });

    // Închide modalul la apăsarea tastei 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            toggleModal(false);
        }
    });

});
