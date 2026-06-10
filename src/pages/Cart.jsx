import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [removeTarget, setRemoveTarget] = useState(null);

  const DELIVERY_FEE = totalPrice >= 499 ? 0 : 49;
  const grandTotal = totalPrice + DELIVERY_FEE;

  const handleCheckout = () => {
    toast.success('Order placed successfully! 🎉');
    clearCart();
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <div className="section-max-width page-padding py-20 flex flex-col items-center justify-center text-center">
        <ShoppingCart size={64} className="text-dark-700 mb-4" />
        <h2 className="text-xl font-semibold text-dark-300 mb-2">Your cart is empty</h2>
        <p className="text-dark-600 text-sm mb-6">Looks like you haven't added any books yet.</p>
        <Link to="/"><Button>Browse Books</Button></Link>
      </div>
    );
  }

  return (
    <div className="section-max-width page-padding py-6 md:py-10">
      <h1 className="text-2xl font-bold text-dark-100 mb-2">Shopping Cart</h1>
      <p className="text-dark-500 text-sm mb-8">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card-glass p-4 flex gap-4 hover:border-dark-700 transition-colors">
              <Link to={`/books/${item.book.id}`} className="flex-shrink-0">
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="w-20 h-28 object-cover rounded-xl bg-dark-800"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link to={`/books/${item.book.id}`}>
                      <h3 className="font-semibold text-dark-100 text-sm hover:text-primary-400 transition-colors line-clamp-2">{item.book.title}</h3>
                    </Link>
                    <p className="text-xs text-dark-500 mt-0.5">{item.book.author}</p>
                    <p className="text-xs text-dark-600 mt-1">Condition: {item.book.condition}</p>
                  </div>
                  <button
                    onClick={() => setRemoveTarget(item)}
                    className="p-1.5 text-dark-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold text-dark-100 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-dark-100">{formatCurrency(item.book.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card-glass p-6 sticky top-24 space-y-4">
            <h2 className="font-bold text-dark-100 text-lg">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-dark-400">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-dark-400">
                <span>Delivery Fee</span>
                <span>{DELIVERY_FEE === 0 ? <span className="text-green-400">FREE</span> : formatCurrency(DELIVERY_FEE)}</span>
              </div>
              {DELIVERY_FEE > 0 && (
                <p className="text-xs text-dark-600">Add {formatCurrency(499 - totalPrice)} more for free delivery</p>
              )}
              <div className="border-t border-dark-800 pt-3 flex justify-between font-bold text-dark-100 text-base">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Button className="w-full flex items-center justify-center gap-2" size="lg" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight size={16} />
            </Button>
            <Link to="/" className="block text-center">
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-dark-400">
                <ShoppingBag size={15} /> Continue Shopping
              </Button>
            </Link>

            <div className="pt-3 border-t border-dark-800 space-y-2">
              {['Secure Checkout', 'Easy Returns', 'Buyer Protection'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-dark-600">
                  <span className="text-green-400">✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Remove confirmation modal */}
      <Modal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Remove Item"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { removeFromCart(removeTarget.book.id); setRemoveTarget(null); }}>Remove</Button>
          </>
        }
      >
        <p className="text-dark-300 text-sm">Remove <strong className="text-dark-100">"{removeTarget?.book.title}"</strong> from your cart?</p>
      </Modal>
    </div>
  );
}
