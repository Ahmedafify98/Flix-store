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
            if (typeof renderCart === "function") renderCart();
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
}

// Remove a product from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    setCart(cart);
    renderCart();
    updateCartCount();
    showToast('Removed from cart');
}

// Update cart count in nav
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
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

// Change quantity of a cart item
function changeCartQty(productId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    setCart(cart);
    renderCart();
    updateCartCount();
}

// Render cart page
function renderCart() {
    const list = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const clearBtn = document.getElementById('clear-cart');
    const purchaseBtn = document.getElementById('purchase-btn');
    if (!list || !summary) return;

    const cart = getCart();
    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = '<p>Your cart is empty.</p>';
        summary.textContent = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (purchaseBtn) purchaseBtn.style.display = 'none';
        return;
    }
    let total = 0;
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (!prod) return;
        total += prod.price * item.qty;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${prod.image}" alt="${prod.name} product image">
            <h3>${prod.name}</h3>
            <p>Price: $${prod.price.toFixed(2)}</p>
            <div class="qty-controls">
                <button aria-label="Decrease quantity" onclick="changeCartQty(${prod.id}, -1)">-</button>
                <span aria-live="polite">${item.qty}</span>
                <button aria-label="Increase quantity" onclick="changeCartQty(${prod.id}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${prod.id})" aria-label="Remove ${prod.name} from cart">Remove</button>
        `;
        list.appendChild(itemDiv);
    });
    summary.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    if (clearBtn) clearBtn.style.display = 'inline-block';
    if (purchaseBtn) purchaseBtn.style.display = 'inline-block';
    if (clearBtn) clearBtn.onclick = function() {
        setCart([]);
        renderCart();
        updateCartCount();
        showToast('Cart cleared');
    };
    if (purchaseBtn) {
        purchaseBtn.onclick = function() {
            openPurchaseModal();
        };
    }
}

// Modal logic
function openPurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if (modal) modal.style.display = 'block';
}
function closePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if (modal) modal.style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('purchase-modal');
    if (modal && event.target === modal) {
        closePurchaseModal();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Close modal button
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.onclick = closePurchaseModal;

    // Demo pay button
    const payDemo = document.getElementById('pay-demo');
    if (payDemo) payDemo.onclick = function() {
        closePurchaseModal();
        setCart([]);
        renderCart();
        updateCartCount();
        showToast('Payment successful! (Demo)');
    };
});

// Expose functions to global scope for inline onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderProducts = renderProducts;
window.renderCart = renderCart;
window.updateCartCount = updateCartCount;
window.changeCartQty = changeCartQty;
window.setupCartCountSync = setupCartCountSync;