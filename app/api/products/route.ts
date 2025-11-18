import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/data';
import { generateSlug } from '@/lib/data';

// GET - Haal alle producten op
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Kon producten niet ophalen' },
      { status: 500 }
    );
  }
}

// POST - Maak een nieuw product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse product data
   const productData = {
  name: body.name,
  slug: body.slug || generateSlug(body.name),
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      dimensions: body.dimensions,
      features: Array.isArray(body.features) ? body.features : [],
      priceChild: parseFloat(body.priceChild),
      priceAdult: parseFloat(body.priceAdult),
      inStock: body.inStock,
      images: Array.isArray(body.images) ? body.images : []
    };

    const newProduct = await createProduct(productData);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product succesvol aangemaakt'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Kon product niet aanmaken' },
      { status: 500 }
    );
  }
}