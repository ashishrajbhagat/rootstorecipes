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
});

/** Carousel */
function scrollCarousel(carouselId, direction, scrollAmount) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        carousel.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    }
}

// Add event listeners to all carousel buttons
document.querySelectorAll('.carousel-btn').forEach(button => {
    button.addEventListener('click', () => {
        const carouselId = button.getAttribute('data-carousel-id');
        const direction = button.classList.contains('left') ? 'left' : 'right';
        scrollCarousel(carouselId, direction, 340);
    });
});
