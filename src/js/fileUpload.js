export default function FileUpload() {
    const elements = Array.from(document.querySelectorAll('.js-file-upload'));

    elements.forEach(element => {
        const input = element.querySelector('input[type="file"]');
        const label = element.querySelector('.js-file-upload-text');
        const form = element.closest('form');
        const originalLabelText = label.textContent;
        // const labelOriginalText = label.textContent;

        input.addEventListener('change', () => {
            if (input.files.length) {
                label.textContent = input.files[0].name;
            }
        });

        if (form) {
            form.addEventListener('reset', () => {
                input.value = '';
                label.innerHTML = originalLabelText;
                element.classList.remove('file-loaded');
            })
        }
    });
}