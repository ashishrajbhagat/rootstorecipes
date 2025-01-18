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
            populateRecipesSections();
            populateAllRecipes();
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
});

const recipeContainer = document.getElementById("recipe-container");

// Utility function to group recipes by a field
function groupRecipesByField(recipes, field) {
    return recipes.reduce((acc, recipe) => {
        const fieldValues = recipe[field]?.split(",") || []; // Split multi-value fields
        fieldValues.forEach(value => {
            acc[value] = acc[value] || [];
            acc[value].push(recipe);
        });
        return acc;
    }, {});
}

// Function to create a section dynamically
function createRecipeSection(title, groupedData) {
    const section = document.createElement("section");
    section.classList.add("recipe-section");

    const heading = document.createElement("h3");
    heading.textContent = title;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.classList.add("category-grid");

    Object.keys(groupedData).forEach(key => {
        const link = document.createElement("a");
        link.href = "#";

        const img = document.createElement("img");
        // img.src = groupedData[key][0]?.images[0] || "https://placehold.co/60x40";
        img.src = "https://placehold.co/60x40";
        img.alt = key;

        const span = document.createElement("span");
        span.textContent = key;

        link.appendChild(img);
        link.appendChild(span);
        grid.appendChild(link);
    });

    section.appendChild(grid);
    return section;
}

// Function to populate Recipes Sections dynamically
function populateRecipesSections() {
    // Group recipes by meal type and cuisine
    const groupedByMealType = groupRecipesByField(recipes, "meal_type");
    const groupedByCuisine = groupRecipesByField(recipes, "cuisine");
    // const groupedByCourse = groupRecipesByField(recipes, "course");
    const groupedByDiet = groupRecipesByField(recipes, "diet");
    const groupedBySeason = groupRecipesByField(recipes, "season");
    const groupedByMethod = groupRecipesByField(recipes, "cooking_method");
    // const groupedBySeries = groupRecipesByField(recipes, "series");

    // Create sections dynamically and append them
    recipeContainer.appendChild(createRecipeSection("Recipes by Meal Type", groupedByMealType));
    recipeContainer.appendChild(createRecipeSection("Recipes by Cuisine", groupedByCuisine));
    // recipeContainer.appendChild(createRecipeSection("Recipes by Course", groupedByCourse));
    recipeContainer.appendChild(createRecipeSection("Recipes by Diet", groupedByDiet));
    recipeContainer.appendChild(createRecipeSection("Recipes by Season", groupedBySeason));
    recipeContainer.appendChild(createRecipeSection("Recipes by Method", groupedByMethod));
    // recipeContainer.appendChild(createRecipeSection("Recipes by Series", groupedBySeries));
}

// Pagination settings
const isMobile = window.innerWidth <= 500; // Check if it's a mobile view
let pageSize = 8; // Recipes per page
if (isMobile) pageSize = 4;
let currentPage = 1;

function populateAllRecipes() {
    // Initial render
    renderRecipes();
    renderPagination();
}

// Function to render recipes dynamically
function renderRecipes() {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const recipesToDisplay = recipes.slice(startIndex, endIndex);

    const recipeGrid = document.querySelector(".recipe-grid");
    recipeGrid.innerHTML = ""; // Clear existing content

    recipesToDisplay.forEach(recipe => {
        const recipeCard = `
        <div class="recipe-card">
            <a href="recipe-details.html?title=${recipe.title}">
                <img src="${recipe.images[0]}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </a>
        </div>
        `;
        recipeGrid.innerHTML += recipeCard;
    });
}

// Function to render pagination
function renderPagination() {
    const paginationContainer = document.querySelector(".pagination");
    const totalPages = Math.ceil(recipes.length / pageSize);
    const maxVisiblePages = isMobile ? 3 : 5; // Show fewer pages in mobile view
    const pages = [];
  
    if (isMobile) {
      // For mobile: Show ... only after current page reaches 3
      if (currentPage > 2) {
        pages.push("..."); // Add leading ...
      }
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 1) {
        pages.push("..."); // Add trailing ...
      }
    } else {
      // For desktop: Default logic
      pages.push(1);
      if (currentPage > 3) pages.push("..."); // Add leading ...
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("..."); // Add trailing ...
      pages.push(totalPages); // Always show the last page
    }
  
    // Clear existing pagination
    paginationContainer.innerHTML = "";
  
    // Add Previous button
    const prevLink = document.createElement("a");
    prevLink.href = "#";
    prevLink.className = "page-link prev-link";
    prevLink.textContent = isMobile ? "<<" : "<< Prev";
    prevLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevLink);
  
    // Add page buttons
    pages.forEach((page) => {
        if (page !== "...") {
            const pageLink = document.createElement("a");
            pageLink.href = "#";
            pageLink.className = "page-link";
            if (page === currentPage) pageLink.classList.add("active");
            pageLink.textContent = page;
            pageLink.addEventListener("click", (e) => {
                e.preventDefault();
                handlePageChange(page);
            });
            paginationContainer.appendChild(pageLink);
        } else {
            const pageSpan = document.createElement("span");
            pageSpan.textContent = page;
            paginationContainer.appendChild(pageSpan);
        }
    });
  
    // Add Next button
    const nextLink = document.createElement("a");
    nextLink.href = "#";
    nextLink.className = "page-link next-link";
    nextLink.textContent = isMobile ? ">>" : "Next >>";
    nextLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    });
    paginationContainer.appendChild(nextLink);
}

// Function to handle page change
function handlePageChange(selectedPage) {
    if (selectedPage && selectedPage !== currentPage) {
        currentPage = selectedPage;
        renderRecipes();
        renderPagination();
    }
}
