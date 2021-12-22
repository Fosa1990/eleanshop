import gallery from '../../../views/partials/сatalog/gallery.hbs';
import catalogz from '../../json/all.json';
let catalog = null;
import filterLib from '../../json/filterLib.json';
import { productRender } from '../../call-list.js';
import { scrollTo } from '../../components/scrollTo';

import refs from '../../refs/refs.js';
const { favQuantityEl } = refs;

function selectLS() {
  let ls = localStorage.getItem('content');
  if (ls) {
    let index = filterLib.filter_category.findIndex(el => el.id === ls);
    if (index > 0) return filterLib.filter_category[index].category;
    index = filterLib.filter_collection.findIndex(el => el.id === ls);
    if (index > 0) return filterLib.filter_collection[index].collection;
  }
  ls = localStorage.getItem('catalogFilter');
  if (ls) {
    let index = filterLib.filter_collection.findIndex(el => el.id === ls);
    if (index > 0) return filterLib.filter_collection[index].collection;
    index = filterLib.filter_category.findIndex(el => el.id === ls);
    if (index > 0) return filterLib.filter_category[index].category;
  }
}

function filterCatalog() {
  const ls = selectLS();
  if (ls) {
    const fcatalog = [];
    catalog.forEach(el => {
      if (!el.collection) el.collection = [];
      if (el.category.indexOf(ls) >= 0 || el.collection.indexOf(ls) >= 0) fcatalog.push(el);
    });

    if (fcatalog.length > 0) return fcatalog;
  }
  return catalog;
}

export function catalogListMarkupF() {
  const value = sessionStorage.getItem('galleryData');
  catalog = JSON.parse(value);
  return gallery(filterCatalog());
}
export function openCategory() {
  const catalogItems = document.querySelector('.js-catalog');
  const cardHeartIcon = catalogItems.querySelectorAll('.icon-gallery-card-heart');
  const cardHeartIconArray = Array.from(cardHeartIcon);

  for (const cardHeartItem of cardHeartIconArray) {
    cardHeartItem.addEventListener('click', heartColorizing);

    function heartColorizing(e) {
      let data = localStorage.getItem('favorites');
      data = data ? JSON.parse(data) : { fav: [] };

      if (catalog) {
        let obj = null;
        let elemn = null;
        if (e.target.tagName === 'svg') {
          obj = e.target.parentElement.parentElement.parentElement;
          elemn = e.target;
        } else if (e.target.tagName === 'use') {
          elemn = e.target.parentElement;
          obj = e.target.parentElement.parentElement.parentElement.parentElement;
        }

        elemn.classList.toggle('heart-click');
        elemn.classList.toggle('active');
        const itemData = catalog.find(item => item.id === obj.id);

        if (itemData) {
          if (cardHeartItem.classList.contains('active')) {
            let elem = {
              label: {
                id: itemData.id,
                name: itemData.productName,
                img: itemData.image[0].imageProduct,
                img2: itemData.image[3].imageProduct,
                price: itemData.productPrice,
                sizeSelected: '',
                colorSelected: '',
                circleSelected: '',
                description: itemData.description,
                count: 1,
              },
            };
            data.fav.push(elem);
            localStorage.setItem('favorites', JSON.stringify(data));
            favQuantityEl.innerHTML = data.fav.length;
          } else {
            removeFromFavorite(itemData.id);
          }
        }
      }
    }
  }

  const catalogSeeMoreIcon = document.querySelector('.catalog-icon-raws-round');
  catalogSeeMoreIcon.addEventListener('click', seeMoreCards);
  function seeMoreCards(elem) {}

  const cardsList = document.querySelector('.catalog-list');
  cardsList.addEventListener('click', cardToProduct);
  cardsList.addEventListener('touchend', cardToProduct);
}

function cardToProduct(e) {
  if (e.target.nodeName !== 'use' && e.target.nodeName !== 'svg') {
    let id = '';
    if (!e.target.getAttribute('id')) {
      let el = e.target.parentElement;
      while (!id) {
        if (el.getAttribute('id')) {
          id = el.getAttribute('id');
        } else {
          el = el.parentElement;
        }
      }
    } else {
      id = e.currentTarget.getAttribute('id');
    }
    catalog.forEach(el => {
      if (el.id === id) localStorage.setItem('productInfoData', JSON.stringify(el));
    });
    productRender();
    scrollTo(0, 700);
  }
}

export function filteredCatalog(filterName) {
  const fcatalog = catalog.filter(
    el => el.category.indexOf(filterName) >= 0 || el.collection.indexOf(filterName) >= 0,
  );
  if (fcatalog.length > 0) {
    document.querySelector('.catalog-list').innerHTML = gallery(fcatalog);
    openCategory();
  }
}
function removeFromFavorite(id) {
  let ls = JSON.parse(localStorage.getItem('favorites'));
  const lsid = ls.fav.findIndex(el => el.id === id);
  ls.fav.splice(lsid, 1);
  localStorage.setItem('favorites', JSON.stringify(ls));
  refs.favQuantityEl.innerHTML = ls.fav.length;
}
