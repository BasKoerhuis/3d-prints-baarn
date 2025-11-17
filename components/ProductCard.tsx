import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images[0] || '/placeholder.svg';

  return (
    <Link href={`/winkel/${product.slug}`} className="card group">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-600">Vanaf </span>
            <span className="font-semibold text-[var(--accent-color)]">
              €{product.priceChild.toFixed(2)}
            </span>
          </div>
          <span className="text-sm font-medium text-[var(--accent-color)] group-hover:underline">
            Bekijk →
          </span>
        </div>
      </div>
    </Link>
  );
}
