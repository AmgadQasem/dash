// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    
    // Form Submission Handling (Demo)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.querySelector('button[type="button"]')?.addEventListener('click', function(e) {
            // Note: Validating explicitly on click for this demo pattern
             const inputs = form.querySelectorAll('input');
             let valid = true;
             inputs.forEach(input => {
                 if(input.type !== 'checkbox' && !input.value.trim()) {
                     valid = false;
                     input.classList.add('is-invalid');
                 } else {
                     input.classList.remove('is-invalid');
                 }
             });
 
             if(valid) {
                 const btn = this; // The button clicked
                 const originalText = btn.innerHTML;
                 
                 // Loading state
                 btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري المعالجة...';
                 btn.disabled = true;
 
                 setTimeout(() => {
                     btn.innerHTML = '<i class="fa-solid fa-check"></i> تم بنجاح';
                     btn.classList.remove('btn-main');
                     btn.classList.add('btn-success');
                     
                     setTimeout(() => {
                         // Reset
                         btn.innerHTML = originalText;
                         btn.disabled = false;
                         btn.classList.add('btn-main');
                         btn.classList.remove('btn-success');
                         form.reset();
                     }, 2000);
                 }, 1500);
             }
        });
    });

    // Language Switcher Toggle (Visual Only)
    const langSwitch = document.querySelector('.lang-switch');
    if(langSwitch) {
        langSwitch.addEventListener('click', function() {
            console.log('Language switch clicked');
        });
    }

    // Toggle Password Visibility
    const togglePassword = document.querySelectorAll('#togglePassword');
    togglePassword.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
            }
        });
    });

    // User Type Toggle Logic
    const btnMarketer = document.getElementById('btn-marketer');
    const btnMerchant = document.getElementById('btn-merchant');

    if(btnMarketer && btnMerchant) {
        btnMarketer.addEventListener('click', () => {
            btnMarketer.classList.add('active');
            btnMerchant.classList.remove('active');
        });
        btnMerchant.addEventListener('click', () => {
            btnMerchant.classList.add('active');
            btnMarketer.classList.remove('active');
        });
    }


});

// Update Country Code
function updateCountry(code, dialCode) {
    const selectedFlag = document.querySelector('#selectedFlag');
    const selectedCode = document.querySelector('#selectedCode');
    
    if(selectedFlag && selectedCode) {
        selectedFlag.src = `https://flagcdn.com/w20/${code}.png`;
        selectedCode.textContent = dialCode;
    }
}

// Platform Toggle Logic
const platformToggles = document.querySelectorAll('.toggle-custom');
platformToggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
        const container = this.closest('.platform-item').querySelector('.platform-input-container');
        if(this.checked) {
            container.classList.add('show');
        } else {
            container.classList.remove('show');
        }
    });
});

// Interest Chip Logic
const interestChips = document.querySelectorAll('.interest-chip');
interestChips.forEach(chip => {
    chip.addEventListener('click', function() {
        this.classList.toggle('active');
        if(this.classList.contains('active')) {
             // Add checkmark if needed, or just style change
             if(!this.querySelector('.fa-xmark')) {
                 this.innerHTML += ' <i class="fa-solid fa-xmark ms-2 small text-muted"></i>';
             }
        } else {
            // Remove checkmark
            const icon = this.querySelector('i');
            if(icon) icon.remove();
        }
    });
});

// Other Platform Toggle
const btnOtherPlatform = document.getElementById('btn-other-platform');
const formOtherPlatform = document.getElementById('form-other-platform');
const closeOtherPlatform = document.getElementById('close-other-platform');

if(btnOtherPlatform && formOtherPlatform) {
    btnOtherPlatform.addEventListener('click', () => {
        btnOtherPlatform.classList.add('d-none');
        formOtherPlatform.classList.remove('d-none');
    });

    if(closeOtherPlatform) {
        closeOtherPlatform.addEventListener('click', () => {
             formOtherPlatform.classList.add('d-none');
             btnOtherPlatform.classList.remove('d-none');
        });
    }
}
