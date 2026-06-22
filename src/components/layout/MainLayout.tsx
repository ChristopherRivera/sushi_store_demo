import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, ShoppingBag, Menu, X, BarChart3, Code2, Globe, Mail, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      name: 'Toma de Pedidos',
      icon: ShoppingBag,
      description: 'Terminal de venta POS'
    },
    {
      path: '/kitchen',
      name: 'Pantalla de Cocina',
      icon: ChefHat,
      description: 'Monitor de comandas KDS'
    },
    {
      path: '/reports',
      name: 'Reportes y Analíticas',
      icon: BarChart3,
      description: 'Métricas de Ventas'
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#06060f] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0c0c14] border-r border-slate-200 dark:border-white/5 shrink-0 z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0c0c14]/50">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ChefHat size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider uppercase text-gray-900 dark:text-white">SUSHI STORE</h1>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-widest uppercase">Showcase POS</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/15'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                  }`}
                />
                <div>
                  <div className="font-semibold text-sm leading-tight">{item.name}</div>
                  <div className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 flex flex-col gap-3 mt-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2 shadow-md shadow-indigo-500/20 text-white">
              <span className="font-bold text-sm tracking-widest">CR</span>
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Christopher Rivera</h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">Frontend Developer</span>
          </div>
          
          <div className="flex justify-center gap-2 mt-1">
            <a href="https://github.com/ChristopherRivera" target="_blank" rel="noreferrer" title="GitHub" className="p-1.5 rounded-lg bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all shadow-sm border border-slate-200 dark:border-white/5">
              <Code2 size={16} />
            </a>
            <a href="https://www.servitechnology.cl" target="_blank" rel="noreferrer" title="Portafolio" className="p-1.5 rounded-lg bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-all shadow-sm border border-slate-200 dark:border-white/5">
              <Globe size={16} />
            </a>
            <a href="mailto:contacto@servitechnology.cl" title="Email" className="p-1.5 rounded-lg bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all shadow-sm border border-slate-200 dark:border-white/5">
              <Mail size={16} />
            </a>
            <a href="https://umaisushivina.cl/" target="_blank" rel="noreferrer" title="Ver Sistema Original" className="p-1.5 rounded-lg bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-all shadow-sm border border-slate-200 dark:border-white/5">
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 bg-white dark:bg-black/20 py-1.5 rounded-md border border-slate-200 dark:border-white/5">
            <BarChart3 size={12} className="text-indigo-500" />
            <span>DEMO</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0c0c14] border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-md">
            <ChefHat size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xs tracking-wider uppercase text-gray-900 dark:text-white">SUSHI STORE</h1>
            <span className="text-[9px] text-indigo-400 font-semibold tracking-wider">POS</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="fixed top-16 left-0 right-0 bg-white dark:bg-[#0c0c14] border-b border-slate-200 dark:border-white/5 p-4 space-y-2 shadow-2xl flex flex-col">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg ${
                    isActive ? 'bg-indigo-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 overflow-hidden relative">
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white/50 dark:bg-[#06060f]/20 backdrop-blur-sm border-b border-slate-200 dark:border-white/5">
          <div className="text-sm font-medium text-slate-400">
            {location.pathname === '/' ? 'Terminal Venta / POS' : location.pathname === '/reports' ? 'Reportes y Analíticas' : 'Kanban de Cocina / KDS'}
          </div>
          <div className="flex items-center gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Servidor Local Conectado</span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floting Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
