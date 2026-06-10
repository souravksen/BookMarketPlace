import { useState } from 'react';
import { Star, MessageSquareQuote, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

const INITIAL_REVIEWS = [
  { id: 1, user: 'Priya Sharma', rating: 5, text: 'Absolutely love this platform! Found some rare college textbooks here at half the price.', date: '2 days ago' },
  { id: 2, user: 'Rahul Verma', rating: 4, text: 'Great UI and smooth checkout experience. The chat with seller feature is very helpful.', date: '1 week ago' },
  { id: 3, user: 'Anita Desai', rating: 5, text: 'Best place to sell my old novels. The dashboard makes managing inventory so easy!', date: '2 weeks ago' },
];

export default function PlatformReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (text.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    const newReview = {
      id: Date.now(),
      user: 'You',
      rating,
      text: text.trim(),
      date: 'Just now',
    };

    setReviews([newReview, ...reviews]);
    setIsWriting(false);
    setRating(0);
    setText('');
    toast.success('Thank you for your feedback!');
  };

  return (
    <div className="mt-20 pt-16 border-t border-dark-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquareQuote size={24} className="text-primary-400" />
            <h2 className="text-3xl font-bold text-dark-100">Platform Experience</h2>
          </div>
          <p className="text-dark-400 max-w-xl">
            See what our community of readers and sellers has to say about BookMarket. Your feedback helps us improve!
          </p>
        </div>
        {!isWriting && (
          <Button onClick={() => setIsWriting(true)} className="flex-shrink-0">
            Write a Review
          </Button>
        )}
      </div>

      {isWriting && (
        <form onSubmit={handleSubmit} className="bg-dark-900/50 border border-dark-700 p-6 rounded-2xl mb-10 animate-fade-in">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Rate your experience</h3>
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    (hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-dark-600'
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-dark-400">
              {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us what you loved or what we can improve..."
            className="input-field min-h-[120px] mb-4 w-full"
          />

          <div className="flex items-center gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsWriting(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Send size={16} /> Submit Review
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="card-glass p-6 flex flex-col relative overflow-hidden">
            {/* Background decoration */}
            <MessageSquareQuote size={80} className="absolute -top-4 -right-4 text-dark-800/30 -z-10" />
            
            <div className="flex items-center gap-1 mb-4 z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={review.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-dark-700'}
                />
              ))}
            </div>
            
            <p className="text-dark-300 text-sm leading-relaxed mb-6 flex-1 z-10">"{review.text}"</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-800/50 z-10">
              <span className="font-semibold text-dark-100">{review.user}</span>
              <span className="text-xs text-dark-500">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
