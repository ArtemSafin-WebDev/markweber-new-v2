import gsap from 'gsap';
import detectIt from 'detect-it';
import imagesLoaded from 'imagesloaded';
import { debounce } from 'lodash';

export default function introSliderDrag() {
    if (detectIt.hasTouch) return;

    const elements = Array.from(document.querySelectorAll('.js-intro-slider'));

    elements.forEach(element => {
        const cursor = element.querySelector('.intro__cursor');

        element.addEventListener('mousemove', e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = parseInt(e.clientX - rect.left, 10);
            const offsetY = parseInt(e.clientY - rect.top, 10);

            gsap.to(cursor, {
                duration: 0.2,
                left: offsetX,
                top: offsetY,
                overwrite: true
            });
        });
        let imgLoad = imagesLoaded(element);
        function onAlways(instance) {
            const imageWrappers = Array.from(document.querySelectorAll('.intro__slider-image-wrapper'));

            imageWrappers.forEach(wrapper => {
                let hovered = false;
                const image = wrapper.querySelector('.intro__slider-image');
                const hoverArea = wrapper.querySelector('.intro__slider-image-hover-area');

                let imageTop = 0;
                let imageLeft = 0;

                const setImagePosition = () => {

                    const blockLeft = element.getBoundingClientRect().left;
                    const blockTop = element.getBoundingClientRect().top + window.pageYOffset;

                    const imageInsideTop = image.getBoundingClientRect().top + window.pageYOffset;
                    const imageInsideLeft = image.getBoundingClientRect().left;

                    imageTop = imageInsideTop - blockTop;
                    imageLeft = imageInsideLeft - blockLeft;

                    console.log('Image top', imageTop), console.log('Image left', imageLeft);
                };

                setImagePosition();

                window.addEventListener(
                    'resize',
                    debounce(() => {
                        setImagePosition();
                    }),
                    300
                );
                hoverArea.addEventListener('mouseenter', () => {
                    hovered = true;
                });
                hoverArea.addEventListener('mouseleave', () => {
                    hovered = false;

                    gsap.to(image, {
                        x: 0,
                        y: 0,

                        duration: 0.3,
                        overwrite: true
                    });
                });

                element.addEventListener('mousemove', e => {
                    if (hovered) {
                        const x = e.pageX;
                        const y = e.pageY;

                        const xOffset = x - imageLeft - image.offsetWidth / 2;
                        const yOffset = y - imageTop - image.offsetHeight / 2;

                        gsap.to(image, {
                            x: xOffset * 0.3,
                            y: yOffset * 0.3,

                            duration: 0.3,
                            overwrite: true
                        });
                    }
                });
            });
        }

        imgLoad.on('always', onAlways);
    });
}
