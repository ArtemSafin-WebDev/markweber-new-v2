export default function HeaderHovers() {
    const addHoverToElement = selector => {
        document.addEventListener('mouseover', event => {
            const { target } = event;

            if (target.matches(selector) || event.target.closest(selector)) {
                const btns = Array.from(document.querySelectorAll(selector));
                btns.forEach(btn => {
                    btn.classList.add('hovered');
                });
            }
        });

        document.addEventListener('mouseout', event => {
            const { target } = event;

            if (target.matches(selector) || event.target.closest(selector)) {
                const btns = Array.from(document.querySelectorAll(selector));
                btns.forEach(btn => {
                    btn.classList.remove('hovered');
                });
            }
        });
    };

    const selectors = ['.page-header__button'];

    selectors.forEach(selector => {
        addHoverToElement(selector)
    })
}
