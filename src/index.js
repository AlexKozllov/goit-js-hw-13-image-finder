import './styles.css';
import refs from './js/refs.js'
import apiService from './js/apiService.js'
import debounce from 'lodash.debounce'
import template from "./template/template.hbs"
import showHide from "./js/showHide.js"


refs.searchForm.addEventListener("input", debounce(dataForFetch, 700))
refs.loadMoreBtn.addEventListener('click', loadMore)

showHide.hideElement(refs.loadMoreBtn)

// const scrol = document.fullscreenElement.scrollHeight
function loadMore() {
    apiService.newSetPage()
    rendering();
    console.dir(window);
    // window.scrollTo(x-coord, y-coord)
    window.scrollTo({
        top: scrol,
        // top: window.pageYOffset,
        // left: 100,
        behavior: 'smooth'
      });

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