/* ============================================
   Barba.js — Page Transitions (Always Active)
   ============================================
   Each PAGE has its own transition style (based on
   the destination namespace). This ensures transitions
   fire in EVERY direction, not just forward.
   ============================================ */

export function initTransitions(onLeave, onEnter) {

    const COVER = 0.6;   // overlay cover duration
    const SETTLE = 0.4;   // breathing room for scene init

    /* Helpers — keep DRY */
    const overlay = () => document.querySelector('.transition-overlay');
    const inner = () => overlay().querySelector('.transition-overlay__inner');

    function makeLeave(bg, animateFn) {
        return function (data) {
            const o = overlay(), i = inner();
            i.style.background = bg;
            // Reset any leftover transforms
            gsap.set(i, { clearProps: 'all' });
            i.style.background = bg;

            const tl = gsap.timeline();
            tl.set(o, { display: 'block', opacity: 1 });
            animateFn(tl, i);
            tl.to({}, { duration: 0.15 }); // small breathing room
            tl.add(() => onLeave && onLeave());
            return tl;
        };
    }

    function makeEnter(revealFn) {
        return function (data) {
            const o = overlay(), i = inner();
            onEnter && onEnter(data.next.namespace);

            const tl = gsap.timeline();
            tl.to({}, { duration: SETTLE }); // wait for scene to init behind overlay
            revealFn(tl, i);
            tl.set(o, { display: 'none' });
            tl.set(i, { clearProps: 'all' });
            return tl;
        };
    }

    barba.init({
        preventRunning: true,
        transitions: [

            /* ─── Going TO Inicio: Horizontal Wipe ─── */
            {
                name: 'to-inicio',
                to: { namespace: ['inicio'] },
                leave: makeLeave(
                    'linear-gradient(135deg, var(--pink), #6C63FF)',
                    (tl, i) => tl.fromTo(i, { xPercent: -100 }, { xPercent: 0, duration: COVER, ease: 'power4.inOut' })
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { xPercent: 100, duration: COVER, ease: 'power4.inOut' })
                ),
            },

            /* ─── Going TO Productos: Scale-Fade Zoom ─── */
            {
                name: 'to-productos',
                to: { namespace: ['productos'] },
                leave: makeLeave(
                    'radial-gradient(circle, var(--pink), var(--blue))',
                    (tl, i) => {
                        tl.set(i, { borderRadius: '50%' });
                        tl.fromTo(i, { scale: 0, opacity: 1 }, { scale: 4, opacity: 1, duration: COVER, ease: 'power3.inOut' });
                    }
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { opacity: 0, duration: 0.5, ease: 'power2.out' })
                ),
            },

            /* ─── Going TO Fundadores: Vertical Curtain ─── */
            {
                name: 'to-fundadores',
                to: { namespace: ['fundadores'] },
                leave: makeLeave(
                    'linear-gradient(180deg, var(--blue), var(--pink), var(--black))',
                    (tl, i) => tl.fromTo(i, { yPercent: -100 }, { yPercent: 0, duration: COVER, ease: 'power4.inOut' })
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { yPercent: 100, duration: COVER, ease: 'power4.inOut' })
                ),
            },

            /* ─── Going TO Redes: Diagonal Slide ─── */
            {
                name: 'to-redes',
                to: { namespace: ['redes'] },
                leave: makeLeave(
                    'linear-gradient(45deg, var(--black), var(--pink), #6C63FF)',
                    (tl, i) => tl.fromTo(i, { xPercent: -100, yPercent: -100 }, { xPercent: 0, yPercent: 0, duration: COVER, ease: 'power4.inOut' })
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { xPercent: 100, yPercent: 100, duration: COVER, ease: 'power4.inOut' })
                ),
            },

            /* ─── Going TO Contacto: Bottom-up Wipe ─── */
            {
                name: 'to-contacto',
                to: { namespace: ['contacto'] },
                leave: makeLeave(
                    'linear-gradient(0deg, var(--pink), #6C63FF, var(--black))',
                    (tl, i) => tl.fromTo(i, { yPercent: 100 }, { yPercent: 0, duration: COVER, ease: 'power4.inOut' })
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { yPercent: -100, duration: COVER, ease: 'power4.inOut' })
                ),
            },

            /* ─── Going TO Teatro: Crossfade ─── */
            {
                name: 'to-teatro',
                to: { namespace: ['teatro'] },
                leave: makeLeave(
                    'var(--black)',
                    (tl, i) => tl.fromTo(i, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' })
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
                ),
            },

            /* ─── Fallback (should rarely fire) ─── */
            {
                name: 'fallback-crossfade',
                leave: makeLeave(
                    'var(--black)',
                    (tl, i) => tl.fromTo(i, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' })
                ),
                enter: makeEnter(
                    (tl, i) => tl.to(i, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
                ),
            }
        ]
    });
}
