document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('#contact-form');
    if (form) {
        var formLayer = document.querySelector('.contact__form-layer');
        var successLayer = document.querySelector('.contact__success-layer');
        var backLink = document.querySelector('.contact__success-back-link');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if ($(form).parsley().isValid()) {
                formLayer.classList.remove('active');
                successLayer.classList.add('active');
                if (window.refreshScroll) {
                    window.refreshScroll();
                }
            }
        });

        backLink.addEventListener('click', function(event) {
            event.preventDefault();
            formLayer.classList.add('active');
            successLayer.classList.remove('active');
            form.reset();
            $(form).parsley().reset();
            if (window.refreshScroll) {
                window.refreshScroll();
            }
        })
    }
})