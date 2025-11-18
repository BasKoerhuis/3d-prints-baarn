import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, GalleryImage } from '@/types';

// Lazy load Supabase client - alleen aanmaken wanneer nodig
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase environment variables ontbreken! Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in je .env.local bestand staan.\n' +
        `URL: ${supabaseUrl ? '✅ gevonden' : '❌ ONTBREEKT'}\n` +
        `Key: ${supabaseAnonKey ? '✅ gevonden' : '❌ ONTBREEKT'}`
      );
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseInstance;
}

// Database row types (snake_case zoals in PostgreSQL)
interface ProductRow {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  dimensions: string;
  features: string[];
  price_child: number;
  price_adult: number;
  images: string[];
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryRow {
  id: string;
  filename: string;
  path: string;
  alt: string;
  tags: string[];
  uploaded_at: string;
}

// Converter functies: database ↔ application
function dbToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    dimensions: row.dimensions,
    features: row.features,
    priceChild: row.price_child,
    priceAdult: row.price_adult,
    images: row.images,
    inStock: row.in_stock,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function productToDb(product: Partial<Product>): Partial<ProductRow> {
  const dbProduct: any = {};
  if (product.name !== undefined) dbProduct.name = product.name;
  if (product.slug !== undefined) dbProduct.slug = product.slug;
  if (product.shortDescription !== undefined) dbProduct.short_description = product.shortDescription;
  if (product.longDescription !== undefined) dbProduct.long_description = product.longDescription;
  if (product.dimensions !== undefined) dbProduct.dimensions = product.dimensions;
  if (product.features !== undefined) dbProduct.features = product.features;
  if (product.priceChild !== undefined) dbProduct.price_child = product.priceChild;
  if (product.priceAdult !== undefined) dbProduct.price_adult = product.priceAdult;
  if (product.images !== undefined) dbProduct.images = product.images;
  if (product.inStock !== undefined) dbProduct.in_stock = product.inStock;
  return dbProduct;
}

function dbToGalleryImage(row: GalleryRow): GalleryImage {
  return {
    id: row.id,
    filename: row.filename,
    path: row.path,
    alt: row.alt,
    tags: row.tags,
    uploadedAt: row.uploaded_at,
  };
}

function galleryToDb(image: Partial<GalleryImage>): Partial<GalleryRow> {
  const dbImage: any = {};
  if (image.filename !== undefined) dbImage.filename = image.filename;
  if (image.path !== undefined) dbImage.path = image.path;
  if (image.alt !== undefined) dbImage.alt = image.alt;
  if (image.tags !== undefined) dbImage.tags = image.tags;
  return dbImage;
}

// Product functions
export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data ? data.map(dbToProduct) : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data ? dbToProduct(data) : null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? dbToProduct(data) : null;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    const supabase = getSupabase();
    const dbProduct = productToDb(product);
    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct)
      .select()
      .single();
    
    if (error) throw error;
    return dbToProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const supabase = getSupabase();
    const dbUpdates = productToDb(updates);
    // Voeg updated_at toe
    (dbUpdates as any).updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? dbToProduct(data) : null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Gallery functions
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data ? data.map(dbToGalleryImage) : [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? dbToGalleryImage(data) : null;
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return null;
  }
}

export async function createGalleryImage(image: Omit<GalleryImage, 'id' | 'uploadedAt'>): Promise<GalleryImage> {
  try {
    const supabase = getSupabase();
    const dbImage = galleryToDb(image);
    const { data, error } = await supabase
      .from('gallery')
      .insert(dbImage)
      .select()
      .single();
    
    if (error) throw error;
    return dbToGalleryImage(data);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    throw error;
  }
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage | null> {
  try {
    const supabase = getSupabase();
    const dbUpdates = galleryToDb(updates);
    const { data, error } = await supabase
      .from('gallery')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? dbToGalleryImage(data) : null;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return null;
  }
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }
}

// Slug generator (blijft hetzelfde)
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}