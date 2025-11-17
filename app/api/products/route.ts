import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct, generateSlug } from '@/lib/data';
import { requireAdmin } from '@/lib/auth-middleware';

// GET all products
export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const data = await request.json();
    
    const slug = generateSlug(data.name);
    
    const product = createProduct({
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      dimensions: data.dimensions,
      features: data.features || [],
      priceChild: parseFloat(data.priceChild),
      priceAdult: parseFloat(data.priceAdult),
      images: data.images || [],
      inStock: data.inStock !== false
    });

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
