import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { MOCK_ORDERS } from '../utils/mockData';
import { ORDER_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import { OrderCardSkeleton } from '../components/ui/Skeletons';
import ChatModal from '../components/chat/ChatModal';

const STATUS_STEPS = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];

function OrderStatusTimeline({ status }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-4 mb-2 overflow-x-auto pb-1">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIndex && status !== 'CANCELLED';
        const info = ORDER_STATUSES[step];
        return (
          <div key={step} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                done ? 'bg-primary-600 border-primary-500 text-white' : 'bg-dark-800 border-dark-700 text-dark-600'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className="text-xs text-dark-500 whitespace-nowrap">{info.label}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-4 transition-all ${i < currentIndex && status !== 'CANCELLED' ? 'bg-primary-600' : 'bg-dark-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onOpenChat }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = ORDER_STATUSES[order.status];
  const badgeVariants = { CREATED: 'info', PAID: 'purple', SHIPPED: 'warning', DELIVERED: 'success', CANCELLED: 'danger' };

  return (
    <div className="card-glass overflow-hidden hover:border-dark-700 transition-colors">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-dark-100 text-sm">#{order.id}</h3>
              <Badge variant={badgeVariants[order.status] || 'default'}>{statusInfo?.label || order.status}</Badge>
            </div>
            <p className="text-xs text-dark-500">Placed on {formatDate(order.createdAt)}</p>
            <p className="text-xs text-dark-600 mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-dark-100">{formatCurrency(order.total)}</p>
            <button
              onClick={() => setExpanded(p => !p)}
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 mt-1 transition-colors"
            >
              {expanded ? 'Hide details' : 'View details'}
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        {order.status !== 'CANCELLED' && <OrderStatusTimeline status={order.status} />}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-dark-800 p-5 space-y-3 animate-fade-in">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.book.image}
                alt={item.book.title}
                className="w-12 h-16 object-cover rounded-lg bg-dark-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-200 line-clamp-1">{item.book.title}</p>
                <p className="text-xs text-dark-500">{item.book.author}</p>
                <p className="text-xs text-dark-600">Qty: {item.quantity}</p>
                {item.book.seller && (
                  <button
                    onClick={() => onOpenChat(item.book.seller)}
                    className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 mt-2 bg-primary-400/10 px-2 py-1 rounded-lg transition-colors w-fit"
                  >
                    <MessageCircle size={14} /> Chat with Seller
                  </button>
                )}
              </div>
              <p className="text-sm font-semibold text-dark-200 flex-shrink-0">{formatCurrency(item.price)}</p>
            </div>
          ))}
          {order.address && (
            <div className="pt-3 border-t border-dark-800">
              <p className="text-xs text-dark-600 font-medium mb-1">Delivery Address</p>
              <p className="text-xs text-dark-400">{order.address}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState({ isOpen: false, seller: null });

  useEffect(() => {
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 700);
  }, []);

  return (
    <div className="section-max-width page-padding py-6 md:py-10 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Package size={24} className="text-primary-400" />
        <div>
          <h1 className="text-2xl font-bold text-dark-100">My Orders</h1>
          <p className="text-dark-500 text-sm">Track and manage your orders</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-dark-700 mb-4" />
          <h3 className="text-lg font-semibold text-dark-400">No orders yet</h3>
          <p className="text-dark-600 text-sm mt-1">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => <OrderCard key={order.id} order={order} onOpenChat={(seller) => setChatInfo({ isOpen: true, seller })} />)}
        </div>
      )}

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatInfo.isOpen}
        onClose={() => setChatInfo({ isOpen: false, seller: null })}
        sellerName={chatInfo.seller?.name || 'Seller'}
        sellerId={chatInfo.seller?.id || 'unknown'}
      />
    </div>
  );
}
