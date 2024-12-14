document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");

    /** Header */
    hamburger.addEventListener("click", function() {
        navbar.classList.toggle("active");
    });
    
    const navItems = document.querySelectorAll('.nav-items li a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });

    /** Carousels */
    setupCarousel('#popularCarousel'); /** Popular Recipes */

    setupCarousel('#healthCarousel'); /** Healthy Recipe */

    setupCarousel('#stateRecipeCarousel'); /** Statewise Recipe */

    setupCarousel('#blogCarousel'); /** Blog/Tips & tricks */

    setupCarousel('#testimonialCarousel'); /** Testimonial */
});

/** Carousel */
function setupCarousel(carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoSlideInterval;
    
    const slideSpeed = 3000;

    const cardWidth = carousel.querySelector('.carousel-card').offsetWidth + 20;

    function autoSlide() {
        autoSlideInterval = setInterval(() => {
            if (carousel.scrollLeft + cardWidth >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft = 0;
            } else {
                carousel.scrollLeft += cardWidth;
            }
        }, slideSpeed);
    }

    autoSlide();

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        stopAutoSlide();
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        autoSlide();
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        autoSlide();
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', autoSlide);
}

