document.querySelector('.nav-toggle').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'flex';
    }
});

let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');
const totalTestimonials = testimonials.length;

document.querySelector('.next').addEventListener('click', function() {
    // Hide current testimonial
    testimonials[currentTestimonial].classList.remove('active');

    // Move to the next testimonial
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;

    // Show new testimonial
    testimonials[currentTestimonial].classList.add('active');
});

document.querySelector('.prev').addEventListener('click', function() {
    // Hide current testimonial
    testimonials[currentTestimonial].classList.remove('active');

    // Move to the previous testimonial
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;

    // Show new testimonial
    testimonials[currentTestimonial].classList.add('active');
});
