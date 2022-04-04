import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function caseIntro() {
    const elements = Array.from(document.querySelectorAll('.js-case-intro'));

    elements.forEach(element => {
        ScrollTrigger.matchMedia({
            '(min-width: 1367px)': () => {
                const background = element.querySelector('.case-intro__bg-parallax-wrapper');
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: element,
                        start: 'top top',
                        end: 'bottom top',
                     
                        scrub: true
                    }
                });

                tl.to(background, {
                    yPercent: 30,
                    ease: 'none',
                    duration: 0.7
                });
            }
        });
    });
}
