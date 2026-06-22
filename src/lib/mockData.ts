import type { Product, Category, Addon, Order } from './types';

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Sushi Rolls' },
  { id: 'cat-2', name: 'Gourmet Burgers' },
  { id: 'cat-3', name: 'Bebidas' },
];

export const mockAddons: Addon[] = [
  { id: 'add-1', name: 'Salsa Teriyaki', price: 500 },
  { id: 'add-2', name: 'Salsa Spicy Mayo', price: 600 },
  { id: 'add-3', name: 'Queso Cheddar Extra', price: 1000 },
  { id: 'add-4', name: 'Tocino Crujiente', price: 1200 },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Dragon Roll',
    description: 'Camarón furai, palta, envuelto en salmón flameado con salsa anguila.',
    price: 8500,
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80',
  },
  {
    id: 'prod-2',
    name: 'Acevichado Roll',
    description: 'Atún, palta, envuelto en atún con salsa acevichada y togarashi.',
    price: 9000,
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
  },
  {
    id: 'prod-3',
    name: 'Truffle Burger',
    description: 'Doble carne Smash, queso suizo, cebolla caramelizada y mayo trufa.',
    price: 11000,
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
  },
  {
    id: 'prod-4',
    name: 'Classic Bacon',
    description: 'Carne Angus, cheddar, tocino, lechuga, tomate y salsa de la casa.',
    price: 9500,
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80',
  },
  {
    id: 'prod-5',
    name: 'Limonada Menta Jengibre',
    description: 'Refrescante limonada natural con toques de menta y jengibre.',
    price: 3500,
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
  },
];

// Generate some fake past orders so the KDS isn't empty
export const initialMockOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 1001,
    customerName: 'Cliente Demo 1',
    status: 'PREPARING',
    paymentMethod: 'TARJETA',
    deliveryType: 'RETIRO',
    total: 12000,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 1,
        price: 8500,
        addons: [mockAddons[0]],
      },
      {
        id: 'item-2',
        productId: 'prod-5',
        quantity: 1,
        price: 3500,
        addons: [],
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 1002,
    customerName: 'Mesa 4',
    status: 'READY',
    paymentMethod: 'EFECTIVO',
    deliveryType: 'RETIRO',
    total: 11000,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(), // Ready 5 mins ago
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        quantity: 1,
        price: 11000,
        addons: [],
      }
    ]
  }
];
