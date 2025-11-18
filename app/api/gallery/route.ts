import { NextRequest, NextResponse } from 'next/server';
import { getAllGalleryImages, createGalleryImage } from '@/lib/data';
import { uploadToSupabase } from '@/lib/supabase-storage';

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
        // Genereer unieke filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2);
        const extension = file.name.split('.').pop();
        const filename = `gallery-${timestamp}-${randomStr}.${extension}`;
        
        // Upload naar Supabase Storage
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await uploadToSupabase(buffer, 'gallery', filename);
        
        if (!uploadResult.success) {
          console.error(`Failed to upload ${file.name}:`, uploadResult.error);
          continue; // Skip dit bestand en ga door met de volgende
        }
        
        // Sla metadata op in database
        const newImage = await createGalleryImage({
          filename,
          path: uploadResult.url!, // De publieke URL van Supabase
          alt: alt || file.name,
          tags
        });
        
        uploadedImages.push(newImage);
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Geen afbeeldingen succesvol geüpload' },
        { status: 500 }
      );
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