import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function blocksReveal2() {
    const blocks = Array.from(document.querySelectorAll('.js-block-to-reveal-2'));

    blocks.forEach(block => {
        ScrollTrigger.create({
            trigger: block,
            start: 'top+=20% bottom',
            onToggle: self => block.classList.add('revealed')
        });
    });
}
