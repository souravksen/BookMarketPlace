import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_location');
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude, isManual: false };
        setLocation(newLocation);
        localStorage.setItem('user_location', JSON.stringify(newLocation));
        setLoading(false);
        toast.success('Location updated successfully!');
      },
      (err) => {
        let errMsg = 'Unable to retrieve your location';
        if (err.code === 1) errMsg = 'Location access denied by user';
        else if (err.code === 2) errMsg = 'Position unavailable';
        else if (err.code === 3) errMsg = 'Location request timed out';
        
        setError(errMsg);
        setLoading(false);
        toast.error(errMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const setManualLocation = (lat, lng, address) => {
    const newLocation = { lat, lng, address, isManual: true };
    setLocation(newLocation);
    localStorage.setItem('user_location', JSON.stringify(newLocation));
    setError(null);
    toast.success('Location set to ' + address);
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem('user_location');
  };

  return (
    <LocationContext.Provider value={{ location, loading, error, requestLocation, setManualLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
