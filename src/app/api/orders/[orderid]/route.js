import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// GET a single order by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { orderid } = await params;

    const order = await Order.findById(orderid)
      .populate('items.product', 'name images slug');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if the order belongs to the current user
    const userId = session.user.id;
    
    // Handle both MongoDB ObjectId (credentials) and Google ID
    let isOwner = false;
    if (order.user.toString() === userId) {
      isOwner = true;
    } else {
      // For Google users, we need to check if the user document matches
      const User = (await import('@/models/User')).default;
      let userDoc = null;
      
      if (userId.length === 24) {
        userDoc = await User.findById(userId);
      } else {
        userDoc = await User.findOne({ googleId: userId });
      }
      
      if (userDoc && order.user.toString() === userDoc._id.toString()) {
        isOwner = true;
      }
    }

    // Allow admin users to view any order
    if (!isOwner && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
