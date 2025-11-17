import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { faqData } from '@/config/site';

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 section">
        <div className="container max-w-4xl">
          <h1 className="mb-8 text-center">Veelgestelde Vragen</h1>
          <div className="space-y-6">
            {faqData.map((item) => (
              <div key={item.id} className="card p-6">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
