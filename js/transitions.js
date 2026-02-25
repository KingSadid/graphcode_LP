/* ============================================
   Barba.js — Page Transitions (each unique)
   ============================================ */

export function initTransitions(onLeave, onEnter) {

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
                            { xPercent: 0, duration: 0.6, ease: 'power3.inOut' }
                        )
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to(inner,
                            { xPercent: 100, duration: 0.6, ease: 'power3.inOut', delay: 0.15 }
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
                            { scale: 3, opacity: 1, duration: 0.7, ease: 'power2.in' }
                        )
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to(inner,
                            { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
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
                    inner.style.background = 'linear-gradient(180deg, var(--blue), var(--pink), var(--blue))';
                    return gsap.timeline()
                        .set(overlay, { display: 'block', opacity: 1 })
                        .fromTo(inner,
                            { yPercent: -100 },
                            { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }
                        )
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to(inner,
                            { yPercent: 100, duration: 0.6, ease: 'power3.inOut', delay: 0.15 }
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
                            { xPercent: 0, yPercent: 0, duration: 0.7, ease: 'power3.inOut' }
                        )
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to(inner,
                            { xPercent: 100, yPercent: 100, duration: 0.7, ease: 'power3.inOut', delay: 0.15 }
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
                            { opacity: 1, duration: 0.4, ease: 'power2.inOut' }
                        )
                        .add(() => onLeave && onLeave());
                },
                enter(data) {
                    const overlay = document.querySelector('.transition-overlay');
                    const inner = overlay.querySelector('.transition-overlay__inner');
                    onEnter && onEnter(data.next.namespace);
                    return gsap.timeline()
                        .to(inner,
                            { opacity: 0, duration: 0.4, ease: 'power2.inOut', delay: 0.15 }
                        )
                        .set(overlay, { display: 'none' });
                }
            }
        ]
    });
}
