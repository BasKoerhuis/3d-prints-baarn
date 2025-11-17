import { NextRequest, NextResponse } from 'next/server';
import { getAllGalleryImages, createGalleryImage } from '@/lib/data';
import { requireAdmin } from '@/lib/auth-middleware';
import { writeFile } from 'fs/promises';
import path from 'path';

// GET all gallery images
export async function GET() {
  try {
    const images = getAllGalleryImages();
    return NextResponse.json({
      success: true,
      data: images
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST upload new image(s) (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const alt = formData.get('alt') as string || '';
    const tags = formData.get('tags') as string || '';
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    // Process each file
    for (const file of files) {
      if (!file || file.size === 0) continue;

      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const ext = path.extname(file.name);
      const filename = `gallery-${timestamp}-${randomSuffix}${ext}`;
      
      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', filename);
      await writeFile(uploadPath, buffer);

      // Create gallery image record
      const image = createGalleryImage({
        filename,
        path: `/uploads/gallery/${filename}`,
        alt: alt || file.name,
        tags: tags ? tags.split(',').map(t => t.trim()) : []
      });

      uploadedImages.push(image);
    }

    return NextResponse.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} afbeelding(en) geüpload`
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
} 