// Setting up the Variables
var bars = document.getElementById("nav-action");
var nav = document.getElementById("nav");

// Setting up the listener
bars.addEventListener("click", barClicked, false);

// Setting up the clicked Effect
function barClicked() {
    bars.classList.toggle('active');
    nav.classList.toggle('visible');
}

// Smooth scrolling pentru link-urile din meniu
document.querySelectorAll('#nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Inchide meniul dupa click
        bars.classList.remove('active');
        nav.classList.remove('visible');
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    });
});
