import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

export default function projectTypeTabs() {
    const elements = Array.from(document.querySelectorAll('.js-project-type-tabs'));

    elements.forEach(element => {
        const btns = Array.from(element.querySelectorAll('.js-tabs-btn'));
        const items = Array.from(element.querySelectorAll('.js-tabs-item'));

        let activeTabIndex = null;

        const setActiveTab = index => {
            const state = Flip.getState(items[0].parentElement);
            btns.forEach(btn => btn.classList.remove('active'));
            items.forEach(item => item.classList.remove('active'));

            btns[index].classList.add('active');
            items[index].classList.add('active');

            if (activeTabIndex === null) {
                gsap.to(items[index], {
                    autoAlpha: 1,
                    duration: 0.6
                });
            } else {
                const activeTabitems = Array.from(items[activeTabIndex].querySelectorAll('.project-types__stack-projects-link'));
                const nextTabItems = Array.from(items[index].querySelectorAll('.project-types__stack-projects-link'));

                const tl = gsap.timeline();
                tl.fromTo(
                    activeTabitems,
                    { yPercent: 0 },
                    {
                        yPercent: 100,
                        duration: 0.6
                    }
                )
                    .to(
                        items[activeTabIndex],
                        {
                            autoAlpha: 0,
                            duration: 0.6
                        },
                        '<'
                    )
                    .to(items[index], {
                        autoAlpha: 1,
                        duration: 0.6
                    }, '<')
                    .fromTo(
                        nextTabItems,
                        { yPercent: 100 },
                        {
                            yPercent: 0,
                            duration: 0.6
                        }
                    );
            }

            activeTabIndex = index;

            Flip.from(state, {
                ease: 'power1.inOut',
                duration: 0.4,
                onComplete: () => {
                    ScrollTrigger.refresh();
                }
            });
        };

        if (items.length) {
            setActiveTab(0);
        }

        btns.forEach((btn, btnIndex) => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                setActiveTab(btnIndex);
            });
        });
    });
}
