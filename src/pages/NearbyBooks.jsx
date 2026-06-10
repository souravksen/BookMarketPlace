import { useState, useMemo, useEffect } from 'react';
import { useLocation as useGeoLocation } from '../context/LocationContext';
import { MOCK_BOOKS } from '../utils/mockData';
import { getMockBookLocation, calculateDistance } from '../utils/geoUtils';
import BookCard from '../components/books/BookCard';
import Button from '../components/ui/Button';
import { MapPin, Navigation, Map as MapIcon, List as ListIcon, Search, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically adjust map view based on user location
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function NearbyBooks() {
  const { location, loading: locLoading, error: locError, requestLocation, setManualLocation } = useGeoLocation();
  const [maxDistance, setMaxDistance] = useState(5); // in km
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [manualCity, setManualCity] = useState('');

  // Manual fallback coordinates for major cities
  const cityCoordinates = {
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    const city = manualCity.toLowerCase().trim();
    if (cityCoordinates[city]) {
      setManualLocation(cityCoordinates[city].lat, cityCoordinates[city].lng, manualCity);
    } else {
      // Very crude fallback: just give some random coords
      setManualLocation(20.5937, 78.9629, manualCity);
    }
  };

  // Enhance books with location data
  const booksWithLocation = useMemo(() => {
    if (!location) return [];
    
    return MOCK_BOOKS.map(book => {
      // Mock book location relative to user (within ~15km radius)
      const bookLoc = getMockBookLocation(book.id, location.lat, location.lng, 15);
      const dist = calculateDistance(location.lat, location.lng, bookLoc.lat, bookLoc.lng);
      
      return {
        ...book,
        location: bookLoc,
        distance: dist
      };
    }).sort((a, b) => a.distance - b.distance); // Sort nearest first
  }, [location]);

  const filteredBooks = useMemo(() => {
    return booksWithLocation.filter(b => b.distance <= maxDistance);
  }, [booksWithLocation, maxDistance]);

  if (!location && !locLoading) {
    return (
      <div className="section-max-width page-padding py-12 md:py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
          <Navigation size={48} className="text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-dark-100 mb-4">Discover Local Books</h1>
        <p className="text-dark-400 max-w-lg mb-8">
          Find books being sold by users near you. Share your location to see the best local deals without the shipping costs.
        </p>
        
        {locError && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2 max-w-md">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm">{locError}</p>
          </div>
        )}

        <Button onClick={requestLocation} className="mb-8 flex items-center gap-2" size="lg">
          <MapPin size={20} /> Use My Current Location
        </Button>

        <div className="w-full max-w-md flex items-center gap-4 mb-8">
          <div className="h-px bg-dark-700 flex-1"></div>
          <span className="text-dark-500 text-sm">OR</span>
          <div className="h-px bg-dark-700 flex-1"></div>
        </div>

        <form onSubmit={handleManualSearch} className="w-full max-w-md relative">
          <input
            type="text"
            placeholder="Enter city (e.g. Mumbai, Delhi)..."
            className="input-field w-full pl-11"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 py-1.5 px-3 text-sm">
            Search
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="section-max-width page-padding py-6 md:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={24} className="text-primary-400" />
            <h1 className="text-3xl font-bold text-dark-100">Nearby Books</h1>
          </div>
          <p className="text-dark-400 flex items-center gap-2">
            Showing books near <span className="font-semibold text-dark-200">{location?.address || 'your location'}</span>
            <button onClick={requestLocation} className="text-primary-400 hover:underline text-sm ml-2">Update</button>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-dark-900/50 p-2 rounded-xl border border-dark-800">
          <div className="flex items-center gap-2 px-2 border-r border-dark-700">
            <span className="text-sm text-dark-400 whitespace-nowrap">Distance:</span>
            <select 
              value={maxDistance} 
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-transparent text-dark-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={20}>Within 20 km</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${viewMode === 'list' ? 'bg-dark-700 text-dark-100' : 'text-dark-500 hover:text-dark-300'}`}
            >
              <ListIcon size={16} /> <span className="hidden sm:inline">List</span>
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${viewMode === 'map' ? 'bg-dark-700 text-dark-100' : 'text-dark-500 hover:text-dark-300'}`}
            >
              <MapIcon size={16} /> <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {locLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-dark-400">Locating books near you...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-dark-300">
              Found <strong className="text-dark-100">{filteredBooks.length}</strong> books within {maxDistance} km.
            </p>
          </div>

          {viewMode === 'list' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
              {filteredBooks.length === 0 && (
                <div className="col-span-full py-12 text-center card-glass">
                  <MapPin size={48} className="mx-auto text-dark-600 mb-4" />
                  <h3 className="text-lg font-semibold text-dark-200 mb-2">No books found nearby</h3>
                  <p className="text-dark-500">Try expanding your search radius to see more results.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-dark-700 shadow-xl relative z-0">
              {location && (
                <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={[location.lat, location.lng]} />
                  
                  {/* User Location Marker */}
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>
                      <strong>You are here</strong>
                    </Popup>
                  </Marker>

                  {/* Book Markers */}
                  {filteredBooks.map((book) => (
                    <Marker key={book.id} position={[book.location.lat, book.location.lng]}>
                      <Popup>
                        <div className="w-48 p-1">
                          <img src={book.image} alt={book.title} className="w-full h-24 object-cover rounded-md mb-2" />
                          <h4 className="font-bold text-sm mb-1 line-clamp-1">{book.title}</h4>
                          <p className="text-xs text-gray-600 mb-1">By {book.author}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-blue-600">₹{book.price}</span>
                            <span className="text-xs font-medium text-gray-500">{book.distance.toFixed(1)} km</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2">Seller: {book.seller.name} ({book.location.city})</p>
                          <a href={`/books/${book.id}`} className="block w-full text-center bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 transition-colors">
                            View Details
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
