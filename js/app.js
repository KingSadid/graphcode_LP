/* ============================================
   App — Main entry point (Multi-page w/ Barba)
   ============================================ */

import { initThreeScene } from './three-scene.js';
import { initAnimations, refreshAnimations } from './animations.js';
import { initTransitions } from './transitions.js';
import { initContactForm } from './contact-form.js';
import { initTheater } from './theater.js';
import { scrollToAnchor } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Detect current page namespace ---
    const container = document.querySelector('[data-barba-namespace]');
    const namespace = container ? container.dataset.barbaNamespace : 'inicio';

    // --- Smooth scroll (Lenis) ---
    let lenis = null;
    if (namespace !== 'teatro') {
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    // --- Three.js background (not on theater page) ---
    let cleanupScene = null;
    if (namespace !== 'teatro') {
        cleanupScene = initThreeScene(namespace);
    }

    // --- GSAP + Popmotion animations ---
    initAnimations();

    // --- Page-specific init ---
    if (namespace === 'contacto') {
        initContactForm();
    }

    let cleanupTheater = null;
    if (namespace === 'teatro') {
        cleanupTheater = initTheater();
    }

    // Recalculate scroll positions
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

    // --- Barba.js transitions ---
    initTransitions(
        // onLeave: cleanup old scene
        () => {
            if (cleanupScene) {
                cleanupScene();
                cleanupScene = null;
            }
            if (cleanupTheater) {
                cleanupTheater();
                cleanupTheater = null;
            }
        },
        // onEnter: init new scene & animations
        (newNamespace) => {
            window.scrollTo(0, 0);

            if (newNamespace !== 'teatro') {
                cleanupScene = initThreeScene(newNamespace);
            }

            // Re-init animations for new page content
            refreshAnimations();

            // Page-specific inits
            if (newNamespace === 'contacto') {
                initContactForm();
            }
            if (newNamespace === 'teatro') {
                cleanupTheater = initTheater();
            }

            // Update active nav
            updateNavActive(newNamespace);

            // Re-setup mobile nav events for new content
            setupMobileNav();
        }
    );
});

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

/* --------------------------------------------------
   Update active nav link
   -------------------------------------------------- */
function updateNavActive(namespace) {
    const pageMap = {
        'inicio': 'index.html',
        'productos': 'productos.html',
        'fundadores': 'fundadores.html',
        'redes': 'redes.html',
        'contacto': 'contacto.html',
        'teatro': 'productos.html', // theater is under products
    };

    const activeHref = pageMap[namespace] || 'index.html';

    document.querySelectorAll('.navbar__links a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === activeHref);
    });
}
