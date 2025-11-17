'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GalleryImage } from '@/types';
import { X, ZoomIn, Tag } from 'lucide-react';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        setImages(data.data || []);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(images.flatMap(img => img.tags))
  ).sort();

  // Filter images by selected tag
  const filteredImages = selectedTag 
    ? images.filter(img => img.tags.includes(selectedTag))
    : images;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white pt-20 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
          
          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Mijn creaties
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                Een verzameling van mijn mooiste 3D prints
              </p>
            </div>
          </div>
        </section>

        <div className="container py-12">
          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? 'bg-[var(--accent-color)] text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Alles
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-[var(--accent-color)] text-white shadow-lg'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-24">
              <div className="spinner mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Laden...</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <>
              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {filteredImages.map((image) => (
                  <div 
                    key={image.id} 
                    className="break-inside-avoid group relative"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300">
                      <img 
                        src={image.path} 
                        alt={image.alt} 
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="font-medium mb-1">{image.alt}</p>
                          {image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {image.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setSelectedImage(image)}
                          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                          aria-label="Vergroot afbeelding"
                        >
                          <ZoomIn className="w-5 h-5 text-gray-900" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result count */}
              <div className="text-center mt-12 text-gray-600">
                {filteredImages.length} foto{filteredImages.length !== 1 ? "'s" : ''}
                {selectedTag && ` met tag "${selectedTag}"`}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Geen foto's gevonden</h3>
                <p className="text-gray-600">
                  {selectedTag 
                    ? `Er zijn geen foto's met de tag "${selectedTag}"`
                    : 'Er zijn nog geen afbeeldingen in de galerij.'
                  }
                </p>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="mt-6 btn-primary"
                  >
                    Toon alles
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors z-10"
            aria-label="Sluit lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div 
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.path}
              alt={selectedImage.alt}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-2xl">
              <h3 className="text-white text-2xl font-bold mb-2">
                {selectedImage.alt}
              </h3>
              {selectedImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}