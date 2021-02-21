import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CasesFiltering() {
    const elements = Array.from(document.querySelectorAll('.js-cases'));

    elements.forEach(element => {
        const links = Array.from(element.querySelectorAll('.cases__top-navigation-link'));
        const cards = Array.from(element.querySelectorAll('.cases__image-grid-card')).map(item => item.cloneNode(true));
        const grid = element.querySelector('.cases__image-grid');


        const isAnimating = () => {
            const currentCards = Array.from(grid.children);
            const animatingCard = currentCards.find(card => gsap.isTweening(card));

            if (animatingCard) {
                console.log('Tweening card', animatingCard)
                return true;
            } else {
                return false;
            }
        }

        const setFilter = link => {
            if (link.classList.contains('active') || isAnimating()) return;
            
            let filteredCards = [];
            if (link.hasAttribute('data-all-categories')) {
                filteredCards = cards.map(card => card.cloneNode(true));
            } else if (link.hasAttribute('data-category')) {
                filteredCards = cards.filter(card => card.getAttribute('data-category') === link.getAttribute('data-category'));
            } else {
                console.error('Items not sorted');
                return;
            }

           

            links.forEach(link => link.classList.remove('active'));
            link.classList.add('active');

            // grid.innerHTML = '';
            // grid.append(...filteredCards);


            const currentCards = Array.from(grid.children);
            console.log('Current cards', currentCards);

            let indexesToRemove = [];

            currentCards.forEach((currentCard, cardIndex) => {
                gsap.to(currentCard, {
                    duration: 0.5,
                    '--clip': '100%',
                    onComplete: () => {
                        if (filteredCards[cardIndex]) {
                            const newCard = filteredCards[cardIndex];

                            gsap.set(newCard, {
                                '--clip': '100%'
                            })
                            
                            indexesToRemove.push(cardIndex);
                            currentCard.parentElement.replaceChild(newCard, currentCard);

                            gsap.fromTo(newCard, {
                                '--clip': '100%'
                            }, {
                                '--clip': '0%',
                                duration: 0.5,
                               
                            })

                            ScrollTrigger.refresh();
                        } else {
                            currentCard.remove();
                            ScrollTrigger.refresh();
                        }
                       
                    }
                })
            });

            // Убираем из массива карточки, которые были заменены

            indexesToRemove.forEach(index => {
                filteredCards.splice(index, 1)
            });

            // Добавляем остатки, которыми не были заменены существующие карточки
            // filteredCards.forEach(card => {
            //     gsap.set(card, {
            //         '--clip': '100%'
            //     })
            //     grid.appendChild(card);

            //     gsap.fromTo(card, {
            //         '--clip': '100%'
            //     }, {
            //         '--clip': '0%',
            //         duration: 0.5,
            //     })

            //     ScrollTrigger.refresh();
            // })

            console.log('Remainder', filteredCards)

           

        };

        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                setFilter(link);
            });
        });

        if (links.length) {
            setFilter(links[0]);
        } else {
            console.warn('No links');
            return;
        }
    });
}
