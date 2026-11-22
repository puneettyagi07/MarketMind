const API_BASE = "http://localhost:5000";

const checkoutItemsList = document.getElementById('checkout-items-list');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const checkoutForm = document.getElementById('checkout-form');
const checkoutGrid = document.getElementById('checkout-grid');
const orderSuccessBox = document.getElementById('order-success-box');
const orderSuccessDetails = document.getElementById('order-success-details');

function formatPrice(amount) {
    return "₹" + Number(amount || 0).toLocaleString('en-IN');
}

function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('mm_cart')) || [];

    if (!checkoutItemsList) return;

    if (cart.length === 0) {
        checkoutItemsList.innerHTML = `<p style="color: var(--text-light);">Your cart is empty.</p>`;
        if (summarySubtotal) summarySubtotal.textContent = "₹0";
        if (summaryShipping) summaryShipping.textContent = "₹0";
        if (summaryTotal) summaryTotal.textContent = "₹0";
        return;
    }

    let html = "";
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const priceNum = Number(item.price) || 0;
        subtotal = subtotal + priceNum;
        html += `
            <div class="checkout-item-row">
                <span>${item.name}</span>
                <strong>${formatPrice(priceNum)}</strong>
            </div>
        `;
    }

    const shipping = subtotal >= 5000 ? 0 : 99;
    const total = subtotal + shipping;

    checkoutItemsList.innerHTML = html;
    if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
    if (summaryShipping) summaryShipping.textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
    if (summaryTotal) summaryTotal.textContent = formatPrice(total);
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('mm_current_user'));
    if (!currentUser) {
        alert("Please login first to access checkout.");
        window.location.href = "login.html";
        return;
    }

    renderOrderSummary();

    const nameInput = document.getElementById('ship-name');
    if (nameInput && currentUser.name) {
        nameInput.value = currentUser.name;
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const cart = JSON.parse(localStorage.getItem('mm_cart')) || [];
            if (cart.length === 0) {
                alert("Your cart is empty! Add products before placing an order.");
                return;
            }

            let subtotal = 0;
            for (let i = 0; i < cart.length; i++) {
                subtotal = subtotal + (Number(cart[i].price) || 0);
            }
            const shipping = subtotal >= 5000 ? 0 : 99;
            const total = subtotal + shipping;

            const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
            const customerName = document.getElementById('ship-name').value.trim();
            const city = document.getElementById('ship-city').value.trim();
            const paymentMethod = document.getElementById('payment-method').value;

            const newOrder = {
                id: orderId,
                customer: customerName,
                city: city,
                paymentMethod: paymentMethod,
                items: cart,
                total: total,
                status: "Pending",
                date: new Date().toLocaleDateString('en-IN')
            };

            const orders = JSON.parse(localStorage.getItem('mm_orders')) || [];
            orders.push(newOrder);
            localStorage.setItem('mm_orders', JSON.stringify(orders));

            try {
                await fetch(`${API_BASE}/api/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newOrder)
                });
            } catch (err) {
                console.log("Backend order route not reached, saved locally:", err.message);
            }

            // Empty cart immediately after order placement
            localStorage.setItem('mm_cart', JSON.stringify([]));
            renderOrderSummary();

            if (checkoutGrid) checkoutGrid.style.display = 'none';
            if (orderSuccessBox) orderSuccessBox.style.display = 'block';
            if (orderSuccessDetails) {
                orderSuccessDetails.textContent = `Order #${orderId} for ${formatPrice(total)} (${paymentMethod}) will be shipped to ${city}.`;
            }
        });
    }
});