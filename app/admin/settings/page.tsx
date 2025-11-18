'use client';


import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    smtp: false
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailSettings, setEmailSettings] = useState({
    orderEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: ''
  });


// Load current settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/email');
        const data = await res.json();
        
        if (data.success && data.data) {
          setEmailSettings({
            orderEmail: data.data.orderEmail || '',
            smtpHost: data.data.smtpHost || '',
            smtpPort: data.data.smtpPort || '',
            smtpUser: data.data.smtpUser || '',
            smtpPass: '' // Don't pre-fill password
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    
    loadSettings();
  }, []);


  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus('error');
      setMessage('Nieuwe wachtwoorden komen niet overeen');
      return;
    }

    if (passwords.newPassword.length < 8) {
      setStatus('error');
      setMessage('Wachtwoord moet minimaal 8 karakters zijn');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('Wachtwoord succesvol gewijzigd!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Er ging iets mis');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Er ging iets mis. Probeer het opnieuw.');
    }
  };

  const handleEmailSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailSettings)
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('Email instellingen succesvol opgeslagen!');
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Instellingen</h1>
          <button
            onClick={() => router.push('/admin/products')}
            className="btn-secondary"
          >
            ← Terug naar Admin
          </button>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg">
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Wachtwoord Wijzigen */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Wachtwoord Wijzigen</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Huidig Wachtwoord *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    className="input pr-10"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nieuw Wachtwoord * (minimaal 8 karakters)
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    className="input pr-10"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bevestig Nieuw Wachtwoord *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className="input pr-10"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary"
              >
                {status === 'loading' ? 'Opslaan...' : 'Wachtwoord Wijzigen'}
              </button>
            </form>
          </div>

          {/* Email Instellingen */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Email Instellingen</h2>
            <form onSubmit={handleEmailSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bestel Email Adres *
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="jelte@3dprintbaarn.nl"
                  value={emailSettings.orderEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, orderEmail: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Email adres waar bestellingen naartoe worden gestuurd
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SMTP Host *
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="smtp.strato.com"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    SMTP Poort *
                  </label>
                  <input
                    type="number"
                    className="input"
                    placeholder="465"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  SMTP Gebruikersnaam *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="jelte@3dprintbaarn.nl"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  SMTP Wachtwoord *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.smtp ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="••••••••"
                    value={emailSettings.smtpPass}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPass: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('smtp')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.smtp ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary"
              >
                {status === 'loading' ? 'Opslaan...' : 'Email Instellingen Opslaan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}