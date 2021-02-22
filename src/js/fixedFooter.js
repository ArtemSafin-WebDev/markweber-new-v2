import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FixedFooter() {
    const pageFooter = document.querySelector('.page-footer');
    const contactUs = document.querySelector('.contact-us');
    const pageFooterWrapper = document.querySelector('.page-footer__wrapper')
    if (!pageFooter || !contactUs) return;


    

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: contactUs,
            start: 'bottom bottom',
            
            end: () => `+=${pageFooter.offsetHeight}`,
           
            scrub: true,
            markers: false
          
        }
    });

    tl.fromTo(pageFooter, {
        yPercent: -100
       
    }, {
        yPercent: 0
    });
    


  
}