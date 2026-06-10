import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, LayoutDashboard, BookOpen, TrendingUp, DollarSign, Star, X, Upload, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_BOOKS, MOCK_SELLER_STATS, MOCK_TRANSACTIONS } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORIES, CONDITIONS } from '../utils/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import toast from 'react-hot-toast';

const bookSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  author: z.string().min(2, 'Author is required'),
  price: z.coerce.number().min(1, 'Price must be > 0'),
  originalPrice: z.coerce.number().optional(),
  category: z.string().min(1, 'Select a category'),
  condition: z.string().min(1, 'Select a condition'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card-glass p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-dark-100">{value}</p>
        <p className="text-sm text-dark-500">{label}</p>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState(MOCK_BOOKS.slice(0, 5));
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(bookSchema),
  });

  const openAdd = () => {
    reset();
    setImagePreview(null);
    setEditTarget(null);
    setAddModalOpen(true);
  };

  const openEdit = (book) => {
    setEditTarget(book);
    setValue('title', book.title);
    setValue('author', book.author);
    setValue('price', book.price);
    setValue('originalPrice', book.originalPrice || '');
    setValue('category', book.category);
    setValue('condition', book.condition);
    setValue('description', book.description);
    setImagePreview(book.image);
    setAddModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editTarget) {
      setListings(prev => prev.map(b => b.id === editTarget.id ? { ...b, ...data, image: imagePreview || b.image } : b));
      toast.success('Listing updated!');
    } else {
      const newBook = {
        id: `new_${Date.now()}`,
        ...data,
        image: imagePreview || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
        rating: 0, reviewCount: 0, inStock: true,
        seller: { id: 's_me', name: user?.name || 'My Store', rating: 5, totalSales: 0 },
        createdAt: new Date().toISOString(),
      };
      setListings(prev => [newBook, ...prev]);
      toast.success('Listing added!');
    }
    setAddModalOpen(false);
    reset();
    setImagePreview(null);
    setEditTarget(null);
  };

  const confirmDelete = () => {
    setListings(prev => prev.filter(b => b.id !== deleteTarget.id));
    toast.success('Listing deleted');
    setDeleteTarget(null);
  };

  const conditionColors = { New: 'success', 'Like New': 'success', Good: 'info', Fair: 'warning', Poor: 'danger' };

  return (
    <div className="section-max-width page-padding py-6 md:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={24} className="text-primary-400" />
          <div>
            <h1 className="text-2xl font-bold text-dark-100">Seller Dashboard</h1>
            <p className="text-dark-500 text-sm">Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add New Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={BookOpen} label="Total Listings" value={MOCK_SELLER_STATS.totalListings} color="bg-primary-600" />
        <StatCard icon={TrendingUp} label="Total Sales" value={MOCK_SELLER_STATS.totalSales} color="bg-accent-600" />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(MOCK_SELLER_STATS.revenue)} color="bg-green-600" />
        <StatCard icon={Star} label="Avg Rating" value={MOCK_SELLER_STATS.avgRating} color="bg-amber-600" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-dark-800 mb-6">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'listings' ? 'text-primary-400' : 'text-dark-400 hover:text-dark-200'}`}
        >
          My Listings
          {activeTab === 'listings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'transactions' ? 'text-primary-400' : 'text-dark-400 hover:text-dark-200'}`}
        >
          Earnings & Transactions
          {activeTab === 'transactions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'listings' ? (
        <div className="card-glass overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between">
            <h2 className="font-semibold text-dark-100">My Listings</h2>
            <span className="text-sm text-dark-500">{listings.length} books</span>
          </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-800 text-dark-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Book</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Condition</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Rating</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/50">
              {listings.map(book => (
                <tr key={book.id} className="hover:bg-dark-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded-lg bg-dark-800 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-dark-200 line-clamp-1">{book.title}</p>
                        <p className="text-xs text-dark-500">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-dark-400">{book.category}</td>
                  <td className="px-5 py-3">
                    <Badge variant={conditionColors[book.condition] || 'default'}>{book.condition}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-dark-200">{formatCurrency(book.price)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <StarRating rating={book.rating} size={11} />
                      <span className="text-xs text-dark-500">({book.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(book)} className="p-1.5 text-dark-500 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-all" aria-label="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(book)} className="p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-dark-800/50">
          {listings.map(book => (
            <div key={book.id} className="p-4 flex gap-3">
              <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded-lg bg-dark-800 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark-200 text-sm line-clamp-1">{book.title}</p>
                <p className="text-xs text-dark-500">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={conditionColors[book.condition] || 'default'} className="text-xs">{book.condition}</Badge>
                  <span className="text-sm font-bold text-dark-200">{formatCurrency(book.price)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => openEdit(book)} className="p-1.5 text-dark-500 hover:text-primary-400 rounded-lg"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteTarget(book)} className="p-1.5 text-dark-500 hover:text-red-400 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto text-dark-700 mb-3" />
            <p className="text-dark-500 text-sm">No listings yet. Add your first book!</p>
          </div>
        )}
      </div>
      ) : (
        <div className="card-glass overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between bg-dark-900/50">
            <div>
              <h2 className="font-semibold text-dark-100">Transaction History</h2>
              <p className="text-xs text-dark-500 mt-0.5">Recent earnings and payouts</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-dark-500 mb-0.5">Available Balance</p>
              <p className="text-lg font-bold text-green-400">{formatCurrency(MOCK_SELLER_STATS.revenue)}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-800 text-dark-500 text-xs uppercase tracking-wider bg-dark-950/30">
                  <th className="px-5 py-3 text-left">Transaction ID</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Item / Buyer</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/50">
                {MOCK_TRANSACTIONS.map(txn => (
                  <tr key={txn.id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-5 py-4 text-dark-400 font-mono text-xs">{txn.id}</td>
                    <td className="px-5 py-4 text-dark-300">{formatDate(txn.date)}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark-200">{txn.bookTitle}</p>
                      <p className="text-xs text-dark-500">Sold to: {txn.buyer}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-dark-100">+{formatCurrency(txn.amount)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        txn.status === 'Completed' ? 'bg-green-400/10 text-green-400' : 'bg-amber-400/10 text-amber-400'
                      }`}>
                        {txn.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {txn.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); reset(); setEditTarget(null); setImagePreview(null); }}
        title={editTarget ? 'Edit Listing' : 'Add New Book'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setAddModalOpen(false); reset(); setEditTarget(null); setImagePreview(null); }}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editTarget ? 'Save Changes' : 'Add Listing'}</Button>
          </>
        }
      >
        <form className="space-y-4" noValidate>
          {/* Image Upload */}
          <div>
            <p className="label">Book Cover Image</p>
            <div className="flex items-center gap-4">
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-16 h-22 object-cover rounded-lg bg-dark-800" />}
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-dark-600 text-dark-400 hover:border-primary-500 hover:text-primary-400 cursor-pointer transition-all text-sm">
                <Upload size={15} /> Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files[0];
                  if (file) setImagePreview(URL.createObjectURL(file));
                }} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="title" label="Title" placeholder="Book title" error={errors.title?.message} {...register('title')} />
            <Input id="author" label="Author" placeholder="Author name" error={errors.author?.message} {...register('author')} />
            <Input id="price" label="Price (₹)" type="number" placeholder="299" error={errors.price?.message} {...register('price')} />
            <Input id="originalPrice" label="Original Price (₹)" type="number" placeholder="499 (optional)" {...register('originalPrice')} />

            <div>
              <label htmlFor="category" className="label">Category</label>
              <select id="category" className="input-field" {...register('category')}>
                <option value="">Select category</option>
                {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-400">⚠ {errors.category.message}</p>}
            </div>

            <div>
              <label htmlFor="condition" className="label">Condition</label>
              <select id="condition" className="input-field" {...register('condition')}>
                <option value="">Select condition</option>
                {CONDITIONS.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.condition && <p className="mt-1 text-xs text-red-400">⚠ {errors.condition.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe the book..."
              className="input-field resize-none"
              {...register('description')}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">⚠ {errors.description.message}</p>}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Listing"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-dark-300 text-sm">
          Permanently delete <strong className="text-dark-100">"{deleteTarget?.title}"</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
