import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/data';

// GET - Haal een specifiek product op
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Kon product niet ophalen' },
      { status: 500 }
    );
  }
}

// PUT - Update een product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Parse updates
    const updates: any = {};
    
    if (body.name !== undefined) updates.name = body.name;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.shortDescription !== undefined) updates.shortDescription = body.shortDescription;
    if (body.longDescription !== undefined) updates.longDescription = body.longDescription;
    if (body.dimensions !== undefined) updates.dimensions = body.dimensions;
    if (body.features !== undefined) updates.features = Array.isArray(body.features) ? body.features : [];
    if (body.priceChild !== undefined) updates.priceChild = parseFloat(body.priceChild);
    if (body.priceAdult !== undefined) updates.priceAdult = parseFloat(body.priceAdult);
    if (body.inStock !== undefined) updates.inStock = body.inStock;
    if (body.images !== undefined) updates.images = Array.isArray(body.images) ? body.images : [];

    const updatedProduct = await updateProduct(params.id, updates);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product succesvol bijgewerkt'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Kon product niet bijwerken' },
      { status: 500 }
    );
  }
}

// DELETE - Verwijder een product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProduct(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Product niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product succesvol verwijderd'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Kon product niet verwijderen' },
      { status: 500 }
    );
  }
}