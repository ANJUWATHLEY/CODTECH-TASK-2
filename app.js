let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let input = document.querySelector("input");
let loading = document.getElementById("loading");

input.focus();
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

function searchMeal() {
  input.focus();
  let userValue = document.querySelector("#user-input").value;
  if (userValue.length == 0) {
    result.innerHTML = `<h3>Input Field Cannot be Empty</h3>`;
  } else {
    loading.style.display = "block";
    fetch(url + userValue)
      .then((response) => response.json())
      .then((data) => {
        loading.style.display = "none";
        if (!data.meals) {
          result.innerHTML = `<h3>No Recipes Found</h3>`;
          return;
        }
        let myMeal = data.meals[0];
        let count = 1;
        let ingredients = [];
        for (let i in myMeal) {
          let ingredient = "";
          let measure = "";
          if (i.startsWith("strIngredient") && myMeal[i]) {
            ingredient = myMeal[i];
            measure = myMeal["strMeasure" + count];
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
          }
        }
        result.innerHTML = `
          <img src=${myMeal.strMealThumb} alt="${myMeal.strMeal}">
          <div class="details">
            <h2>${myMeal.strMeal}</h2>
            <h4>${myMeal.strArea}</h4>
            <h4>Category: ${myMeal.strCategory}</h4>
            <h4>Tags: ${myMeal.strTags ? myMeal.strTags.split(',').join(', ') : 'N/A'}</h4>
          </div>
          <div class="ingredient-content"></div>
          <div class="recipe">
            <button id="hide-recipe">X</button>
            <pre id="instructions">${myMeal.strInstructions}</pre>
            ${myMeal.strYoutube ? `<a href="${myMeal.strYoutube}" target="_blank">Watch Video</a>` : ''}
          </div>
          <button id="show-recipe">View Recipe</button>
        `;
        let hideRecipe = document.querySelector("#hide-recipe");
        let showRecipe = document.querySelector("#show-recipe");
        let recipe = document.querySelector(".recipe");
        let ingredientContent = document.querySelector(".ingredient-content");
        let parent = document.createElement("ul");

        ingredients.forEach((i) => {
          let child = document.createElement("li");
          child.innerText = i;
          parent.appendChild(child);
          ingredientContent.appendChild(parent);
        });
        hideRecipe.addEventListener("click", () => {
          recipe.style.display = "none";
        });
        showRecipe.addEventListener("click", () => {
          recipe.style.display = "block";
        });
      })
      .catch(() => {
        loading.style.display = "none";
        result.innerHTML = `<h3>Invalid Input</h3>`;
      });
  }
}

document.querySelector("input").addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    searchMeal();
  }
});
searchBtn.addEventListener("click", searchMeal);
