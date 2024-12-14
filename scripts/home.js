// Query DOM elements
const form = document.querySelector('.search-container');
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const searchCategory = document.getElementById('searchCategory');
const searchOptions = document.getElementById("searchOptions");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

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

// Placeholder for recipes data
let recipes = [];

// Function to fetch recipes and initialize the Recipe of the Day section
function initializeRecipeOfTheDay() {
    fetch('json/recipes.json') // Update the path to your JSON file
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipes = data.recipes;
            displayRecipeOfTheDay();
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
}

// Function to display the Recipe of the Day
function displayRecipeOfTheDay() {
    // Check if a recipe is already stored for today
    const today = new Date().toISOString().split('T')[0]; // Get the current date (YYYY-MM-DD)
    const savedRecipe = JSON.parse(localStorage.getItem('recipeOfTheDay'));

    // If a recipe is already saved for today, use it
    if (savedRecipe && savedRecipe.date === today) {
        updateRecipeSection(savedRecipe.recipe);
        return;
    }

    // Otherwise, select a new random recipe
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const selectedRecipe = recipes[randomIndex];

    // Save the selected recipe and date in localStorage
    localStorage.setItem('recipeOfTheDay', JSON.stringify({
        date: today,
        recipe: selectedRecipe
    }));

    // Update the section with the new recipe
    updateRecipeSection(selectedRecipe);
}

// Function to update the Recipe of the Day section
function updateRecipeSection(recipe) {
    const largeImage = document.querySelector('.recipe-day-large-image img');
    const smallImages = document.querySelectorAll('.recipe-day-small-images img');
    const title = document.querySelector('.recipe-day-title');
    const description = document.querySelector('.recipe-day-description');
    const prepTime = document.querySelector('.recipe-day-info li:nth-child(1)');
    const cookTime = document.querySelector('.recipe-day-info li:nth-child(2)');
    const servings = document.querySelector('.recipe-day-info li:nth-child(3)');
    const viewRecipeButton = document.querySelector('.btn-primary');

    // Update content
    largeImage.src = recipe.images[0];
    largeImage.alt = recipe.title;

    // Update small images (use additional images if available, otherwise fallback)
    smallImages[0].src = recipe.images[1] || recipe.images[0];
    smallImages[1].src = recipe.images[2] || recipe.images[0];

    title.textContent = recipe.title;
    description.textContent = recipe.description;
    prepTime.innerHTML = `<strong>Prep Time:</strong> ${recipe.prep_time_minutes}`;
    cookTime.innerHTML = `<strong>Cook Time:</strong> ${recipe.cook_time_minutes}`;
    servings.innerHTML = `<strong>Servings:</strong> ${recipe.servings}`;
    viewRecipeButton.href = recipe.detailPageUrl || '#';
}

// Initialize the Recipe of the Day on page load
document.addEventListener('DOMContentLoaded', initializeRecipeOfTheDay);
