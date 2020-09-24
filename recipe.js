const mealsEl = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals')

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');


const mealPopup = document.getElementById('meal-popup');
const popupCloseBtn = document.getElementById('close-popup');
const mealInfoEl = document.getElementById('meal-info');

getRandom();
const load=setInterval(function(){getRandom()},10000);
fetchFav();

async function getRandom() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

  const responseJSON = await response.json();
  const randomMeal = responseJSON.meals[0];

  console.log(randomMeal);

  loadRandom(randomMeal, true);

}

async function getId(id) {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

  const respData = await resp.json();

  const meal = respData.meals[0];
  return meal;
}

async function getSearch(term) {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}

function loadRandom(mealData, random = false) {
  const meal = document.createElement('div');
  meal.classList.add('meal');
  meal.innerHTML = `
  <div class="meal_header">
    ${random ? `<span class="random">
    Random Recipe
    </span>` : ''}
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
  </div>
  <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
    <i class="fa fa-heart"></i>
    </button>
  </div>
  `;
  const btn = meal.querySelector(".meal-body .fav-btn");
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      removeLS(mealData.idMeal);
      btn.classList.remove('active');
    } else {
      addLS(mealData.idMeal);
      btn.classList.add('active');
    }


    fetchFav();
  });
  let rimage=meal.querySelector('.meal_header');
  rimage.addEventListener('click', () => {
    showMeal(mealData);
  });
  mealsEl.appendChild(meal);
}

function addLS(mealId) {
  const mealIds = getLS();

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeLS(mealId) {
  const mealIds = getLS();

  localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));

  return mealIds === null ? [] : mealIds;
}

async function fetchFav() {
  favContainer.innerHTML = '';
  const mealIds = getLS();
  const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getId(mealId);
    addFav(meal);
  }
  //add to screen
}


function addFav(mealData) {

  const fav = document.createElement('li');

  fav.innerHTML = `
  <img title="${mealData.strMeal}" src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
  <button class="clear">
  <i class="fas fa-window-close"></i></button>
  `;
  const btn = fav.querySelector('.clear');
  const image=fav.querySelector('img');

  btn.addEventListener('click', () => {
    removeLS(mealData.idMeal);
    fetchFav();
  });

  image.addEventListener('click', () => {
    showMeal(mealData);
  });
  favContainer.appendChild(fav);
}

// prepare

function showMeal(mealData) {
  mealInfoEl.innerHTML = '';

  const mealEl = document.createElement('div');

  const ingredients = [];
  for (let i = 1; i < 20; i++) {
    if (mealData["strIngredient"+i]) {
      ingredients.push(`${ mealData["strIngredient" + i]} - ${ mealData["strMeasure" + i]}`);
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
  <h1>${mealData.strMeal}</h1>
  <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">

  <h3>Ingredients</h3>
  <ul>
    ${ingredients.map(ing =>`<li>${ing}</li>`).join("")}
  </ul>
  <h3>Preparation</h3>
  <p>${mealData.strInstructions}</p>
  
  `;

  mealInfoEl.appendChild(mealEl);
  //show popup
  mealPopup.classList.remove('hidden');
}


//search meal
searchBtn.addEventListener('click', async () => {
  mealsEl.innerHTML = '';
  const search = searchTerm.value;

  // console.log(await getSearch(search));
  const meals = await getSearch(search);
  clearInterval(load);

  if (meals) {
    meals.forEach(meal => {
      loadRandom(meal);
    });
  }

});

// prepare

popupCloseBtn.addEventListener('click', () => {
  // mealPopup.style.display="none";
  mealPopup.classList.add('hidden');
});


//Push notification

// function notify(){
//   let box=document.createElement('div');
//   let header=document.createElement('h3');
//   let message=document.createElement('p');
//   header.innerHTML=`Welcome to Chef's Hub`
//   message.innerHTML=`We load random recipes here, Feel free to search your own.Use the button go straight to the top`;
//   tip.className='notification';
//   tip.appendChild(header);
//   tip.appendChild(message);
//   document.body.appendChild(tip);
//   removeNotify();
//   setTimeout(()=>{
//     tip.classList.add('visible')
//   },10);

//   setTimeout(()=>{
//     tip.classList.add('remove')
//     setTimeout(()=>{
//       tip.remove()
//     },300);
//   },2500);
// }

// function removeNotify(){
//   const notification=document.querySelectorAll('.visible')
//   if(notification.length>0){
//     notification.forEach((tip)=>{
//       tip.classList.add('remove')
//       setTimeout(()=>{
//         tip.remove()
//       },300);
//     })
//   }
// }
// notify();
