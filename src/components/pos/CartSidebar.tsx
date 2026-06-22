import { useState } from 'react';
import { usePOSStore } from '@/store/usePOSStore';
import { Trash2, Plus, Minus, ShoppingCart, User, MapPin } from 'lucide-react';

export function CartSidebar() {
  const {
    cart,
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
    placeOrder,
    clearCart
  } = usePOSStore();

  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'>('EFECTIVO');
  const [deliveryType, setDeliveryType] = useState<'RETIRO' | 'DELIVERY'>('RETIRO');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCost, setDeliveryCost] = useState<number>(2000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      placeOrder(
        customerName,
        paymentMethod,
        deliveryType,
        deliveryType === 'DELIVERY' ? deliveryAddress : undefined,
        deliveryType === 'DELIVERY' ? deliveryCost : undefined
      );
      setCustomerName('');
      setDeliveryAddress('');
      setDeliveryCost(2000);
      setPaymentMethod('EFECTIVO');
      setDeliveryType('RETIRO');
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3s
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 800);
  };

  const finalDeliveryCost = deliveryType === 'DELIVERY' ? deliveryCost : 0;
  const orderTotal = cartTotal + finalDeliveryCost;
  const subtotal = Math.round(cartTotal * 0.81);
  const tax = Math.round(cartTotal * 0.19);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-black/10">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-indigo-500" />
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">Comanda Actual</h2>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showSuccessMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold text-center animate-in fade-in duration-300">
            ¡Comanda enviada a la cocina con éxito! 🍜
          </div>
        )}

        {cart.length > 0 ? (
          cart.map((item) => {
            const addonTotal = item.addons.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);
            const itemPrice = item.product.price + addonTotal;

            return (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/5 hover:border-slate-200 dark:hover:border-white/10 transition-all group"
              >
                {/* Product Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate pr-2 leading-snug">
                      {item.product.name}
                    </h4>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      ${(itemPrice * item.quantity).toLocaleString('es-CL')}
                    </span>
                  </div>

                  {/* Addons List */}
                  {item.addons.length > 0 && (
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex flex-wrap gap-x-1.5 gap-y-0.5">
                      {item.addons.map((addon) => (
                        <span key={addon.id} className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                          +{addon.name}{(addon.quantity && addon.quantity > 1) ? ` x${addon.quantity}` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Preparations Note / Comment */}
                  {item.comment && (
                    <div className="text-[10px] italic text-amber-500 dark:text-amber-400 mt-1 truncate">
                      Nota: "{item.comment}"
                    </div>
                  )}

                  {/* Quantity & Delete Actions Row */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-white dark:bg-[#12121c] border border-slate-100 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-white dark:bg-[#12121c] border border-slate-100 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      aria-label="Quitar item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Comanda Vacía</div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[180px] leading-relaxed">
                Selecciona productos del menú para comenzar el pedido.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Section Form */}
      {cart.length > 0 && (
        <form onSubmit={handlePlaceOrder} className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10 space-y-3.5 max-h-[45vh] overflow-y-auto">
          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nombre Cliente</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ej: Christopher Rivera"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c14] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs transition-all"
              />
              <User className="absolute left-3 top-3 text-slate-400" size={14} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Método de Pago</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-black/20 p-0.5 rounded-xl border border-slate-200/40 dark:border-white/5">
              {(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-white dark:bg-[#12121c] text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {method === 'EFECTIVO' ? 'Efectivo' : method === 'TARJETA' ? 'Tarjeta' : 'Transfer'}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tipo de Despacho</label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-black/20 p-0.5 rounded-xl border border-slate-200/40 dark:border-white/5">
              {(['RETIRO', 'DELIVERY'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDeliveryType(type)}
                  className={`py-2 rounded-lg text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
                    deliveryType === type
                      ? 'bg-white dark:bg-[#12121c] text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {type === 'RETIRO' ? 'Retiro local' : 'Delivery'}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Delivery Inputs */}
          {deliveryType === 'DELIVERY' && (
            <div className="space-y-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dirección de Despacho</label>
                <div className="relative">
                  <input
                    type="text"
                    required={deliveryType === 'DELIVERY'}
                    placeholder="Ej: Av. Libertad 1234, Depto 402"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c14] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs transition-all"
                  />
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={12} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Costo de Envío</label>
                <input
                  type="number"
                  required={deliveryType === 'DELIVERY'}
                  min={0}
                  step={100}
                  value={deliveryCost === 0 ? '' : deliveryCost}
                  onChange={(e) => setDeliveryCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c14] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs transition-all"
                />
              </div>
            </div>
          )}

          {/* Pricing Totals */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
              <span>Subtotal Productos</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
              <span>IVA (19%)</span>
              <span>${tax.toLocaleString('es-CL')}</span>
            </div>
            {deliveryType === 'DELIVERY' && (
              <div className="flex justify-between items-center text-xs text-indigo-500 font-semibold">
                <span>Costo de Despacho</span>
                <span>+${deliveryCost.toLocaleString('es-CL')}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                ${orderTotal.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer animate-all duration-200"
          >
            {isSubmitting ? 'Procesando...' : 'Enviar a Cocina'}
          </button>
        </form>
      )}
    </div>
  );
}
