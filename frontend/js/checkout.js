const checkoutItemsList = document.getElementById('checkout-items-list');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const checkoutForm = document.getElementById('checkout-form');
const checkoutGrid = document.getElementById('checkout-grid');
const orderSuccessBox = document.getElementById('order-success-box');
const orderSuccessDetails = document.getElementById('order-success-details');

function formatPrice(amount) {
    return "₹" + amount.toLocaleString('en-IN');
}

function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('mm_cart')) || [];

    if (cart.length === 0) {
        checkoutItemsList.innerHTML = `<p style="color: var(--text-light);">Your cart is empty.</p>`;
        summarySubtotal.textContent = "₹0";
        summaryShipping.textContent = "₹0";
        summaryTotal.textContent = "₹0";
        return;
    }

    let html = "";
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        subtotal = subtotal + item.price;
        html += `
            <div class="checkout-item-row">
                <span>${item.name}</span>
                <strong>${formatPrice(item.price)}</strong>
            </div>
        `;
    }

    // Free shipping for orders >= ₹5,000, otherwise ₹99
    const shipping = subtotal >= 5000 ? 0 : 99;
    const total = subtotal + shipping;

    checkoutItemsList.innerHTML = html;
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryShipping.textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
    summaryTotal.textContent = formatPrice(total);
}

document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();

    // Pre-fill name if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('mm_current_user'));
    const nameInput = document.getElementById('ship-name');
    if (currentUser && nameInput && currentUser.name) {
        nameInput.value = currentUser.name;
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cart = JSON.parse(localStorage.getItem('mm_cart')) || [];
            if (cart.length === 0) {
                alert("Your cart is empty! Add products before placing an order.");
                return;
            }

            let subtotal = 0;
            for (let i = 0; i < cart.length; i++) {
                subtotal = subtotal + cart[i].price;
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

            // Clear cart after placing order
            localStorage.setItem('mm_cart', JSON.stringify([]));

            checkoutGrid.style.display = 'none';
            orderSuccessBox.style.display = 'block';
            orderSuccessDetails.textContent = `Order #${orderId} for ${formatPrice(total)} (${paymentMethod}) will be shipped to ${city}.`;
        });
    }
});