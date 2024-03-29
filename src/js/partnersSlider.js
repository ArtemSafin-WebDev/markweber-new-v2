import { Swiper, Navigation, EffectFade, Autoplay } from 'swiper';

Swiper.use([Navigation, EffectFade, Autoplay]);

export default function partnersSlider() {
    const elements = Array.from(document.querySelectorAll('.js-partners-slider'));

    elements.forEach(element => {
        const container = element.querySelector('.swiper');

        const instance = new Swiper(container, {
            slidesPerView: 'auto',
            centeredSlides: true,
            loop: true,
            loopedSlides: 15,
            watchOverflow: true,
            speed: 3500,
            allowTouchMove: false,
            autoplay: {
                delay: 0,
                disableOnInteraction: false
            }
        });

        instance.autoplay.start()
    });
}