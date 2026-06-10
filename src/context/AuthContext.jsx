import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { MOCK_USER } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bookmarket_token'));
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bookmarket_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('bookmarket_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (credentials) => {
    try {
      const { data } = await authService.login(credentials);
      const { token: jwt, user: userData } = data;
      localStorage.setItem('bookmarket_token', jwt);
      localStorage.setItem('bookmarket_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Demo: fall back to mock login
      const mockJwt = 'mock_jwt_token_demo';
      localStorage.setItem('bookmarket_token', mockJwt);
      localStorage.setItem('bookmarket_user', JSON.stringify(MOCK_USER));
      setToken(mockJwt);
      setUser(MOCK_USER);
      return { success: true };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const { data: resData } = await authService.register(data);
      const { token: jwt, user: userData } = resData;
      localStorage.setItem('bookmarket_token', jwt);
      localStorage.setItem('bookmarket_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Demo: fall back to mock registration
      const newUser = { ...MOCK_USER, name: data.name, email: data.email };
      const mockJwt = 'mock_jwt_token_demo';
      localStorage.setItem('bookmarket_token', mockJwt);
      localStorage.setItem('bookmarket_user', JSON.stringify(newUser));
      setToken(mockJwt);
      setUser(newUser);
      return { success: true };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bookmarket_token');
    localStorage.removeItem('bookmarket_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
