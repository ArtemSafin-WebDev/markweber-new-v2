import { Swiper, Thumbs, EffectFade } from 'swiper';
import gsap from 'gsap';

Swiper.use([Thumbs, EffectFade]);

export default function StoriesSlider() {
    const elements = Array.from(document.querySelectorAll('.js-stories-slider'));

    elements.forEach(element => {
        const thumbsContainer = element.querySelector('.stories-slider__master-slider-thumbs .swiper-container');
        const mainContainer = element.querySelector('.stories-slider__master-slider-main .swiper-container');
        const outerSliderContainer = element.querySelector('.stories-slider__outer-slider > .swiper-container');
        const progressBullets = Array.from(element.querySelectorAll('.stories-slider__master-slider-thumbs-card-progress'));
        const mainSlides = Array.from(element.querySelectorAll('.stories-slider__master-slider-main .swiper-slide'));
        const AUTOPLAY_SPEED = 4;
        const DEBUG = false;

        if (DEBUG) console.log('Main slides count', mainSlides.length);

        const mainSliderOptions = {
            watchOverflow: true,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 400,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            threshold: 5,
            thumbs: {
                autoScrollOffset: 1
            },
            nested: false,
            on: {
                slideChange: swiper => {
                    if (DEBUG) console.log('Slidechange handler')
                  
                    autoplay(swiper.realIndex);
                }
            }
        };

        mainSliderOptions.thumbs.swiper = new Swiper(thumbsContainer, {
            watchOverflow: true,
            spaceBetween: 4,
            slidesPerView: 'auto',
            threshold: 10,
            speed: 500,

            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            breakpoints: {
                641: {
                    spaceBetween: 10,
                }
            }
           
        });


        // if (window.matchMedia('(max-width: 640px)').matches) {
        //     new Swiper(outerSliderContainer, {
        //         slidesPerView: 'auto',
        //         spaceBetween: 30,
        //         watchOverflow: true
        //     })
        // }

        const mainSlider = new Swiper(mainContainer, mainSliderOptions);

        function autoplay(startIndex) {
            if (DEBUG) console.log('Starting autoplay for bullet', progressBullets[startIndex]);

            progressBullets.forEach(bullet => {
                gsap.set(bullet, {
                    '--slider-progress': 0
                });
                gsap.killTweensOf(bullet);
            });

            progressBullets.forEach((bullet, bulletIndex) => {
                if (bulletIndex < startIndex) {
                    gsap.set(bullet, {
                        '--slider-progress': 1
                    });
                }
            })
            gsap.fromTo(
                progressBullets[startIndex],
                { '--slider-progress': 0 },
                {
                    '--slider-progress': 1,
                    duration: AUTOPLAY_SPEED,
                    ease: 'linear',
                    onComplete: () => {
                        if (mainSlides[startIndex + 1]) {
                            mainSlider.slideTo(startIndex + 1);
                            autoplay(startIndex + 1);
                        } else {
                            mainSlider.slideTo(0);
                            autoplay(0);
                        }
                    }
                }
            );
        };

        if (mainSlides.length >= 2) {
            autoplay(0);
        }

    });
}
