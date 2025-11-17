import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImageById, updateGalleryImage, deleteGalleryImage } from '@/lib/data';
import { requireAdmin } from '@/lib/auth-middleware';
import { unlink } from 'fs/promises';
import path from 'path';

// PUT update gallery image (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const data = await request.json();
    
    const updates = {
      ...(data.alt && { alt: data.alt }),
      ...(data.tags && { tags: data.tags })
    };

    const image = updateGalleryImage(params.id, updates);

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE gallery image (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const image = getGalleryImageById(params.id);
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'public', image.path);
    try {
      await unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Delete from database
    const success = deleteGalleryImage(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
