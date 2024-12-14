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

// Placeholder for recipes data
let recipes = [];

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

    // Filter recipes based on search criteria
    let filteredRecipes = [];
    if (recipes.length > 0) {
        if (text) {
            filteredRecipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(text.toLowerCase()) ||
                recipe.description.toLowerCase().includes(text.toLowerCase())
            );
        } else if (category && option) {
            filteredRecipes = recipes.filter(recipe =>
                recipe[category] && recipe[category].toLowerCase() === option
            );
        }
    }

    // Populate results
    resultsGrid.innerHTML = ''; // Clear existing results
    if (filteredRecipes.length > 0) {
        document.getElementById('result-title').style.display = 'block';
        filteredRecipes.forEach(recipe => {
            const resultCard = `
                <div class="result-card">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description}</p>
                </div>
            `;
            resultsGrid.insertAdjacentHTML('beforeend', resultCard);
        });
    } else {
        document.getElementById('result-title').style.display = 'block';
        resultsGrid.innerHTML = '<p>No recipes found for your search criteria.</p>';
    }
});

// Populate form fields based on query parameters
function populateFormFromQueryParams() {
    const searchData = JSON.parse(sessionStorage.getItem('searchData'));
    sessionStorage.removeItem('searchData'); // Clear sessionStorage after data retrieval

    if (searchData) {
        // Populate form fields with the stored data
        document.querySelector(`input[name="searchType"][value="${searchData.searchType}"]`).checked = true;

        // If 'text' value exists, toggle the radio to "text" search
        if (searchData.text) {
            toggleSearchType('text');
            searchInput.style.display = 'block';
            searchInput.value = searchData.text;
            toggleSearchButton(); // Enable the search button if inputs are pre-filled
            searchButton.click(); // Automatically trigger search if the form is populated
        } else if (searchData.category) {
            // Otherwise, toggle the radio to "category" search
            toggleSearchType('category');
            searchCategory.value = searchData.category;
        
            // Trigger change event and wait for options to populate
            searchCategory.dispatchEvent(new Event('change'));

            // Use a timeout to ensure options are updated
            setTimeout(() => {
                if (searchData.option) {
                    searchOptions.disabled = false;
                    searchOptions.value = searchData.option;
                    toggleSearchButton(); // Enable the search button if inputs are pre-filled

                    searchButton.click(); // Automatically trigger search if the form is populated
                }
            }, 100); // Adjust the timeout as needed
        }
    }
}

// Populate the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from the JSON file
    fetch('json/recipes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipes = data.recipes;
            populateFormFromQueryParams();
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });

    // populateFormFromQueryParams();
});