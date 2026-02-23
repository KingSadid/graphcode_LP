/* ============================================
   Utility helpers
   ============================================ */

/** Smooth-scroll to an anchor on the same page */
export function scrollToAnchor(selector) {
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
}

/** Simple debounce */
export function debounce(fn, ms = 100) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}
