import { useState, useMemo } from 'react';
import type { Product, Addon } from '@/lib/types';
import { X, Plus, Minus } from 'lucide-react';
import { mockAddons } from '@/lib/mockData';

interface AddonModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, selectedAddons: Addon[], comment: string) => void;
}

export function AddonModal({ product, isOpen, onClose, onConfirm }: AddonModalProps) {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [comment, setComment] = useState<string>('');

  const updateAddonQuantity = (addon: Addon, delta: number) => {
    setSelectedAddons((prev) => {
      const existing = prev.find((a) => a.id === addon.id);
      if (!existing) {
        if (delta > 0) {
          return [...prev, { ...addon, quantity: 1 }];
        }
        return prev;
      }
      
      const newQty = (existing.quantity || 1) + delta;
      if (newQty <= 0) {
        return prev.filter((a) => a.id !== addon.id);
      }
      
      return prev.map((a) =>
        a.id === addon.id ? { ...a, quantity: newQty } : a
      );
    });
  };

  // Dynamic calculations memoized for performance (Zero Lag)
  const addonTotal = useMemo(() => {
    return selectedAddons.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);
  }, [selectedAddons]);

  const itemTotal = useMemo(() => {
    return (product.price + addonTotal) * quantity;
  }, [product.price, addonTotal, quantity]);

  const handleConfirm = () => {
    onConfirm(product, quantity, selectedAddons, comment);
    // Reset state
    setQuantity(1);
    setSelectedAddons([]);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header with image & overlay */}
        <div className="relative h-48 bg-slate-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/90 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
              {product.categoryId === 'cat-1' ? 'Sushi' : product.categoryId === 'cat-2' ? 'Burgers' : 'Bebidas'}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1 leading-tight">{product.name}</h2>
            <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Base Price Display */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio Base</span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>

          {/* Addons Selection (Exclude beverages from getting food addons optionally or just show all for demo simplicity) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adicionales / Extras</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mockAddons.map((addon) => {
                const selectedAddon = selectedAddons.find((a) => a.id === addon.id);
                const qty = selectedAddon?.quantity || 0;
                const isSelected = qty > 0;

                return (
                  <div
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400 font-semibold'
                        : 'border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{addon.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold mt-0.5">
                        +${addon.price.toLocaleString('es-CL')}
                      </span>
                    </div>

                    {/* Stepper for Addon Quantity */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 bg-white dark:bg-[#12121c] p-0.5 rounded-lg border border-slate-200/60 dark:border-white/5 shadow-sm">
                          <button
                            onClick={() => updateAddonQuantity(addon, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                            aria-label="Disminuir extra"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateAddonQuantity(addon, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all"
                            aria-label="Aumentar extra"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateAddonQuantity(addon, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 text-slate-500 transition-all cursor-pointer border border-transparent dark:border-white/5"
                          aria-label="Agregar extra"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nota de Preparación</label>
            <input
              type="text"
              placeholder="Ej: Sin cebolla, aderezo aparte..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/15 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cantidad</span>
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-[#12121c] border border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-[#12121c] border border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0c0c14] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1.5 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-between"
          >
            <span>Agregar</span>
            <span className="opacity-90 font-extrabold">${itemTotal.toLocaleString('es-CL')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
