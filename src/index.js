import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import './css/styles.css';
import {fetchCountries} from './fileJS/fetchCountries';

const DEBOUNCE_DELAY = 300;

const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');


searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  const searchCountries = e.target.value.trim();

  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (!searchCountries) {
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'hidden';
    Notiflix.Notify.info('Please enter a country name');
    return;
  }

  fetchCountries(searchCountries)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (result.length === 1) {
        countriesList.style.visibility = 'hidden';
        countryInfo.style.visibility = 'visible';
        countryCardMarkup(result);
      } else {
        countryInfo.style.visibility = 'hidden';
        countriesList.style.visibility = 'visible';
        countriesListMarkup(result);
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}


function renderedCountries(result) {
  const inputLetters = result.length;

  if (inputLetters === 1) {
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'visible';
    countryCardMarkup(result);
  } else if (inputLetters > 1 && inputLetters <= 10) {
    countryInfo.style.visibility = 'hidden';
    countriesList.style.visibility = 'visible';
    countriesListMarkup(result);
  }
}

function countriesListMarkup(result) {
  const listMarkup = result.map((({ name, flags }) => {
    return `<li>
                        <img src="${flags.svg}" alt="${name}" width="60" height="auto">
                        <span>${name.official}</span>
                </li>`;
  })).join('');
  countriesList.innerHTML = listMarkup;
  return listMarkup;
}

function countryCardMarkup(result) {
  const cardMarkup = result.map(({ flags, name, capital, population, languages }) => {
    languages = Object.values(languages).join(", ");
    return `
            <img src="${flags.svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
  }).join('');
  countryInfo.innerHTML = cardMarkup;
  return cardMarkup;
}