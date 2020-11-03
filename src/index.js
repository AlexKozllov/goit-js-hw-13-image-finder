import './styles.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import refs from './js/refs.js'
import apiService from './js/apiService.js'
import debounce from 'lodash.debounce'
import template from "./template/template.hbs"
import showHide from "./js/showHide.js"
import * as basicLightbox from 'basiclightbox'
import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

refs.searchForm.addEventListener("input", debounce(onSearchForm, 700))
refs.loadMoreBtn.addEventListener('click', loadMore)

showHide.hideElement(refs.loadMoreBtn)

function loadMore() {
    apiService.newSetPage()
    rendering();
}

function autoScroll(){
    let scrollHeight=Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
    ) - document.documentElement.clientHeight;
       setTimeout(()=>{
         window.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
          });
    },300)
}


function onSearchForm(event) {
    clearWindow()
    apiService.query = event.target.value;
    apiService.resetPage()
    if (event.target.value === '') {
        showHide.hideElement(refs.loadMoreBtn)
        return
    }
    rendering();
    refs.gallery.addEventListener('click', opoenPhotoCard)
    }


// Отрисовка полученый данных
function rendering() {
    showHide.hideElement(refs.loadMoreBtn);
    apiService.getData().then((data) => {
        refs.gallery.insertAdjacentHTML('beforeend', template(data));
        if (data.length === 0) notification()
        if (refs.gallery.childElementCount > 12 & data.length !== 0) autoScroll();
        if (refs.gallery.childElementCount >= 12) showHide.showElement(refs.loadMoreBtn)
        if (data.length < 12) showHide.hideElement(refs.loadMoreBtn);
    }).catch((err) => {
        notification()
    })
}
// //////////////////////////////////////////////////////////////////////

// Очистка окна результатов поиска
function clearWindow() {
    refs.gallery.innerHTML=''
}
// ////////////////////////////////////////////////////////////////////////

// Загрузка при прокрутке
refs.checkBox.addEventListener("change", onCheckBox)
function onCheckBox(e) {
    if (e.target.checked) {
        window.addEventListener('scroll', infiniteScrolling) 
    }
    if (!e.target.checked) {
        window.removeEventListener('scroll', infiniteScrolling)
   }
}

const infiniteScrolling= debounce(function () {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement
        if (clientHeight + scrollTop >= scrollHeight - 5) loadMore()
}, 500)
    

// //////////////////////////////////////////////////////////////////////////


// Модальное окно
function opoenPhotoCard(e) {
    if (e.target.nodeName !== "IMG") return
        basicLightbox.create(`
     <img width="1400" height="900" src=${e.target.dataset.largeimageurl}>
      `).show()
    }
// //////////////////////////////////////////////////////////////////////////

// Окно с ошибкой
function notification() {
  error({
    title: "ATTENTION",
    text: "No matches, please try again!",
    addClass: "notificationFont",
    delay: 3000,
  });
}


