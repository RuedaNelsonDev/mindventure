import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);

function extractError(err, fallback) {
  return err?.response?.data?.mensaje || err?.message || fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/auth/perfil');
        if (!cancelled) {
          setUser(res?.data?.data?.user || null);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: u, token } = res?.data?.data || {};
      if (!u || !token) {
        return { success: false, error: 'Respuesta invalida del servidor' };
      }
      localStorage.setItem(TOKEN_KEY, token);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: extractError(err, 'Error al iniciar sesion') };
    }
  }

  async function registro(datos) {
    try {
      const res = await api.post('/auth/registrar', datos);
      const { user: u, token } = res?.data?.data || {};
      if (!u || !token) {
        return { success: false, error: 'Respuesta invalida del servidor' };
      }
      localStorage.setItem(TOKEN_KEY, token);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: extractError(err, 'Error al registrarse') };
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    navigate('/login');
  }

  async function actualizarPerfil(datos) {
    try {
      const res = await api.patch('/auth/perfil', datos);
      const u = res?.data?.data?.user;
      if (u) setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: extractError(err, 'Error al actualizar el perfil') };
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    registro,
    logout,
    actualizarPerfil,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
