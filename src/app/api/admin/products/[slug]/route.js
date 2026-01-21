import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Get single product by slug
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const body = await request.json();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update fields
    const updateData = {
      name: body.name || product.name,
      description: body.description || product.description,
      price: body.price !== undefined ? body.price : product.price,
      discountPrice: body.discountPrice !== undefined ? body.discountPrice : product.discountPrice,
      category: body.category || product.category,
      fabric: body.fabric !== undefined ? body.fabric : product.fabric,
      featured: body.featured !== undefined ? body.featured : product.featured,
      isActive: body.isActive !== undefined ? body.isActive : product.isActive,
      images: body.images || product.images,
      sizes: body.sizes || product.sizes,
      colors: body.colors || product.colors,
    };

    // Recalculate total stock if sizes changed
    if (body.sizes) {
      updateData.totalStock = body.sizes.reduce((acc, size) => acc + (size.stock || 0), 0);
    }

    // Update slug if name changed
    if (body.name && body.name !== product.name) {
      updateData.slug = body.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );

    return NextResponse.json({ product: updatedProduct, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { slug } = await params;
    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
