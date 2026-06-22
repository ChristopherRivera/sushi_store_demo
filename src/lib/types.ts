export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  quantity?: number; // Optional quantity (defaults to 1 if undefined)
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number; // Price at the time of order
  addons: Addon[];
  comment?: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';

export type DeliveryType = 'RETIRO' | 'DELIVERY';

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  deliveryCost?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
