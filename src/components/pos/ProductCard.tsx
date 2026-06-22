import type { Product } from '@/lib/types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/20 cursor-pointer transition-all duration-300"
    >
      {/* Product Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Floating Plus icon for quick action */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Plus size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              {product.categoryId === 'cat-1' ? 'Rolls' : product.categoryId === 'cat-2' ? 'Burgers' : 'Bebidas'}
            </span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
