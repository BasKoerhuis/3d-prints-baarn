import fs from 'fs';
import path from 'path';
import { Product, GalleryImage } from '@/types';

// Data directories
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

// Ensure data directories exist
export function ensureDataDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(GALLERY_FILE)) {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify([]));
  }
}

// Product functions
export function getAllProducts(): Product[] {
  ensureDataDirs();
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function getProductBySlug(slug: string): Product | null {
  const products = getAllProducts();
  return products.find(p => p.slug === slug) || null;
}

export function getProductById(id: string): Product | null {
  const products = getAllProducts();
  return products.find(p => p.id === id) || null;
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const products = getAllProducts();
  const newProduct: Product = {
    ...product,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id, // Prevent ID change
    createdAt: products[index].createdAt, // Prevent createdAt change
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getAllProducts();
  const newProducts = products.filter(p => p.id !== id);
  
  if (newProducts.length === products.length) return false;
  
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(newProducts, null, 2));
  return true;
}

// Gallery functions
export function getAllGalleryImages(): GalleryImage[] {
  ensureDataDirs();
  try {
    const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function getGalleryImageById(id: string): GalleryImage | null {
  const images = getAllGalleryImages();
  return images.find(img => img.id === id) || null;
}

export function createGalleryImage(image: Omit<GalleryImage, 'id' | 'uploadedAt'>): GalleryImage {
  const images = getAllGalleryImages();
  const newImage: GalleryImage = {
    ...image,
    id: generateId(),
    uploadedAt: new Date().toISOString()
  };
  images.push(newImage);
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(images, null, 2));
  return newImage;
}

export function updateGalleryImage(id: string, updates: Partial<GalleryImage>): GalleryImage | null {
  const images = getAllGalleryImages();
  const index = images.findIndex(img => img.id === id);
  
  if (index === -1) return null;
  
  images[index] = {
    ...images[index],
    ...updates,
    id: images[index].id,
    uploadedAt: images[index].uploadedAt
  };
  
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(images, null, 2));
  return images[index];
}

export function deleteGalleryImage(id: string): boolean {
  const images = getAllGalleryImages();
  const newImages = images.filter(img => img.id !== id);
  
  if (newImages.length === images.length) return false;
  
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(newImages, null, 2));
  return true;
}

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
