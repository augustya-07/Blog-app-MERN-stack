import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('inkspire_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('inkspire_token');
    if (!token) return;

    setLoading(true);
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('inkspire_user', JSON.stringify(data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('inkspire_token', data.token);
    localStorage.setItem('inkspire_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('inkspire_token', data.token);
    localStorage.setItem('inkspire_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('inkspire_token');
    localStorage.removeItem('inkspire_user');
    setUser(null);
  }

  function syncUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem('inkspire_user', JSON.stringify(nextUser));
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, syncUser, isAuthed: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
