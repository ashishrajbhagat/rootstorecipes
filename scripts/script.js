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

    /** Search Form - index.html */    
    const searchCategoryContainer = document.querySelector('.search-category-container');
    const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
    const searchOptions = document.getElementById("searchOptions");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resetButton = document.getElementById("resetButton");

    searchTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'category') {
                searchCategoryContainer.style.display = 'flex';
                searchInput.style.display = 'none';
            } else if (this.value === 'text') {
                searchCategoryContainer.style.display = 'none';
                searchInput.style.display = 'block';
            }
        });
    });

    function toggleSearchButton() {
        const isInputFilled = searchInput.value.trim() !== "";
        const isOptionSelected = searchOptions.value !== "";
        searchButton.disabled = !(isInputFilled || isOptionSelected);
        if (!searchButton.disabled) {
            searchButton.style.cursor = 'pointer';
        }
    }

    searchInput.addEventListener("input", toggleSearchButton);

    document.getElementById('searchCategory').addEventListener('change', function() {

        searchOptions.innerHTML = '<option value="" disabled selected>Select an Option</option>';
        searchInput.value = "";
        searchButton.disabled = true;

        const category = this.value;

        let options = [];
        if (category === 'difficulty') {
            options = ['Easy', 'Intermediate', 'Advanced'];
        } else if (category === 'time') {
            options = ['Under 15 minutes', '15-30 minutes', '30-60 minutes', 'Over 1 hour'];
        } else if (category === 'diet') {
            options = ['Vegan', 'Vegetarian', 'Non-Vegetarian'];
        } else if (category === 'occasion') {
            options = ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Party'];
        } else if (category === 'season') {
            options = ['Spring', 'Summer', 'Autumn', 'Winter'];
        }

        options.forEach(function(option) {
            const newOption = document.createElement('option');
            newOption.value = option.toLowerCase().replace(/\s+/g, '_');
            newOption.textContent = option;
            searchOptions.appendChild(newOption);
            searchOptions.disabled = false;
            searchOptions.style.cursor = 'pointer';
        });
    });

    searchOptions.addEventListener("change", toggleSearchButton);

    resetButton.addEventListener("click", function() {
        searchCategory.selectedIndex = 0;
        searchOptions.innerHTML = '<option value="" disabled selected>Select an Option</option>';
        searchOptions.disabled = true;
        searchInput.value = "";
        searchButton.disabled = true;
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
    console.log(carousel);
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

