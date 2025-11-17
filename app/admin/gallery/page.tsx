'use client';

import { useEffect, useState } from 'react';
import { GalleryImage } from '@/types';
import { Upload, X, Edit2, Trash2 } from 'lucide-react';

interface FileWithPreview {
  file: File;
  preview: string;
  alt: string;
  tags: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editFormData, setEditFormData] = useState({ alt: '', tags: '' });
  
  // Upload preview state
  const [filesToUpload, setFilesToUpload] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: FileWithPreview[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newFiles.push({
          file,
          preview,
          alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          tags: ''
        });
      }
    });

    setFilesToUpload(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFileFromQueue = (index: number) => {
    setFilesToUpload(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileMetadata = (index: number, field: 'alt' | 'tags', value: string) => {
    setFilesToUpload(prev => {
      const newFiles = [...prev];
      newFiles[index][field] = value;
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    
    setUploading(true);

    try {
      // Upload each file separately with its own metadata
      for (const fileData of filesToUpload) {
        const formData = new FormData();
        formData.append('files', fileData.file);
        formData.append('alt', fileData.alt);
        formData.append('tags', fileData.tags);

        const res = await fetch('/api/gallery', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(`Upload failed for ${fileData.file.name}`);
        }
      }

      // Clear previews
      filesToUpload.forEach(f => URL.revokeObjectURL(f.preview));
      setFilesToUpload([]);
      
      // Refresh gallery
      await fetchImages();
      alert('Alle foto\'s succesvol geüpload!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Er ging iets mis bij het uploaden');
    } finally {
      setUploading(false);
    }
  };

  const startEditingImage = (image: GalleryImage) => {
    setEditingImage(image);
    setEditFormData({
      alt: image.alt,
      tags: image.tags.join(', ')
    });
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      const res = await fetch(`/api/gallery/${editingImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: editFormData.alt,
          tags: editFormData.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (res.ok) {
        fetchImages();
        setEditingImage(null);
      }
    } catch (error) {
      alert('Er ging iets mis');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze afbeelding wilt verwijderen?')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchImages();
      }
    } catch (error) {
      alert('Er ging iets mis');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="spinner mx-auto"></div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Galerij Beheren</h1>

      {/* Upload Area */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Foto's Uploaden</h2>
        
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-[var(--accent-color)] bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium">Sleep foto's hierheen</p>
              <p className="text-sm text-gray-600 mt-1">of</p>
            </div>
            <label className="btn-primary inline-block cursor-pointer">
              Selecteer Bestanden
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Preview & Metadata */}
        {filesToUpload.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Te uploaden foto's ({filesToUpload.length})</h3>
            <div className="space-y-3">
              {filesToUpload.map((fileData, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={fileData.preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Beschrijving (bijv. Minecraft Creeper)"
                      value={fileData.alt}
                      onChange={(e) => updateFileMetadata(index, 'alt', e.target.value)}
                      className="input text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Tags (komma gescheiden, bijv. minecraft, creeper)"
                      value={fileData.tags}
                      onChange={(e) => updateFileMetadata(index, 'tags', e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeFileFromQueue(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Verwijderen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? 'Uploaden...' : `Upload ${filesToUpload.length} foto${filesToUpload.length > 1 ? "'s" : ''}`}
              </button>
              <button
                onClick={() => {
                  filesToUpload.forEach(f => URL.revokeObjectURL(f.preview));
                  setFilesToUpload([]);
                }}
                className="btn-secondary"
              >
                Alles Annuleren
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="card overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={image.path} alt={image.alt} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-800 mb-1 font-medium truncate">{image.alt}</p>
              {image.tags.length > 0 && (
                <p className="text-xs text-gray-500 mb-3">
                  {image.tags.join(', ')}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => startEditingImage(image)}
                  className="text-sm text-[var(--accent-color)] hover:underline inline-flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Bewerken
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-sm text-red-600 hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <p>Nog geen afbeeldingen in de galerij. Upload je eerste foto's hierboven.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Foto Bewerken</h3>
            <div className="space-y-4">
              <div>
                <img
                  src={editingImage.path}
                  alt={editingImage.alt}
                  className="w-full max-h-64 object-contain bg-gray-100 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Beschrijving</label>
                <input
                  type="text"
                  value={editFormData.alt}
                  onChange={(e) => setEditFormData({ ...editFormData, alt: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags (komma gescheiden)</label>
                <input
                  type="text"
                  value={editFormData.tags}
                  onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                  className="input"
                  placeholder="bijv. minecraft, creeper, figuur"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdateImage} className="btn-primary">
                  Opslaan
                </button>
                <button onClick={() => setEditingImage(null)} className="btn-secondary">
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}