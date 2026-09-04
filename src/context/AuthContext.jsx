import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('nf_token');
    const storedUser = localStorage.getItem('nf_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('nf_user');
      }
    }
    setInitializing(false);
  }, []);

  const persistSession = useCallback((newToken, newUser) => {
    localStorage.setItem('nf_token', newToken);
    localStorage.setItem('nf_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      persistSession(res.token, res.user);
      toast.success('¡Cuenta creada correctamente!');
      return res.user;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const login = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      persistSession(res.token, res.user);
      toast.success(`¡Bienvenido de nuevo, ${res.user.name}!`);
      return res.user;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const loginGoogle = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await authService.google(data);
      persistSession(res.token, res.user);
      toast.success(`¡Bienvenido, ${res.user.name}!`);
      return res.user;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('nf_token');
    localStorage.removeItem('nf_user');
    setToken(null);
    setUser(null);
    toast.success('Sesión cerrada');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.me();
      setUser(res.user);
      localStorage.setItem('nf_user', JSON.stringify(res.user));
      return res.user;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    isAdmin,
    initializing,
    loading,
    register,
    login,
    loginGoogle,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
