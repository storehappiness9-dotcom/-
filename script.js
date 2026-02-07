// Header Scroll Effect
const navbar = document.querySelector('.navbar');

// WhatsApp Floating Button
const whatsappBtn = document.getElementById('whatsappBtn');

// Mobile Navigation
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');

// Create backdrop element
const backdrop = document.createElement('div');
backdrop.className = 'mobile-nav-backdrop';
document.body.appendChild(backdrop);

// Open mobile menu
function openMobileNav() {
    mobileNavOverlay.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close mobile menu
function closeMobileNav() {
    mobileNavOverlay.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for mobile nav
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileNav);
}

if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
}

backdrop.addEventListener('click', closeMobileNav);

// Close on link click
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
        closeMobileNav();
    }
});

window.addEventListener('scroll', () => {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // WhatsApp button visibility on scroll
    if (whatsappBtn) {
        if (window.scrollY > 300) {
            whatsappBtn.classList.add('visible');
        } else {
            whatsappBtn.classList.remove('visible');
        }
    }
});

// Countdown Timer
const countdown = () => {
    // Set a date 3 days from now for demonstration
    const countDate = new Date();
    countDate.setDate(countDate.getDate() + 3);

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

// Product Image Floating Parallax
document.addEventListener('mousemove', (e) => {
    const watchWrapper = document.querySelector('.image-wrapper');
    if (watchWrapper) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        watchWrapper.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
});

// ============================================
// CART SYSTEM
// ============================================

// Cart State
let cart = [];
let isSubmitting = false;

// Cart Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');
const cartForm = document.getElementById('cartForm');
const totalPriceEl = document.getElementById('totalPrice');
const orderForm = document.getElementById('orderForm');

// Open Cart
function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Cart
function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close cart on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('active')) {
        closeCart();
    }
});

// Add to Cart
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.dataset.product;
    const productImage = productCard.dataset.image;

    // Get selected quantity
    const selectedRadio = productCard.querySelector('input[type="radio"]:checked');

    if (!selectedRadio) {
        showAlert('يرجى اختيار عدد العبوات أولاً!', 'error');
        return;
    }

    const quantity = parseInt(selectedRadio.value);
    const price = parseInt(selectedRadio.dataset.price);

    // Add to cart array
    cart.push({
        name: productName,
        image: productImage,
        quantity: quantity,
        price: price
    });

    // Update UI
    updateCartUI();

    // Show success feedback
    showAlert(`تمت إضافة ${productName} إلى السلة!`, 'success');

    // Reset selection
    selectedRadio.checked = false;

    // Open cart drawer
    openCart();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    // Update all badges
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = cart.length;

        // Optional: Animation trigger
        badge.classList.remove('pop');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('pop');
    });

    // Clear items container (keep empty state)
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    if (cart.length === 0) {
        // Show empty state
        cartEmpty.style.display = 'block';
        cartTotal.style.display = 'none';
        cartForm.style.display = 'none';
    } else {
        // Hide empty state
        cartEmpty.style.display = 'none';
        cartTotal.style.display = 'block';
        cartForm.style.display = 'block';

        // Render cart items
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;

            const qtyText = item.quantity === 1 ? 'عبوة واحدة' :
                item.quantity === 2 ? 'عبوتان' :
                    `${item.quantity} عبوات`;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">${qtyText}</div>
                    <div class="cart-item-price">${item.price} ريال</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        // Update total
        totalPriceEl.textContent = `${total} ريال`;
    }
}

// Order Form Submission
if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prevent double submission
        if (isSubmitting) return;

        // Validate cart
        if (cart.length === 0) {
            showAlert('السلة فارغة! أضف منتجات أولاً.', 'error');
            return;
        }

        // Get form data
        const name = document.getElementById('cartName').value.trim();
        const phone = document.getElementById('cartPhone').value.trim();
        const address = document.getElementById('cartAddress').value.trim();

        // Validate form
        if (!name || !phone || !address) {
            showAlert('يرجى ملء جميع البيانات!', 'error');
            return;
        }

        // Set submitting state
        isSubmitting = true;
        const btn = document.getElementById('confirmOrderBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
        btn.disabled = true;

        // Calculate total
        const total = cart.reduce((sum, item) => sum + item.price, 0);

        // Format products for submission
        const products = cart.map(item => {
            const qtyText = item.quantity === 1 ? '1 عبوة' :
                item.quantity === 2 ? '2 عبوات' :
                    `${item.quantity} عبوات`;
            return `${item.name} (${qtyText}) - ${item.price} ريال`;
        }).join(' | ');

        // Calculate delivery date (3 days from now)
        const orderDate = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(orderDate.getDate() + 3);
        const formattedDeliveryDate = deliveryDate.toLocaleDateString('ar-EG', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Google Sheets URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxmMZPf0o8LJl68-ZB1_pAhIs99lOl_hIIIz7UV5Nip2PJo_PP-THB3oeXAWdcTZiMi2g/exec';

        // Prepare form data
        const formData = new FormData();
        formData.append('Product', products);
        formData.append('Name', name);
        formData.append('Address', address);
        formData.append('Phone', phone);
        formData.append('Total', total + ' ريال');
        formData.append('OrderDate', orderDate.toLocaleString('ar-EG'));

        try {
            await fetch(scriptURL, { method: 'POST', body: formData });

            // Success!
            const successMessage = `
تم تأكيد طلبك ✅
التوصيل خلال 3 أيام من تاريخ الطلب (${formattedDeliveryDate})
السعر الإجمالي: ${total} ريال
لا يوجد دفع بالبطاقات، الدفع عند الاستلام فقط
            `.trim();

            showAlert(successMessage, 'success');

            // Clear cart and form
            cart = [];
            updateCartUI();
            orderForm.reset();

            // Close cart after delay
            setTimeout(() => {
                closeCart();
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            showAlert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            // Reset button state
            isSubmitting = false;
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
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

    // Handle multiline messages
    const formattedMessage = message.replace(/\n/g, '<br>');

    alertEl.innerHTML = `
        <div class="custom-alert-content">
            <i class="fas ${icon}"></i>
            <span>${formattedMessage}</span>
        </div>
        <button class="custom-alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(alertEl);

    // Remove after 6 seconds for longer messages
    const timeout = message.includes('\n') ? 8000 : 5000;
    setTimeout(() => {
        alertEl.style.animation = 'fadeOutUp 0.5s forwards';
        alertEl.addEventListener('animationend', () => {
            alertEl.remove();
        });
    }, timeout);
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

// Certificate Modal Functions
function openCertificateModal(imgSrc, title, description) {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalCertificateImg');
    const modalTitle = document.getElementById('modalCertificateTitle');
    const modalDesc = document.getElementById('modalCertificateDesc');

    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on click outside content
document.addEventListener('click', (e) => {
    const modal = document.getElementById('certificateModal');
    if (modal && e.target === modal) {
        closeCertificateModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertificateModal();
    }
});

// ============================================
// RADIO BUTTON TOGGLE (DESELECT)
// ============================================
const quantityRadios = document.querySelectorAll('.quantity-option input[type="radio"]');
quantityRadios.forEach(radio => {
    // Initialize tracking attribute
    radio.dataset.wasChecked = radio.checked;

    radio.addEventListener('click', function (e) {
        // If it was already checked before this click, uncheck it
        if (this.dataset.wasChecked === 'true') {
            this.checked = false;
            this.dataset.wasChecked = 'false';

            // Also need to trigger change event if needed by other listeners, 
            // but for simple UI updates, unchecking is usually enough.
            // However, visually we might need to update something if other logic depends on it.
        } else {
            // It was not checked, now it is. 
            // Update tracking for this one
            this.dataset.wasChecked = 'true';

            // Update tracking for others in the same group (they became unchecked)
            const groupName = this.name;
            document.querySelectorAll(`input[name="${groupName}"]`).forEach(otherRadio => {
                if (otherRadio !== this) {
                    otherRadio.dataset.wasChecked = 'false';
                }
            });
        }
    });
});

