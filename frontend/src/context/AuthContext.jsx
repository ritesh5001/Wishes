import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import api, { clearAuthToken, setAuthToken } from '../utils/api';

const TOKEN_KEY = 'pcm_token';
const USER_KEY = 'pcm_user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  });
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored user payload', error);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!token) {
      clearAuthToken();
      setInitializing(false);
      return;
    }

    setAuthToken(token);
    setInitializing(false);
  }, [token]);

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);

    if (typeof window !== 'undefined') {
      if (nextToken) {
        localStorage.setItem(TOKEN_KEY, nextToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }

      if (nextUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      const nextToken = data?.token;
      const nextUser = data?.user ?? null;

      if (!nextToken) {
        throw new Error('No token returned from server.');
      }

      persistAuth(nextToken, nextUser);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    persistAuth(null, null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      initializing,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      setUser: (nextUser) => persistAuth(token, nextUser),
    }),
    [token, user, loading, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
