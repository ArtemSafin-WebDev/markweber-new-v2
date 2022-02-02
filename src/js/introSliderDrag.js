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

        function makeImageDrag() {
            let mouseEnterTuple = null;
            let mouseLeaveTuple = null;
            let mouseMoveTuple = null;
            function initializeImageDrag() {
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

                    // window.addEventListener(
                    //     'resize',
                    //     debounce(() => {
                    //         setImagePosition();
                    //     }),
                    //     300
                    // );

                    const handleMouseEnter = () => {
                        hovered = true;
                    };

                    const handleMouseLeave = () => {
                        hovered = false;

                        gsap.to(image, {
                            x: 0,
                            y: 0,

                            duration: 0.3,
                            overwrite: true
                        });
                    };

                    const handleMouseMove = e => {
                        if (hovered) {
                            const x = e.pageX;
                            const y = e.pageY;

                            const xOffset = x - imageLeft - image.offsetWidth / 2;
                            const yOffset = y - imageTop - image.offsetHeight / 2;

                            gsap.to(image, {
                                x: xOffset * 0.15,
                                y: yOffset * 0.15,

                                duration: 0.3,
                                overwrite: true
                            });
                        }
                    };

                    hoverArea.addEventListener('mouseenter', handleMouseEnter);
                    hoverArea.addEventListener('mouseleave', handleMouseLeave);

                    element.addEventListener('mousemove', handleMouseMove);

                    mouseEnterTuple = [hoverArea, handleMouseEnter];
                    mouseLeaveTuple = [hoverArea, handleMouseLeave];
                    mouseMoveTuple = [element, handleMouseMove];
                });
            }

            function destroyImageDrag() {
                if (mouseEnterTuple) {
                    mouseEnterTuple[0].removeEventListener('mouseenter', mouseEnterTuple[1]);
                }
                if (mouseEnterTuple) {
                    mouseLeaveTuple[0].removeEventListener('mouseleave', mouseLeaveTuple[1]);
                }
                if (mouseMoveTuple) {
                    mouseMoveTuple[0].addEventListener('mousemove', mouseMoveTuple[1]);
                }
            }

            return {
                initialize: initializeImageDrag,
                destroy: destroyImageDrag
            };
        }

        const imageDrag = makeImageDrag();

        let imgLoad = imagesLoaded(element);
        function onAlways(instance) {
            imageDrag.initialize();
        }
        imgLoad.on('always', onAlways);

        document.addEventListener('intro-slider-destroy', () => {
            imageDrag.destroy();
            setTimeout(() => {
                imageDrag.initialize();
            }, 100);
        });
    });
}
