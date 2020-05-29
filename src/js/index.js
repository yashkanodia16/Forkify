import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchViews';

const state = {}

const controlSearch  = async () =>  {
    const query = searchView.getInput();
  
    if(query) {
        state.search = new Search(query);
        
        searchView.clearInput();
        searchView.clearRes();
        renderLoader(elements.searchRes);

        await state.search.getResults(); 
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchFrom.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearRes();
        searchView.renderResults(state.search.result, goToPage);
    }
})