import { create } from 'zustand';
import toast from 'react-hot-toast';

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  initialized: false,

  // Fetch wishlist from API
  fetchWishlist: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        set({ items: data.wishlist || [], initialized: true });
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Add item to wishlist
  addItem: async (productId) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'add' }),
      });

      if (res.ok) {
        const data = await res.json();
        set({ items: data.wishlist || [] });
        toast.success('Added to wishlist!');
        return true;
      } else {
        const error = await res.json();
        toast.error(error.error || 'Please login to add to wishlist');
        return false;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    }
  },

  // Remove item from wishlist
  removeItem: async (productId) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'remove' }),
      });

      if (res.ok) {
        const data = await res.json();
        set({ items: data.wishlist || [] });
        toast.success('Removed from wishlist');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    }
  },

  // Toggle item in wishlist
  toggleItem: async (productId) => {
    const items = get().items;
    const isInWishlist = items.some(item => 
      (item._id || item) === productId
    );

    if (isInWishlist) {
      return get().removeItem(productId);
    } else {
      return get().addItem(productId);
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId) => {
    return get().items.some(item => 
      (item._id || item) === productId
    );
  },

  // Clear wishlist
  clearWishlist: () => set({ items: [], initialized: false }),
}));

export default useWishlistStore;
