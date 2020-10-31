import './styles.css';
import refs from './js/refs.js'
import apiService from './js/apiService.js'
import debounce from 'lodash.debounce'
import template from "./template/template.hbs"
import showHide from "./js/showHide.js"


refs.searchForm.addEventListener("input", debounce(dataForFetch, 700))

console.dir(refs.loadMoreBtn);
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
            )-180;
    setTimeout(()=>{
        window.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
          });
    },10)
}
 

function dataForFetch(event) {
    apiService.query = event.target.value;

    if (event.target.value === '') {
        showHide.hideElement(refs.loadMoreBtn)
        return
    }

    rendering();
    showHide.showElement(refs.loadMoreBtn)

    }


function rendering() {
    apiService.getData().then((data) => {
        refs.gallery.insertAdjacentHTML('beforeend', template(data));
    })
}