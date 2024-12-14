// Query DOM elements
const form = document.querySelector('.search-container');
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const searchCategoryContainer = document.querySelector('.search-category-container');
const searchCategory = document.getElementById('searchCategory');
const searchOptions = document.getElementById("searchOptions");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");
const resultsGrid = document.getElementById('resultsGrid');

// Function to toggle search type (radio buttons and associated UI)
function toggleSearchType(type) {
    searchTypeRadios.forEach(radio => {
        if (radio.value === type) {
            radio.checked = true;
            if (type === 'text') {
                searchInput.style.display = 'block';
                searchCategory.parentElement.style.display = 'none';
            } else if (type === 'category') {
                searchInput.style.display = 'none';
                searchCategory.parentElement.style.display = 'flex';
            }
        }
    });
}

// Add event listeners to manually toggle search type when a radio button is clicked
searchTypeRadios.forEach(radio => {
    radio.addEventListener('change', function () {
        toggleSearchType(this.value);
    });
});

// Enable or disable the search button
function toggleSearchButton() {
    const isInputFilled = searchInput.value.trim() !== "";
    const isOptionSelected = searchOptions.value !== "";
    searchButton.disabled = !(isInputFilled || isOptionSelected);
    if (!searchButton.disabled) {
        searchButton.style.cursor = 'pointer';
    }
}

searchOptions.addEventListener("change", toggleSearchButton);
searchInput.addEventListener("input", toggleSearchButton);

// Populate options based on selected category
searchCategory.addEventListener('change', function () {
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
    } else if (category === 'meal_type') {
        options = ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Party'];
    } else if (category === 'main_ingredient') {
        options = ['Paneer', 'Rice', 'Lentils', 'Vegetables', 'Fruits', 'Nuts'];
    } else if (category === 'spice_level') {
        options = ['Mild', 'Medium', 'Spicy'];
    } else if (category === 'cooking_method') {
        options = ['Grilled', 'Roasted', 'Fried', 'Boiled', 'Sautéed', 'Baked'];
    } else if (category === 'health_focus') {
        options = ['Protein-rich', 'Low-calorie', 'High-fiber', 'Comfort food', 'Healthy'];
    }

    options.forEach(function (option) {
        const newOption = document.createElement('option');
        newOption.value = option.toLowerCase().replace(/\s+/g, '_');
        newOption.textContent = option;
        searchOptions.appendChild(newOption);
        searchOptions.disabled = false;
        searchOptions.style.cursor = 'pointer';
    });
});

// Reset the form
resetButton.addEventListener("click", function () {
    searchCategory.selectedIndex = 0;
    searchOptions.innerHTML = '<option value="" disabled selected>Select an Option</option>';
    searchOptions.disabled = true;
    searchInput.value = "";
    searchButton.disabled = true;
    searchButton.style.cursor = 'not-allowed';
});

// Handle form submission and redirect with query parameters
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const category = searchCategory.value;
    const option = searchOptions.value;
    const text = searchInput.value;

    // Clear existing data from sessionStorage
    sessionStorage.removeItem('searchData');
    
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    if (category && option) {
        sessionStorage.setItem('searchData', JSON.stringify({
            searchType,
            category,
            option
        }));
    }

    if (text.trim() !== '') {
        sessionStorage.setItem('searchData', JSON.stringify({
            searchType,
            text
        }));
    }        

    // Redirect to search.html with query parameters
    window.location.href = 'search.html';
});