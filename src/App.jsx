import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#f1f5f9' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#f1f5f9' } },
            duration: 3000,
          }}
        />
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
