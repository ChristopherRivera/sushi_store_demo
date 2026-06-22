import { useMemo } from 'react';
import { usePOSStore } from '@/store/usePOSStore';
import { mockProducts } from '@/lib/mockData';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react';

export function ReportsDashboard() {
  const { orders } = usePOSStore();

  // 1. KPI Calculations (Merged with live orders)
  const stats = useMemo(() => {
    // Basic stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => o.status !== 'CANCELLED' ? sum + o.total : sum, 0);
    const avgTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Average prep time calculation for ready/delivered orders
    const completedOrders = orders.filter(o => o.status === 'READY' || o.status === 'DELIVERED');
    let avgPrepTimeMinutes = 12; // default fallback if no ready orders
    if (completedOrders.length > 0) {
      const times = completedOrders.map(o => {
        const start = new Date(o.createdAt).getTime();
        const end = new Date(o.updatedAt).getTime();
        return Math.floor((end - start) / 60000);
      });
      avgPrepTimeMinutes = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    }

    return {
      totalOrders,
      totalRevenue,
      avgTicket,
      avgPrepTimeMinutes
    };
  }, [orders]);

  // 2. Sales Trend (Past 7 Days - Mock + Live Orders)
  const salesTrendData = useMemo(() => {
    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const baseSales = [185000, 220000, 195000, 280000, 390000, 480000, 410000];
    
    // Map today's live orders to the trend
    const todayIndex = (new Date().getDay() + 6) % 7; // Convert Sun=0/Mon=1 to Mon=0/Sun=6
    const todayLiveRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0);

    return daysOfWeek.map((day, idx) => {
      let revenue = baseSales[idx];
      if (idx === todayIndex) {
        revenue += todayLiveRevenue;
      }
      return {
        day,
        Ventas: revenue,
        Pedidos: idx === todayIndex ? orders.length + 15 : Math.round(revenue / 11000)
      };
    });
  }, [orders]);

  // 3. Top Products (Live store orders + mock data)
  const topProductsData = useMemo(() => {
    const productCounts: Record<string, number> = {};
    
    // Seed counts with some default popularity
    productCounts['prod-1'] = 45; // Dragon Roll
    productCounts['prod-2'] = 38; // Acevichado
    productCounts['prod-3'] = 52; // Truffle Burger
    productCounts['prod-4'] = 31; // Classic Bacon
    productCounts['prod-5'] = 22; // Limonada

    // Accumulate live counts
    orders.forEach(o => {
      if (o.status !== 'CANCELLED') {
        o.items.forEach(item => {
          productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
        });
      }
    });

    return Object.entries(productCounts)
      .map(([id, quantity]) => {
        const prod = mockProducts.find(p => p.id === id);
        return {
          name: prod ? prod.name : 'Producto',
          Cantidad: quantity,
          Ingresos: quantity * (prod ? prod.price : 0)
        };
      })
      .sort((a, b) => b.Cantidad - a.Cantidad)
      .slice(0, 5);
  }, [orders]);

  // 4. Payment Methods Distribution (Live + Mock)
  const paymentData = useMemo(() => {
    const methods = { EFECTIVO: 15, TARJETA: 32, TRANSFERENCIA: 18 };
    
    orders.forEach(o => {
      if (o.status !== 'CANCELLED') {
        methods[o.paymentMethod] = (methods[o.paymentMethod] || 0) + 1;
      }
    });

    return [
      { name: 'Efectivo', value: methods.EFECTIVO, color: '#10b981' },
      { name: 'Tarjeta', value: methods.TARJETA, color: '#6366f1' },
      { name: 'Transferencia', value: methods.TRANSFERENCIA, color: '#f59e0b' }
    ];
  }, [orders]);

  // 5. Delivery Methods Distribution (Live + Mock)
  const deliveryData = useMemo(() => {
    const channels = { RETIRO: 42, DELIVERY: 28 };

    orders.forEach(o => {
      if (o.status !== 'CANCELLED') {
        channels[o.deliveryType] = (channels[o.deliveryType] || 0) + 1;
      }
    });

    return [
      { name: 'Retiro en Local', value: channels.RETIRO, color: '#10b981' },
      { name: 'Despacho (Delivery)', value: channels.DELIVERY, color: '#f43f5e' }
    ];
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">Analítica y Reportes</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">Monitorea el volumen de ventas, el rendimiento del menú y canales de despacho</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Ventas Totales</span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
              ${stats.totalRevenue.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pedidos Recibidos</span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
              {stats.totalOrders + 65} <span className="text-xs text-slate-400 font-bold">(Live + Hist)</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Average Ticket */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Ticket Promedio</span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
              ${(stats.avgTicket || 11500).toLocaleString('es-CL')}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Avg Prep Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Promedio Cocina</span>
            <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
              {stats.avgPrepTimeMinutes} min
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend (Large) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Evolución de Ventas Semanales</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value || 0).toLocaleString('es-CL')}`, 'Ventas']}
                  contentStyle={{ backgroundColor: '#0c0c14', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="Ventas" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods (Small) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Métodos de Pago Preferidos</h3>
          <div className="h-80 w-full flex flex-col justify-center items-center relative">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} pedidos`, 'Frecuencia']}
                  contentStyle={{ backgroundColor: '#0c0c14', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider mt-2">
              {paymentData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Top 5 Platos Más Vendidos</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 10, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={100} />
                <Tooltip
                  formatter={(value, name) => [value, name === 'Cantidad' ? 'Unidades Vendidas' : 'Ingresos']}
                  contentStyle={{ backgroundColor: '#0c0c14', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="Cantidad" fill="#6366f1" radius={[0, 8, 8, 0]} maxBarSize={30}>
                  {topProductsData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#4f46e5' : index === 2 ? '#4338ca' : '#3730a3'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery vs Local */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Canales de Venta / Despacho</h3>
          <div className="h-80 w-full flex flex-col justify-center items-center relative">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  labelLine={false}
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} pedidos`, 'Total']}
                  contentStyle={{ backgroundColor: '#0c0c14', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider mt-2">
              {deliveryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
