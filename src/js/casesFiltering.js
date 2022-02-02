import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CasesFiltering() {
    const elements = Array.from(document.querySelectorAll('.js-cases'));

    elements.forEach(element => {
        const options = {
            threshold: [0, 0.5, 1]
        };
        const callback = function(entries, observer) {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.35) {
                    entry.target.classList.add('revealed');
                }

                console.log('Intersection ratio', entry.intersectionRatio);
            });
        };
        const observer = new IntersectionObserver(callback, options);

        const cards = Array.from(element.querySelectorAll('.cases__image-grid-card'));
        const cardsContainer = element.querySelector('.cases__image-grid');

        const clonedCards = cards.map(card => card.cloneNode(true));

        console.log(
            'Cloned cards images',
            clonedCards.map(card => card.querySelector('img'))
        );
        cards.forEach(card => {
            observer.observe(card);
        });

        const filterBtns = Array.from(document.querySelectorAll('.cases__top-navigation-link'));

        let timer = null;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();

             
                if (btn.classList.contains('active')) return;
                filterBtns.forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');

                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                const category = btn.getAttribute('data-category');

                const currentCards = Array.from(cardsContainer.querySelectorAll('.cases__image-grid-card'));
                currentCards.forEach(card => {
                    card.classList.add('hide');
                });

                timer = setTimeout(() => {
                    let filteredCards = [];
                    if (!category) {
                        filteredCards = clonedCards.map(card => card.cloneNode(true));
                    } else {
                        filteredCards = clonedCards.map(card => card.cloneNode(true)).filter(card => card.matches(`[data-category="${category}"]`));
                    }
                    cardsContainer.innerHTML = '';
                    cardsContainer.append(...filteredCards);
                    ScrollTrigger.refresh();
                }, 350);
            });
        });

        if (filterBtns.length) {
            filterBtns[0].click();
        }

        const config = {
            attributes: false,
            childList: true,
            subtree: false
        };

        // Колбэк-функция при срабатывании мутации
        const mutationCallback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const newCards = cardsContainer.querySelectorAll('.cases__image-grid-card');
                    requestAnimationFrame(() => {
                        newCards.forEach(item => item.classList.add('revealed'));
                    });
                }
            }
        };

        // Создаём экземпляр наблюдателя с указанной функцией колбэка
        const mutationObserver = new MutationObserver(mutationCallback);

        // Начинаем наблюдение за настроенными изменениями целевого элемента
        mutationObserver.observe(cardsContainer, config);
    });
}
