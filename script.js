const search = document.getElementById('search'),
        submit = document.getElementById('submit'),
        random = document.getElementById('random'),
        cocktailsEl = document.getElementById('cocktail'),
        resultHeading = document.getElementById('result-heading'),
        single_cocktailEl = document.getElementById('single-cocktail');

//search cocktail by name from the API
function searchCocktail(e){
    e.preventDefault();

    //Clear single drinks
    single_cocktailEl.innerHTML = '';

    //get the term
    const term = search.value;

    //insert data to db
    db.collection('data').add({
        drink:term
    })
    
    //check for empty
    if(term.trim()){
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            resultHeading.innerHTML = `<h2>Search results for '${term}' :</h2>`
            
            if(data.drinks === null){
                resultHeading.innerHTML = `<p>There are no search results.Try again!</p>`
            }else{
                    //For map fucntions no { }
                    cocktailsEl.innerHTML = data.drinks.map(drink =>`<div class="cocktail">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
                    <div class="drink-info" data-drinkId="${drink.idDrink}">
                    <h3>${drink.strDrink}</h3>
                    </div>
                    </div>`
                )
                .join('')
            }
        })

        //clear the input
        search.value = '';
    }else{
        //if nothing enters
        alert('Please enter a search term');
    }

}

//fetch a single drink by id
function getDrinkById(drinkId){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then(res => res.json())
    .then(data => {

        const drink = data.drinks[0]
        addDrinkToDOM(drink)
    })
}


//get random drink
function getRandomCocktail(){
    //clear heading
    resultHeading.innerHTML = '';
    cocktailsEl.innerHTML = '';

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data =>  {
        const drink = data.drinks[0];

        addDrinkToDOM(drink)
    })

}

//add drink to DOM
function addDrinkToDOM(drink){
    const ingredients = [];
    const imgs = [];

    for(let i = 1;i <= 15;i++){
        if(drink[`strIngredient${i}`]){
            ingredients.push(`${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`)
            imgs.push(`${drink[`strIngredient${i}`]}`)
        }else{
            break;
        }
    }

    single_cocktailEl.innerHTML = `
            <div class="single-drink">
            <h1>${drink.strDrink}</h1>
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
            <div class="single-drink-info">
            ${drink.strCategory ? `<p>${drink.strCategory}</p>` : ''}
            ${drink.strAlcoholic ? `<p>${drink.strAlcoholic}</p>` : ''}
            </div>
            <div class="main">
                <p>${drink.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${imgs.map(img => `<img src="https://www.thecocktaildb.com/images/ingredients/${img}-Small.png">`).join('')}
                    <br>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

}   


//Event Liteners
submit.addEventListener('submit',searchCocktail);
random.addEventListener('click',getRandomCocktail);

//when click the id get the id
cocktailsEl.addEventListener('click',e =>{
    const drinkInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('drink-info')
        }else{
            return false
        }
    })

    if(drinkInfo){
        const drinkID = drinkInfo.getAttribute('data-drinkId');
        getDrinkById(drinkID)
    }
    
})