'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const found = data.data.find((p: Product) => p.slug === params.slug);
        setProduct(found || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>Laden...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 section">
          <div className="container text-center">
            <h1 className="mb-4">Product niet gevonden</h1>
            <Link href="/winkel" className="btn-primary inline-block">
              Terug naar Winkel
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img
                  src={product.images[currentImage] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        currentImage === idx ? 'border-[var(--accent-color)]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{product.shortDescription}</p>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Prijzen</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kinderprijs (t/m 15 jaar):</span>
                    <span className="font-semibold text-[var(--accent-color)]">€{product.priceChild.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volwassen prijs:</span>
                    <span className="font-semibold text-[var(--accent-color)]">€{product.priceAdult.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Specificaties</h3>
                <p className="text-gray-600 mb-2"><strong>Afmetingen:</strong> {product.dimensions}</p>
                {product.features.length > 0 && (
                  <div>
                    <strong className="block mb-2">Kenmerken:</strong>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Beschrijving</h3>
                <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
              </div>

              {/* CTA */}
              <Link 
                href={`/bestellen?product=${product.id}`}
                className="btn-primary inline-block w-full text-center"
              >
                Bestellen
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
