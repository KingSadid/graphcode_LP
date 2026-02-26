/* ============================================
   GSAP — Animations + Custom Cursor + Mouse Parallax
   ============================================ */

export function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    animatePageContent();

    // Only run cursor-reactive effects on desktop (pointer: fine)
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    if (isDesktop) {
        setupMagneticButtons();
        setupCardTilts();
        setupCustomCursor();
        setupMouseParallax();
    }
}

/* --------------------------------------------------
   Page content entrance animations
   -------------------------------------------------- */
function animatePageContent() {
    // Hero-specific entrance
    if (document.querySelector('.hero .section__title')) {
        animateHeroEntrance();
    }

    // Animate text elements
    document.querySelectorAll('.anim-text').forEach((el, i) => {
        const delay = 0.3 + i * 0.12;
        const animType = el.dataset.anim || 'fade-up';

        switch (animType) {
            case 'glitch-in':
                animateGlitchIn(el, delay);
                break;
            case 'scale-in':
                animateScaleIn(el, delay);
                break;
            case 'fade-up':
            default:
                animateFadeUp(el, delay);
                break;
        }
    });

    // Stagger cards with scroll trigger
    const staggerContainers = ['.products__grid', '.founders__grid', '.social__grid'];
    staggerContainers.forEach((selector) => {
        const el = document.querySelector(selector);
        if (!el) return;
        gsap.fromTo(el.children,
            { opacity: 0, y: 60, scale: 0.9 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.7,
                stagger: 0.15, ease: 'back.out(1.7)',
                immediateRender: false,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // Parallax for hero title
    if (document.querySelector('.hero')) {
        gsap.to('.hero .section__title', {
            y: -80,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            },
        });
    }

    // Active nav
    setActiveNavLink();
}

/* --------------------------------------------------
   Entrance Animations
   -------------------------------------------------- */
function animateFadeUp(el, delay) {
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay, ease: 'power3.out' });
}

function animateGlitchIn(el, delay) {
    gsap.set(el, { opacity: 0, y: 30 });
    const tl = gsap.timeline({ delay });
    tl.set(el, { opacity: 1 })
        .to(el, { x: -5, opacity: 0.7, duration: 0.05 })
        .to(el, { x: 5, opacity: 0.5, duration: 0.05 })
        .to(el, { x: -3, opacity: 0.8, duration: 0.05 })
        .to(el, { x: 3, opacity: 0.6, duration: 0.05 })
        .to(el, { x: -1, opacity: 0.9, duration: 0.05 })
        .to(el, { x: 0, opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
}

function animateScaleIn(el, delay) {
    gsap.set(el, { opacity: 0, scale: 0.6 });
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.6, delay, ease: 'back.out(1.7)' });
}

function animateHeroEntrance() {
    gsap.fromTo('.hero__floating-code',
        { opacity: 0, y: 30 },
        { opacity: 0.15, y: 0, duration: 1.5, stagger: 0.3, delay: 1.2, ease: 'power2.out' }
    );
    gsap.fromTo('.hero__ring',
        { opacity: 0, scale: 0.5 },
        { opacity: 0.3, scale: 1, duration: 1.5, stagger: 0.2, delay: 0.8, ease: 'power2.out' }
    );
    gsap.fromTo('.hero__scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.5 }
    );
}

/* --------------------------------------------------
   Custom Cursor (dot + follower ring)
   -------------------------------------------------- */
function setupCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    // Only show custom cursor on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.classList.add('has-custom-cursor');
    } else {
        return; // don't set up on touch devices
    }

    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        // Dot follows instantly
        gsap.set(cursor, { x: mx, y: my });
    });

    // Follower ring follows with delay
    gsap.ticker.add(() => {
        gsap.to(follower, { x: mx, y: my, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    });

    // Scale up cursor & follower on hover over interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .magnetic-btn, .glass-card, input, textarea, .navbar__toggle');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--hover');
            follower.classList.add('cursor-follower--hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--hover');
            follower.classList.remove('cursor-follower--hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to([cursor, follower], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to([cursor, follower], { opacity: 1, duration: 0.2 });
    });
}

/* --------------------------------------------------
   Mouse Parallax — page content reacts to cursor
   -------------------------------------------------- */
function setupMouseParallax() {
    // Skip entirely on touch/mobile devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const parallaxTargets = document.querySelectorAll(
        '.section__title, .section__subtitle, .hero__floating-code, .hero__ring, .glass-card'
    );
    if (!parallaxTargets.length) return;

    // Categorize by depth
    const deepTargets = document.querySelectorAll('.hero__floating-code, .hero__ring');
    const mediumTargets = document.querySelectorAll('.section__title, .section__subtitle');
    const shallowTargets = document.querySelectorAll('.glass-card');

    let cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
        cx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
        cy = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    gsap.ticker.add(() => {
        // Deep parallax (decorative elements move more)
        deepTargets.forEach(el => {
            gsap.to(el, {
                x: cx * 20,
                y: cy * 15,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        // Medium parallax (titles shift subtly)
        mediumTargets.forEach(el => {
            gsap.to(el, {
                x: cx * 8,
                y: cy * 5,
                duration: 1,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        // Shallow parallax (cards barely move)
        shallowTargets.forEach(el => {
            gsap.to(el, {
                x: cx * 4,
                y: cy * 3,
                duration: 1.2,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });
    });
}

/* --------------------------------------------------
   Magnetic Buttons (cursor-following hover)
   -------------------------------------------------- */
function setupMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });

        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.06, duration: 0.25 });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.25 });
        });
    });
}

/* --------------------------------------------------
   Card Tilt Effect (3D perspective on hover)
   -------------------------------------------------- */
function setupCardTilts() {
    document.querySelectorAll('.glass-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
                rotateY: x * 10,
                rotateX: -y * 10,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 500,
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0, rotateX: 0,
                duration: 0.6, ease: 'power2.out',
            });
        });
    });
}

/* --------------------------------------------------
   Active navbar link highlight
   -------------------------------------------------- */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__links a').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage);
    });
}
