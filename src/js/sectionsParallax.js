import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionsParallax() {
    const intro = document.querySelector('.intro');

   

    if (intro) {
        ScrollTrigger.matchMedia({
            '(min-width: 1367px)': () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: intro,
                        start: 'bottom bottom',
                        end: () => `+=${intro.offsetHeight}`,
                        pin: true,
                        pinSpacing: false,
                        scrub: true
                    }
                });

                tl.to(intro, {
                    yPercent: -70,
                    ease: 'none'
                });
            }
        });
    }
}
