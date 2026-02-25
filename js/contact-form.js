/* ============================================
   Contact Form — Submit with delay + checkmark
   ============================================ */

export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('contact-submit');
    const btnText = submitBtn.querySelector('.contact-form__submit-text');
    const spinner = submitBtn.querySelector('.contact-form__spinner');
    const check = submitBtn.querySelector('.contact-form__check');
    const status = form.querySelector('.contact-form__status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const name = form.querySelector('#contact-name').value.trim();
        const email = form.querySelector('#contact-email').value.trim();
        const message = form.querySelector('#contact-message').value.trim();

        if (!name || !email || !message) {
            status.textContent = 'Por favor completa los campos requeridos.';
            status.classList.add('error');
            shakeButton(submitBtn);
            return;
        }

        if (!isValidEmail(email)) {
            status.textContent = 'Por favor ingresa un correo electrónico válido.';
            status.classList.add('error');
            shakeButton(submitBtn);
            return;
        }

        // Clear previous status
        status.textContent = '';
        status.classList.remove('error', 'success');

        // Disable button & show spinner
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        btnText.style.opacity = '0';
        spinner.classList.add('visible');

        // Simulate sending with delay (3 seconds)
        setTimeout(() => {
            spinner.classList.remove('visible');
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            // Show animated checkmark
            check.classList.add('visible');

            // Animate the check circle and path
            gsap.timeline()
                .fromTo('.check-circle',
                    { strokeDashoffset: 166 },
                    { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }
                )
                .fromTo('.check-path',
                    { strokeDashoffset: 48 },
                    { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }
                    , '-=0.2');

            status.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
            status.classList.add('success');

            // Reset form after a moment
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.classList.remove('success');
                check.classList.remove('visible');
                btnText.style.opacity = '1';
            }, 4000);

        }, 3000);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeButton(btn) {
    gsap.timeline()
        .to(btn, { x: -8, duration: 0.06 })
        .to(btn, { x: 8, duration: 0.06 })
        .to(btn, { x: -6, duration: 0.06 })
        .to(btn, { x: 6, duration: 0.06 })
        .to(btn, { x: 0, duration: 0.1 });
}
