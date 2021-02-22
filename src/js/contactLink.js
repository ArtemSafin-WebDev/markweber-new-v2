export default function ContactLink() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 40) {
            document.body.classList.add('contact-link-expanded')
        } else {
            document.body.classList.remove('contact-link-expanded')
        }
    })
}