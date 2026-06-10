import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Spinner from '../components/ui/Spinner';

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const BookDetails = lazy(() => import('../pages/BookDetails'));
const Cart = lazy(() => import('../pages/Cart'));
const Orders = lazy(() => import('../pages/Orders'));
const SellerDashboard = lazy(() => import('../pages/SellerDashboard'));
const NearbyBooks = lazy(() => import('../pages/NearbyBooks'));
const NotFound = lazy(() => import('../pages/NotFound'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireSeller && user?.role !== 'SELLER') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/nearby" element={<NearbyBooks />} />
            <Route path="/cart" element={
              <ProtectedRoute><Cart /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><Orders /></ProtectedRoute>
            } />
            <Route path="/seller/dashboard" element={
              <ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute>
            } />
          </Route>
          <Route path="/login" element={
            <GuestRoute><Login /></GuestRoute>
          } />
          <Route path="/register" element={
            <GuestRoute><Register /></GuestRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
