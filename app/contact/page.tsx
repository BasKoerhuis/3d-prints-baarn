'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { siteConfig } from '@/config/site';

// Tekst in de rode waarschuwings-popup voor geblokkeerde IP's.
// Pas deze regels aan om de boodschap te wijzigen.
const WARNING_LINES = [
  'Je IP-adres, apparaatgegevens en het tijdstip van dit bericht zijn geregistreerd.',
  'Dit is niet de eerste keer dat je dit doet.',
  'Bij een volgend bericht worden deze gegevens gedeeld met school en ouders.',
  'We houden je in de gaten.',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'warning' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);

  // AudioContext "ontgrendelen" tijdens de klik (browsers blokkeren geluid
  // zonder gebruikersactie). Aanroepen vanuit handleSubmit.
  const unlockAudio = () => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) audioCtxRef.current = new AC();
    }
    audioCtxRef.current?.resume?.();
  };

  // Speelt 6 harde piepjes af als alarm.
  const playAlarm = () => {
    if (!audioCtxRef.current) unlockAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const schedule = () => {
      const now = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        // afwisselend hoog/laag voor een alarmerend sirene-effect
        osc.frequency.value = i % 2 === 0 ? 1040 : 760;
        const start = now + i * 0.3;
        const end = start + 0.22;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.9, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(end + 0.02);
      }
    };

    // Context kan nog 'suspended' zijn; dan eerst hervatten, daarna plannen.
    if (ctx.state === 'suspended') {
      ctx.resume().then(schedule).catch(() => {});
    } else {
      schedule();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    unlockAudio();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        if (data.flagged) {
          setStatus('warning');
          setMessage(data.message || 'Je bericht is verzonden.');
          playAlarm();
        } else {
          setStatus('success');
          setMessage('Bedankt! Je bericht is verzonden.');
        }
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
      {status === 'warning' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border-4 border-red-700 shadow-2xl">
            {/* Pulserend rood vlak op de achtergrond; tekst erboven blijft vol-wit */}
            <div className="absolute inset-0 bg-red-600 animate-pulse" aria-hidden="true" />
            <div className="relative p-8 text-center text-white">
              <div className="mb-4 text-7xl" aria-hidden="true">⚠️</div>
              <h2 className="mb-6 text-4xl font-black uppercase tracking-wide text-white">
                Waarschuwing
              </h2>
              <div className="space-y-3 text-lg font-bold leading-snug text-white">
                {WARNING_LINES.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-8 rounded-lg border-2 border-white px-6 py-2 text-base font-bold text-white hover:bg-white/20"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
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
                  <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-50 text-green-800' : status === 'warning' ? 'bg-red-600 text-white font-semibold' : 'bg-red-50 text-red-800'}`}>
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
