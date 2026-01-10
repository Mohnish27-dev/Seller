// Script to seed products into the database for testing Razorpay
const mongoose = require('mongoose')
const Product = require('../models/Product.js')
const {sampleProducts} = require('../data/sampleProducts.js')
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedProducts() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found in environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Remove existing products
        await Product.deleteMany({});
        console.log('Existing products removed');

        // // Insert sample products
        const productsWithSlug = sampleProducts.map(p => ({
            ...p,
            slug: p.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
        }));
        await Product.insertMany(productsWithSlug);
        console.log('Sample products inserted successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
