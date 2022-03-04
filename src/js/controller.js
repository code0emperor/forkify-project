import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable/';
import 'regenerator-runtime/runtime';

// if (module.hot) module.hot.accept();

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update resultsView to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering fetched recipe
    recipeView.render(model.state.recipe);

    // 3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render Initial pagination view
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const controlPagination = goToPage => {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render New Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarksView
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    // Show Loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe Data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    // Render bookmark View
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form Window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const newWelcomeMessage = () => {
  console.log('HELLO!!! Welcome to an all new Recipe Page!');
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newWelcomeMessage();
};
init();
