// About section specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initAboutAnimations();
});

function initAboutAnimations() {
    // Skill tags animation
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('fade-in');
    });
    
    // Profile image shine effect
    const profileImage = document.querySelector('.image-placeholder');
    
    setInterval(() => {
        profileImage.style.animation = 'none';
        setTimeout(() => {
            profileImage.style.animation = 'shine 3s ease-in-out';
        }, 10);
    }, 5000);
}
