import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);


export default function FixedContactsSidebar() {
    ScrollTrigger.matchMedia({
        '(min-width: 641px)': () => {
            ScrollTrigger.create({
                trigger: '.contact__sidebar',
                start: 'top-=100px top',
                endTrigger: '.contact',
                end: 'bottom bottom',
                pin: true,
                pinSpacing: true
            });
        }
    });
}