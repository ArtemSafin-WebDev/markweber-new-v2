import { Swiper, Autoplay, Navigation, Parallax, Controller } from 'swiper';

Swiper.use([Autoplay, Navigation, Parallax, Controller]);
import Hammer from 'hammerjs';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function ExpertiseSlider() {
    const elements = Array.from(document.querySelectorAll('.js-expertise'));

    elements.forEach(element => {
        const navLinks = Array.from(element.querySelectorAll('.expertise__navigation-link'));
        const navSliderContainer = element.querySelector('.expertise__nav-slider .swiper-container');
        const mainSliderContainer = element.querySelector('.expertise__main-slider .swiper-container');
        const scrollWrapper = element.querySelector('.expertise__nav-slider .swiper-wrapper');
        const navSlides = Array.from(element.querySelectorAll('.expertise__nav-slider .swiper-slide'));

        const expertiseNavSlider = element.querySelector('.expertise__nav-slider');

        let navSlider = null;

        if (!window.matchMedia('(max-width: 640px)').matches) {
            navSlider = new Swiper(navSliderContainer, {
                slidesPerView: 1,
                speed: 800,
                watchOverflow: true,
                spaceBetween: 45,
                allowTouchMove: true,
                slideToClickedSlide: true,
                init: false,
                longSwipesRatio: 0.95,
                threshold: 5
            });
        }

        const mainSlider = new Swiper(mainSliderContainer, {
            slidesPerView: 1,
            speed: 800,
            watchOverflow: true,
            spaceBetween: 45,
            allowTouchMove: false,
            parallax: window.matchMedia('(max-width: 640px)').matches ? false : true,
            init: false,
            on: {
                init: swiper => {
                    setActiveNavLinkMobile(swiper.realIndex);
                },
                slideChange: swiper => {
                    setActiveNavLinkMobile(swiper.realIndex);
                }
            }
        });

        mainSlider.init();

        function setActiveNavLinkMobile(index) {
            if (!window.matchMedia('(max-width: 640px)').matches) return;

            navSlides.forEach((slide, slideIndex) => {
                const card = slide.querySelector('.expertise__nav-slider-card');
                if (slideIndex === index) {
                    gsap.to(card, {
                        duration: 0.8,
                        ease: 'easeOut',
                        webkitTextFillColor: 'rgba(36, 40, 43, 1)',
                        webkitTextStrokeColor: '#24282b'
                    });
                } else {
                    gsap.to(card, {
                        duration: 0.8,
                        ease: 'easeOut',
                        webkitTextFillColor: 'rgba(36, 40, 43, 0)',
                        webkitTextStrokeColor: '#9BA1A4'
                    });
                }
            });
            const activeSlide = navSlides[index];

            gsap.to(scrollWrapper, {
                duration: 0.6,
                scrollTo: { x: activeSlide.offsetLeft - parseFloat(window.getComputedStyle(scrollWrapper).paddingLeft) }
            });

            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[index].classList.add('active');
        }

        function highlightActiveNavSlide(swiper) {
            const slides = swiper.slides;
            const currentSlide = swiper.slides[swiper.realIndex];

            slides.forEach(slide => {
                const card = slide.querySelector('.expertise__nav-slider-card');
                if (slide === currentSlide) {
                    gsap.to(card, {
                        duration: 0.8,
                        ease: 'easeOut',
                        webkitTextFillColor: 'rgba(36, 40, 43, 1)',
                        webkitTextStrokeColor: '#24282b'
                    });
                } else {
                    gsap.to(card, {
                        duration: 0.8,
                        ease: 'easeOut',
                        webkitTextFillColor: 'rgba(36, 40, 43, 0)',
                        webkitTextStrokeColor: '#9BA1A4'
                    });
                }
            });

            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[swiper.realIndex].classList.add('active');

            console.log('Current slide', currentSlide);
        }

        if (navSlider) {
            navSlider.on('init', highlightActiveNavSlide);
            navSlider.on('slideChange', highlightActiveNavSlide);

            navSlider.init();

            navSlider.controller.control = mainSlider;
            mainSlider.controller.control = navSlider;
        }

        navLinks.forEach((link, linkIndex) => {
            link.addEventListener('click', event => {
                event.preventDefault();
                mainSlider.slideTo(linkIndex);
            });
        });

        if (window.matchMedia('(max-width: 640px)').matches) {
            scrollWrapper.addEventListener('touchmove', event => {
                event.preventDefault();
            });
            navSlides.forEach((slide, slideIndex) => {
                const card = slide.querySelector('.expertise__nav-slider-card');

                card.addEventListener('click', event => {
                    event.preventDefault();
                    mainSlider.slideTo(slideIndex);
                });
            });

            const hammertime = new Hammer(expertiseNavSlider);

            hammertime.on('swipeleft', () => {
                const currentIndex = mainSlider.activeIndex;
                if (navSlides[currentIndex + 1]) {
                    mainSlider.slideTo(currentIndex + 1)
                }

                
            });
            hammertime.on('swiperight', () => {
                const currentIndex = mainSlider.activeIndex;
                if (navSlides[currentIndex - 1]) {
                    mainSlider.slideTo(currentIndex - 1)
                }
                
            });
        }
    });
}
