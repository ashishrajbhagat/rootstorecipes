// Placeholder for recipes data
let recipes = [];

// Fetch data from the JSON file
document.addEventListener('DOMContentLoaded', function() {
    fetch('json/recipes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipes = data.recipes;
            renderRecipeDetails();
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
});

// Function to get query parameters by key-value pairs
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}

// Function to find recipe details by key and value
function fetchRecipeDetails(key, value) {
    return recipes.find(recipe => {
        // Check if the key exists and its value matches the search value (case-insensitive)
        return recipe[key] && recipe[key].toString().toLowerCase() === value.toLowerCase();
    });
}

// Main function to handle the process
function renderRecipeDetails() {
    // Fetch the title from the query parameter
    const queryParams = getQueryParams();
    const key = Object.keys(queryParams)[0];
    const value = queryParams[key];

    if (key && value) {
        // Fetch recipe details from the JSON data
        const recipe = fetchRecipeDetails(key, value);

        if (recipe) {
            document.querySelector('.recipe-found').style.display = 'block';
            document.querySelector('.no-recipe-found').style.display = 'none';

            // Render images
            const carouselImages = document.querySelector(".carousel-images");
            const carouselButtons = document.querySelector(".carousel-buttons");
            recipe.images.forEach((src, index) => {
                // Add image to the carousel
                const imgElement = document.createElement("img");
                imgElement.src = src;
                imgElement.alt = recipe.title + ' ' + (index + 1);
                carouselImages.appendChild(imgElement);
            
                // Add button for navigation
                const button = document.createElement("button");
                button.setAttribute("data-index", index);
                if (index === 0) button.classList.add("active");
                carouselButtons.appendChild(button);
            });

            // Render title and description
            document.querySelector('#recipe-title').innerText = recipe.title;
            document.querySelector('#recipe-description').innerText = recipe.description;

            // Render recipe overview
            const overviewContainer = document.getElementById('recipe-overview');
            const ul = document.createElement('ul');

            const mappings = {
                cuisine: "Cuisine",
                meal_type: "Meal Type",
                diet: "Diet",
                difficulty: "Difficulty Level",
                spice_level: "Spice Level",
                cooking_method: "Cooking Method",
                health_focus: "Health Focus",
                season: "Season",
                prep_time_minutes: "Preparation Time",
                cook_time_minutes: "Cooking Time",
                total_time_minutes: "Total Time",
                servings: "Servings"
            };

            for (const [key, label] of Object.entries(mappings)) {
                if (recipe[key]) {
                    const li = document.createElement('li');
                    const strong = document.createElement('strong');
                    strong.textContent = `${label}:`;
                    li.appendChild(strong);

                    let value = recipe[key];

                    if (key === "prep_time_minutes" || key === "cook_time_minutes" || key === "total_time_minutes") {
                        value += " minutes";
                    }

                    const text = document.createTextNode(` ${value}`);
                    li.appendChild(text);

                    ul.appendChild(li);
                }
            }

            overviewContainer.appendChild(ul);

            // Render ingredients
            const ingredientsContainer = document.querySelector('#recipe-ingredients');
            ingredientsContainer.innerHTML = recipe.ingredients
                .map(
                    ingredient =>
                        `<li><strong>${ingredient.name}:</strong> ${ingredient.quantity}</li>`
                )
                .join('');

            // Render steps
            const stepsContainer = document.querySelector('#recipe-steps');
            stepsContainer.innerHTML = recipe.steps.map(step => `<li>${step}</li>`).join('');

            // Render note
            const noteContainer = document.querySelector('#recipe-note');
            if (recipe.note) noteContainer.innerHTML = `<span>Note: ` + recipe.note + `</span>`;
            else noteContainer.style.display = "none";
        } else {
            document.querySelector('.recipe-found').style.display = 'none';
            document.querySelector('.no-recipe-found').style.display = 'block';
            document.querySelector('.no-recipe-found').innerHTML = `<h1>Recipe not found.</h1><p>Try searching again. Go to <a href='index.html'>Home</a>.</p>`;
        }
    } else {
        document.querySelector('.recipe-found').style.display = 'none';
        document.querySelector('.no-recipe-found').style.display = 'block';
        document.querySelector('.no-recipe-found').innerHTML = `<h1>No search or filter criteria provided.</h1><p>Try searching again. Go to <a href='index.html'>Home</a>.</p>`;
    }
}

// Track the current slide index
let currentIndex = 0;

// Function to update the carousel
function updateCarousel(index) {
    const carouselImages = document.querySelector(".carousel-images");
    const slideWidth = carouselImages.querySelector("img").clientWidth;
    carouselImages.style.transform = `translateX(-${index * slideWidth}px)`;

    // Update button active state
    document.querySelectorAll(".carousel-buttons button").forEach((button, idx) => {
        button.classList.toggle("active", idx === index);
    });
}

// Event listener for button clicks
document.querySelector(".carousel-buttons").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const index = parseInt(e.target.getAttribute("data-index"));
        currentIndex = index;
        updateCarousel(currentIndex);
    }
});

// Adjust carousel on window resize
window.addEventListener("resize", () => {
    updateCarousel(currentIndex);
});