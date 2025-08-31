// Demo products
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80",
        description: "Great sound, wireless freedom."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 99.99,
        image: "https://btech.com/media/catalog/product/cache/ead4866c641338b50cadbc0815eacb19/a/2/a25a0310-829a-4f3d-b0b1-7d23f03c7981.jpg",
        description: "Track your activity and stay connected."
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 39.99,
        image: "https://btech.com/media/catalog/product/cache/d90305861bc3b857ca54208b208083e9/8/1/81ujymronol._ac_sx679_.jpg",
        description: "Portable, powerful sound."
    },
    {
        id: 4,
        name: "USB-C Charger",
        price: 19.99,
        image: "https://btech.com/media/catalog/product/cache/d47f447e0165cbec465453e808dd0c9a/m/u/mu7w2_geo_gb-adapter_2_copy.jpg",
        description: "Fast charging for all your devices."
    },
    {
        id: 5,
        name: "Air Pods",
        price: 29.99,
        image: "https://i.pinimg.com/736x/3b/55/9f/3b559fafd9cf32a9064e5f1104cdf11d.jpg",
        description: "Pro-level Active Noise Cancellation, Adaptive Audio."
    },
    {
        id: 6,
        name: "Mobile 6 Stabilizer, Grey - M06001",
        price: 84.99,
        image: "https://btech.com/media/catalog/product/cache/7200f2a2e9389b4c813f2a4d8b201898/n/e/newproject-2023-12-24t003259.418_1024x.jpg",
        description: "Portable and Foldable, ActiveTrack 5.0, Built-In Extension Rod, 3-Axis Stabilization."
    }
];

// Utility: Read cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Utility: Save cart to localStorage
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Trigger storage event for other tabs
    localStorage.setItem('cart_sync', Date.now());
}

// Show a non-blocking toast message
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Sync cart count across tabs/pages
function setupCartCountSync() {
    window.addEventListener('storage', function (e) {
        if (e.key === 'cart' || e.key === 'cart_sync') {
            updateCartCount();
            renderCartModal();
        }
    });
}

// Add a product to cart
function addToCart(productId) {
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    setCart(cart);
    updateCartCount();
    showToast('Added to cart!');
    showFloatingCart();
}

// Remove a product from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    setCart(cart);
    renderCartModal();
    updateCartCount();
    showToast('Removed from cart');
    showFloatingCart();
}

// Update floating cart summary
function showFloatingCart() {
    const floatingCart = document.getElementById('floating-cart');
    if (!floatingCart) return;
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    floatingCart.querySelector('.floating-cart-count').textContent = count;
    floatingCart.style.display = count > 0 ? 'flex' : 'none';
}

// Update cart count in floating cart only
function updateCartCount() {
    showFloatingCart();
}

// Render products on homepage
function renderProducts() {
    const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = '';
    products.forEach(prod => {
        const prodDiv = document.createElement('div');
        prodDiv.className = 'product';
        prodDiv.innerHTML = `
            <img src="${prod.image}" alt="${prod.name} product image">
            <h3>${prod.name}</h3>
            <p>${prod.description}</p>
            <p><strong>$${prod.price.toFixed(2)}</strong></p>
            <button onclick="addToCart(${prod.id})" aria-label="Add ${prod.name} to cart">Add to Cart</button>
        `;
        list.appendChild(prodDiv);
    });
}

// Change quantity of a cart item (for modal)
function changeCartQty(productId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    setCart(cart);
    renderCartModal();
    updateCartCount();
    showFloatingCart();
}

// Render cart in modal
// ...existing code...

function renderCartModal() {
    const itemsDiv = document.getElementById('cart-modal-items');
    const summaryDiv = document.getElementById('cart-modal-summary');
    if (!itemsDiv || !summaryDiv) return;
    const cart = getCart();
    itemsDiv.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        itemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        summaryDiv.textContent = '';
    } else {
        cart.forEach(item => {
            const prod = products.find(p => p.id === item.id);
            if (!prod) return;
            total += prod.price * item.qty;
            const itemDiv = document.createElement('div');
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.marginBottom = '1em';
            itemDiv.innerHTML = `
                <img src="${prod.image}" alt="${prod.name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;margin-right:1em;">
                <div style="flex:1;">
                    <strong>${prod.name}</strong><br>
                    $${prod.price.toFixed(2)} x ${item.qty}
                </div>
                <div>
                    <button onclick="changeCartQty(${prod.id}, -1)" style="margin-left:0.5em;">-</button>
                    <button onclick="changeCartQty(${prod.id}, 1)">+</button>
                    <button onclick="removeFromCart(${prod.id})" style="margin-left:0.5em;">Remove</button>
                </div>
            `;
            itemsDiv.appendChild(itemDiv);
        });
        summaryDiv.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    }
}

// ...existing code...

// Modal logic for cart
function openCartModal() {
    renderCartModal();
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'block';
}
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside content
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (modal && event.target === modal) {
        closeCartModal();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Floating cart modal events
    const openCartBtn = document.getElementById('open-cart-modal');
    if (openCartBtn) openCartBtn.onclick = openCartModal;

    const closeCartBtn = document.getElementById('close-cart-modal');
    if (closeCartBtn) closeCartBtn.onclick = closeCartModal;

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            window.location.href = 'checkout.html';
        };
    }

    // Show floating cart on load if needed
    showFloatingCart();
});

// Expose functions to global scope for inline onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderProducts = renderProducts;
window.updateCartCount = updateCartCount;
window.changeCartQty = changeCartQty;
window.setupCartCountSync = setupCartCountSync;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;