import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { Sparkles, Leaf, Zap, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const products = await getAllProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Apple Style */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white pt-20 pb-32">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(74,144,226,0.05),transparent_50%)]"></div>
          
          <div className="container relative">
            <div className="text-center max-w-5xl mx-auto space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 text-sm font-medium text-gray-700 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
                  Geprint in Baarn
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                Creatieve 3D prints
                <br />
                <span className="bg-gradient-to-r from-[var(--accent-color)] to-blue-600 bg-clip-text text-transparent">
                  voor jong & oud
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {siteConfig.tagline}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link 
                  href="/winkel" 
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent-color)] text-white rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Ontdek mijn ontwerpen
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/over" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md"
                >
                  Over mij
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products - Minimalist Grid */}
        {featuredProducts.length > 0 && (
          <section className="section py-24">
            <div className="container">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-bold mb-4">Uitgelicht</h2>
                <p className="text-xl text-gray-600">Mijn favorieten</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-16">
                <Link 
                  href="/winkel" 
                  className="inline-flex items-center gap-2 text-[var(--accent-color)] text-lg font-semibold hover:gap-3 transition-all"
                >
                  Bekijk alle producten
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Features Section - Glass Cards */}
        <section className="section py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">Waarom kiezen voor mij?</h2>
              <p className="text-xl text-gray-600">Kwaliteit en passie in elk detail</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature Card 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Uniek design</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Elk product wordt met zorg en aandacht voor detail gemaakt
                  </p>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Duurzaam</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Gemaakt van milieuvriendelijk PLA plastic
                  </p>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Snel geleverd</h3>
                  <p className="text-gray-600 leading-relaxed">
                    De meeste producten zijn binnen 3-5 dagen klaar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Premium Banner */}
        <section className="section py-32 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] via-blue-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white">
                Klaar om te bestellen?
              </h2>
              <p className="text-2xl text-white/90 leading-relaxed">
                Ontdek mijn ontwerpen en vind jouw perfecte 3D print
              </p>
              <div className="pt-4">
                <Link 
                  href="/winkel" 
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-[var(--accent-color)] rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl"
                >
                  Naar de winkel
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}