import { Star } from 'lucide-react';

export default function StarRating({ rating, maxStars = 5, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={filled || half ? 'star-filled' : 'star-empty'}
          />
        );
      })}
    </div>
  );
}
