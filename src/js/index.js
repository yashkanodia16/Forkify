import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeView';

const state = {}

// Search Controller
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);

        searchView.clearInput();
        searchView.clearRes();
        renderLoader(elements.searchRes);
        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);

        }
        catch (error) {
            alert('Error with search..');
            clearLoader();
        }
    }
}

elements.searchFrom.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

window.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearRes();
        searchView.renderResults(state.search.result, goToPage);
    }
})

// Recipe Controller

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        recipeView.clearRes();   
        renderLoader(elements.recipe);
        if(state.search) searchView.highlightSelected(id);
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe.ingredients);

            state.recipe.calcTime();
            state.recipe.calcServings();
            
                
            clearLoader();
            recipeView.renderRecipe(state.recipe);

            
        }
        catch (error) {
            alert(error);
        }

    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));