import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hotelpro_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('hotelpro_token', res.data.token);
        localStorage.setItem('hotelpro_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please verify your credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('hotelpro_token', res.data.token);
        localStorage.setItem('hotelpro_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const quickDemoLogin = async (role) => {
    let email = 'guest@hotelpro.com';
    let password = 'guest123';

    if (role === 'admin') {
      email = 'admin@hotelpro.com';
      password = 'admin123';
    } else if (role === 'staff') {
      email = 'staff@hotelpro.com';
      password = 'staff123';
    }

    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('hotelpro_token');
    localStorage.removeItem('hotelpro_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUser,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff' || user?.role === 'admin',
        isGuest: user?.role === 'guest'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
