// Progress Scroll Bar Functionality
window.onscroll = function() {
    updateProgressBar();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}

// Futuristic Menu Functionality
const menuToggle = document.getElementById('menuToggle');
const menuContent = document.getElementById('menuContent');

menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    menuContent.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideMenu = menuToggle.contains(event.target) || menuContent.contains(event.target);
    
    if (!isClickInsideMenu && menuContent.classList.contains('active')) {
        menuToggle.classList.remove('active');
        menuContent.classList.remove('active');
    }
});

// Smooth scrolling for menu items
document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        
        // Close menu
        menuToggle.classList.remove('active');
        menuContent.classList.remove('active');
    });
});

// Glass Card Functionality
const glassCard = document.getElementById('glassCard');
const moveCardBtn = document.getElementById('moveCard');
const resizeCardBtn = document.getElementById('resizeCard');

let isMoving = false;
let isResizing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;

// Move Card Functionality
moveCardBtn.addEventListener('click', function() {
    isMoving = !isMoving;
    isResizing = false;
    
    glassCard.classList.toggle('moving', isMoving);
    glassCard.classList.toggle('resizing', false);
    
    this.style.background = isMoving ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    resizeCardBtn.style.background = 'rgba(255, 255, 255, 0.1)';
});

// Resize Card Functionality
resizeCardBtn.addEventListener('click', function() {
    isResizing = !isResizing;
    isMoving = false;
    
    glassCard.classList.toggle('resizing', isResizing);
    glassCard.classList.toggle('moving', false);
    
    this.style.background = isResizing ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    moveCardBtn.style.background = 'rgba(255, 255, 255, 0.1)';
});

// Mouse events for moving card
glassCard.addEventListener('mousedown', function(e) {
    if (isMoving) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(window.getComputedStyle(glassCard).left);
        startTop = parseInt(window.getComputedStyle(glassCard).top);
        
        document.addEventListener('mousemove', moveCard);
        document.addEventListener('mouseup', stopMoveCard);
    } else if (isResizing) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.getComputedStyle(glassCard).width);
        startHeight = parseInt(window.getComputedStyle(glassCard).height);
        
        document.addEventListener('mousemove', resizeCard);
        document.addEventListener('mouseup', stopResizeCard);
    }
});

function moveCard(e) {
    if (!isMoving) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    glassCard.style.left = (startLeft + deltaX) + 'px';
    glassCard.style.top = (startTop + deltaY) + 'px';
    glassCard.style.transform = 'none';
}

function stopMoveCard() {
    document.removeEventListener('mousemove', moveCard);
    document.removeEventListener('mouseup', stopMoveCard);
}

function resizeCard(e) {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newWidth = Math.max(300, startWidth + deltaX);
    const newHeight = Math.max(200, startHeight + deltaY);
    
    glassCard.style.width = newWidth + 'px';
    glassCard.style.height = 'auto';
    glassCard.style.minHeight = newHeight + 'px';
}

function stopResizeCard() {
    document.removeEventListener('mousemove', resizeCard);
    document.removeEventListener('mouseup', stopResizeCard);
}

// Touch events for mobile
glassCard.addEventListener('touchstart', function(e) {
    if (isMoving) {
        e.preventDefault();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startLeft = parseInt(window.getComputedStyle(glassCard).left);
        startTop = parseInt(window.getComputedStyle(glassCard).top);
        
        document.addEventListener('touchmove', moveCardTouch);
        document.addEventListener('touchend', stopMoveCardTouch);
    } else if (isResizing) {
        e.preventDefault();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startWidth = parseInt(window.getComputedStyle(glassCard).width);
        startHeight = parseInt(window.getComputedStyle(glassCard).height);
        
        document.addEventListener('touchmove', resizeCardTouch);
        document.addEventListener('touchend', stopResizeCardTouch);
    }
});

function moveCardTouch(e) {
    if (!isMoving) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    glassCard.style.left = (startLeft + deltaX) + 'px';
    glassCard.style.top = (startTop + deltaY) + 'px';
    glassCard.style.transform = 'none';
}

function stopMoveCardTouch() {
    document.removeEventListener('touchmove', moveCardTouch);
    document.removeEventListener('touchend', stopMoveCardTouch);
}

function resizeCardTouch(e) {
    if (!isResizing) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    const newWidth = Math.max(300, startWidth + deltaX);
    const newHeight = Math.max(200, startHeight + deltaY);
    
    glassCard.style.width = newWidth + 'px';
    glassCard.style.height = 'auto';
    glassCard.style.minHeight = newHeight + 'px';
}

function stopResizeCardTouch() {
    document.removeEventListener('touchmove', resizeCardTouch);
    document.removeEventListener('touchend', stopResizeCardTouch);
}
