const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile nav ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

function closeMenu() {
    navMenu.classList.remove('show-menu');
    navToggle.setAttribute('aria-expanded', 'false');
}

function openMenu() {
    navMenu.classList.add('show-menu');
    navToggle.setAttribute('aria-expanded', 'true');
}

navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('show-menu');
    isOpen ? closeMenu() : openMenu();
});

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('click', function (event) {
    const isInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
    if (!isInsideNav) closeMenu();
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
});

/* ---------- Sticky header shadow ---------- */
const header = document.getElementById('site-header');

function updateHeaderShadow() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
}

updateHeaderShadow();
window.addEventListener('scroll', updateHeaderShadow, { passive: true });

/* ---------- Testimonial carousel ---------- */
const carousel = document.querySelector('.carousel');
const testimonials = document.querySelectorAll('.testimonial-item');
const totalTestimonials = testimonials.length;
const dotsContainer = document.getElementById('carousel-dots');
let currentTestimonial = 0;
let autoplayTimer = null;

testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => showTestimonial(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dots button');

function showTestimonial(index) {
    testimonials[currentTestimonial].classList.remove('active');
    dots[currentTestimonial].classList.remove('active');

    currentTestimonial = (index + totalTestimonials) % totalTestimonials;

    testimonials[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

dots[0].classList.add('active');

document.querySelector('.next').addEventListener('click', () => {
    showTestimonial(currentTestimonial + 1);
    restartAutoplay();
});

document.querySelector('.prev').addEventListener('click', () => {
    showTestimonial(currentTestimonial - 1);
    restartAutoplay();
});

function startAutoplay() {
    if (prefersReducedMotion) return;
    autoplayTimer = setInterval(() => showTestimonial(currentTestimonial + 1), 6000);
}

function stopAutoplay() {
    clearInterval(autoplayTimer);
}

function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
}

carousel.addEventListener('mouseenter', stopAutoplay);
carousel.addEventListener('mouseleave', startAutoplay);
carousel.addEventListener('focusin', stopAutoplay);
carousel.addEventListener('focusout', startAutoplay);

startAutoplay();

/* Swipe support */
let touchStartX = 0;

carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
    stopAutoplay();
}, { passive: true });

carousel.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;

    if (Math.abs(delta) > 40) {
        delta < 0 ? showTestimonial(currentTestimonial + 1) : showTestimonial(currentTestimonial - 1);
    }
    startAutoplay();
}, { passive: true });

/* ---------- Steps scroll progress ---------- */
const steps = document.querySelectorAll('.step');
const progressBar = document.getElementById('progress-bar');
let ticking = false;

function updateSteps() {
    const scrollY = window.pageYOffset;

    steps.forEach((step, index) => {
        const stepTop = step.offsetTop - 600;
        const stepHeight = step.offsetHeight;

        if (scrollY >= stepTop) {
            step.classList.add('active');
        }

        if (scrollY >= stepTop && scrollY < stepTop + stepHeight) {
            const progress = ((index + 1) / steps.length) * 100;
            progressBar.style.width = progress + '%';
        }
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateSteps);
        ticking = true;
    }
}, { passive: true });

updateSteps();

/* ---------- Generic scroll reveal ---------- */
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
} else {
    revealElements.forEach(el => el.classList.add('is-visible'));
}
