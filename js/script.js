document.addEventListener("DOMContentLoaded", function() {

    const scrollContainer = document.querySelector('.scroll-container');
    const progressBar = document.querySelector('.progress-bar');
    
    const homeHeader = document.querySelector('.home-header');
    const pageHeader = document.querySelector('.page-header');
    const currentSectionText = document.querySelector('.current-section-text');
    const homeSection = document.getElementById('home');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const allSections = document.querySelectorAll('section[data-section-name]');
    const socials = document.querySelector('.socials');

    // ===== 1. Scroll Progress Bar =====
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });

    // ===== 2. Header & UI Toggle (Intersection Observer) =====
    const homeObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            // Suntem pe Home
            homeHeader.classList.remove('hidden');
            pageHeader.classList.add('hidden');
            scrollIndicator.classList.remove('hidden');
            socials.classList.remove('hidden');
            footer.classList.remove('hidden');
        } else {
            // Nu suntem pe Home
            homeHeader.classList.add('hidden');
            pageHeader.classList.remove('hidden');
            scrollIndicator.classList.add('hidden');
            
            // Cerința P.S: "toate iconitele, etc dispar cand dai scroll"
            socials.classList.add('hidden');
            footer.classList.add('hidden');
        }
    }, {
        root: scrollContainer,
        threshold: 0.5 // Se activează când 50% din Home e vizibil
    });

    homeObserver.observe(homeSection);

    // ===== 3. "Currently On" Text Update =====
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId) {
                    const navLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
                    if (navLink) {
                        const iconClass = navLink.querySelector('i').className;
                        currentSectionText.innerHTML = `Currently on: <i class="${iconClass}"></i>`;
                    }
                }
            }
        });
    }, {
        root: scrollContainer,
        threshold: 0.7 // Se activează când 70% dintr-o secțiune e vizibilă
    });
    
    allSections.forEach(section => {
        sectionObserver.observe(section);
    });
});
