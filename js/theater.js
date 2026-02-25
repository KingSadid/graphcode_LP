/* ============================================
   Theater — 2D CSS Movie Theater Logic
   ============================================ */

export function initTheater() {
    const projectorLight = document.querySelector('.theater-2d__projector-light');
    const screenContent = document.querySelector('.theater-2d__content');

    if (!projectorLight || !screenContent) return null;

    // Ambient pulsing light effect from the "projector"
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(projectorLight, { opacity: 0.6, duration: 1.5, ease: 'sine.inOut' })
        .to(projectorLight, { opacity: 0.8, duration: 1.2, ease: 'sine.inOut' })
        .to(projectorLight, { opacity: 0.5, duration: 2, ease: 'sine.inOut' });

    // Floating content in screen
    gsap.to(screenContent, {
        y: 8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    return () => {
        // Cleanup if needed when leaving
        tl.kill();
        gsap.killTweensOf(screenContent);
    };
}
