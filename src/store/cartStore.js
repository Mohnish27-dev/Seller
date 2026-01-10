import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1, size, color) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.productId === product._id && item.size === size && item.color === color
        );
        
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({
            items: [...items, {
              productId: product._id,
              name: product.name,
              price: product.discountPrice || product.price,
              originalPrice: product.price,
              image: product.images[0]?.url || '/placeholder.jpg',
              quantity,
              size,
              color,
              slug: product.slug,
            }],
          });
        }
      },
      
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            item => !(item.productId === productId && item.size === size && item.color === color)
          ),
        });
      },
      
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        
        const newItems = get().items.map(item => {
          if (item.productId === productId && item.size === size && item.color === color) {
            return { ...item, quantity };
          }
          return item;
        });
        
        set({ items: newItems });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
