// Header Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Countdown Timer
const countdown = () => {
    // Set a date 3 days from now for demonstration
    const countDate = new Date();
    countDate.setDate(countDate.getDate() + 3);

    // Or hardcode a launch date
    // const countDate = new Date("Jan 1, 2024 00:00:00").getTime();

    const now = new Date().getTime();
    const gap = countDate - now;

    // Time calculations
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Calculate display values
    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    // Update DOM
    if (document.querySelector('.timer')) {
        document.getElementById('days').innerText = textDay < 10 ? '0' + textDay : textDay;
        document.getElementById('hours').innerText = textHour < 10 ? '0' + textHour : textHour;
        document.getElementById('minutes').innerText = textMinute < 10 ? '0' + textMinute : textMinute;
        document.getElementById('seconds').innerText = textSecond < 10 ? '0' + textSecond : textSecond;
    }
};

setInterval(countdown, 1000);

// Product Image Floating Parallax (Optional smooth effect following mouse)
document.addEventListener('mousemove', (e) => {
    const watchWrapper = document.querySelector('.image-wrapper');
    if (watchWrapper) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        watchWrapper.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
});

// Form Submission
const form = document.getElementById('leadForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        // Collect Form Data
        const product = document.getElementById('product').value;
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const date = new Date().toLocaleString();

        btn.innerText = 'جاري المعالجة...';
        btn.style.opacity = '0.7';

        // Simulate Network Delay
        setTimeout(() => {
            // 1. Send directly to Google Sheets
            const maskDate = new Date().toLocaleString();
            /* CSV Download removed as per request */

            // 2. Send to Google Sheets
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzW-a6L5-L8NeTTiTz7AGIRb39s3qY5lovM5eoWa5EnCtsYsak5aaCYVnODfL6kl877pQ/exec';


            // إعداد البيانات للإرسال
            const formData = new FormData();
            formData.append('Product', product);
            formData.append('Name', name);
            formData.append('Address', address);
            formData.append('Phone', phone);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    // 3. Success UI
                    btn.innerText = 'تم تسجيل طلبك بنجاح!';
                    btn.style.background = '#10b981'; // Success Green
                    btn.style.opacity = '1';

                    // Styled Alert
                    showAlert("شكراً لك! تم استلام طلبك وتسجيله بنجاح.", "success");
                    form.reset();

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = '';
                    }, 4000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    btn.innerText = 'حدث خطأ!';
                    btn.style.background = 'red';

                    // Styled Alert
                    showAlert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو الاتصال بنا.", "error");
                });
        }, 1500);
    });
}

// Custom Alert Helper
function showAlert(message, type) {
    // Create container if not exists
    let container = document.querySelector('.custom-alert-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'custom-alert-container';
        document.body.appendChild(container);
    }

    // Create alert element
    const alertEl = document.createElement('div');
    alertEl.className = `custom-alert ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    alertEl.innerHTML = `
        <div class="custom-alert-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="custom-alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(alertEl);

    // Remove after 5 seconds
    setTimeout(() => {
        alertEl.style.animation = 'fadeOutUp 0.5s forwards';
        alertEl.addEventListener('animationend', () => {
            alertEl.remove();
        });
    }, 5000);
}

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.feature-card, .showcase-image, .showcase-text');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
};

// Add initial styles for reveal
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.6s ease-out";
});


window.addEventListener('scroll', revealOnScroll);

// Select Product Helper
function selectProduct(type) {
    const select = document.getElementById('product');
    const formSection = document.getElementById('contact');

    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth' });

    // Select logic
    if (type === 'typeA') {
        select.value = "Basic - 2 Packs - 189 SAR"; // Best value
    } else if (type === 'typeA2') {
        select.value = "Basic2 - 2 Packs - 189 SAR"; // Best value
    } else if (type === 'typeImg5') {
        select.value = "Special - 2 Packs - 170 SAR";
    } else if (type === 'typeImg6') {
        select.value = "Diamond - 2 Packs - 190 SAR";
    } else if (type === 'typeB') {
        select.value = "Advanced - 2 Packs - 175 SAR";
    } else if (type === 'typeC') {
        select.value = "Premium - 2 Packs - 175 SAR";
    }

    // Highlight effect
    select.style.borderColor = '#0284c7';
    setTimeout(() => {
        select.style.borderColor = '';
    }, 2000);
}
