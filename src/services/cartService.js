import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (bookId, quantity) => api.post('/cart', { bookId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};
