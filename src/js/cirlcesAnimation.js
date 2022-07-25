import { gsap } from 'gsap';
import { DrawSVGPlugin } from './vendor/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

export default function circlesAnimation() {
    const elements = Array.from(document.querySelectorAll('.about-numbers__circle'));

    elements.forEach(element => {
        const circle = element.querySelector('circle');
        const tl = gsap.timeline({
            scrollTrigger: element,
            start: () => `top+=${30} bottom`
        });

        tl.fromTo(
            circle,
            { drawSVG: '0% 0%' },
            {
                duration: 2,
                drawSVG: '0% 100%'
                // ease: 'none'
            }
        );
    });
}
