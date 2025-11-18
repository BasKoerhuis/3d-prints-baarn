import { NextRequest, NextResponse } from 'next/server';
import { getAllGalleryImages, createGalleryImage } from '@/lib/data';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// GET - Haal alle galerij afbeeldingen op
export async function GET() {
  try {
    const images = await getAllGalleryImages();
    return NextResponse.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { success: false, error: 'Kon afbeeldingen niet ophalen' },
      { status: 500 }
    );
  }
}

// POST - Upload nieuwe galerij afbeeldingen
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const alt = formData.get('alt') as string || '';
    const tagsString = formData.get('tags') as string || '';
    const tags = tagsString.split(',').map(t => t.trim()).filter(t => t);
    
    const files = formData.getAll('files') as File[];
    const uploadedImages = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `gallery-${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
        const filepath = join(process.cwd(), 'public', 'uploads', 'gallery', filename);
        
        await writeFile(filepath, buffer);
        
        const newImage = await createGalleryImage({
          filename,
          path: `/uploads/gallery/${filename}`,
          alt: alt || file.name,
          tags
        });
        
        uploadedImages.push(newImage);
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} afbeelding(en) succesvol geüpload`
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Kon afbeeldingen niet uploaden' },
      { status: 500 }
    );
  }
}