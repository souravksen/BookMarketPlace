import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, TrendingUp, BookOpen, X, Award, Quote } from 'lucide-react';
import BookCard from '../components/books/BookCard';
import { BookCardSkeleton } from '../components/ui/Skeletons';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import PlatformReviews from '../components/home/PlatformReviews';
import { MOCK_BOOKS, MOCK_TOP_SELLERS } from '../utils/mockData';
import { CATEGORIES, CONDITIONS, SORT_OPTIONS, PRICE_RANGES, ITEMS_PER_PAGE } from '../utils/constants';
import { bookService } from '../services/bookService';

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await bookService.getBooks({ search: searchQuery });
        setBooks(data.books || data);
      } catch {
        // Use mock data when backend unavailable
        setBooks(MOCK_BOOKS);
      } finally {
        setTimeout(() => setLoading(false), 600); // small delay for skeleton demo
      }
    };
    load();
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let result = [...books];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'All') result = result.filter(b => b.category === selectedCategory);
    if (selectedCondition !== 'All') result = result.filter(b => b.condition === selectedCondition);
    const range = PRICE_RANGES[selectedPriceRange];
    result = result.filter(b => b.price >= range.min && b.price <= range.max);

    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [books, searchQuery, selectedCategory, selectedCondition, selectedPriceRange, sortBy]);

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedPriceRange(0);
    setSortBy('latest');
    setPage(1);
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedCondition !== 'All',
    selectedPriceRange !== 0,
  ].filter(Boolean).length;

  return (
    <div className="section-max-width page-padding py-6 md:py-10">
      {/* Hero Banner */}
      {!searchQuery && (
        <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 border border-primary-800/50 p-8 md:p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-accent-400" />
              <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">Trending Now</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-3 leading-tight">
              Discover Your<br />
              <span className="text-gradient">Next Great Read</span>
            </h1>
            <p className="text-dark-300 text-sm md:text-base max-w-md">
              Browse thousands of new and used books from sellers across India. Great prices, fast delivery.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-xs text-dark-400">Books Listed</p>
              </div>
              <div className="w-px h-8 bg-dark-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">5K+</p>
                <p className="text-xs text-dark-400">Happy Readers</p>
              </div>
              <div className="w-px h-8 bg-dark-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-dark-400">Sellers</p>
              </div>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute right-4 top-4 bottom-4 w-48 md:w-64 flex items-center justify-center opacity-10 pointer-events-none">
            <BookOpen size={180} />
          </div>
        </div>
      )}

      {/* Top Sellers Section */}
      {!searchQuery && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Award size={24} className="text-amber-400" />
            <h2 className="text-2xl font-bold text-dark-100">Top Rated Sellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {MOCK_TOP_SELLERS.map(seller => (
              <div key={seller.id} className="card-glass p-5 flex flex-col hover:border-dark-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {seller.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-100">{seller.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StarRating rating={seller.rating} size={12} />
                      <span className="text-xs text-dark-500">({seller.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-dark-400 mb-4 bg-dark-900/50 p-3 rounded-lg border border-dark-800/50">
                  <div className="text-center w-full">
                    <p className="font-semibold text-dark-200">{seller.totalSales.toLocaleString()}+</p>
                    <p className="text-xs">Books Sold</p>
                  </div>
                  <div className="w-px h-8 bg-dark-800" />
                  <div className="text-center w-full">
                    <p className="font-semibold text-dark-200">{new Date(seller.joinDate).getFullYear()}</p>
                    <p className="text-xs">Joined</p>
                  </div>
                </div>
                <div className="mt-auto bg-dark-800/30 p-3 rounded-xl border border-dark-800/50 relative">
                  <Quote size={14} className="text-dark-600 absolute top-3 left-3" />
                  <p className="text-xs text-dark-400 italic pl-6 leading-relaxed mb-2">
                    {seller.recentReview}
                  </p>
                  <p className="text-[10px] text-dark-500 text-right font-medium">— {seller.reviewerName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-dark-100">
            Search results for: <span className="text-primary-400">"{searchQuery}"</span>
          </h2>
          <p className="text-sm text-dark-500 mt-1">{filtered.length} books found</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(p => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-300 hover:text-dark-100 hover:border-dark-600 transition-all text-sm font-medium"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">{activeFiltersCount}</span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-dark-500 hover:text-dark-200 transition-colors">
              <X size={12} /> Clear all
            </button>
          )}
          <span className="text-sm text-dark-500">{filtered.length} books</span>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          className="input-field max-w-[180px] py-2 text-sm"
          aria-label="Sort books"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="card-glass p-5 mb-6 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Category */}
            <div>
              <p className="label">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 8).map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setPage(1); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-dark-800 border-dark-700 text-dark-400 hover:border-dark-500 hover:text-dark-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="label">Price Range</p>
              <div className="flex flex-col gap-1.5">
                {PRICE_RANGES.map((range, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === i}
                      onChange={() => { setSelectedPriceRange(i); setPage(1); }}
                      className="accent-primary-500"
                    />
                    <span className="text-sm text-dark-300">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="label">Condition</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(cond => (
                  <button
                    key={cond}
                    onClick={() => { setSelectedCondition(cond); setPage(1); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedCondition === cond
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-dark-800 border-dark-700 text-dark-400 hover:border-dark-500 hover:text-dark-200'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <BookCardSkeleton key={i} />)
          : paginated.map(book => <BookCard key={book.id} book={book} />)
        }
      </div>

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto text-dark-700 mb-4" />
          <h3 className="text-lg font-semibold text-dark-400">No books found</h3>
          <p className="text-dark-600 text-sm mt-1">Try adjusting your filters or search query</p>
          <Button onClick={clearFilters} variant="secondary" className="mt-4">Clear Filters</Button>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-10">
          <Button variant="secondary" onClick={() => setPage(p => p + 1)}>
            Load More Books
          </Button>
        </div>
      )}

      {/* Platform Reviews Section */}
      {!searchQuery && <PlatformReviews />}
    </div>
  );
}
