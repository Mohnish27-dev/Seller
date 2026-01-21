import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Helper to get user document
async function getUserDoc(session) {
  if (!session?.user?.id) return null;
  
  let userDoc = null;
  if (session.user.id.length === 24) {
    userDoc = await User.findById(session.user.id);
  } else {
    userDoc = await User.findOne({ googleId: session.user.id });
  }
  return userDoc;
}

// GET wishlist
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ wishlist: [] });
    }

    await connectDB();

    const userDoc = await getUserDoc(session);
    if (!userDoc) {
      return NextResponse.json({ wishlist: [] });
    }

    // Populate wishlist with product details
    await userDoc.populate({
      path: 'wishlist',
      select: 'name slug images price discountPrice category sizes colors',
    });

    return NextResponse.json({ wishlist: userDoc.wishlist || [] });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST add/remove from wishlist
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Please login to manage wishlist' }, { status: 401 });
    }

    await connectDB();

    const { productId, action } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const userDoc = await getUserDoc(session);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    if (action === 'add') {
      // Add to wishlist if not already present
      const mongoose = (await import('mongoose')).default;
      const productObjectId = new mongoose.Types.ObjectId(productId);
      const alreadyExists = userDoc.wishlist.some(
        id => id.toString() === productId
      );
      if (!alreadyExists) {
        userDoc.wishlist.push(productObjectId);
        await userDoc.save();
      }
    } else if (action === 'remove') {
      // Remove from wishlist
      userDoc.wishlist = userDoc.wishlist.filter(
        id => id.toString() !== productId
      );
      await userDoc.save();
    }

    // Populate and return updated wishlist
    await userDoc.populate({
      path: 'wishlist',
      select: 'name slug images price discountPrice category sizes colors',
    });

    return NextResponse.json({ wishlist: userDoc.wishlist || [] });
  } catch (error) {
    console.error('Update wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}
