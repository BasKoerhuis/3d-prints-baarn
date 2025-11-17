'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { siteConfig } from '@/config/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('Bedankt! Je bericht is verzonden.');
        setFormData({ name: '', email: '', message: '' });
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
          <h1 className="mb-8 text-center">Contact</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-xl font-semibold mb-4">Stuur een bericht</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Naam</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-mail</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bericht</label>
                  <textarea
                    className="textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                {status !== 'idle' && (
                  <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message}
                  </div>
                )}
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                  {status === 'loading' ? 'Verzenden...' : 'Verstuur Bericht'}
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Contactgegevens</h3>
              <div className="space-y-4">
                <div className="card p-6">
                  <h4 className="font-semibold mb-2">Email</h4>
                  <a href={`mailto:${siteConfig.orderEmail}`} className="text-[var(--accent-color)] hover:underline">
                    {siteConfig.orderEmail}
                  </a>
                </div>
                <div className="card p-6">
                  <h4 className="font-semibold mb-2">Locatie</h4>
                  <p className="text-gray-600">Baarn, Nederland</p>
                </div>
                <div className="card p-6">
                  <h4 className="font-semibold mb-2">Responstijd</h4>
                  <p className="text-gray-600">Binnen 24 uur op werkdagen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
