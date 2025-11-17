import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/data';
import { requireAdmin } from '@/lib/auth-middleware';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = getProductById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const data = await request.json();
    
    const updates = {
      ...(data.name && { name: data.name }),
      ...(data.shortDescription && { shortDescription: data.shortDescription }),
      ...(data.longDescription && { longDescription: data.longDescription }),
      ...(data.dimensions && { dimensions: data.dimensions }),
      ...(data.features && { features: data.features }),
      ...(data.priceChild !== undefined && { priceChild: parseFloat(data.priceChild) }),
      ...(data.priceAdult !== undefined && { priceAdult: parseFloat(data.priceAdult) }),
      ...(data.images && { images: data.images }),
      ...(data.inStock !== undefined && { inStock: data.inStock })
    };

    const product = updateProduct(params.id, updates);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const success = deleteProduct(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
