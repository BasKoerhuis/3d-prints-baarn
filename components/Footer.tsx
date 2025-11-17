import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[var(--accent-color)] rounded-lg flex items-center justify-center text-white font-bold">
                3D
              </div>
              <span className="font-semibold text-lg">{siteConfig.siteName}</span>
            </div>
            <p className="text-sm text-gray-600">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Navigatie</h3>
            <ul className="space-y-2">
              <li><Link href="/winkel" className="text-sm text-gray-600 hover:text-[var(--accent-color)]">Winkel</Link></li>
              <li><Link href="/galerij" className="text-sm text-gray-600 hover:text-[var(--accent-color)]">Galerij</Link></li>
              <li><Link href="/over" className="text-sm text-gray-600 hover:text-[var(--accent-color)]">Over Mij</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-600 hover:text-[var(--accent-color)]">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-[var(--accent-color)]">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Contact</h3>
            <p className="text-sm text-gray-600 mb-2">
              Email: <a href={`mailto:${siteConfig.orderEmail}`} className="hover:text-[var(--accent-color)]">{siteConfig.orderEmail}</a>
            </p>
            <p className="text-sm text-gray-600">
              Locatie: Baarn, Nederland
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} {siteConfig.siteName}. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
