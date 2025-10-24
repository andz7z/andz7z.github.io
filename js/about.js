/* ========================================
   ABOUT SECTION - INTERACTIVE EFFECTS
   ======================================== */

'use strict';

/* ========================================
   ABOUT DOM ELEMENTS
   ======================================== */

const AboutDOM = {
    section: null,
    container: null
};

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 About module initializing...');
    
    // Cache DOM elements
    AboutDOM.section = document.getElementById('about');
    AboutDOM.container = document.querySelector('.about-container');
    
    // Initialize features
    initAboutSection();
    
    console.log('✅ About module loaded');
});

/* ========================================
   ABOUT SECTION INITIALIZATION
   ======================================== */

function initAboutSection() {
    if (!AboutDOM.section) return;
    
    // Add your custom initialization code here
    
    console.log('📖 About section initialized');
}

/* ========================================
   EXPORT ABOUT MODULE
   ======================================== */

window.AboutModule = {
    AboutDOM
};
