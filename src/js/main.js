// import axios from 'axios';

// Name export
// import { axiosSearch } from './request-api';
// import { createMarkup } from './markup';

// Default export
import axiosSearch from './request-api';
import createMarkup from './markup';

import Notiflix from 'notiflix';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
iziToast.settings({
  position: 'topRight',
  maxWidth: 300,
  // timeout: 5000,
  closeOnEscape: true,
  closeOnClick: true,
});

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery-list a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Elements ojects
const elements = {
  form: document.querySelector('.js-sumbit'),
  gallery: document.querySelector('.js-gallery'),
  loader: document.querySelector('.loader'),
  moreBtn: document.querySelector('.js-btn'),
};

let wordSearch = '';
let currentPage = 1;
let perPage = 6;
let totalImg = 1;
let totalPages = 1;

// Event listeners - submit to submit form
elements.form.addEventListener('submit', handlerSubmitForm);

// Event listeners - click to moreBtn
elements.moreBtn.addEventListener('click', handlerMoreBtn);

// Callback function for listener, for submitting a form
async function handlerSubmitForm(evt) {
  evt.preventDefault();
  currentPage = 1;
  loaderSow();
  moreBtnHidden();

  // Notiflix.Loading
  Notiflix.Loading.standard('Loading data, please wait....');

  const { searchQuery } = evt.currentTarget.elements;
  const date = {
    search: searchQuery.value,
  };
  console.log(date.search);
  wordSearch = date.search;

  try {
    await axiosSearch(wordSearch, currentPage, perPage).then(
      ({ data, data: { hits }, data: { totalHits } }) => {
        console.log(data);
        console.log(hits);
        console.log(hits.length);

        totalImg = totalHits;
        console.log(totalImg);
        totalPages = Math.ceil(totalImg / perPage);
        console.log(totalPages);

        if (hits.length === 0) {
          iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please try again.',
          });
          moreBtnHidden();
          currentPagepage = 1;
        }
        elements.gallery.innerHTML = createMarkup(hits);

        Notiflix.Loading.remove();
        loaderHidden();
        moreBtnSow();

        lightbox.refresh();
      }
    );
  } catch (error) {
    iziToast.error({
      //  title: 'Error',
      message: 'Oops! Something went wrong! Try reloading the page!',
    });
    Notiflix.Loading.remove();
    loaderHidden();
    console.log(error);
  } finally {
    evt.target.reset();
  }

  // Card height
  elements.galleryItem = document.querySelector('.js-gallery-item');
  const heightItem = elements.galleryItem.getBoundingClientRect().height;
  console.log(heightItem);

  // window.scrollBy page scroll
  window.scrollBy(0, {
    top: heightItem * 2,
    left: 0,
    behavior: 'smooth',
  });
}

// Callback function for listener, for click at MoreBtn
async function handlerMoreBtn() {
  currentPage += 1;

  if (currentPage > totalPages) {
    moreBtnHidden();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
    });
    return;
  }

  moreBtnHidden();
  loaderSow();
  // Notiflix.Loading
  Notiflix.Loading.standard('Loading data, please wait....');

  await axiosSearch(wordSearch, currentPage, perPage).then(
    ({ data, data: { hits }, data: { totalHits } }) => {
      console.log(data);
      console.log(hits);
      console.log(hits.length);
      console.log(currentPage);

      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

      Notiflix.Loading.remove();
      loaderHidden();
      moreBtnSow();

      lightbox.refresh();
    }
  );
}

// Load and Error Handling Functions
function loaderSow() {
  elements.loader.classList.replace('hidden', 'show');
}
function loaderHidden() {
  elements.loader.classList.replace('show', 'hidden');
}

// moreBtnSow, moreBtnHidden function
function moreBtnSow() {
  elements.moreBtn.classList.replace('hidden', 'show');
}
function moreBtnHidden() {
  elements.moreBtn.classList.replace('show', 'hidden');
}
