// Run this script once to create an admin user
// Usage: node src/scripts/seed-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv=require('dotenv')
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@ladiesgarments.com',
      password: hashedPassword,
      phone: '8317052176',
      role: 'admin',
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@ladiesgarments.com');
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedAdmin();
