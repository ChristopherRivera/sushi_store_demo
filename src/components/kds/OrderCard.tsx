import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/lib/types';
import { usePOSStore } from '@/store/usePOSStore';
import { mockProducts } from '@/lib/mockData';
import { Clock, Check, Play, CheckSquare, Ban, MapPin } from 'lucide-react';
import { PrintTicketButton } from '@/components/pos/PrintTicketButton';
import { PrintKitchenTicketButton } from '@/components/kds/PrintKitchenTicketButton';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus } = usePOSStore();
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Live timer effect that updates the elapsed time on the ticket every 10 seconds
  useEffect(() => {
    const calculateElapsed = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const differenceMs = Date.now() - createdTime;
      setElapsedMinutes(Math.floor(differenceMs / 60000));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 10000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getStatusAction = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Preparar',
          icon: Play,
          colorClass: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/15',
          nextStatus: 'PREPARING' as OrderStatus
        };
      case 'PREPARING':
        return {
          label: 'Terminar',
          icon: CheckSquare,
          colorClass: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/15',
          nextStatus: 'READY' as OrderStatus
        };
      case 'READY':
        return {
          label: 'Entregar',
          icon: Check,
          colorClass: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/15',
          nextStatus: 'DELIVERED' as OrderStatus
        };
      default:
        return null;
    }
  };

  const action = getStatusAction(order.status);

  // Color coding for order age warning states
  const getAgeColor = () => {
    if (order.status === 'READY' || order.status === 'DELIVERED') return 'text-slate-400';
    if (elapsedMinutes >= 15) return 'text-rose-500 font-black animate-pulse';
    if (elapsedMinutes >= 10) return 'text-amber-500 font-bold';
    return 'text-slate-400 dark:text-slate-500';
  };

  return (
    <div className="flex flex-col bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      
      {/* Ticket Header */}
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-black/10">
        <div>
          <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Orden #{order.orderNumber}
          </div>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white truncate max-w-[140px] leading-tight">
            {order.customerName}
          </h3>
          <div className="flex gap-1.5 mt-1.5">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide ${
              order.deliveryType === 'DELIVERY'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}>
              {order.deliveryType === 'DELIVERY' ? 'Despacho' : 'Retiro'}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-white/5">
              {order.paymentMethod === 'EFECTIVO' ? 'Efectivo' : order.paymentMethod === 'TARJETA' ? 'Tarjeta' : 'Transfer'}
            </span>
          </div>
        </div>

        {/* Elapsed Timer & Cancel button */}
        <div className="flex items-center gap-2">
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <div className={`flex items-center gap-1 text-[11px] font-semibold mr-1 ${getAgeColor()}`}>
              <Clock size={12} />
              <span>{elapsedMinutes}m</span>
            </div>
          )}
          
          <PrintTicketButton order={order} />
          <PrintKitchenTicketButton order={order} />
          
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
              className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Cancelar Orden"
            >
              <Ban size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Ticket Body: Items list */}
      <div className="flex-1 p-4 space-y-3.5 max-h-[250px] overflow-y-auto">
        {order.deliveryType === 'DELIVERY' && order.deliveryAddress && (
          <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 mb-3 animate-in fade-in duration-200">
            <MapPin size={12} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold uppercase tracking-wider text-[8px] text-indigo-400 leading-none mb-1">Dirección de Despacho</div>
              <span className="font-bold leading-normal">{order.deliveryAddress}</span>
            </div>
          </div>
        )}
        
        {order.items.map((item) => {
          const product = mockProducts.find((p) => p.id === item.productId);
          return (
            <div key={item.id} className="space-y-1">
              {/* Item Info */}
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  <span className="text-indigo-500 dark:text-indigo-400 font-extrabold mr-1.5">
                    {item.quantity}x
                  </span>
                  {product ? product.name : 'Producto Desconocido'}
                </span>
              </div>

              {/* Addons List */}
              {item.addons.length > 0 && (
                <div className="text-[10px] text-slate-400 dark:text-slate-500 pl-5 flex flex-wrap gap-x-1.5">
                  {item.addons.map((addon) => (
                    <span key={addon.id}>• {addon.name}{(addon.quantity && addon.quantity > 1) ? ` x${addon.quantity}` : ''}</span>
                  ))}
                </div>
              )}

              {/* Comments / Modifications */}
              {item.comment && (
                <div className="text-[10px] pl-5 font-semibold text-amber-500 dark:text-amber-400">
                  Nota: "{item.comment}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ticket Footer action button */}
      {action && (
        <div className="p-3 bg-slate-50 dark:bg-black/10 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={() => updateOrderStatus(order.id, action.nextStatus)}
            className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${action.colorClass}`}
          >
            <action.icon size={12} strokeWidth={2.5} />
            <span>{action.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
