import { Swiper, Navigation, Controller } from 'swiper';

Swiper.use([Navigation, Controller]);

export default function aboutGallery() {
    const elements = Array.from(document.querySelectorAll('.js-about-gallery'));

    elements.forEach(element => {
        const container = element.querySelector('.swiper');

        new Swiper(container, {
            slidesPerView: 'auto',
            speed: 700,
            loop: true,
            loopAdditionalSlides: 5,
            loopedSlides: 5,
            navigation: {
                nextEl: element.querySelector('.about-gallery__arrows-btn--next'),
                prevEl: element.querySelector('.about-gallery__arrows-btn--prev')
            }
        });
    });
}
