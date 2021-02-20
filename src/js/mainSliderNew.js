import gsap from 'gsap';
import Hammer from 'hammerjs';
import { debounce } from 'lodash';
import CardInnerSlider from './cardInnerSlider';

export default class MainSliderNew {
    constructor(element) {
        console.log('Initializing on element', element);
        this.rootElement = element;
        this.cards = Array.from(element.querySelectorAll('.main-slider__card'));
        if (!this.cards.length) {
            console.warn('No slider cards');
            return;
        }
        this.cardsContainer = element.querySelector('.main-slider__cards');
        this.locked = false;
        this.filterClicks = false;
        this.filterClicksDelay = 200;
        this.activeIndex = 0;
        this.marginRight = this.calculateMargin();
        this.maximumOffset = 400;
        this.scaleMultiplier = 1.4;
        this.initialCardWidth = this.calculateInitialCardWidth();
        this.threshold = this.initialCardWidth * 0.7;
        this.innerSliders = [];
        this.touchContainer = new Hammer(this.cardsContainer);
        this.cardPositions = this.calculateCardPositions();

        this.initialSetup();
        this.bindListeners();
        this.setupInnerSliders();
    }

    calculateInitialCardWidth = () => {
        const initialCardWidth = this.cards[0].offsetWidth;
        console.log('Initial card width', initialCardWidth);
        return initialCardWidth;
    };

    calculateMargin = () => {
        const styles = getComputedStyle(this.cards[0]);
        const margin = parseInt(styles.marginRight, 10);
        console.log('Calculated margin', margin);
        return margin;
    };

    setupInnerSliders = () => {
        this.innerSliders = this.cards.map(card => {
            const innerSlider = new CardInnerSlider(card);
            innerSlider.onAutoplayEnd(() => {
                innerSlider.killAutoplay();
                console.log('Changing next slider with autoplay from card', card)
                if (this.cards[this.activeIndex + 1]) {
                    this.nextSlide();
                } else {
                    console.log('Reached end');
                    innerSlider.killAutoplay();
                }
              
            })
            return innerSlider;
        });

        this.unlockInnerSlider(this.activeIndex)

        this.setAutoplay(this.activeIndex);
    };


    setAutoplay = index => {
       
        this.innerSliders.forEach(slider => slider.killAutoplay());
        this.innerSliders[index].startAutoplay();
    }

    initialSetup = () => {
        const initialActiveCard = this.cards[this.activeIndex];
        this.cards.forEach(card => {
            gsap.set(card, {
                width: this.initialCardWidth
            });
            card.classList.remove('active');
        });

        initialActiveCard.classList.add('active');

        gsap.set(initialActiveCard, {
            width: this.initialCardWidth * this.scaleMultiplier
        });

        this.cardPositions = this.calculateCardPositions();
    };

    calculateCardPositions = () => {
        const positions = this.cards.map((card, cardIndex) => {
            return {
                card,
                cardIndex,
                xTransform: 0
            };
        });

        console.log('Calculated card positions', positions);

        return positions;
    };

    lockSlider = () => {
        this.locked = true;
        this.innerSliders.forEach(slider => slider.lock())
    };

    unlockSlider = () => {
        setTimeout(() => {
            this.locked = false;
            this.unlockInnerSlider(this.activeIndex)
        }, 400);
    };


    unlockInnerSlider = index => {
        this.innerSliders.forEach(slider => slider.lock());
        this.innerSliders[index].unlock();
       
    }

    handlePanStart = event => {
        console.log('Panstart');

        this.filterClicks = true;

        this.innerSliders.forEach(slider => slider.lock())
    };

    handlePanMove = event => {
        if (this.locked) {
            console.log('Panmove blocked');
            return;
        }

        if (Math.abs(event.deltaX) >= this.threshold && event.offsetDirection === 4) {
            this.lockSlider();

            return;
        }

        console.log('Panmove');

        this.cardPositions.forEach(cardPosition => {
            if (cardPosition.cardIndex <= this.activeIndex && event.offsetDirection === 2) {
                gsap.set(cardPosition.card, {
                    x: cardPosition.xTransform
                });
            } else if (cardPosition.cardIndex < this.activeIndex && event.offsetDirection === 4) {
                gsap.set(cardPosition.card, {
                    x: cardPosition.xTransform
                });
            } else {
                gsap.set(cardPosition.card, {
                    x: cardPosition.xTransform + event.deltaX
                });
            }
        });
    };

    goToSlide = index => {
        if (this.locked || !this.cards[index] || index <= this.activeIndex) return;
        this.lockSlider();
        this.cardPositions.forEach(cardPosition => {
            if (cardPosition.cardIndex <= this.activeIndex) {
                cardPosition.card.classList.remove('active');
                gsap.to(cardPosition.card, {
                    autoAlpha: 0,
                    duration: 0.3,
                    scale: 0,
                    width: this.initialCardWidth * this.scaleMultiplier,
                });
                return;
            } else if (cardPosition.cardIndex > this.activeIndex && cardPosition.cardIndex < index) {
                const newTransform =
                    cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier * (cardPosition.cardIndex - this.activeIndex) - this.marginRight * (index - this.activeIndex);
                cardPosition.card.classList.remove('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    width: this.initialCardWidth * this.scaleMultiplier,
                    autoAlpha: 0,
                    scale: 0,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            } else if (cardPosition.cardIndex === index) {
                const newTransform =
                    cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier * (cardPosition.cardIndex - this.activeIndex) - this.marginRight * (index - this.activeIndex)
                console.log('New transform for main card', newTransform)
                cardPosition.card.classList.add('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    width: this.initialCardWidth * this.scaleMultiplier,
                    autoAlpha: 1,
                    scale: 1,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            } else {
                const newTransform =
                    cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier * (index - this.activeIndex) - this.marginRight * (index - this.activeIndex);
                cardPosition.card.classList.remove('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    width: this.initialCardWidth,
                    autoAlpha: 1,
                    scale: 1,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            }
        });

        this.activeIndex = index;

        this.unlockSlider();

        this.setAutoplay(this.activeIndex);
    };

    prevSlide = () => {
        if (!this.cards[this.activeIndex - 1]) return;
        this.lockSlider();

        this.cardPositions.forEach(cardPosition => {
            if (cardPosition.cardIndex < this.activeIndex - 1) {
                return;
            } else if (cardPosition.cardIndex === this.activeIndex - 1) {
                cardPosition.card.classList.add('active');
                gsap.to(cardPosition.card, {
                    autoAlpha: 1,
                    duration: 0.3,
                    scale: 1
                });
            } else if (cardPosition.cardIndex === this.activeIndex) {
                const newTransform = cardPosition.xTransform + this.initialCardWidth * this.scaleMultiplier + this.marginRight;
                cardPosition.card.classList.remove('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    width: this.initialCardWidth,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            } else {
                const newTransform = cardPosition.xTransform + this.initialCardWidth * this.scaleMultiplier + this.marginRight;
                cardPosition.card.classList.remove('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            }
        });
        this.activeIndex = this.activeIndex - 1;

        this.unlockSlider();

        this.setAutoplay(this.activeIndex);
    };

    nextSlide = () => {
        if (!this.cards[this.activeIndex + 1]) return;
        this.lockSlider();
        const currentCard = this.cards[this.activeIndex];

        gsap.to(currentCard, {
            autoAlpha: 0,
            duration: 0.3,
            scale: 0
        });

        this.cardPositions.forEach(cardPosition => {
            if (cardPosition.cardIndex <= this.activeIndex) {
                cardPosition.card.classList.remove('active');

                return;
            } else if (cardPosition.cardIndex === this.activeIndex + 1) {
                const newTransform = cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier - this.marginRight;
                cardPosition.card.classList.add('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    width: this.initialCardWidth * this.scaleMultiplier,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            } else {
                const newTransform = cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier - this.marginRight;
                cardPosition.card.classList.remove('active');
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: newTransform,
                    onComplete: () => {
                        cardPosition.xTransform = newTransform;
                    }
                });
            }
        });

        this.activeIndex = this.activeIndex + 1;

        this.unlockSlider();

        this.setAutoplay(this.activeIndex);
    };

    handlePanEnd = event => {
        console.log('Panend');

        if (Math.abs(event.deltaX) >= this.threshold) {
            const direction = event.offsetDirection === 4 ? 'right' : 'left';
            const currentCard = this.cards[this.activeIndex];
            console.log(`Slidechange happened in direction: ${direction}`);

            this.lockSlider();

            if (direction === 'left' && this.cards[this.activeIndex + 1]) {
                gsap.to(currentCard, {
                    autoAlpha: 0,
                    duration: 0.3,
                    scale: 0
                });

                this.cardPositions.forEach(cardPosition => {
                    if (cardPosition.cardIndex <= this.activeIndex) {
                        cardPosition.card.classList.remove('active');

                        return;
                    } else if (cardPosition.cardIndex === this.activeIndex + 1) {
                        const newTransform = cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier - this.marginRight;
                        cardPosition.card.classList.add('active');
                        gsap.to(cardPosition.card, {
                            duration: 0.3,
                            x: newTransform,
                            width: this.initialCardWidth * this.scaleMultiplier,
                            onComplete: () => {
                                cardPosition.xTransform = newTransform;
                            }
                        });
                    } else {
                        const newTransform = cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier - this.marginRight;
                        cardPosition.card.classList.remove('active');
                        gsap.to(cardPosition.card, {
                            duration: 0.3,
                            x: newTransform,
                            onComplete: () => {
                                cardPosition.xTransform = newTransform;
                            }
                        });
                    }
                });

                this.activeIndex = this.activeIndex + 1;

                this.unlockSlider();

                this.setAutoplay(this.activeIndex);

                return;
            }

            if (direction === 'right' && this.cards[this.activeIndex - 1]) {
                this.cardPositions.forEach(cardPosition => {
                    if (cardPosition.cardIndex < this.activeIndex - 1) {
                        return;
                    } else if (cardPosition.cardIndex === this.activeIndex - 1) {
                        cardPosition.card.classList.add('active');
                        gsap.to(cardPosition.card, {
                            autoAlpha: 1,
                            duration: 0.3,
                            scale: 1
                        });
                    } else if (cardPosition.cardIndex === this.activeIndex) {
                        const newTransform = cardPosition.xTransform + this.initialCardWidth * this.scaleMultiplier + this.marginRight;
                        cardPosition.card.classList.remove('active');
                        gsap.to(cardPosition.card, {
                            duration: 0.3,
                            x: newTransform,
                            width: this.initialCardWidth,
                            onComplete: () => {
                                cardPosition.xTransform = newTransform;
                            }
                        });
                    } else {
                        const newTransform = cardPosition.xTransform + this.initialCardWidth * this.scaleMultiplier + this.marginRight;
                        cardPosition.card.classList.remove('active');
                        gsap.to(cardPosition.card, {
                            duration: 0.3,
                            x: newTransform,
                            onComplete: () => {
                                cardPosition.xTransform = newTransform;
                            }
                        });
                    }
                });
                this.activeIndex = this.activeIndex - 1;

                this.unlockSlider();

                this.setAutoplay(this.activeIndex);

                return;
            } else {
                this.cardPositions.forEach(cardPosition => {
                    gsap.to(cardPosition.card, {
                        duration: 0.3,
                        x: cardPosition.xTransform
                    });
                });

                this.unlockSlider();
            }
        } else {
            console.log('Slidechange not happened, returning slider to initial position');
            this.cardPositions.forEach(cardPosition => {
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: cardPosition.xTransform
                });
            });

            this.unlockSlider();
        }

        setTimeout(() => {
            this.filterClicks = false;
        }, this.filterClicksDelay);
    };

    resizeHandler = () => {
        this.cards.forEach(card => {
            gsap.set(card, {
                clearProps: 'all'
            });
        });
        this.activeIndex = 0;
        this.initialCardWidth = this.calculateInitialCardWidth();
        this.threshold = this.initialCardWidth * 0.9;
        this.unlockSlider();
        this.marginRight = this.calculateMargin();
        this.cardPositions = this.calculateCardPositions();

        this.initialSetup();

        this.setAutoplay(this.activeIndex);
        console.log('Debounced resize handler');
    };

    preventPhantomClicks = event => {
        if (event.target.matches('a') || event.target.closest('a')) {
            if (this.filterClicks) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };

    bindListeners = () => {
        console.log('Listeners bound');

        window.addEventListener('resize', debounce(this.resizeHandler, 200));

        this.touchContainer.on('panstart', this.handlePanStart);
        this.touchContainer.on('panmove', this.handlePanMove);
        this.touchContainer.on('panend', this.handlePanEnd);

        this.cards.forEach((card, cardIndex) => {
            card.addEventListener('click', event => {
                event.preventDefault();
                this.goToSlide(cardIndex);
            })
        })

        this.cardsContainer.addEventListener('click', this.preventPhantomClicks);
    };
}
