/* ============================================
   Barba.js — Page Transitions (Smoother, Anti-Lag)
   ============================================ */

export function initTransitions(onLeave, onEnter) {

    // Add more delay between leaving and entering to allow 
    // the page and heavy Three.js scripts to reinitialize without stuttering visually.
    const COVER_DURATION = 0.8;
    const DELAY_BEFORE_ENTER = 0.5;

    barba.init({
        preventRunning: true,
        transitions: [
            /* --- Inicio → Productos: Horizontal Wipe --- */
            {
                name: 'wipe-horizontal',
                from: { namespace: ['inicio'] },
                to: { namespace: ['productos'] },
                leave(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    inner.style.background = 'linear-gradient(135deg, var(--pink), #6C63FF)';
                    return gsap.timeline()
                        .set(overlay, { display: 'block', opacity: 1 })
                        .fromTo(inner,
                            { xPercent: -100 },
                            { xPercent: 0, duration: COVER_DURATION, ease: 'power4.inOut' }
                        )
                        .to({}, { duration: 0.2 }) // Extra wait to allow heavy teardown
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to({}, { duration: DELAY_BEFORE_ENTER }) // Extra wait before uncovering to let scene init 
                        .to(inner,
                            { xPercent: 100, duration: COVER_DURATION, ease: 'power4.inOut' }
                        )
                        .set(overlay, { display: 'none' });
                }
            },

            /* --- Productos → Fundadores: Scale-Fade Zoom --- */
            {
                name: 'scale-fade',
                from: { namespace: ['productos'] },
                to: { namespace: ['fundadores'] },
                leave(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    inner.style.background = 'radial-gradient(circle, var(--pink), var(--blue))';
                    return gsap.timeline()
                        .set(overlay, { display: 'block' })
                        .fromTo(inner,
                            { scale: 0, opacity: 1, borderRadius: '50%' },
                            { scale: 4, opacity: 1, duration: COVER_DURATION, ease: 'power3.inOut' }
                        )
                        .to({}, { duration: 0.2 })
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to({}, { duration: DELAY_BEFORE_ENTER })
                        .to(inner,
                            { opacity: 0, duration: 0.6, ease: 'power2.out' }
                        )
                        .set(overlay, { display: 'none' })
                        .set(inner, { scale: 1, borderRadius: '0%', opacity: 1 });
                }
            },

            /* --- Fundadores → Redes: Vertical Curtain --- */
            {
                name: 'curtain-vertical',
                from: { namespace: ['fundadores'] },
                to: { namespace: ['redes'] },
                leave(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    inner.style.background = 'linear-gradient(180deg, var(--blue), var(--pink), var(--black))';
                    return gsap.timeline()
                        .set(overlay, { display: 'block', opacity: 1 })
                        .fromTo(inner,
                            { yPercent: -100 },
                            { yPercent: 0, duration: COVER_DURATION, ease: 'power4.inOut' }
                        )
                        .to({}, { duration: 0.2 })
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to({}, { duration: DELAY_BEFORE_ENTER })
                        .to(inner,
                            { yPercent: 100, duration: COVER_DURATION, ease: 'power4.inOut' }
                        )
                        .set(overlay, { display: 'none' });
                }
            },

            /* --- Redes → Contacto: Diagonal Slide --- */
            {
                name: 'diagonal-slide',
                from: { namespace: ['redes'] },
                to: { namespace: ['contacto'] },
                leave(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    inner.style.background = 'linear-gradient(45deg, var(--black), var(--pink), #6C63FF)';
                    return gsap.timeline()
                        .set(overlay, { display: 'block', opacity: 1 })
                        .fromTo(inner,
                            { xPercent: -100, yPercent: -100 },
                            { xPercent: 0, yPercent: 0, duration: COVER_DURATION, ease: 'power4.inOut' }
                        )
                        .to({}, { duration: 0.2 })
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to({}, { duration: DELAY_BEFORE_ENTER })
                        .to(inner,
                            { xPercent: 100, yPercent: 100, duration: COVER_DURATION, ease: 'power4.inOut' }
                        )
                        .set(overlay, { display: 'none' });
                }
            },

            /* --- Default / Fallback: Smooth Crossfade --- */
            {
                name: 'crossfade',
                leave(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    inner.style.background = 'var(--black)';
                    return gsap.timeline()
                        .set(overlay, { display: 'block' })
                        .fromTo(inner,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
                        )
                        .to({}, { duration: 0.2 })
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to({}, { duration: DELAY_BEFORE_ENTER })
                        .to(inner,
                            { opacity: 0, duration: 0.5, ease: 'power2.inOut' }
                        )
                        .set(overlay, { display: 'none' });
                }
            }
        ]
    });
}
