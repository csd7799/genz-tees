document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        const animate = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ── Product Data with Collections & Unique Designs ──────────────
    const collections = {
        'shunya': { name: 'SHUNYA', color: '#7B2FBE', meaning: 'The Void' },
        'nakshatra': { name: 'NAKSHATRA', color: '#00D4FF', meaning: 'Star / Constellation' },
        'kaal': { name: 'KAAL', color: '#FF3864', meaning: 'Time / Death' },
        'pralay': { name: 'PRALAY', color: '#FF4500', meaning: 'Apocalypse' },
        'aatma': { name: 'AATMA', color: '#E8E8F0', meaning: 'Soul' }
    };

    // Using placeholder images (SVG data URIs) or generic names
    const products = [
        // SHUNYA DROP (Minimalist Void)
        { name: "VOID CIRCLE — BLACK", price: "₹1299", img: "shunya_void_circle.png", badge: "LIMITED", filter: "brightness(0)", collection: "shunya", desc: "Pure minimalism. A single void circle on black. Embroidered chest logo. Drop-shoulder oversized fit." },
        { name: "SHUNYA SANSKRIT — CHARCOAL", price: "₹1399", img: "shunya_sanskrit.png", badge: "NEW", filter: "brightness(0.2)", collection: "shunya", desc: "The Sanskrit character 'शून्य' in oversized distressed print. Premium heavy cotton." },
        { name: "ORBITAL RINGS — BLACK", price: "₹1499", img: "shunya_orbit.png", badge: "", filter: "brightness(0)", collection: "shunya", desc: "Abstract orbit rings with VYOM VOID wordmark. Wraparound print. Heavy 280 GSM." },
        
        // NAKSHATRA DROP (Star Maps)
        { name: "STAR MAP — DEEP NAVY", price: "₹1599", img: "nakshatra_star.png", badge: "HOT", filter: "sepia(0.5) hue-rotate(190deg)", collection: "nakshatra", desc: "Indian constellation mythology rendered in technical diagram style. Star map aesthetic." },
        { name: "CONSTELLATION — BLACK", price: "₹1299", img: "nakshatra_const.png", badge: "", filter: "brightness(0)", collection: "nakshatra", desc: "Dark star maps reimagined. Minimalist constellation print on chest." },
        
        // KAAL DROP (Time / Glitch)
        { name: "GLITCH TIME — OFF BLACK", price: "₹1399", img: "kaal_glitch.png", badge: "TRENDING", filter: "hue-rotate(270deg) contrast(1.2)", collection: "kaal", desc: "Distorted time. Melting clocks, broken grids. Y2K-dark glitch aesthetic." },
        { name: "DISTORTED GRID — GREY", price: "₹1199", img: "kaal_grid.png", badge: "", filter: "grayscale(1)", collection: "kaal", desc: "Broken grid lines and corrupted text. The concept: time is an illusion." },

        // PRA LAY DROP (Apocalypse)
        { name: "COSMIC SUPERNOVA — BLACK", price: "₹1799", img: "pralay_supernova.png", badge: "HEAVY", filter: "hue-rotate(320deg)", collection: "pralay", desc: "Bold graphic heavy. Supernova explosion art. Double-sided print." },
        { name: "COLLAPSING STAR — CHARCOAL", price: "₹1599", img: "pralay_collapse.png", badge: "", filter: "sepia(1) hue-rotate(300deg)", collection: "pralay", desc: "Inspired by Hindu cosmological cycles of creation and destruction." }
    ];

    const basePath = "images/";
    const grid = document.getElementById('product-grid');
    let activeCollection = 'all';

    // Mockup images for multi-angle views
    const mockupAngles = [
        { src: 'mockup_front.png', label: 'FRONT VIEW' },
        { src: 'mockup_back.png', label: 'BACK VIEW' },
        { src: 'mockup_side.png', label: 'SIDE VIEW' }
    ];

    // ── Render Products ─────────────────────────────────────────────
    function renderProducts(collectionFilter) {
        grid.innerHTML = '';
        const filtered = collectionFilter === 'all' ? products : products.filter(p => p.collection === collectionFilter);

        filtered.forEach((prod, _) => {
            const originalIndex = products.indexOf(prod);
            const col = collections[prod.collection];
            const badgeHTML = prod.badge ? `<div class="badges"><span class="badge ${prod.badge === 'NEW' || prod.badge === 'LIMITED' ? 'new' : 'trending'}">${prod.badge}</span></div>` : '';

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${basePath}${prod.img}" alt="${prod.name}" class="product-image" style="filter: ${prod.filter};">
                    ${badgeHTML}
                    <button class="quick-add" data-index="${originalIndex}">CLAIM THIS PIECE</button>
                </div>
                <div class="product-info">
                    <span style="font-size:0.7rem;color:${col.color};font-weight:700;letter-spacing:1px;font-family:var(--font-heading);">${col.name}</span>
                    <h3>${prod.name}</h3>
                    <p class="price">${prod.price}</p>
                </div>
            `;
            // Click card to open detail modal
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('quick-add')) {
                    openProductDetail(originalIndex);
                }
            });
            grid.appendChild(card);
        });

        bindQuickAdd();
        bindScrollAnimations();
        rebindCursorHover();
    }

    // Collection tab filtering
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCollection = btn.dataset.collection;
            renderProducts(activeCollection);
        });
    });

    renderProducts('all');

    // ── Product Detail Modal ────────────────────────────────────────
    const detailModal = document.getElementById('product-detail-modal');
    const closeDetailBtn = document.getElementById('close-detail');
    let currentDetailProduct = null;
    let selectedSize = 'L';

    function openProductDetail(index) {
        currentDetailProduct = products[index];
        currentDetailProduct._index = index;
        const col = collections[currentDetailProduct.collection];

        document.getElementById('detail-collection-badge').textContent = col.name;
        document.getElementById('detail-collection-badge').style.background = col.color;
        document.getElementById('detail-product-name').textContent = currentDetailProduct.name;
        document.getElementById('detail-price').textContent = currentDetailProduct.price;
        document.getElementById('detail-btn-price').textContent = currentDetailProduct.price;
        document.getElementById('detail-description-text').textContent = currentDetailProduct.desc;

        // Set main image
        const mainImg = document.getElementById('gallery-main-img');
        mainImg.src = basePath + currentDetailProduct.img;
        mainImg.style.filter = currentDetailProduct.filter;
        document.getElementById('gallery-angle-badge').textContent = 'FRONT VIEW';

        // Build thumbnails
        const thumbContainer = document.getElementById('gallery-thumbnails');
        thumbContainer.innerHTML = '';

        // First thumb = original product image
        const views = [
            { src: currentDetailProduct.img, label: 'FRONT VIEW', filter: currentDetailProduct.filter },
            ...mockupAngles.map(m => ({ src: m.src, label: m.label, filter: currentDetailProduct.filter }))
        ];

        views.forEach((view, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${basePath}${view.src}" alt="${view.label}" style="filter: ${view.filter};">`;
            thumb.addEventListener('click', () => {
                document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImg.style.opacity = '0';
                setTimeout(() => {
                    mainImg.src = basePath + view.src;
                    mainImg.style.filter = view.filter;
                    document.getElementById('gallery-angle-badge').textContent = view.label;
                    mainImg.style.opacity = '1';
                }, 200);
            });
            thumbContainer.appendChild(thumb);
        });

        // Reset size selection
        selectedSize = 'L';
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === 'L');
        });
        document.getElementById('size-error').textContent = '';

        detailModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeDetailBtn.addEventListener('click', () => {
        detailModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            document.getElementById('size-error').textContent = '';
        });
    });

    // Add to cart from detail modal
    document.getElementById('detail-add-to-cart').addEventListener('click', () => {
        if (!selectedSize) {
            document.getElementById('size-error').textContent = 'Please select a size';
            return;
        }
        const item = { ...currentDetailProduct, size: selectedSize };
        cart.push(item);
        updateCartUI();

        const btn = document.getElementById('detail-add-to-cart');
        btn.textContent = 'CLAIMED! 🔥';
        btn.style.background = 'var(--accent-secondary)';
        btn.style.color = '#000';
        setTimeout(() => {
            btn.innerHTML = `CLAIM THIS PIECE — <span id="detail-btn-price">${currentDetailProduct.price}</span>`;
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    });

    // ── Cart State & Interaction ────────────────────────────────────
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = [];

    const updateCartUI = () => {
        cartBtn.textContent = `CART (${cart.length})`;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const priceNum = parseInt(item.price.replace('₹', ''));
            total += priceNum;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} · Size: ${item.size || 'L'}</div>
                </div>
                <button class="remove-item" data-index="${index}">X</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalAmount.textContent = `₹${total}`;

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(parseInt(e.target.dataset.index), 1);
                updateCartUI();
            });
        });
    };

    function bindQuickAdd() {
        document.querySelectorAll('.quick-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productIndex = parseInt(btn.dataset.index);
                const product = { ...products[productIndex], size: 'L' };
                cart.push(product);
                updateCartUI();

                if (typeof fbq === 'function') fbq('track', 'AddToCart', { content_name: product.name, value: parseInt(product.price.replace('₹', '')), currency: 'INR' });
                if (typeof gtag === 'function') gtag('event', 'add_to_cart', { currency: 'INR', value: parseInt(product.price.replace('₹', '')), items: [{ item_name: product.name }] });

                const originalText = btn.textContent;
                btn.textContent = 'CLAIMED! 🔥';
                btn.style.background = 'var(--accent-primary)';
                btn.style.color = '#fff';
                setTimeout(() => { btn.textContent = originalText; btn.style.background = 'rgba(255,255,255,0.9)'; btn.style.color = '#000'; }, 1500);
            });
        });
    }

    cartBtn.addEventListener('click', (e) => { e.preventDefault(); cartModal.style.display = 'block'; });
    closeCart.addEventListener('click', () => { cartModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target == cartModal) cartModal.style.display = 'none'; });

    // ── Customer Details Flow ───────────────────────────────────────
    const customerModal = document.getElementById('customer-modal');
    const closeCustomerBtn = document.getElementById('close-customer');
    const customerForm = document.getElementById('customer-form');

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) { alert("Your cart is empty!"); return; }

        if (typeof fbq === 'function') fbq('track', 'InitiateCheckout', { value: getCartTotal(), currency: 'INR' });
        if (typeof gtag === 'function') gtag('event', 'begin_checkout', { value: getCartTotal(), currency: 'INR' });

        // Show customer details instead of direct payment
        cartModal.style.display = 'none';
        showCustomerModal();
    });

    function getCartTotal() {
        return cart.reduce((acc, item) => acc + parseInt(item.price.replace('₹', '')), 0);
    }

    function showCustomerModal() {
        // Populate order summary
        const itemsContainer = document.getElementById('customer-order-items');
        itemsContainer.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'order-summary-item';
            div.innerHTML = `<span>${item.name} (${item.size || 'L'})</span><span>${item.price}</span>`;
            itemsContainer.appendChild(div);
        });
        document.getElementById('customer-order-total').textContent = `₹${getCartTotal()}`;

        customerModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeCustomerBtn.addEventListener('click', () => {
        customerModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    customerModal.addEventListener('click', (e) => {
        if (e.target === customerModal) { customerModal.style.display = 'none'; document.body.style.overflow = ''; }
    });

    // Form submission → Razorpay payment
    customerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const customer = {
            fullName: document.getElementById('cust-name').value,
            email: document.getElementById('cust-email').value,
            phone: document.getElementById('cust-phone').value,
            address: document.getElementById('cust-address').value,
            city: document.getElementById('cust-city').value,
            state: document.getElementById('cust-state').value,
            pincode: document.getElementById('cust-pincode').value
        };

        const totalAmount = getCartTotal();
        const cartItems = cart.map(item => ({
            name: item.name,
            price: item.price,
            size: item.size || 'L',
            collection: item.collection
        }));

        // Update steps UI
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-1').classList.add('done');
        document.getElementById('step-2').classList.add('active');

        try {
            const response = await fetch('http://localhost:3000/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount, customer, items: cartItems })
            });
            const order = await response.json();

            customerModal.style.display = 'none';
            document.body.style.overflow = '';

            // Open Razorpay
            const options = {
                "key": "rzp_test_SfJRVUJVV0bXjj",
                "amount": order.amount,
                "currency": "INR",
                "name": "VYOM VOID",
                "description": "Premium Streetwear Order",
                "order_id": order.id,
                "handler": async function (response) {
                    // Confirm payment on backend
                    await fetch('http://localhost:3000/confirm-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpayOrderId: order.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        })
                    });

                    if (typeof fbq === 'function') fbq('track', 'Purchase', { value: totalAmount, currency: 'INR' });
                    if (typeof gtag === 'function') gtag('event', 'purchase', { transaction_id: response.razorpay_payment_id, value: totalAmount, currency: 'INR' });

                    alert(`✅ Order placed successfully!\nPayment ID: ${response.razorpay_payment_id}\nWelcome to the void. 🔥`);
                    cart = [];
                    updateCartUI();
                    customerForm.reset();
                },
                "prefill": {
                    "name": customer.fullName,
                    "email": customer.email,
                    "contact": customer.phone
                },
                "theme": { "color": "#7B2FBE" }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', (resp) => alert(`Payment Failed: ${resp.error.description}`));
            rzp.open();

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        }
    });

    // ── Scroll Animations ───────────────────────────────────────────
    function bindScrollAnimations() {
        const cards = document.querySelectorAll('.product-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, (index % 4) * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    }

    function rebindCursorHover() {
        if (window.matchMedia("(pointer: fine)").matches) {
            document.querySelectorAll('a, button, .product-card').forEach(el => {
                el.addEventListener('mouseenter', () => { cursor.classList.add('cursor-hover'); follower.classList.add('follower-hover'); });
                el.addEventListener('mouseleave', () => { cursor.classList.remove('cursor-hover'); follower.classList.remove('follower-hover'); });
            });
        }
    }

    // ── Navbar Scroll ───────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { navbar.style.padding = '1rem 4%'; navbar.style.background = 'rgba(10, 10, 15, 0.95)'; }
        else { navbar.style.padding = '1.5rem 4%'; navbar.style.background = 'rgba(10, 10, 15, 0.8)'; }
    });

    // ── Promo Banner & Countdown ────────────────────────────────────
    const promoBanner = document.getElementById('promo-banner');
    const closePromoBtn = document.getElementById('close-promo');
    const countdownEl = document.getElementById('countdown-timer');

    if (promoBanner) {
        document.body.classList.add('banner-active');
        closePromoBtn.addEventListener('click', () => { promoBanner.style.display = 'none'; document.body.classList.remove('banner-active'); });

        const countDownDate = new Date().getTime() + (48 * 60 * 60 * 1000);
        setInterval(function() {
            const distance = countDownDate - new Date().getTime();
            const d = Math.floor(distance / (1000*60*60*24));
            const h = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
            const m = Math.floor((distance % (1000*60*60)) / (1000*60));
            const s = Math.floor((distance % (1000*60)) / 1000);
            if (countdownEl) countdownEl.innerHTML = `${String(d).padStart(2,'0')} : ${String(h).padStart(2,'0')} : ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}`;
            if (distance < 0 && countdownEl) countdownEl.innerHTML = "DROP CLOSED";
        }, 1000);
    }

    // ── Email Modal ─────────────────────────────────────────────────
    const emailModal = document.getElementById('email-modal');
    const closeEmailBtn = document.getElementById('close-email');
    const emailForm = document.getElementById('email-form');
    const emailSuccessMsg = document.getElementById('email-success-msg');

    if (emailModal) {
        setTimeout(() => { if (!localStorage.getItem('vyom_email_closed')) emailModal.style.display = 'block'; }, 5000);
        closeEmailBtn.addEventListener('click', () => { emailModal.style.display = 'none'; localStorage.setItem('vyom_email_closed', 'true'); });
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Captured email:', document.getElementById('email-input').value);
            if (typeof fbq === 'function') fbq('track', 'Lead');
            if (typeof gtag === 'function') gtag('event', 'generate_lead');
            emailForm.style.display = 'none';
            emailSuccessMsg.style.display = 'block';
            localStorage.setItem('vyom_email_closed', 'true');
            setTimeout(() => { emailModal.style.display = 'none'; }, 3000);
        });
    }
});