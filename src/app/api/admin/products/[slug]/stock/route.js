import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// PUT - Update stock for specific sizes
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const { sizes } = await request.json();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update sizes
    product.sizes = sizes;
    
    // Recalculate total stock
    product.totalStock = sizes.reduce((acc, size) => acc + (size.stock || 0), 0);
    
    await product.save();

    return NextResponse.json({ 
      product, 
      message: 'Stock updated successfully' 
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
