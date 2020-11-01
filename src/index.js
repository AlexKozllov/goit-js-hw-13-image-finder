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
    autoScroll();  
}

function autoScroll(){
    let scrollHeight=Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
            )-document.documentElement.clientHeight;
    setTimeout(()=>{
        window.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
          });
    },100)
}

function onSearchForm(event) {
    apiService.query = event.target.value;
    if (event.target.value === '') {
        showHide.hideElement(refs.loadMoreBtn)
        apiService.resetPage()
        return
    }
    rendering();
    showHide.showElement(refs.loadMoreBtn)
    refs.gallery.addEventListener('click', opoenPhotoCard)
    }


// Отрисовка полученый данных
function rendering() {
    apiService.getData().then((data) => {
        refs.gallery.insertAdjacentHTML('beforeend', template(data));
        if (refs.gallery.childElementCount > 12 & data !== 0) autoScroll()
        if (data === 0) notification()
    }).catch((err) => { notification() })
}
// ////////////////////////////////////////////////////////////////////////

// Загрузка при прокрутке
refs.checkBox.addEventListener("change",onCheckBox)
function onCheckBox(e) {
    if (e.target.checked) {
        window.addEventListener('scroll', infiniteScrolling) 
    }
    if (!e.target.checked) {
        window.removeEventListener('scroll', infiniteScrolling)
   }
}

function infiniteScrolling() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
        if (clientHeight + scrollTop >= scrollHeight - 20) {
             loadMore()
        }
}
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


