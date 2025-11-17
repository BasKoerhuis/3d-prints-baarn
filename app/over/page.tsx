import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aboutContent } from '@/config/site';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 section">
        <div className="container max-w-4xl">
          <h1 className="mb-8 text-center">{aboutContent.title}</h1>
          <div className="card p-8">
            <div className="prose prose-lg max-w-none">
              {aboutContent.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-600 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-xl font-semibold">{aboutContent.makerName}, {aboutContent.makerAge} jaar</p>
              <p className="text-gray-600 mt-2">Maker & Eigenaar</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
