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

const User = require('./models/User');
const Order = require('./models/Order');

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already registered." });
        }

        const newUser = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role: role === 'seller' ? 'seller' : 'customer',
            password
        });

        return res.status(201).json({
            success: true,
            user: { name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error during registration." });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        return res.status(200).json({
            success: true,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error during login." });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must include at least one item." });
        }

        const createdOrder = await Order.create(orderData);
        return res.status(201).json({
            success: true,
            message: "Order saved to database",
            order: createdOrder
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error saving order." });
    }
});
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error fetching orders."
        });
    }
});

// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SEED_PRODUCTS = [
    { name: "Sony WH-1000XM4 Headphones", category: "Electronics", price: 22990, rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { name: "Ergonomic Mesh Chair", category: "Furniture", price: 8500, rating: 4.5, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80" },
    { name: "Classic Cotton T-Shirt", category: "Fashion", price: 999, rating: 4.6, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { name: "Fitness Smart Watch Active 2", category: "Wearables", price: 3999, rating: 4.2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
    { name: "Logitech MX Master 3 Mouse", category: "Electronics", price: 7995, rating: 4.9, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
    { name: "Running Sneakers", category: "Fashion", price: 3499, rating: 4.4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
    { name: "Minimalist Desk Lamp", category: "Furniture", price: 1500, rating: 4.3, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80" },
    { name: "Noise Cancelling Earbuds", category: "Wearables", price: 4999, rating: 4.4, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" }
];

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(SEED_PRODUCTS);
            console.log("Seeded initial products into MongoDB");
        }
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
}

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "MarketMind API is running" });
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error fetching products" });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
app.post('/api/ai-search', async (req, res) => {
    try {
        const rawQuery = (req.body && req.body.query) ? String(req.body.query).toLowerCase().trim() : "";
        const allProducts = await Product.find();

        if (!rawQuery) {
            return res.status(200).json({ success: true, products: allProducts });
        }

        // Extract optional max price after "under"
        let maxPrice = Infinity;
        const words = rawQuery.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
            if (words[i] === "under" && words[i + 1]) {
                const parsed = parseInt(words[i + 1].replace(/[^0-9]/g, ""), 10);
                if (!isNaN(parsed)) {
                    maxPrice = parsed;
                }
            }
        }

        const matched = [];
        for (let i = 0; i < allProducts.length; i++) {
            const item = allProducts[i];
            const nameLower = item.name.toLowerCase();
            const categoryLower = item.category.toLowerCase();

            const withinBudget = item.price <= maxPrice;
            const matchesKeyword =
                rawQuery.includes(categoryLower) ||
                nameLower.includes(rawQuery) ||
                maxPrice !== Infinity;

            if (withinBudget && matchesKeyword) {
                matched.push(item);
            }
        }

        return res.status(200).json({
            success: true,
            products: matched
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during AI search."
        });
    }
});