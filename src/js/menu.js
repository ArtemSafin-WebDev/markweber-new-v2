import { lockScroll, unlockScroll } from './scrollBlocker';
import gsap from 'gsap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default function Menu() {
    const menu = document.querySelector('.menu');

    const menuBg = document.querySelector('.menu__bg');
    const secondaryLinks = Array.from(document.querySelectorAll('.menu__secondary-nav-link'));
    const mainLinks = Array.from(document.querySelectorAll('.menu__main-nav-link'));
    const menuGrid = document.querySelector('.menu__grid');
    const contacts = document.querySelector('.menu__contacts');
    const brief = document.querySelector('.menu__brief');
    const menuContainer = menu.querySelector('.container');
    const menuInner = menu.querySelector('.menu__inner')

    if (!menu) return;

    let menuOpen = false;
    const openMenu = () => {
        if (menuOpen) return;

        document.body.classList.add('menu-open');

        // lockScroll(menu);
        disableBodyScroll(menuContainer, {
            reserveScrollBarGap: true
        });

        if (window.matchMedia('(max-width: 640px)').matches) {
            const tl = gsap.timeline();
            tl.to(menu, {
                autoAlpha: 1,
                duration: 0
            }).from(
                menuBg,
                {
                    scaleY: 0,
                    duration: 1,
                    ease: 'power3.out'
                },
                '>'
            ).from(menuInner, {
                autoAlpha: 0,
                duration: 0.3
            }, '<0.5')
        } else {
            const tl = gsap.timeline();

            tl.to(menu, {
                autoAlpha: 1,
                duration: 0
            })
                .from(
                    menuBg,
                    {
                        scaleY: 0,
                        duration: 1,
                        ease: 'power3.out'
                    },
                    '>'
                )
                .from(
                    secondaryLinks,
                    {
                        y: 60,
                        stagger: 0.1,
                        duration: 1
                    },
                    '<'
                )
                .from(
                    mainLinks,
                    {
                        y: 60,
                        stagger: 0.1,
                        duration: 1
                    },
                    '<'
                )
                .from(
                    contacts,
                    {
                        y: 60,
                        duration: 1
                    },
                    '<'
                )
                .from(
                    brief,
                    {
                        y: 60,
                        duration: 1
                    },
                    '<'
                )
                .from(
                    menuGrid,
                    {
                        autoAlpha: 0,
                        duration: 0.4
                    },
                    '<0.4'
                );
        }

        menuOpen = true;
    };
    const closeMenu = () => {
        if (!menuOpen) return;

        document.body.classList.remove('menu-open');

        // unlockScroll();
        enableBodyScroll(menuContainer);

        const tl = gsap.timeline();
        tl.to(menu, {
            autoAlpha: 0,
            duration: 0.4
        });

        menuOpen = false;
    };

    document.addEventListener('click', event => {
        if (event.target.matches('.page-header__button') || event.target.closest('.page-header__button')) {
            if (!menuOpen) {
                openMenu();
            } else {
                closeMenu();
            }
        }
    });
}
