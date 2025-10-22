// Logica JavaScript specifică pentru secțiunea #portfolioo
// portfolio.js
function initPortfolio() {
    // Modal pentru detalii proiect
    initProjectModal();
}

function initProjectModal() {
    const viewButtons = document.querySelectorAll('.view-project');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Într-o implementare reală, aici s-ar deschide un modal cu detalii despre proiect
            alert('Detalii proiect vor fi afișate aici într-o implementare completă.');
        });
    });
}
