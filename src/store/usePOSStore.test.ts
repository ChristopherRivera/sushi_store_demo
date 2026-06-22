import { describe, it, expect, beforeEach } from 'vitest';
import { usePOSStore } from './usePOSStore';
import { mockProducts } from '@/lib/mockData';

describe('usePOSStore - Carrito de Compras', () => {
  beforeEach(() => {
    // Limpiamos el carrito antes de cada prueba
    usePOSStore.getState().clearCart();
  });

  it('debería calcular el total correctamente al agregar productos sin addons', () => {
    const store = usePOSStore.getState();
    const product = mockProducts[0]; // Producto mockeado (ej. Roll)
    
    // Agregamos 2 unidades del producto
    store.addToCart(product, 2, []);
    
    expect(usePOSStore.getState().cartTotal).toBe(product.price * 2);
  });

  it('debería calcular el total correctamente incluyendo el precio de los addons (extras)', () => {
    const store = usePOSStore.getState();
    const product = mockProducts[0];
    
    // Agregamos 1 unidad del producto con 2 extras de Salsa (ej. 500 c/u)
    const addonPrice = 500;
    store.addToCart(product, 1, [{ id: 'a1', name: 'Salsa Extra', price: addonPrice, quantity: 2 }]);
    
    const expectedTotal = product.price + (addonPrice * 2);
    expect(usePOSStore.getState().cartTotal).toBe(expectedTotal);
  });

  it('debería vaciar el carrito correctamente', () => {
    const store = usePOSStore.getState();
    
    store.addToCart(mockProducts[0], 1, []);
    expect(usePOSStore.getState().cart.length).toBe(1);
    
    usePOSStore.getState().clearCart();
    
    expect(usePOSStore.getState().cart.length).toBe(0);
    expect(usePOSStore.getState().cartTotal).toBe(0);
  });
});
