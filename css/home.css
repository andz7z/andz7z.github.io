/* css/home.css */
/* 
HOW TO EDIT HOME SECTION:
- Video background: Update video source or fallback image
- Content animation: Adjust timing and effects
- Color overlay: Modify .video-overlay background
*/

.home-section {
    position: relative;
    overflow: hidden;
}

/* Video Background */
.video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.bg-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        45deg,
        rgba(10, 10, 20, 0.8) 0%,
        rgba(139, 92, 246, 0.2) 50%,
        rgba(236, 72, 153, 0.1) 100%
    );
}

/* Home Content */
.home-content {
    text-align: center;
    z-index: 2;
    opacity: 0;
    transform: translateY(30px);
    animation: homeReveal 1s ease 0.5s forwards;
}

.home-title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-lg);
    line-height: 1.1;
}

.title-line {
    display: block;
    background: linear-gradient(135deg, var(--color-text), var(--color-primary-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateY(20px);
    animation: titleLineReveal 0.8s ease forwards;
}

.title-line:nth-child(1) { animation-delay: 1s; }
.title-line:nth-child(2) { animation-delay: 1.3s; }
.title-line:nth-child(3) { animation-delay: 1.6s; }

.home-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-muted);
    margin-bottom: var(--space-xl);
    opacity: 0;
    transform: translateY(20px);
    animation: subtitleReveal 0.8s ease 2s forwards;
}

.cta-button {
    background: var(--gradient-primary);
    border: none;
    border-radius: 50px;
    padding: var(--space-md) var(--space-xl);
    color: var(--color-text);
    font-size: 1.1rem;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-bounce);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin: 0 auto;
    opacity: 0;
    transform: scale(0.9);
    animation: ctaReveal 0.8s ease 2.3s forwards;
    position: relative;
    overflow: hidden;
}

.cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.cta-button:hover::before {
    left: 100%;
}

.cta-button:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.cta-arrow {
    width: 20px;
    height: 20px;
    fill: currentColor;
    transition: transform var(--transition-normal);
}

.cta-button:hover .cta-arrow {
    transform: translateX(4px);
}

/* Animations */
@keyframes homeReveal {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes titleLineReveal {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes subtitleReveal {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes ctaReveal {
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .home-content,
    .title-line,
    .home-subtitle,
    .cta-button {
        animation: none;
        opacity: 1;
        transform: none;
    }
}
