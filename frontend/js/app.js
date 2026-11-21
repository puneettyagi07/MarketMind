// --- 1. MOCK DATA ---
const PRODUCTS = [
    { id: "prod_001", name: "Sony WH-1000XM4 Headphones", category: "Electronics", price: 22990, rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { id: "prod_002", name: "Ergonomic Mesh Chair", category: "Furniture", price: 8500, rating: 4.5, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80" },
    { id: "prod_003", name: "Classic Cotton T-Shirt", category: "Fashion", price: 999, rating: 4.6, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { id: "prod_004", name: "Fitness Smart Watch Active 2", category: "Wearables", price: 3999, rating: 4.2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
    { id: "prod_005", name: "Logitech MX Master 3 Mouse", category: "Electronics", price: 7995, rating: 4.9, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
    { id: "prod_006", name: "Running Sneakers", category: "Fashion", price: 3499, rating: 4.4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
    { id: "prod_007", name: "Minimalist Desk Lamp", category: "Furniture", price: 1500, rating: 4.3, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80" },
    { id: "prod_008", name: "Noise Cancelling Earbuds", category: "Wearables", price: 4999, rating: 4.4, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" }
];

// --- 2. STATE (Saved in Browser localStorage + Backend Sync) ---
let products = [...PRODUCTS];
let cart = JSON.parse(localStorage.getItem('mm_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('mm_wishlist')) || [];

// --- 3. DOM ELEMENTS ---
const productGrid = document.getElementById('product-grid');
const wishlistGrid = document.getElementById('wishlist-grid');
const productTitle = document.getElementById('product-section-title');
const cartCountElement = document.getElementById('cart-count');
const wishlistCountElement = document.getElementById('wishlist-count');

const standardSearchInput = document.getElementById('header-search-input');
const standardSearchBtn = document.getElementById('header-search-btn');
const aiSearchInput = document.getElementById('ai-input');
const aiSearchBtn = document.getElementById('ai-search-btn');

const cartNavLink = document.getElementById('cart-nav-link');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// --- 4. HELPER FUNCTIONS ---
function formatPrice(amount) {
    return "₹" + amount.toLocaleString('en-IN');
}

function isInWishlist(productId) {
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === productId) {
            return true;
        }
    }
    return false;
}

// --- 5. RENDER PRODUCTS (Home Page) ---
function renderProducts(items) {
    if (!productGrid) return;

    if (items.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No products found.</p>`;
        return;
    }

    let html = "";
    for (let i = 0; i < items.length; i++) {
        const product = items[i];
        const saved = isInWishlist(product.id);
        const heartSymbol = saved ? "♥" : "♡";
        const heartColor = saved ? "color: var(--primary-color);" : "";

        html += `
            <div class="product-card">
                <div class="heart-icon" style="${heartColor}" onclick="toggleWishlist('${product.id}')">${heartSymbol}</div>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <span class="stars">⭐ ${product.rating}</span>
                <div class="price-row">
                    <span class="price">${formatPrice(product.price)}</span>
                </div>
                <button type="button" class="btn-primary w-100" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        `;
    }
    productGrid.innerHTML = html;
}

// --- 6. WISHLIST LOGIC ---
function toggleWishlist(productId) {
    let foundIndex = -1;
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === productId) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex > -1) {
        // Already in wishlist -> remove it
        wishlist.splice(foundIndex, 1);
    } else {
        // Not in wishlist -> find product and add it
        for (let i = 0; i < PRODUCTS.length; i++) {
            if (PRODUCTS[i].id === productId) {
                wishlist.push(PRODUCTS[i]);
                break;
            }
        }
    }

    localStorage.setItem('mm_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts(PRODUCTS);
    renderWishlistPage();
}

function updateWishlistUI() {
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
    }
}

function renderWishlistPage() {
    if (!wishlistGrid) return;

    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="color: var(--text-light); margin-bottom: 1rem;">Your wishlist is empty.</p>
                <a href="index.html" class="btn-primary">Explore Products</a>
            </div>
        `;
        return;
    }

    let html = "";
    for (let i = 0; i < wishlist.length; i++) {
        const product = wishlist[i];
        html += `
            <div class="product-card">
                <div class="heart-icon" style="color: var(--primary-color);" onclick="toggleWishlist('${product.id}')">♥</div>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <span class="stars">⭐ ${product.rating}</span>
                <div class="price-row">
                    <span class="price">${formatPrice(product.price)}</span>
                </div>
                <button type="button" class="btn-primary w-100" onclick="addToCart('${product.id}')">
                    Move to Cart
                </button>
                <button type="button" class="remove-btn w-100" style="margin-top: 0.5rem;" onclick="toggleWishlist('${product.id}')">
                    Remove
                </button>
            </div>
        `;
    }
    wishlistGrid.innerHTML = html;
}

// --- 7. CART LOGIC ---
function addToCart(productId) {
    for (let i = 0; i < PRODUCTS.length; i++) {
        if (PRODUCTS[i].id === productId) {
            cart.push(PRODUCTS[i]);
            break;
        }
    }
    localStorage.setItem('mm_cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('mm_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    renderCartDrawer();
}

function renderCartDrawer() {
    if (!cartItemsContainer || !cartTotalPrice) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; color:#64748B; padding:2rem;">Your cart is empty.</p>`;
        cartTotalPrice.textContent = "₹0";
        return;
    }

    let html = "";
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total = total + item.price;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p style="color:var(--primary-color); font-weight:700;">${formatPrice(item.price)}</p>
                    <button type="button" class="remove-btn" onclick="removeFromCart(${i})">Remove</button>
                </div>
            </div>
        `;
    }

    cartItemsContainer.innerHTML = html;
    cartTotalPrice.textContent = formatPrice(total);
}

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// --- 8. SEARCH & AI LOGIC ---
function handleStandardSearch() {
    const query = standardSearchInput.value.toLowerCase().trim();
    if (query === "") {
        productTitle.textContent = "Best Selling Products";
        renderProducts(PRODUCTS);
        return;
    }

    const filtered = [];
    for (let i = 0; i < PRODUCTS.length; i++) {
        const name = PRODUCTS[i].name.toLowerCase();
        const category = PRODUCTS[i].category.toLowerCase();
        if (name.includes(query) || category.includes(query)) {
            filtered.push(PRODUCTS[i]);
        }
    }

    productTitle.textContent = `Search Results for "${query}"`;
    renderProducts(filtered);
    productGrid.scrollIntoView({ behavior: "smooth" });
}

function handleAISearch() {
    const query = aiSearchInput.value.toLowerCase().trim();
    if (query === "") {
        productTitle.textContent = "Best Selling Products";
        renderProducts(PRODUCTS);
        return;
    }

    let maxPrice = Infinity;
    const words = query.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i] === "under" && words[i + 1]) {
            const parsedNumber = parseInt(words[i + 1].replace(/[^0-9]/g, ""), 10);
            if (!isNaN(parsedNumber)) {
                maxPrice = parsedNumber;
            }
        }
    }

    const filtered = [];
    for (let i = 0; i < PRODUCTS.length; i++) {
        const p = PRODUCTS[i];
        const matchesPrice = p.price <= maxPrice;
        const matchesWord = query.includes(p.category.toLowerCase()) ||
                            p.name.toLowerCase().includes(query) ||
                            maxPrice !== Infinity;

        if (matchesPrice && matchesWord) {
            filtered.push(p);
        }
    }

    productTitle.textContent = `✨ AI Recommendations (${filtered.length} found)`;
    renderProducts(filtered);
    productGrid.scrollIntoView({ behavior: "smooth" });
}

// --- USER SESSION IN NAVBAR ---
function logoutUser() {
    localStorage.removeItem('mm_current_user');
    window.location.href = "index.html";
}

function renderNavbarAuth() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const currentUser = JSON.parse(localStorage.getItem('mm_current_user'));
    const loginLink = navActions.querySelector('a[href="login.html"]');

    if (currentUser && loginLink) {
        const userSpan = document.createElement('span');
        userSpan.className = 'nav-user-badge';
        userSpan.textContent = `Hi, ${currentUser.name}`;

        const logoutBtn = document.createElement('button');
        logoutBtn.type = 'button';
        logoutBtn.className = 'btn-logout';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logoutUser;

        loginLink.replaceWith(userSpan, logoutBtn);
    }
}

// --- BACKEND API FETCH ---
async function fetchProductsFromAPI() {
    try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
            throw new Error("Failed to fetch products from server");
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.products)) {
            products = data.products;
            renderProducts(products);
            console.log("Loaded products from backend API:", products.length);
        }
    } catch (error) {
        console.log("Backend not reachable, using local mock products:", error.message);
        renderProducts(products);
    }
}

// --- 9. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchProductsFromAPI();
    renderWishlistPage();
    updateCartUI();
    updateWishlistUI();
    renderNavbarAuth();

    if (standardSearchBtn) {
        standardSearchBtn.addEventListener('click', handleStandardSearch);
        standardSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleStandardSearch();
        });
    }

    if (aiSearchBtn) {
        aiSearchBtn.addEventListener('click', handleAISearch);
        aiSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAISearch();
        });
    }

    const categoryCircles = document.querySelectorAll('.category-circle-wrapper');
    for (let i = 0; i < categoryCircles.length; i++) {
        categoryCircles[i].addEventListener('click', function () {
            const selectedCategory = this.getAttribute('data-category');

            if (selectedCategory === "All") {
                productTitle.textContent = "Best Selling Products";
                renderProducts(PRODUCTS);
            } else {
                const filtered = [];
                for (let j = 0; j < PRODUCTS.length; j++) {
                    if (PRODUCTS[j].category === selectedCategory) {
                        filtered.push(PRODUCTS[j]);
                    }
                }
                productTitle.textContent = selectedCategory;
                renderProducts(filtered);
            }
        });
    }

    if (cartNavLink) {
        cartNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem('mm_current_user'));
        if (!currentUser) {
            alert("Please login first to proceed to checkout.");
            window.location.href = "login.html";
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            window.location.href = "checkout.html";
        }
    });
}
});