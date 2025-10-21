/* js/portfolio.js */

/**
 * Filtrare Portofoliu (Req 5)
 * ----------------------------
 * Ascunde și afișează elementele din grilă în funcție
 * de categoria selectată de butoane.
 */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Setează starea activă pe buton
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Iterează prin item-uri și afișează/ascunde
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block'; // Sau 'grid', 'flex' etc.
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Aici se va adăuga și logica pentru deschiderea Modalului (Req 5)
    // Ex: portfolioItems.forEach(item => item.addEventListener('click', () => { ... }))
});
