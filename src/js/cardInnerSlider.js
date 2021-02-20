import gsap from 'gsap';

export default class CardInnerSlider {
    constructor(card) {
        this.card = card;
        this.images = Array.from(card.querySelectorAll('.main-slider__card-image'));
        this.textSlides = Array.from(card.querySelectorAll('.main-slider__card-text'));
        this.clickableContainer = card.querySelector('.main-slider__card-images');
        this.paginationContainer = card.querySelector('.main-slider__card-controls');
        this.paginationBullets = [];
        this.autoplaySpeed = 5;
        this.activeIndex = 0;
        this.locked = true;
        this.autoplayCallback = null;
        if (this.images.length <= 1) {
            console.log('Not enough images in card, skipping', card);
            return;
        }

        this.createPagination();

        this.bindListeners();

        this.setActiveSlide(this.activeIndex);
    }

    lock = () => {
        this.locked = true;
    };
    unlock = () => {
        this.locked = false;
    };

    createPagination = () => {
        this.paginationBullets = this.images.map(() => {
            const bullet = document.createElement('div');

            bullet.className = 'main-slider__card-controls-bullet';

            bullet.innerHTML = `
                <span class="main-slider__card-controls-bullet-inner"></span>
            `;

            return bullet;
        });

        console.log('Created pagination bullets', this.paginationBullets);

        if (!this.paginationContainer) {
            console.warn('No pagination container');
            return;
        }

        this.paginationContainer.innerHTML = '';
        this.paginationContainer.append(...this.paginationBullets);
    };

    setActiveSlide = index => {
        if (this.images.length && this.images[index]) {
            this.images.forEach(image => image.classList.remove('active'));
            this.images[index].classList.add('active');
        }

        if (this.textSlides.length && this.textSlides[index]) {
            this.textSlides.forEach(textSlide => textSlide.classList.remove('active'));
            this.textSlides[index].classList.add('active');
        }

        if (this.paginationBullets.length && this.paginationBullets[index]) {
            this.paginationBullets.forEach(bullet => bullet.classList.remove('active'));
            this.paginationBullets[index].classList.add('active');
        }

        this.activeIndex = index;
    };

    onAutoplayEnd = callback => {
        this.autoplayCallback = callback;
    };

    autoplay = startIndex => {
        if (!this.images.length || !this.paginationBullets.length) return;
        this.paginationBullets.forEach((bullet, bulletIndex) => {
            if (bulletIndex < startIndex) {
                gsap.set(bullet, {
                    '--slider-progress': 1
                });
            }

            if (bulletIndex > startIndex) {
                gsap.set(bullet, {
                    '--slider-progress': 0
                });
            }
        });
        gsap.fromTo(
            this.paginationBullets[startIndex],
            { '--slider-progress': 0 },
            {
                '--slider-progress': 1,
                duration: this.autoplaySpeed,
                ease: 'linear',
                onComplete: () => {
                    if (this.images[startIndex + 1]) {
                        this.setActiveSlide(startIndex + 1);
                        this.autoplay(startIndex + 1);
                    } else {
                        if (typeof this.autoplayCallback === 'function') {
                            this.autoplayCallback();
                        }
                        this.setActiveSlide(0);
                        this.autoplay(0);
                    }
                }
            }
        );
    };

    startAutoplay = () => {
        if (!this.images.length || !this.paginationBullets.length) return;
        console.log('Starting autoplay for card', this.card)
        this.setActiveSlide(0);
        this.autoplay(this.activeIndex);
    };

    killAutoplay = () => {
        this.setActiveSlide(0);

        this.paginationBullets.forEach(bullet => {
            gsap.set(bullet, {
                '--slider-progress': 0
            });
            gsap.killTweensOf(bullet);
        });
    };

    handleClick = index => {
        if (this.locked || !this.images.length || !this.paginationBullets.length) return;
        this.setActiveSlide(index);

        this.paginationBullets.forEach(bullet => {
            gsap.set(bullet, {
                '--slider-progress': 0
            });
            gsap.killTweensOf(bullet);
        });
        this.autoplay(index);
    };

    bindListeners = () => {
        this.paginationBullets.forEach((bullet, bulletIndex) => {
            bullet.addEventListener('click', event => {
                event.preventDefault();

                this.handleClick(bulletIndex);
            });
        });

        this.clickableContainer.addEventListener('click', event => {
            if (this.locked) return;
            const offsetX = event.offsetX;
            const clickableContainerWidth = this.clickableContainer.offsetWidth;

            const direction = offsetX >= clickableContainerWidth / 2 ? 'next' : 'prev';

            console.log(`Clicked on clickable container, direction is ${direction}`, {
                offsetX,
                clickableContainerWidth
            });

            if (direction === 'next') {
                if (this.images[this.activeIndex + 1]) {
                    this.handleClick(this.activeIndex + 1);
                } else {
                    this.handleClick(0);
                }
            } else {
                if (this.images[this.activeIndex - 1]) {
                    this.handleClick(this.activeIndex - 1);
                } else {
                    this.handleClick(this.images.length - 1);
                }
            }
        });
    };
}
