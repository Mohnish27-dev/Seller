import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - List all products (admin)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const stock = searchParams.get('stock');
    const search = searchParams.get('search');

    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'paused') {
      query.isActive = false;
    }

    if (stock === 'out') {
      query.totalStock = 0;
    } else if (stock === 'low') {
      query.totalStock = { $gt: 0, $lt: 10 };
    } else if (stock === 'in') {
      query.totalStock = { $gte: 10 };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      fabric,
      featured,
      isActive,
      images,
      sizes,
      colors,
    } = body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one product image' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with a similar name already exists' },
        { status: 400 }
      );
    }

    // Calculate total stock
    const totalStock = sizes.reduce((acc, size) => acc + (size.stock || 0), 0);

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discountPrice: discountPrice || 0,
      category,
      fabric: fabric || '',
      featured: featured || false,
      isActive: isActive !== undefined ? isActive : true,
      images,
      sizes,
      colors: colors || [],
      totalStock,
    });

    return NextResponse.json({ product, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
