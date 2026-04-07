import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/supabase';

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id && item.size === size);
        
        if (existingItem) {
          set({
            items: currentItems.map(item => 
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1, size }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () => get().items.reduce((acc, item) => {
        const price = item.discount_price || item.original_price;
        return acc + (price * item.quantity);
      }, 0),
    }),
    {
      name: 'clothing-store-cart',
    }
  )
);
