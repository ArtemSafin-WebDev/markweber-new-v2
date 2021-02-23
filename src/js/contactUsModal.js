import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import gsap from 'gsap';


export default function ContactUsModal() {
    const contactUsModal = document.querySelector('.js-contact-us-modal');

    if (!contactUsModal) return;

    let currentLayerIndex = 0;
    const layers = Array.from(contactUsModal.querySelectorAll('.contacts-us__layer'));
    const contactUsForm = contactUsModal.querySelector('.contact-us__form');
    const contactUsCheckboxes = Array.from(contactUsModal.querySelectorAll('.contact-us__checkbox-input'));
    const closeBtn = document.querySelector('.contact-us__close-btn');
    const orbWrapper = document.querySelector('.contact-us__orb-wrapper')

    const setLayer = index => {
      
        const nextLayer = layers[index];
        const currentLayer = layers[currentLayerIndex];
        if (!nextLayer) {
            contactUsForm.submit();
            return;
        }



        currentLayer.classList.remove('active');
        nextLayer.classList.add('active')

      
       
        currentLayerIndex = index;
    }

    setLayer(0)

    const OFFSET = window.matchMedia(`(max-width: 640px)`).matches ? 50 : 100;

    const openModal = () => {
        return gsap.to(window, { duration: 0.3, scrollTo: {y: contactUsModal, offsetY: OFFSET}, onComplete: () => {
            gsap.set(contactUsModal, {
                position: 'fixed',
                left: 0,
                width: '100%',
                zIndex: 2000,
                top: contactUsModal.getBoundingClientRect().top
            });
    
         
    
            disableBodyScroll(contactUsModal, {
                reserveScrollBarGap: true
            });
            gsap.to(closeBtn, {
                autoAlpha: 1,
                duration: 0.3,
                delay: 0.3
            })

            return gsap.to(contactUsModal, {
                top: 0,
                paddingTop: contactUsModal.getBoundingClientRect().top + parseFloat(window.getComputedStyle(contactUsModal).paddingTop),
                bottom: 0,
                duration: 0.6
            });
        } });
    };

    const closeModal = () => {
        gsap.set(contactUsModal, {
            clearProps: 'all'
        })
        gsap.to(closeBtn, {
            autoAlpha: 0,
            duration: 0.3
        })

    

        setLayer(0);
        contactUsForm.reset();
        enableBodyScroll(contactUsModal);
    }

    contactUsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (layers.length < 2) {
                contactUsForm.submit();
                return;
            }

            if (currentLayerIndex === 0) {
                openModal().then(() => {
                    setLayer(currentLayerIndex + 1)
                })
            } else {
                setLayer(currentLayerIndex + 1)
            }
        })
    })


    closeBtn.addEventListener('click', event => {
        event.preventDefault();
        closeModal();
    })

 
}
