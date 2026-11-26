import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('interlinka-token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(response => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('interlinka-token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('interlinka-token', response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(details) {
    const response = await api.post('/auth/register', details);
    localStorage.setItem('interlinka-token', response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  function logout() {
    localStorage.removeItem('interlinka-token');
    setUser(null);
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
