import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/list';
import Likes from './models/likes';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeView';

const state = {}
window.state = state;

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
        if (state.search) searchView.highlightSelected(id);
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

/**
 * Like Controller
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if (!state.likes.isLiked(currentID)) {
        console.log(state.likes.isLiked(currentID));
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        console.log(state.likes);
    } else {
        state.likes.deleteLike(currentID)
        console.log(state.likes);
    }
}


/**
 * List Controller
 */

const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);

        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

window.l = new List();