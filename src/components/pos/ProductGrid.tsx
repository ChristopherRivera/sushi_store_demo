import { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { mockProducts, mockCategories } from '@/lib/mockData';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

export function ProductGrid({ onSelectProduct }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Memoized product filtering to ensure Zero Lag performance
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory =
        selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategoryId]);

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Search & Header Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">Menú General</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Selecciona un producto para agregarlo a la comanda</p>
        </div>
        
        {/* Search Bar - Controlled input but simple enough for smooth typing */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c14] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={16} />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
            selectedCategoryId === 'all'
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/15'
              : 'bg-white dark:bg-[#0c0c14] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-slate-400'
          }`}
        >
          Todos
        </button>
        {mockCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategoryId === category.id
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/15'
                : 'bg-white dark:bg-[#0c0c14] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-slate-400'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-1">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <div className="text-slate-400 dark:text-slate-600 mb-2 font-bold text-sm uppercase tracking-wider">Sin Resultados</div>
          <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs">
            No encontramos ningún producto que coincida con tu búsqueda. Intenta con otra palabra.
          </p>
        </div>
      )}
    </div>
  );
}
