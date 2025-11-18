// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  dimensions?: string;
  features: string[];
  priceChild: number;
  priceAdult: number;
  images: string[]; // Array of image paths
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  shortDescription: string;
  longDescription: string;
  dimensions?: string;
  features: string;
  priceChild: number;
  priceAdult: number;
  inStock: boolean;
}

// Image Types
export interface GalleryImage {
  id: string;
  filename: string;
  path: string;
  alt: string;
  tags: string[];
  uploadedAt: string;
}

// Order Types
export interface OrderFormData {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  contactMethod: 'email' | 'phone';
  contactValue: string;
  products: OrderProduct[];
  dropoffLocation: string;
  comments: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  priceType: 'child' | 'adult';
  price: number;
}

// Config Types
export interface SiteConfig {
  siteName: string;
  tagline: string;
  orderEmail: string;
  accentColor: string;
  dropoffLocations: string[];
}

// Auth Types
export interface AdminUser {
  username: string;
  passwordHash: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// FAQ Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

// About Content
export interface AboutContent {
  title: string;
  content: string;
  makerName: string;
  makerAge: number;
  makerPhoto?: string;
}