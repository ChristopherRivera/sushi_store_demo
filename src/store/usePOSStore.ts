import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Addon, Order, OrderItem, OrderStatus, PaymentMethod, DeliveryType } from '@/lib/types';
import { initialMockOrders } from '@/lib/mockData';

interface CartItem {
  id: string; // Unique ID for cart entry (since same product can have different addons)
  product: Product;
  quantity: number;
  addons: Addon[];
  comment?: string;
}

interface POSState {
  // POS Cart State
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, addons: Addon[], comment?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders State (Mock DB)
  orders: Order[];
  placeOrder: (
    customerName: string,
    paymentMethod: PaymentMethod,
    deliveryType: DeliveryType,
    deliveryAddress?: string,
    deliveryCost?: number
  ) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const usePOSStore = create<POSState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: initialMockOrders,
      
      cartTotal: 0,

      addToCart: (product, quantity, addons, comment) => {
        const newItemId = Math.random().toString(36).substring(7);
        
        set((state) => {
          const newCart = [...state.cart, { id: newItemId, product, quantity, addons, comment }];
          
          // Calculate new total
          const newTotal = newCart.reduce((total, item) => {
            const itemAddonsTotal = item.addons.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);
            return total + ((item.product.price + itemAddonsTotal) * item.quantity);
          }, 0);

          return { cart: newCart, cartTotal: newTotal };
        });
      },

      removeFromCart: (cartItemId) => {
        set((state) => {
          const newCart = state.cart.filter(item => item.id !== cartItemId);
          const newTotal = newCart.reduce((total, item) => {
            const itemAddonsTotal = item.addons.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);
            return total + ((item.product.price + itemAddonsTotal) * item.quantity);
          }, 0);
          return { cart: newCart, cartTotal: newTotal };
        });
      },

      updateCartItemQuantity: (cartItemId, newQuantity) => {
        if (newQuantity <= 0) return get().removeFromCart(cartItemId);
        
        set((state) => {
          const newCart = state.cart.map(item => 
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          );
          const newTotal = newCart.reduce((total, item) => {
            const itemAddonsTotal = item.addons.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);
            return total + ((item.product.price + itemAddonsTotal) * item.quantity);
          }, 0);
          return { cart: newCart, cartTotal: newTotal };
        });
      },

      clearCart: () => set({ cart: [], cartTotal: 0 }),

      placeOrder: (customerName, paymentMethod, deliveryType, deliveryAddress, deliveryCost) => {
        const state = get();
        if (state.cart.length === 0) return;

        const newOrderNumber = Math.max(...state.orders.map(o => o.orderNumber), 1000) + 1;
        
        const orderItems: OrderItem[] = state.cart.map(c => ({
          id: Math.random().toString(36).substring(7),
          productId: c.product.id,
          quantity: c.quantity,
          price: c.product.price,
          addons: c.addons,
          comment: c.comment
        }));

        const finalDeliveryCost = deliveryType === 'DELIVERY' ? (deliveryCost || 0) : 0;
        const orderTotal = state.cartTotal + finalDeliveryCost;

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: newOrderNumber,
          customerName: customerName || 'Cliente en Caja',
          items: orderItems,
          total: orderTotal,
          status: 'PENDING',
          paymentMethod,
          deliveryType,
          deliveryAddress: deliveryType === 'DELIVERY' ? (deliveryAddress || 'Sin Dirección') : undefined,
          deliveryCost: deliveryType === 'DELIVERY' ? finalDeliveryCost : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          orders: [newOrder, ...state.orders], // Add to beginning
          cart: [], // Empty cart
          cartTotal: 0
        }));
      },

      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } 
              : order
          )
        }));
      }
    }),
    {
      name: 'pos-showcase-storage', // name of the item in the storage (must be unique)
    }
  )
);
