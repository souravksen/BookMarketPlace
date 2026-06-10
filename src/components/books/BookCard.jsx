import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, truncate } from '../../utils/helpers';
import StarRating from '../ui/StarRating';
import Badge from '../ui/Badge';

export default function BookCard({ book }) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(book.id);
  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  return (
    <div className="group card-glass overflow-hidden hover:border-dark-700 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link to={`/books/${book.id}`} className="relative overflow-hidden block">
        <div className="aspect-[3/4] overflow-hidden bg-dark-800">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
          {!book.inStock && (
            <span className="bg-dark-700/90 text-dark-400 text-xs font-medium px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button className="absolute top-2 right-2 p-1.5 bg-dark-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark-800" aria-label="Add to wishlist">
          <Heart size={14} className="text-dark-400 hover:text-red-400 transition-colors" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        <div>
          <Badge variant="default" className="mb-1.5 text-xs">{book.category}</Badge>
          <Link to={`/books/${book.id}`}>
            <h3 className="font-semibold text-dark-100 text-sm leading-snug hover:text-primary-400 transition-colors line-clamp-2">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-dark-500 mt-0.5">{book.author}</p>
        </div>

        {/* Rating & Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarRating rating={book.rating} size={12} />
            <span className="text-xs text-dark-500">({book.reviewCount?.toLocaleString()})</span>
          </div>
          {book.distance !== undefined && (
            <div className="flex items-center gap-1 text-[10px] bg-primary-500/10 text-primary-400 px-1.5 py-0.5 rounded-full font-medium">
              <MapPin size={10} />
              {book.distance.toFixed(1)} km
            </div>
          )}
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-dark-800">
          <div>
            <p className="text-base font-bold text-dark-100">{formatCurrency(book.price)}</p>
            {book.originalPrice && (
              <p className="text-xs text-dark-600 line-through">{formatCurrency(book.originalPrice)}</p>
            )}
          </div>
          <button
            onClick={() => addToCart(book)}
            disabled={!book.inStock || inCart}
            className={`p-2 rounded-xl transition-all duration-200 ${
              inCart
                ? 'bg-primary-600/20 text-primary-400 cursor-default'
                : book.inStock
                ? 'bg-primary-600 hover:bg-primary-500 text-white active:scale-95'
                : 'bg-dark-800 text-dark-600 cursor-not-allowed'
            }`}
            aria-label={inCart ? 'Already in cart' : 'Add to cart'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
