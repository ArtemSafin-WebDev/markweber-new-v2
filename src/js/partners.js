import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, Thumbs, EffectFade } from 'swiper';
import { convertRemToPixels, IS_MOBILE } from './utils';

gsap.registerPlugin(ScrollTrigger);

Swiper.use([Thumbs, EffectFade]);

export default function partners() {
    const elements = Array.from(document.querySelectorAll('.js-partners'));

    elements.forEach(element => {
        const sliders = Array.from(element.querySelectorAll('.partners__slider'));

        const slides = Array.from(element.querySelectorAll('.swiper-slide'));

        sliders.forEach(slider => {
            const container = slider.querySelector('.swiper');
            const wrapper = slider.querySelector('.swiper-wrapper')

            const slides = Array.from(slider.querySelectorAll('.swiper-slide'));

            slides.forEach(slide => {
                wrapper.appendChild(slide.cloneNode(true));
            });

            new Swiper(container, {
                direction: IS_MOBILE ? 'horizontal' : 'vertical',
                spaceBetween: 0,
                slidesPerView: 'auto',
                loop: true,
                centeredSlides: true,
                loopedSlides: 15,
                loopedSlidesLimit: false,
                loopAdditionalSlides: 10,
            });
        });

        sliders.forEach((slider, sliderIndex) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: slider,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
            if ((sliderIndex + 1) % 2 === 0) {
                if (IS_MOBILE) {
                    tl.to(slider, {
                        x: () => slides[0]?.offsetWidth * 4,
                        duration: 1
                    });
                } else {
                    tl.to(slider, {
                        y: () => slides[0]?.offsetHeight * 4,
                        duration: 1
                    });
                }

                console.log('Slider is even');
            } else {
                console.log('Slider is odd');

                if (IS_MOBILE) {
                    tl.to(slider, {
                        x: () => -1 * slides[0]?.offsetWidth * 4,
                        duration: 1
                    });
                } else {
                    tl.to(slider, {
                        y: () => -1 * slides[0]?.offsetHeight * 4,
                        duration: 1
                    });
                }
            }
        });
    });
}
