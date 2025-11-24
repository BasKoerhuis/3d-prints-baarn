export const dynamic = 'force-dynamic';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/data';

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 section">
        <div className="container">
          <h1 className="mb-8">Winkel</h1>
          <p className="text-xl text-gray-600 mb-12">
            Bekijk al onze beschikbare 3D prints
          </p>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nog geen producten beschikbaar.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
