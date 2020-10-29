export default {
    showElement(elem) {
        elem.classList.remove('is-hidden')
    },

    hideElement(elem) {
        elem.classList.add('is-hidden')
    }
}