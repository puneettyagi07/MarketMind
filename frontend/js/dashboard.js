document.addEventListener('DOMContentLoaded', () => {
    const defaultOrders = [
        { id: "#ORD-8832", customer: "Rahul Sharma", date: "2023-10-25", amount: 22990, status: "Shipped" },
        { id: "#ORD-8833", customer: "Priya Singh", date: "2023-10-26", amount: 8500, status: "Pending" },
        { id: "#ORD-8834", customer: "Amit Patel", date: "2023-10-26", amount: 6999, status: "Shipped" }
    ];

    const savedOrders = JSON.parse(localStorage.getItem('mm_orders')) || [];
    const allOrders = [];

    // Put newest saved orders first
    for (let i = savedOrders.length - 1; i >= 0; i--) {
        const o = savedOrders[i];
        allOrders.push({
            id: "#" + o.id,
            customer: o.customer,
            date: o.date,
            amount: o.total,
            status: o.status
        });
    }

    for (let i = 0; i < defaultOrders.length; i++) {
        allOrders.push(defaultOrders[i]);
    }

    const tbody = document.getElementById('orders-tbody');

    if (tbody) {
        let rowsHtml = "";
        for (let i = 0; i < allOrders.length; i++) {
            const order = allOrders[i];
            const statusClass = order.status === "Pending" ? "status-pending" : "status-shipped";
            const formattedAmount = "₹" + Number(order.amount).toLocaleString('en-IN');

            rowsHtml += `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${order.customer}</td>
                    <td>${order.date}</td>
                    <td>${formattedAmount}</td>
                    <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                </tr>
            `;
        }
        tbody.innerHTML = rowsHtml;
    }
});