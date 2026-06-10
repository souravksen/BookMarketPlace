import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-900 to-dark-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary-800">
          <BookOpen size={36} className="text-primary-400" />
        </div>
        <h1 className="text-7xl font-black text-gradient mb-2">404</h1>
        <h2 className="text-2xl font-bold text-dark-200 mb-3">Page Not Found</h2>
        <p className="text-dark-500 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for seems to have wandered off — much like a lost bookmark.
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2 mx-auto">
            <Home size={16} /> Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
