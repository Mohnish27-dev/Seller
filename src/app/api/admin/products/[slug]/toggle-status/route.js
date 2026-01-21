import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// PUT - Toggle product active status (pause/unpause)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const { isActive } = await request.json();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    product.isActive = isActive;
    await product.save();

    return NextResponse.json({ 
      product, 
      message: isActive ? 'Product activated' : 'Product paused' 
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 });
  }
}
