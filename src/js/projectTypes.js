import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function projectTypes() {
    const competencies = Array.from(document.querySelectorAll('.js-project-types-competencies'));

    competencies.forEach(element => {
        const cards = Array.from(element.querySelectorAll('.project-types__competencies-card'));
        const wrapper = element.querySelector('.project-types__competencies-wrapper');
        const cursorLayers = Array.from(element.querySelectorAll('.project-types__competencies-cursor-layer'));
        const cursor = element.querySelector('.project-types__competencies-cursor');

        let activeIndex = null;

        wrapper.addEventListener('mouseenter', () => {
            wrapper.classList.add('cursor-shown');
            gsap.to(cursor, {
                scale: 1,
                duration: 0.2,
                autoAlpha: 1
            });
        });

        wrapper.addEventListener('mouseleave', () => {
            wrapper.classList.remove('cursor-shown');

            gsap.to(cursor, {
                scale: 0,
                duration: 0.2,
                autoAlpha: 0
            });

            activeIndex = null;
        });

       

        cards.forEach((card, cardIndex) => {
            card.addEventListener('mouseenter', () => {
                cards.forEach(card => card.classList.remove('active'));
                card.classList.add('active');
                cursorLayers.forEach(layer => layer.classList.remove('active'));
                cursorLayers[cardIndex]?.classList.add('active');
                console.log('cardOffsetTop', card.offsetTop);

                if (activeIndex === null) {
                    // gsap.fromTo(cursorLayers[cardIndex], {
                    //    xPercent: -100
                    // }, {
                    //     xPercent: 0,
                    //     duration: 0.4
                    // })
                } else {
                    const tl = gsap.timeline();

                    tl.fromTo(
                        cursorLayers[cardIndex],
                        {
                            xPercent: -100
                        },
                        {
                            xPercent: 0,
                            duration: 0.4
                        }
                    );
                }

                activeIndex = cardIndex;

                gsap.to(cursor, {
                    y: () => card.offsetTop + card.offsetHeight / 2,
                    duration: 0.4,
                    yPercent: -50
                });
            });

            card.addEventListener('mouseleave', () => {
                cards.forEach(card => card.classList.remove('active'));
            });
        });
    });
}
