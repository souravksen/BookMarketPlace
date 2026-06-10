import api from './api';

export const bookService = {
  getBooks: (params) => api.get('/books', { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post('/books', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateBook: (id, data) => api.put(`/books/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getSellerBooks: () => api.get('/books/seller/my-listings'),
  getCategories: () => api.get('/books/categories'),
  addReview: (bookId, data) => api.post(`/books/${bookId}/reviews`, data),
};
