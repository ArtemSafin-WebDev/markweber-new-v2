import { Swiper, Navigation, EffectFade, Autoplay, Controller } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { convertRemToPixels } from './utils';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Flip, Observer);
Swiper.use([Navigation, EffectFade, Autoplay, Controller]);

export default function clientsSlider() {
    const elements = Array.from(document.querySelectorAll('.js-clients-slider'));

    elements.forEach(element => {
        let activeIndex = 0;
        const mainContainer = element.querySelector('.our-clients__clients-slider-main .swiper');
        const paginationContainer = element.querySelector('.our-clients__clients-slider-pagination .swiper');
        const progress = element.querySelector('.our-clients__clients-slider-progress');
        const textTabs = Array.from(element.querySelectorAll('.our-clients__clients-slider-text-tab'));
        const AUTOPLAY_DURATION = 10;
        const tabsWrapper = element.querySelector('.our-clients__clients-slider-text-tabs');
        const photos = Array.from(element.querySelectorAll('.our-clients__clients-slider-photo'));
        const authorTabs = Array.from(element.querySelectorAll('.our-clients__clients-slider-author-info-item'));
        const paginationItems = Array.from(element.querySelectorAll('.our-clients__clients-slider-pagination-item'));

        const setActiveTabs = index => {
            const state = Flip.getState(tabsWrapper);
            textTabs.forEach(tab => tab.classList.remove('active'));
            textTabs[index]?.classList.add('active');
            photos.forEach(photo => photo.classList.remove('active'));
            photos[index]?.classList.add('active');
            authorTabs.forEach(tab => tab.classList.remove('active'));
            authorTabs[index]?.classList.add('active');
            paginationItems.forEach(item => item.classList.remove('active'));
            paginationItems[index]?.classList.add('active');

            Flip.from(state, {
                ease: 'power1.inOut',
                duration: 0.4,
                onComplete: () => {
                    ScrollTrigger.refresh();
                }
            });
        };

        const paginationSlider = new Swiper(paginationContainer, {
            slidesPerView: 5,
            spaceBetween: convertRemToPixels(4)
        });
        const mainSlider = new Swiper(mainContainer, {
            init: false,
            speed: 600,
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: false
            },
            allowTouchMove: false,
            navigation: {
                nextEl: element.querySelector('.our-clients__clients-slider-arrow--next'),
                prevEl: element.querySelector('.our-clients__clients-slider-arrow--prev')
            },
            on: {
                init: swiper => {
                    autoplay(swiper.realIndex);
                    activeIndex = swiper.realIndex;

                    setActiveTabs(swiper.realIndex);

                    paginationSlider.slideTo(swiper.realIndex);
                },
                slideChange: swiper => {
                    if (activeIndex === swiper.realIndex) return;
                    autoplay(swiper.realIndex);
                    activeIndex = swiper.realIndex;

                    setActiveTabs(swiper.realIndex);

                    paginationSlider.slideTo(swiper.realIndex);
                }
            }
        });
        mainSlider.init();

        function autoplay(startIndex) {
            gsap.killTweensOf(progress);
            gsap.fromTo(
                progress,
                { '--slider-progress': 0 },
                {
                    '--slider-progress': 1,
                    duration: AUTOPLAY_DURATION,
                    ease: 'linear',
                    onComplete: () => {
                        mainSlider.slideNext();
                    }
                }
            );
        }

        paginationItems.forEach((item, itemIndex) => {
            item.addEventListener('click', event => {
                event.preventDefault();
                mainSlider.slideToLoop(itemIndex);
            });
        });

        Observer.create({
            target: element, // can be any element (selector text is fine)
            type: 'pointer,touch', // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
            onLeft: () =>  mainSlider.slidePrev(),
            onRight: () =>  mainSlider.slideNext(),
            tolerance: 40
        });
    });
}
