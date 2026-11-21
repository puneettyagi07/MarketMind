const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 2. SAMPLE PRODUCT DATA (Will move to MongoDB later) ---
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

// --- 3. ROUTES ---
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "MarketMind API is running"
    });
});

app.get('/api/products', (req, res) => {
    res.status(200).json({
        success: true,
        products: PRODUCTS
    });
});

// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});