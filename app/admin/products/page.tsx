'use client';

import { useEffect, useState } from 'react';
import { Product, GalleryImage } from '@/types';
import { ChevronLeft, ChevronRight, X, Plus, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    dimensions: '',
    features: '',
    priceChild: '',
    priceAdult: '',
    inStock: true,
    images: [] as string[]
  });

  useEffect(() => {
    fetchProducts();
    fetchGalleryImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setGalleryImages(data.data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim()),
      priceChild: parseFloat(formData.priceChild),
      priceAdult: parseFloat(formData.priceAdult),
      images: formData.images
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      alert('Er ging iets mis');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      dimensions: product.dimensions || '',
      features: product.features.join('\n'),
      priceChild: product.priceChild.toString(),
      priceAdult: product.priceAdult.toString(),
      inStock: product.inStock,
      images: product.images || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      alert('Er ging iets mis');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      longDescription: '',
      dimensions: '',
      features: '',
      priceChild: '',
      priceAdult: '',
      inStock: true,
      images: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const addImageToProduct = (imagePath: string) => {
    if (!formData.images.includes(imagePath)) {
      setFormData({ ...formData, images: [...formData.images, imagePath] });
    }
  };

  const removeImageFromProduct = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setFormData({ ...formData, images: newImages });
  };

  if (loading) {
    return <div className="text-center py-12"><div className="spinner mx-auto"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Producten Beheren</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuleren' : '+ Nieuw Product'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editingProduct ? 'Product Bewerken' : 'Nieuw Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Foto's</label>
              <div className="space-y-3">
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {formData.images.map((imagePath, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imagePath}
                          alt={`Product foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded border-2 border-gray-200"
                        />
                        <div className="absolute top-1 right-1 flex gap-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'up')}
                              className="bg-white rounded p-1.5 shadow hover:bg-gray-100 transition-colors"
                              title="Naar links"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}
                          {index < formData.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'down')}
                              className="bg-white rounded p-1.5 shadow hover:bg-gray-100 transition-colors"
                              title="Naar rechts"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImageFromProduct(index)}
                            className="bg-red-500 text-white rounded p-1.5 shadow hover:bg-red-600 transition-colors"
                            title="Verwijderen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Foto's Toevoegen uit Galerij
                </button>
                {formData.images.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Nog geen foto's toegevoegd. Klik op de knop hierboven om foto's te selecteren.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of the form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Productnaam *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Korte beschrijving *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Lange beschrijving *</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Afmetingen</label>
                <input
                  type="text"
                  className="input"
                  placeholder="bijv. 10 x 5 x 3 cm"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
               
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kenmerken (1 per regel)</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kinderprijs (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.priceChild}
                  onChange={(e) => setFormData({ ...formData, priceChild: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Volwassen prijs (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.priceAdult}
                  onChange={(e) => setFormData({ ...formData, priceAdult: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-5 h-5 text-[var(--accent-color)] rounded"
                  />
                  <span className="text-sm font-medium">Op voorraad</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Opslaan' : 'Product Aanmaken'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Annuleren
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div key={product.id} className="card p-6">
            <div className="flex gap-4">
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                  ))}
                  {product.images.length > 3 && (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
                      +{product.images.length - 3}
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.shortDescription}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>Kind: €{product.priceChild.toFixed(2)}</span>
                  <span>Volwassene: €{product.priceAdult.toFixed(2)}</span>
                  <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                    {product.inStock ? '✓ Op voorraad' : '✗ Niet op voorraad'}
                  </span>
                  {product.images && (
                    <span className="text-blue-600">{product.images.length} foto's</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="btn-ghost">
                  Bewerken
                </button>
                <button onClick={() => handleDelete(product.id)} className="btn-ghost text-red-600">
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-600">
          <p>Nog geen producten. Klik op '+ Nieuw Product' om te beginnen.</p>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Selecteer Foto's uit Galerij</h3>
              <button
                onClick={() => setShowImagePicker(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {galleryImages.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>Geen foto's in de galerij. Upload eerst foto's via de Galerij pagina.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {galleryImages.map((image) => {
                  const isSelected = formData.images.includes(image.path);
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => addImageToProduct(image.path)}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                        isSelected 
                          ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)] ring-opacity-50' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image.path}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-[var(--accent-color)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {formData.images.length} foto{formData.images.length !== 1 ? "'s" : ''} geselecteerd
              </p>
              <button
                onClick={() => setShowImagePicker(false)}
                className="btn-primary"
              >
                Klaar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}