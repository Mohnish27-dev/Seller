import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

// GET user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email })
      .select('-password')
      .populate('wishlist');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $in: ['$orderStatus', ['pending', 'confirmed', 'processing', 'shipped']] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      deliveredOrders: 0,
      pendingOrders: 0
    };

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlistCount: user.wishlist?.length || 0,
        createdAt: user.createdAt,
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, addresses } = body;

    await connectDB();

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
