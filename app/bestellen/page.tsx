'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product, OrderProduct } from '@/types';
import { siteConfig } from '@/config/site';

function OrderPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    contactMethod: 'email' as 'email' | 'phone',
    contactValue: '',
    dropoffLocation: siteConfig.dropoffLocations[0],
    comments: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data || []);

      // Pre-select product from URL
      const productId = searchParams.get('product');
      if (productId) {
        const product = data.data.find((p: Product) => p.id === productId);
        if (product) {
         setSelectedProducts([{
  productId: product.id,
  productName: product.name,
  quantity: 1,
  priceType: 'child',
  price: product.priceChild
}]);
        }
      }
    }
    fetchProducts();
  }, [searchParams]);

  const addProduct = () => {
    if (products.length > 0) {
      setSelectedProducts([...selectedProducts, {
        productId: products[0].id,
        productName: products[0].name,
        quantity: 1,
        priceType: 'child'
      }]);
    }
  };

  const updateProduct = (index: number, updates: Partial<OrderProduct>) => {
    const newProducts = [...selectedProducts];
    newProducts[index] = { ...newProducts[index], ...updates };
    
    // Update product name when product changes
    if (updates.productId) {
      const product = products.find(p => p.id === updates.productId);
      if (product) {
        newProducts[index].productName = product.name;
      }
    }
    
    setSelectedProducts(newProducts);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const getProductPrice = (productId: string, priceType: 'child' | 'adult'): number => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    return priceType === 'child' ? product.priceChild : product.priceAdult;
  };

  const calculateTotal = (): number => {
    return selectedProducts.reduce((total, item) => {
      const price = getProductPrice(item.productId, item.priceType);
      return total + (price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      setStatus('error');
      setMessage('Selecteer minimaal één product');
      return;
    }

    setStatus('loading');

    // Add prices to products before sending
    const productsWithPrices = selectedProducts.map(item => ({
      ...item,
      price: getProductPrice(item.productId, item.priceType)
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: productsWithPrices
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('Bedankt voor je bestelling! We nemen snel contact met je op.');
        setFormData({
          name: '',
          address: '',
          postalCode: '',
          city: '',
          contactMethod: 'email',
          contactValue: '',
          dropoffLocation: siteConfig.dropoffLocations[0],
          comments: ''
        });
        setSelectedProducts([]);
      } else {
        setStatus('error');
        setMessage(data.error || 'Er ging iets mis');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Er ging iets mis. Probeer het opnieuw.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 section">
        <div className="container max-w-4xl">
          <h1 className="mb-8 text-center">Bestellen</h1>
          
          {status === 'success' ? (
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold mb-4">Bestelling Verzonden!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button onClick={() => setStatus('idle')} className="btn-primary">
                Nieuwe Bestelling
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Jouw Gegevens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Naam *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Adres *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Straatnaam en huisnummer"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postcode *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="1234 AB"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Woonplaats *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact via *</label>
                    <select
                      className="input"
                      value={formData.contactMethod}
                      onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as 'email' | 'phone' })}
                    >
                      <option value="email">E-mail</option>
                      <option value="phone">Telefoon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {formData.contactMethod === 'email' ? 'E-mailadres' : 'Telefoonnummer'} *
                    </label>
                    <input
                      type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                      className="input"
                      value={formData.contactValue}
                      onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Producten</h3>
                {selectedProducts.map((item, index) => {
                  const price = getProductPrice(item.productId, item.priceType);
                  const lineTotal = price * item.quantity;
                  
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Product</label>
                          <select
                            className="input"
                            value={item.productId}
                            onChange={(e) => updateProduct(index, { productId: e.target.value })}
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Aantal</label>
                          <input
                            type="number"
                            min="1"
                            className="input"
                            value={item.quantity}
                            onChange={(e) => updateProduct(index, { quantity: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Prijs</label>
                          <select
                            className="input"
                            value={item.priceType}
                            onChange={(e) => updateProduct(index, { priceType: e.target.value as 'child' | 'adult' })}
                          >
                            <option value="child">Kind (€{price.toFixed(2)})</option>
                            <option value="adult">Volwassene (€{getProductPrice(item.productId, 'adult').toFixed(2)})</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {item.quantity} x €{price.toFixed(2)} = <span className="font-semibold">€{lineTotal.toFixed(2)}</span>
                        </div>
                        {selectedProducts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Verwijderen
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button type="button" onClick={addProduct} className="btn-secondary w-full mb-4">
                  + Product Toevoegen
                </button>
                
                {selectedProducts.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Totaal:</span>
                      <span className="text-[var(--accent-color)]">€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Bezorging</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Aflevering *</label>
                    <select
                      className="input"
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                    >
                      {siteConfig.dropoffLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Opmerkingen (optioneel)</label>
                    <textarea
                      className="textarea"
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Bijv. kleurvoorkeur, speciale wensen, etc."
                    />
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 rounded-lg bg-red-50 text-red-800">
                  {message}
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                {status === 'loading' ? 'Bestelling Verzenden...' : 'Bestelling Plaatsen'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderPageWrapper() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <OrderPage />
    </Suspense>
  );
}