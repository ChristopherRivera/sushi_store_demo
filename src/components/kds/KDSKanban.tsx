import { useState, useMemo } from 'react';
import { usePOSStore } from '@/store/usePOSStore';
import { OrderCard } from './OrderCard';
import { ChefHat, ListTodo, Flame, CheckCircle, History } from 'lucide-react';

export function KDSKanban() {
  const { orders } = usePOSStore();
  const [activeTab, setActiveTab] = useState<'kanban' | 'history'>('kanban');

  // Memoize filtered lists to ensure zero lag when state changes (Zero Lag Pattern)
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'PENDING'), [orders]);
  const preparingOrders = useMemo(() => orders.filter(o => o.status === 'PREPARING'), [orders]);
  const readyOrders = useMemo(() => orders.filter(o => o.status === 'READY'), [orders]);
  
  const historyOrders = useMemo(() => 
    orders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED')
  , [orders]);

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* KDS Header with tab navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">Pantalla de Cocina (KDS)</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Monitorea y gestiona el flujo de preparación de las comandas</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/15'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <ChefHat size={14} />
            <span>Tablero Cocina</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/15'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <History size={14} />
            <span>Historial</span>
          </button>
        </div>
      </div>

      {activeTab === 'kanban' ? (
        /* Kanban Board columns */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN 1: PENDING */}
          <div className="flex flex-col bg-slate-100/40 dark:bg-black/10 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl h-[calc(100vh-210px)] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5 mb-4">
              <div className="flex items-center gap-2 text-amber-500">
                <ListTodo size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">Pendientes</h3>
              </div>
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingOrders.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 scrollbar-thin">
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <ListTodo size={32} className="text-slate-400 mb-2" />
                  <p className="text-[11px] font-semibold text-slate-500">Sin órdenes en espera</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: PREPARING */}
          <div className="flex flex-col bg-slate-100/40 dark:bg-black/10 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl h-[calc(100vh-210px)] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5 mb-4">
              <div className="flex items-center gap-2 text-indigo-500">
                <Flame size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">En Preparación</h3>
              </div>
              <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {preparingOrders.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 scrollbar-thin">
              {preparingOrders.length > 0 ? (
                preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <Flame size={32} className="text-slate-400 mb-2" />
                  <p className="text-[11px] font-semibold text-slate-500">Cocina despejada</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: READY */}
          <div className="flex flex-col bg-slate-100/40 dark:bg-black/10 border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl h-[calc(100vh-210px)] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5 mb-4">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">Listos</h3>
              </div>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {readyOrders.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 scrollbar-thin">
              {readyOrders.length > 0 ? (
                readyOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <CheckCircle size={32} className="text-slate-400 mb-2" />
                  <p className="text-[11px] font-semibold text-slate-500">Nada listo por retirar</p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* History Archive Table view */
        <div className="bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Archivo de Comandas</h3>
            <span className="text-[10px] font-bold bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md">
              Total: {historyOrders.length} registros
            </span>
          </div>

          <div className="overflow-x-auto min-w-[700px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-extrabold uppercase tracking-wider bg-slate-50/30 dark:bg-black/5">
                  <th className="p-4">Orden</th>
                  <th className="p-4">Cliente / Mesa</th>
                  <th className="p-4">Fecha / Hora</th>
                  <th className="p-4">Monto Total</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-slate-300">
                {historyOrders.length > 0 ? (
                  historyOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-extrabold text-indigo-500">#{order.orderNumber}</td>
                      <td className="p-4 font-bold">{order.customerName}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString('es-CL', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="p-4 font-black">${order.total.toLocaleString('es-CL')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {order.status === 'DELIVERED' ? 'Entregado' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 opacity-60">
                      No hay historial de comandas registradas en esta sesión.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
