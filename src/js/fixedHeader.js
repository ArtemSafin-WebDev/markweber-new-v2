export default function FixedHeader() {
    const pageHeader = document.querySelector('.page-header')
    if (window.matchMedia('(max-width: 640px)').matches) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 30) {
                pageHeader.classList.add('fixed');
            } else {
                pageHeader.classList.remove('fixed');
            }
        })
    }
}