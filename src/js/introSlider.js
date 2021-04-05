import gsap from 'gsap';
import Hammer from 'hammerjs';
import detectIt from 'detect-it';

export default function IntroSlider() {
    const elements = Array.from(document.querySelectorAll('.js-intro-slider'));

    elements.forEach(element => {
        const images = Array.from(element.querySelectorAll('.intro__slider-image'));
        const descriptions = Array.from(element.querySelectorAll('.intro__slider-description'));
        const backgrounds = Array.from(element.querySelectorAll('.intro__background'));
        const nextBtn = element.querySelector('.intro__slider-arrow--next');
        const prevBtn = element.querySelector('.intro__slider-arrow--prev');
        const BACKGROUND_CHANGE_SPEED = 0.6;
        const DESCRIPTION_CHANGE_SPEED = 0.3;
        const DESKTOP_AUTOPLAY_SPEED = 8;
        const progressBullets = Array.from(element.querySelectorAll('.intro__slider-pagination-bullet'));

        if (images.length !== descriptions.length) {
            console.error('Number of images must equal number of text slides', images.length, descriptions.length);
            return;
        }
        if (backgrounds.length !== descriptions.length) {
            console.error('Number of backgrounds must equal number of text slides');
            return;
        }

        let activeIndex = 0;
        let locked = false;

        const setActiveSlide = (index, reverseDirection = false) => {
            if (locked) return;
            element.classList.add('locked');

            let direction;

            if (reverseDirection) {
                direction = index > activeIndex ? 'left' : 'right';
            } else {
                direction = index > activeIndex ? 'right' : 'left';
            }

            locked = true;

            const prevBG = backgrounds[activeIndex];
            const nextBG = backgrounds[index];
            const prevDesc = descriptions[activeIndex];
            const nextDesc = descriptions[index];
            const prevImage = images[activeIndex];
            const nextImage = images[index];

            gsap.set(prevDesc, {
                position: 'absolute',
                zIndex: 5
            });
            gsap.set(nextDesc, {
                position: 'relative',
                zIndex: 10
            });

            gsap.set(prevBG, {
                zIndex: 2
            });
            gsap.set(nextBG, {
                zIndex: 5
            });

            if (nextBG.hasAttribute('data-light-bg')) {
                document.body.classList.add('light-background');
            } else {
                document.body.classList.remove('light-background');
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    locked = false;
                    element.classList.remove('locked');
                }
            });

            tl.timeScale(1.2);
            tl.to(
                prevBG,
                {
                    autoAlpha: 0,
                    duration: BACKGROUND_CHANGE_SPEED
                },
                0
            )
                .to(
                    nextBG,
                    {
                        autoAlpha: 1,
                        duration: BACKGROUND_CHANGE_SPEED
                    },
                    0
                )
                .to(
                    prevDesc,
                    {
                        yPercent: 100,
                        autoAlpha: 0,
                        duration: DESCRIPTION_CHANGE_SPEED
                    },
                    0
                );

            if (direction === 'right') {
                tl.fromTo(
                    prevImage,
                    {
                        xPercent: 0,
                        autoAlpha: 1
                    },
                    {
                        xPercent: -70,
                        autoAlpha: 0,
                        duration: 0.6,
                        ease: 'power1.in'
                    },
                    0
                );
                tl.fromTo(
                    nextImage,
                    {
                        xPercent: 70,
                        autoAlpha: 0
                    },
                    {
                        duration: 1.4,
                        xPercent: 0,
                        autoAlpha: 1,
                        ease: 'elastic.out(1, 1)'
                    },
                    '>'
                );
            } else {
                tl.fromTo(
                    prevImage,
                    {
                        xPercent: 0,
                        autoAlpha: 1
                    },
                    {
                        xPercent: 70,
                        autoAlpha: 0,
                        duration: 0.6,
                        ease: 'power1.in'
                    },
                    0
                );
                tl.fromTo(
                    nextImage,
                    {
                        xPercent: -70,
                        autoAlpha: 0
                    },
                    {
                        duration: 1,
                        xPercent: 0,
                        autoAlpha: 1.4,
                        ease: 'elastic.out(1, 1)'
                    },
                    '>'
                );
            }

            tl.fromTo(
                nextDesc,
                {
                    autoAlpha: 0,
                    yPercent: 100
                },
                {
                    autoAlpha: 1,
                    yPercent: 0,
                    duration: DESCRIPTION_CHANGE_SPEED
                },
                '<-0.1'
            );

            activeIndex = index;

            if (window.matchMedia('(max-width: 640px)').matches) {
                mobileAutoplay(activeIndex);
            } else {
                desktopAutoplay();
            }
        };

        const initialize = () => {
            images.forEach(image =>
                gsap.set(image, {
                    autoAlpha: 0
                })
            );
            descriptions.forEach(desc => {
                gsap.set(desc, {
                    autoAlpha: 0,
                    position: 'absolute',
                    zIndex: 5
                });
            });
            backgrounds.forEach(bg => {
                gsap.set(bg, {
                    autoAlpha: 0,
                    zIndex: 2
                });
            });

            gsap.set(images[activeIndex], {
                autoAlpha: 1
            });

            gsap.set(backgrounds[activeIndex], {
                autoAlpha: 1
            });

            gsap.set(descriptions[activeIndex], {
                autoAlpha: 1,
                position: 'relative',
                zIndex: 10
            });

            element.classList.add('initialized');
        };

        const goNextSlide = () => {
            if (descriptions[activeIndex + 1]) {
                setActiveSlide(activeIndex + 1);
            } else {
                setActiveSlide(0, true);
            }
        };
        const goPrevSlide = () => {
            if (descriptions[activeIndex - 1]) {
                setActiveSlide(activeIndex - 1);
            } else {
                setActiveSlide(descriptions.length - 1, true);
            }
        };

        initialize();

        nextBtn.addEventListener('click', event => {
            event.preventDefault();
            goNextSlide();
        });
        prevBtn.addEventListener('click', event => {
            event.preventDefault();
            goPrevSlide();
        });

        function desktopAutoplay() {
            gsap.set(nextBtn, {
                '--slider-progress': 0
            });
            gsap.killTweensOf(nextBtn);
            gsap.fromTo(
                nextBtn,
                { '--slider-progress': 0 },
                {
                    '--slider-progress': 1,
                    duration: DESKTOP_AUTOPLAY_SPEED,
                    ease: 'linear',
                    onComplete: () => {
                        goNextSlide();
                    }
                }
            );
        }

        function mobileAutoplay(startIndex) {
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
            });
            gsap.fromTo(
                progressBullets[startIndex],
                { '--slider-progress': 0 },
                {
                    '--slider-progress': 1,
                    duration: 10,
                    ease: 'linear',
                    onComplete: () => {
                        goNextSlide();
                    }
                }
            );
        }

        progressBullets.forEach((bullet, bulletIndex) => {
            bullet.addEventListener('click', event => {
                event.preventDefault();

                setActiveSlide(bulletIndex);
            });
        });

        if (detectIt.hasTouch || window.matchMedia('(max-width: 640px)').matches) {
            const hammertime = new Hammer(element);

            hammertime.on('swipeleft', () => {
                goNextSlide();
            });
            hammertime.on('swiperight', () => {
                goPrevSlide();
            });
        }

        if (window.matchMedia('(max-width: 640px)').matches) {
    
            mobileAutoplay(activeIndex);
        } else {
            nextBtn.classList.add('autoplay');
            desktopAutoplay();
        }
    });
}
