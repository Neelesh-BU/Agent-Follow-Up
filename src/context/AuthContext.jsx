import { createContext, useState, useEffect, useCallback } from 'react';
import storage from '@/utils/storage';
import { normalizeUser } from '@/utils/roles';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUserState(null);
  }, []);

  useEffect(() => {
    const initAuth = () => {
      const token = storage.getToken();
      const storedUser = storage.getUser();

      if (token && storedUser) {
        setUserState(normalizeUser(storedUser));
      } else if (!token) {
        storage.clearAuth();
        setUserState(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback((userData, token) => {
    const normalized = normalizeUser(userData);
    if (token) {
      storage.setToken(token);
    }
    if (normalized) {
      storage.setUser(normalized);
      setUserState(normalized);
    }
  }, []);

  const setUser = useCallback((userData) => {
    const normalized = normalizeUser(userData);
    if (normalized) {
      storage.setUser(normalized);
      setUserState(normalized);
    } else {
      storage.removeUser();
      setUserState(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
