import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User'
import Product from '@/models/Product';


function generateOrderNumber() {
  // Example: ORD-20260110-1234567890
  return 'ORD-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random() * 1e10);
}
// GET user orders
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images slug');

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { items, shippingAddress, paymentMethod } = await request.json();

    // Find the user by _id (for credentials) or googleId (for Google users)
    let userDoc = null;
    if (session.user.id.length === 24) {
      // Likely a MongoDB ObjectId (credentials/local user)
      userDoc = await (await import('@/models/User')).default.findById(session.user.id);
      console.log(userDoc)
    } else {
      // Google user: id is Google sub, find by googleId
      userDoc = await (await import('@/models/User')).default.findOne({ googleId: session.user.id });
      console.log(userDoc)
    }
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Calculate totals
    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      // Check stock availability for the specific size
      const sizeInfo = product.sizes.find(s => s.size === item.size);
      if (!sizeInfo) {
        return NextResponse.json(
          { error: `Size "${item.size}" not available for ${product.name}` },
          { status: 400 }
        );
      }

      if (sizeInfo.stock < item.quantity) {
        return NextResponse.json(
          { 
            error: `Insufficient stock for "${product.name}" (Size: ${item.size}). Only ${sizeInfo.stock} available, but ${item.quantity} requested.` 
          },
          { status: 400 }
        );
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.discountPrice || product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });

      itemsTotal += (product.discountPrice || product.price) * item.quantity;
    }

    // Calculate shipping (free above ₹999)
    const shippingCharge = itemsTotal >= 999 ? 0 : 79;
    const totalAmount = itemsTotal + shippingCharge;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: userDoc._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsTotal,
      shippingCharge,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
    });

    // Deduct stock from products after order is created
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        // Find the size and deduct stock
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].stock = Math.max(0, product.sizes[sizeIndex].stock - item.quantity);
        }
        // Recalculate total stock
        product.totalStock = product.sizes.reduce((acc, s) => acc + (s.stock || 0), 0);
        // Increment sold count
        product.soldCount = (product.soldCount || 0) + item.quantity;
        await product.save();
      }
    }

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
