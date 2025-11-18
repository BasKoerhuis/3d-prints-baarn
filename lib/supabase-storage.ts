import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload een afbeelding naar Supabase Storage
 * @param buffer - Het bestand als Buffer
 * @param folder - De folder in de bucket ('gallery' of 'products')
 * @param filename - De bestandsnaam
 * @returns Promise met het resultaat en de publieke URL
 */
export async function uploadToSupabase(
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<UploadResult> {
  try {
    const path = `${folder}/${filename}`;
    
    // Upload naar Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, buffer, {
        contentType: 'image/jpeg,image/png,image/jpg,image/webp',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Genereer de publieke URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(path);

    return {
      success: true,
      url: publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Verwijder een afbeelding van Supabase Storage
 * @param path - Het pad in de bucket (bijv. 'gallery/image.jpg')
 */
export async function deleteFromSupabase(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}