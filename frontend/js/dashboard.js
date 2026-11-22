const API_BASE = "http://localhost:5000";

const defaultOrders = [
    { id: "#ORD-8832", customer: "Rahul Sharma", date: "2023-10-25", amount: 22990, status: "Shipped" },
    { id: "#ORD-8833", customer: "Priya Singh", date: "2023-10-26", amount: 8500, status: "Pending" },
    { id: "#ORD-8834", customer: "Amit Patel", date: "2023-10-26", amount: 6999, status: "Shipped" }
];

function renderOrdersTable(ordersList) {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    let rowsHtml = "";
    for (let i = 0; i < ordersList.length; i++) {
        const order = ordersList[i];
        const cleanId = String(order.id || "").startsWith("#") ? order.id : "#" + order.id;
        const amountValue = order.total !== undefined ? order.total : order.amount;
        const statusClass = order.status === "Pending" ? "status-pending" : "status-shipped";
        const formattedAmount = "₹" + Number(amountValue || 0).toLocaleString('en-IN');

        rowsHtml += `
            <tr>
                <td><strong>${cleanId}</strong></td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formattedAmount}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            </tr>
        `;
    }

    tbody.innerHTML = rowsHtml;
}

function getFallbackOrders() {
    const savedOrders = JSON.parse(localStorage.getItem('mm_orders')) || [];
    const combined = [];

    for (let i = savedOrders.length - 1; i >= 0; i--) {
        const o = savedOrders[i];
        combined.push({
            id: "#" + o.id,
            customer: o.customer,
            date: o.date,
            amount: o.total,
            status: o.status
        });
    }

    for (let i = 0; i < defaultOrders.length; i++) {
        combined.push(defaultOrders[i]);
    }

    return combined;
}

async function loadDashboardOrders() {
    try {
        const response = await fetch(`${API_BASE}/api/orders`);
        if (!response.ok) {
            throw new Error("Failed to fetch orders from server");
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            renderOrdersTable(data.orders);
            return;
        }

        // If MongoDB has no orders yet, show fallback orders
        renderOrdersTable(getFallbackOrders());
    } catch (err) {
        console.log("Backend not reachable, using local/sample orders:", err.message);
        renderOrdersTable(getFallbackOrders());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardOrders();
});