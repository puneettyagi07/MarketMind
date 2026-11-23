const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        customer: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        paymentMethod: { type: String, required: true },
        items: { type: Array, required: true },
        total: { type: Number, required: true, min: 0 },
        status: { type: String, default: 'Pending' },
        date: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);