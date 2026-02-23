/* ============================================
   App — Main entry point
   ============================================ */

import { initThreeScene } from './three-scene.js';
import { initAnimations } from './animations.js';
import { scrollToAnchor } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth scroll (Lenis) ---
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // --- Three.js background ---
    initThreeScene();

    // --- GSAP animations ---
    initAnimations();

    // --- Loader ---
    const loader = document.querySelector('.loader');
    setTimeout(() => loader.classList.add('hidden'), 1200);

    // --- Mobile nav toggle ---
    const toggle = document.querySelector('.navbar__toggle');
    const navLinks = document.querySelector('.navbar__links');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // --- Anchor smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToAnchor(a.getAttribute('href'));
        });
    });
});
