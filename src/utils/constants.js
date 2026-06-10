export const ORDER_STATUSES = {
  CREATED: { label: 'Order Placed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  PAID: { label: 'Payment Confirmed', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  SHIPPED: { label: 'Shipped', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  DELIVERED: { label: 'Delivered', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export const CATEGORIES = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Self-Help',
  'Romance',
  'Mystery',
  'Fantasy',
  'Children',
  'Textbooks',
];

export const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹200', min: 0, max: 200 },
  { label: '₹200 – ₹500', min: 200, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: 'Above ₹1000', min: 1000, max: Infinity },
];

export const ITEMS_PER_PAGE = 12;
