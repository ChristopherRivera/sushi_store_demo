import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CartSidebar } from '@/components/pos/CartSidebar';
import { AddonModal } from '@/components/pos/AddonModal';
import { KDSKanban } from '@/components/kds/KDSKanban';
import { ReportsDashboard } from '@/components/reports/ReportsDashboard';
import { usePOSStore } from '@/store/usePOSStore';
import type { Product, Addon } from '@/lib/types';

function POSView() {
  const { addToCart } = usePOSStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddonModalOpen(true);
  };

  const handleAddonConfirm = (product: Product, quantity: number, selectedAddons: Addon[], comment: string) => {
    addToCart(product, quantity, selectedAddons, comment);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
      {/* Product Catalog */}
      <div className="lg:col-span-8 h-full flex flex-col min-w-0">
        <ProductGrid onSelectProduct={handleSelectProduct} />
      </div>

      {/* Cart Sidebar */}
      <div className="lg:col-span-4 h-full">
        <CartSidebar />
      </div>

      {/* Addon Modal */}
      <AddonModal
        product={selectedProduct}
        isOpen={isAddonModalOpen}
        onClose={() => setIsAddonModalOpen(false)}
        onConfirm={handleAddonConfirm}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<POSView />} />
          <Route path="/kitchen" element={<KDSKanban />} />
          <Route path="/reports" element={<ReportsDashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
