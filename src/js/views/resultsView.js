import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found. Please try again!';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new ResultsView();
