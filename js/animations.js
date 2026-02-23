/* ============================================
   GSAP — Scroll & Micro-interaction Animations
   ============================================ */

export function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- Reveal on scroll ---
    document.querySelectorAll('.reveal').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.8,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // --- Hero entrance ---
    const heroTL = gsap.timeline({ delay: 0.5 });
    heroTL
        .from('.hero .section__tag', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero .section__title', { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
        .from('.hero .section__subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
        .from('.hero__cta', { opacity: 0, scale: 0.8, duration: 0.5 }, '-=0.2')
        .from('.hero__scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.1');

    // --- Stagger cards ---
    const staggerSections = ['.products__grid', '.founders__grid', '.social__grid'];
    staggerSections.forEach((selector) => {
        const el = document.querySelector(selector);
        if (!el) return;
        gsap.fromTo(el.children,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.6,
                stagger: 0.15, ease: 'power2.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // --- Navbar active link ---
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.navbar__links a');

    sections.forEach((sec) => {
        ScrollTrigger.create({
            trigger: sec,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveLink(sec.id),
            onEnterBack: () => setActiveLink(sec.id),
        });
    });

    function setActiveLink(id) {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    }

    // --- Parallax hero ---
    gsap.to('.hero .section__title', {
        y: -60,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        },
    });

    // --- Button hover glow ---
    document.querySelectorAll('.hero__cta, .social-link').forEach((btn) => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.25 }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.25 }));
    });
}
