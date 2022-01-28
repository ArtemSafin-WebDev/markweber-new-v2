import gsap from 'gsap';

export default function introSliderDrag() {
    const elements = Array.from(document.querySelectorAll('.js-intro-slider'));

    elements.forEach(element => {
        const cursor = element.querySelector('.intro__cursor');

        element.addEventListener('mousemove', e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = parseInt(e.clientX - rect.left, 10);
            const offsetY = parseInt(e.clientY - rect.top, 10);
            // console.log({
            //     left: offsetX,
            //     top: offsetY,
            //     target: e.currentTarget
            // });
            gsap.to(cursor, {
                duration: 0.2,
                left: offsetX,
                top: offsetY,
                overwrite: true
            });
        });
    });
}
