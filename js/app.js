/* ============================================
   App — Main entry point (No Barba, standalone pages)
   ============================================ */

import { initThreeScene } from './three-scene.js';
import { initAnimations } from './animations.js';
import { initContactForm } from './contact-form.js';
import { initTheater } from './theater.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Detect current page ---
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const namespace = getNamespace(path);

    // --- Smooth scroll (Lenis) ---
    if (namespace !== 'teatro') {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    // --- Three.js background (not on theater page) ---
    if (namespace !== 'teatro') {
        initThreeScene(namespace);
    }

    // --- GSAP animations + custom cursor + mouse effects ---
    initAnimations();

    // --- Page-specific init ---
    if (namespace === 'contacto') {
        initContactForm();
    }
    if (namespace === 'teatro') {
        initTheater();
    }

    // --- ScrollTrigger refresh ---
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }

    // --- Loader ---
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 1200);
    }

    // --- Mobile nav toggle ---
    setupMobileNav();
});

/* --------------------------------------------------
   Page namespace detection
   -------------------------------------------------- */
function getNamespace(path) {
    if (path.includes('productos')) return 'productos';
    if (path.includes('fundadores')) return 'fundadores';
    if (path.includes('redes')) return 'redes';
    if (path.includes('contacto')) return 'contacto';
    if (path.includes('teatro')) return 'teatro';
    return 'inicio';
}

/* --------------------------------------------------
   Mobile Nav Setup
   -------------------------------------------------- */
function setupMobileNav() {
    const toggle = document.querySelector('.navbar__toggle');
    const navLinks = document.querySelector('.navbar__links');
    if (!toggle || !navLinks) return;

    // Remove old listeners by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    newToggle.addEventListener('click', () => {
        newToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            newToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}
