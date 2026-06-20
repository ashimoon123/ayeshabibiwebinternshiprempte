/* ======================================
   MUHAMMAD MUEEN - PORTFOLIO SCRIPTS
====================================== */

/* ---- 1. NAVBAR: Scroll + Active Link + Mobile Toggle ---- */
(function () {
    const navbar    = document.getElementById('navbar');
    const navLinks  = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    const sections  = document.querySelectorAll('section[id]');

    // Scrolled class
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        highlightActiveLink();
        toggleBackToTop();
    }, { passive: true });

    // Active link on scroll
    function highlightActiveLink() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 90;
            if (window.scrollY >= top) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navLinksEl.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksEl.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinksEl.classList.remove('open');
            navToggle.classList.remove('open');
        }
    });
})();


/* ---- 2. TYPING ANIMATION ---- */
(function () {
    const el     = document.getElementById('typedText');
    if (!el) return;

    const phrases = [
        'Frontend Developer',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Full Stack Learner',
        'Open Source Contributor'
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let typingSpeed = 100;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 600);
})();


/* ---- 3. SCROLL REVEAL ---- */
(function () {
    // Add reveal class to animatable elements
    const targets = document.querySelectorAll(
        '.about-grid, .skills-category, .project-card, .contact-grid, ' +
        '.section-header, .about-card, .tech-badge, .contact-info-item'
    );

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        // Stagger children of grids
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
})();


/* ---- 4. SKILL BARS ANIMATION ---- */
(function () {
    const skillBars = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar   = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => observer.observe(bar));
})();


/* ---- 5. CONTACT FORM VALIDATION ---- */
(function () {
    const form       = document.getElementById('contactForm');
    if (!form) return;

    const nameInput  = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const msgInput   = document.getElementById('message');
    const submitBtn  = document.getElementById('submitBtn');
    const successEl  = document.getElementById('formSuccess');

    function showError(inputId, msg) {
        const errEl = document.getElementById(inputId + 'Error');
        if (errEl) errEl.textContent = msg;
    }

    function clearError(inputId) {
        const errEl = document.getElementById(inputId + 'Error');
        if (errEl) errEl.textContent = '';
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Live validation
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) clearError('name');
    });
    emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value.trim())) clearError('email');
    });
    msgInput.addEventListener('input', () => {
        if (msgInput.value.trim().length >= 10) clearError('message');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Validate name
        if (nameInput.value.trim().length < 2) {
            showError('name', 'Please enter your full name (at least 2 characters).');
            valid = false;
        } else {
            clearError('name');
        }

        // Validate email
        if (!validateEmail(emailInput.value.trim())) {
            showError('email', 'Please enter a valid email address.');
            valid = false;
        } else {
            clearError('email');
        }

        // Validate message
        if (msgInput.value.trim().length < 10) {
            showError('message', 'Message must be at least 10 characters.');
            valid = false;
        } else {
            clearError('message');
        }

        if (!valid) return;

        // Simulate sending
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            form.reset();
            successEl.classList.add('show');
            setTimeout(() => successEl.classList.remove('show'), 5000);
        }, 1800);
    });
})();


/* ---- 6. BACK TO TOP BUTTON ---- */
function toggleBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.classList.toggle('visible', window.scrollY > 400);
}

document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---- 7. HERO IMAGE: Fallback if no profile.jpg ---- */
(function () {
    const imgs = document.querySelectorAll('.hero-image, .about-image');
    imgs.forEach(img => {
        img.addEventListener('error', function () {
            // Replace with a gradient placeholder SVG
            const initials = 'MM';
            const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236c63ff'/%3E%3Cstop offset='100%25' stop-color='%23ff6584'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23g)'/%3E%3Ctext x='50%25' y='54%25' font-family='Inter,sans-serif' font-size='90' font-weight='700' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${initials}%3C/text%3E%3C/svg%3E`;
            this.src = svg;
            this.style.objectPosition = 'center';
        });
    });
})();


/* ---- 8. SMOOTH SCROLL for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
