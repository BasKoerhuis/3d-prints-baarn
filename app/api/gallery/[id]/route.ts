import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImageById, updateGalleryImage, deleteGalleryImage } from '@/lib/data';
import { deleteFromSupabase } from '@/lib/supabase-storage';

// GET - Haal een specifieke galerij afbeelding op
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await getGalleryImageById(params.id);
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Afbeelding niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Kon afbeelding niet ophalen' },
      { status: 500 }
    );
  }
}

// PUT - Update een galerij afbeelding (metadata)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updates: any = {};
    if (body.alt !== undefined) updates.alt = body.alt;
    if (body.tags !== undefined) updates.tags = body.tags;

    const updatedImage = await updateGalleryImage(params.id, updates);

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: 'Afbeelding niet gevonden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: 'Afbeelding succesvol bijgewerkt'
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Kon afbeelding niet bijwerken' },
      { status: 500 }
    );
  }
}

// DELETE - Verwijder een galerij afbeelding
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Haal eerst de afbeelding op om het path te krijgen
    const image = await getGalleryImageById(params.id);
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Afbeelding niet gevonden' },
        { status: 404 }
      );
    }

    // Extraheer het path uit de Supabase URL
    // Bijvoorbeeld: https://xxx.supabase.co/storage/v1/object/public/images/gallery/image.jpg
    // We hebben alleen 'gallery/image.jpg' nodig
    const url = new URL(image.path);
    const pathParts = url.pathname.split('/');
    const storageIndex = pathParts.indexOf('images');
    const storagePath = pathParts.slice(storageIndex + 1).join('/');

    // Verwijder van Supabase Storage
    await deleteFromSupabase(storagePath);
    
    // Verwijder uit database
    const success = await deleteGalleryImage(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Afbeelding niet gevonden in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Afbeelding succesvol verwijderd'
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Kon afbeelding niet verwijderen' },
      { status: 500 }
    );
  }
}