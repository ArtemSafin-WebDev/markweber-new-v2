
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MobileContactLink() {
    if (!window.matchMedia(`(max-width: 640px)`).matches) return;

    const mobileContactLink = document.querySelector('.page-header__contact-link');

    if (!mobileContactLink) return;

    let documentHeight = document.body.scrollHeight;

    const checkMobileButton = () => {
        if (documentHeight - 40 <= window.pageYOffset + window.innerHeight) {
            mobileContactLink.classList.add('scrolled-to-the-bottom');
        } else {
            mobileContactLink.classList.remove('scrolled-to-the-bottom');
        }
    };

    window.addEventListener('scroll', () => {
        checkMobileButton();
    });

    window.addEventListener('resize', () => {
        documentHeight = document.body.scrollHeight;
        checkMobileButton();
    });

    ScrollTrigger.addEventListener('refresh', function() {
        documentHeight = document.body.scrollHeight;
        checkMobileButton();
    });
}
