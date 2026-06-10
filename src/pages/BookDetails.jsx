import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight, User, Shield, Package, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_BOOKS, MOCK_REVIEWS } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';
import { BookDetailSkeleton } from '../components/ui/Skeletons';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const found = MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
      setBook(found);
      setLoading(false);
    }, 700);
  }, [id]);

  if (loading) return <BookDetailSkeleton />;
  if (!book) return null;

  const inCart = isInCart(book.id);
  const images = book.images?.length ? book.images : [book.image];

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); navigate('/login'); return; }
    addToCart(book, quantity);
  };

  const conditionColors = { New: 'success', 'Like New': 'success', Good: 'info', Fair: 'warning', Poor: 'danger' };

  return (
    <div className="section-max-width page-padding py-6 md:py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-dark-500 hover:text-dark-200 mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to listings
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Image Carousel */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-dark-900 border border-dark-800 aspect-[3/4] max-h-[520px]">
            <img src={images[activeImage]} alt={book.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImage(p => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-900/80 text-dark-200 hover:bg-dark-800" aria-label="Prev"><ChevronLeft size={18} /></button>
                <button onClick={() => setActiveImage(p => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-900/80 text-dark-200 hover:bg-dark-800" aria-label="Next"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-500' : 'border-dark-700 opacity-60'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="primary">{book.category}</Badge>
              <Badge variant={conditionColors[book.condition] || 'default'}>{book.condition}</Badge>
              {!book.inStock && <Badge variant="danger">Out of Stock</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-100 leading-tight">{book.title}</h1>
            <p className="text-dark-400 mt-1">by <span className="text-dark-200 font-medium">{book.author}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={book.rating} size={16} />
            <span className="text-sm font-semibold text-dark-200">{book.rating}</span>
            <span className="text-sm text-dark-500">({book.reviewCount?.toLocaleString()} reviews)</span>
          </div>
          <div className="card-glass p-4 rounded-xl">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-dark-100">{formatCurrency(book.price)}</span>
              {book.originalPrice && <span className="text-lg text-dark-600 line-through mb-0.5">{formatCurrency(book.originalPrice)}</span>}
              {book.originalPrice && <span className="text-sm font-semibold text-green-400 mb-0.5">{Math.round((1 - book.price / book.originalPrice) * 100)}% off</span>}
            </div>
          </div>
          <div>
            <p className="label">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:bg-dark-700 text-lg font-bold">−</button>
              <span className="text-dark-100 font-semibold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:bg-dark-700 text-lg font-bold">+</button>
            </div>
          </div>
          <Button onClick={handleAddToCart} disabled={!book.inStock || inCart} className="w-full flex items-center justify-center gap-2" size="lg">
            <ShoppingCart size={18} />
            {inCart ? 'Already in Cart' : book.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <p className="text-sm text-dark-400 leading-relaxed">{book.description}</p>
          {book.seller && (
            <div className="card-glass p-4 rounded-xl">
              <h2 className="font-semibold text-dark-200 mb-3 flex items-center gap-2"><User size={15} /> Seller Information</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-100 font-medium">{book.seller.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={12} className="star-filled" />
                    <span className="text-xs text-dark-400">{book.seller.rating} · {book.seller.totalSales?.toLocaleString()} sales</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-xs font-medium"><Shield size={14} /> Verified</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <Package size={15} className="text-primary-400" /> Estimated delivery: 3–7 business days
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-dark-100 mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="card-glass p-4 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-xs font-bold text-white">{review.user[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-dark-200">{review.user}</p>
                    <p className="text-xs text-dark-600">{formatDate(review.date)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={12} />
              </div>
              <p className="text-sm text-dark-400 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
