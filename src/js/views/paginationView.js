import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      // console.log(goToPage);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages =
      Math.ceil(this._data.results.length) / this._data.resultsPerPage;

    // Page 1 with more results
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupButtonNext(currPage);
    }

    // Last Page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupButtonPrev(currPage);
    }

    // Other Page
    if (currPage < numPages) {
      return (
        this._generateMarkupButtonPrev(currPage) +
        this._generateMarkupButtonNext(currPage)
      );
    }

    // Page 1 with no more results
    return '';
  }

  _generateMarkupButtonNext(currPage) {
    return `
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }
  _generateMarkupButtonPrev(currPage) {
    return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
      </button>
       `;
  }
}

export default new PaginationView();
