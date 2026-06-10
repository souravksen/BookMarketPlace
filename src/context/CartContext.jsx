import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = useCallback((book, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        toast.success('Quantity updated in cart');
        return prev.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      toast.success('Added to cart!');
      return [...prev, { id: `cart_${book.id}_${Date.now()}`, book, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId));
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.book.id !== bookId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.book.id === bookId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((bookId) => items.some((i) => i.book.id === bookId), [items]);

  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
    totalPrice: items.reduce((acc, i) => acc + i.book.price * i.quantity, 0),
  }), [items]);

  return (
    <CartContext.Provider value={{
      items, totalItems, totalPrice,
      addToCart, removeFromCart, updateQuantity, clearCart, isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
