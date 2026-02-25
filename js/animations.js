/* ============================================
   GSAP + Popmotion — Animations (per-page)
   ============================================ */

export function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Run page-specific animations
    animatePageContent();
    setupMagneticButtons();
    setupCardTilts();
}

/** Re-run after each Barba page transition */
export function refreshAnimations() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    animatePageContent();
    setupMagneticButtons();
    setupCardTilts();
}

/* --------------------------------------------------
   Page content entrance animations (Popmotion + GSAP)
   -------------------------------------------------- */
function animatePageContent() {
    // Hero-specific entrance
    const heroTitle = document.querySelector('.hero .section__title');
    if (heroTitle) {
        animateHeroEntrance();
    }

    // Animate text elements with Popmotion spring
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

    // Stagger cards with spring physics
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
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
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

    // Navbar active link
    setActiveNavLink();
}

/* --------------------------------------------------
   Popmotion-based Entrance Animations
   -------------------------------------------------- */
function animateFadeUp(el, delay) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';

    setTimeout(() => {
        if (typeof popmotion !== 'undefined' && popmotion.animate) {
            popmotion.animate({
                from: 0,
                to: 1,
                duration: 600,
                ease: popmotion.easeOut,
                onUpdate: (v) => {
                    el.style.opacity = v;
                    el.style.transform = `translateY(${40 * (1 - v)}px)`;
                }
            });
        } else {
            // Fallback GSAP
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    }, delay * 1000);
}

function animateGlitchIn(el, delay) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';

    setTimeout(() => {
        // Glitch flicker effect
        const glitchTL = gsap.timeline();
        glitchTL
            .set(el, { opacity: 1 })
            .to(el, { x: -5, opacity: 0.7, duration: 0.05 })
            .to(el, { x: 5, opacity: 0.5, duration: 0.05 })
            .to(el, { x: -3, opacity: 0.8, duration: 0.05 })
            .to(el, { x: 3, opacity: 0.6, duration: 0.05 })
            .to(el, { x: -1, opacity: 0.9, duration: 0.05 })
            .to(el, { x: 0, opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    }, delay * 1000);
}

function animateScaleIn(el, delay) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.6)';

    setTimeout(() => {
        if (typeof popmotion !== 'undefined' && popmotion.spring) {
            popmotion.spring({
                from: 0,
                to: 1,
                stiffness: 200,
                damping: 15,
                onUpdate: (v) => {
                    el.style.opacity = Math.min(v, 1);
                    el.style.transform = `scale(${0.6 + 0.4 * v})`;
                }
            });
        } else {
            gsap.to(el, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
        }
    }, delay * 1000);
}

function animateHeroEntrance() {
    // Floating code snippets
    gsap.fromTo('.hero__floating-code',
        { opacity: 0, y: 30 },
        { opacity: 0.15, y: 0, duration: 1.5, stagger: 0.3, delay: 1.2, ease: 'power2.out' }
    );

    // Pulsing rings
    gsap.fromTo('.hero__ring',
        { opacity: 0, scale: 0.5 },
        { opacity: 0.3, scale: 1, duration: 1.5, stagger: 0.2, delay: 0.8, ease: 'power2.out' }
    );

    // Scroll hint
    gsap.fromTo('.hero__scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.5 }
    );
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
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: 'power2.out',
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
