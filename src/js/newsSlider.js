import { Swiper } from 'swiper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

Swiper.use([]);

export default function newsSlider() {
    const elements = Array.from(document.querySelectorAll('.js-news-slider'));

    elements.forEach(element => {
        const btns = Array.from(element.querySelectorAll('.news-slider__navigation-link'));
        const tabs = Array.from(element.querySelectorAll('.news-slider__tab'));
        const tabsContainer = element.querySelector('.news-slider__tabs');
        const sliders = [];

        const prevBtn = element.querySelector('.news-slider__arrow--prev');
        const nextBtn = element.querySelector('.news-slider__arrow--next');

        const cursor = element.querySelector('.news-slider__card-cursor');
        const cursorLayers = Array.from(cursor.querySelectorAll('.news-slider__card-cursor-layer'));

        const cursorHandler = e => {
            const xmouse = e.clientX || e.pageX;
            const ymouse = e.clientY || e.pageY - window.scrollY;
            cursor.style.left = xmouse + 'px';
            cursor.style.top = ymouse + 'px';
        };

        tabsContainer.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        tabsContainer.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });

        document.addEventListener('mousemove', cursorHandler);

        tabs.forEach((tab, tabIndex) => {
            const container = tab.querySelector('.swiper-container');

            const slides = Array.from(tab.querySelectorAll('.swiper-slide'));
            const cursor = tab.querySelector('.news-slider__card-cursor');
            const layer = cursorLayers[tabIndex];

            const cursorImages = Array.from(layer.querySelectorAll('.news-slider__card-cursor-image'));

            const instance = new Swiper(container, {
                slidesPerView: 'auto',
                watchOverflow: true,
                touchStartPreventDefault: false,
                speed: 500,
                on: {
                    progress: swiper => {
                        if (swiper.progress === 0) {
                            prevBtn.classList.add('swiper-button-disabled');
                        } else {
                            prevBtn.classList.remove('swiper-button-disabled');
                        }
                        if (swiper.progress === 1) {
                            nextBtn.classList.add('swiper-button-disabled');
                        } else {
                            nextBtn.classList.remove('swiper-button-disabled');
                        }

                        console.log('Progress', swiper.progress);
                        console.log('Is end', swiper.isEnd);
                        console.log('active index', swiper.activeIndex);
                    }
                }
            });

            sliders.push(instance);

            slides.forEach((slide, slideIndex) => {
                slide.addEventListener('mouseenter', () => {
                    slides.forEach(otherSlide => {
                        if (otherSlide !== slide) {
                            otherSlide.classList.add('faded');
                        }
                    });

                    if (cursorImages[slideIndex]) {
                        cursorImages[slideIndex].classList.add('active');
                    }
                });

                slide.addEventListener('mouseleave', () => {
                    slides.forEach(slide => slide.classList.remove('faded'));

                    cursorImages[slideIndex].classList.remove('active');
                });
            });
        });

        const setActiveTab = index => {
            tabs.forEach(tab => tab.classList.remove('active'));
            btns.forEach(btn => btn.classList.remove('active'));
            tabs[index].classList.add('active');
            btns[index].classList.add('active');
            cursorLayers.forEach(layer => layer.classList.remove('active'));
            cursorLayers[index].classList.add('active');

            const currentSliderInstance = sliders[index];

            if (currentSliderInstance.progress === 0) {
                prevBtn.classList.add('swiper-button-disabled');
            } else {
                prevBtn.classList.remove('swiper-button-disabled');
            }
            if (currentSliderInstance.progress === 1) {
                nextBtn.classList.add('swiper-button-disabled');
            } else {
                nextBtn.classList.remove('swiper-button-disabled');
            }

            ScrollTrigger.refresh();
        };

        if (tabs.length) {
            setActiveTab(0);
        }

        prevBtn.addEventListener('click', event => {
            event.preventDefault();
            const activeTabIndex = tabs.findIndex(tab => tab.classList.contains('active'));
            sliders[activeTabIndex].slidePrev();
        });
        nextBtn.addEventListener('click', event => {
            event.preventDefault();
            const activeTabIndex = tabs.findIndex(tab => tab.classList.contains('active'));
            sliders[activeTabIndex].slideNext();
        });

        btns.forEach((btn, btnIndex) => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                setActiveTab(btnIndex);
            });
        });
    });
}
