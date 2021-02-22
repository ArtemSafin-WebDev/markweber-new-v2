import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash';

gsap.registerPlugin(ScrollTrigger);

export default function FixedFooter() {
    const pageFooter = document.querySelector('.page-footer');

    const pageFooterInner = document.querySelector('.page-footer__inner');
    if (!pageFooter) return;

    const setFixedFooter = () => {
        gsap.set(pageFooter, {
            height: pageFooter.offsetHeight
        });

        gsap.set(pageFooterInner, {
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'auto'
        });
    }

    if (!window.matchMedia('(max-width: 640px)').matches) {
     
        setFixedFooter();
        window.addEventListener('resize', debounce(() => {
            gsap.set(pageFooter, {
                clearProps: 'all'
            })
            gsap.set(pageFooterInner, {
                clearProps: 'all'
            })

            setFixedFooter();
        }, 300));
    }

    // ScrollTrigger.matchMedia({
    //     '(min-width: 1025px)': () => {
    //         const tl = gsap.timeline({
    //             scrollTrigger: {
    //                 trigger: contactUs,
    //                 start: 'bottom bottom',

    //                 end: () => `+=${pageFooter.offsetHeight}`,

    //                 scrub: true,
    //                 markers: false
    //             }
    //         });

    //         tl.fromTo(
    //             pageFooter,
    //             {
    //                 yPercent: -100
    //             },
    //             {
    //                 ease: 'none',
    //                 yPercent: 0
    //             }
    //         );
    //     }
    // });
}
