import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Interceptor global do Axios para incluir automaticamente o token Bearer em todas as requisições
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export function AuthProvider({ children }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Validação real do token com o backend ao inicializar a aplicação
  useEffect(() => {
    async function validateCurrentSession() {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });

        setUser(data);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        console.warn('Sessão expirada ou inválida:', err.response?.data?.error || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    validateCurrentSession();
  }, [apiUrl]);

  const login = (userData, tokenData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(tokenData);

    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    isLoggedIn,
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
