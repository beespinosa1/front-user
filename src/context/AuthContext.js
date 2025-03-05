import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error al cargar el usuario:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Función para verificar si un usuario existe
  const checkUser = async (username) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.checkUser(username);
    } catch (err) {
      setError(err.message || 'Error al verificar el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para solicitar código de restablecimiento
  const requestPasswordReset = async (username) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.requestPasswordReset(username);
    } catch (err) {
      setError(err.message || 'Error al solicitar código de restablecimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar código de restablecimiento
  const verifyResetCode = async (username, code) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.verifyResetCode(username, code);
    } catch (err) {
      setError(err.message || 'Error al verificar código');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para restablecer contraseña
  const resetPassword = async (username, code, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.resetPassword(username, code, newPassword);
    } catch (err) {
      setError(err.message || 'Error al restablecer contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (newPassword) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.changePassword(newPassword);
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkUser,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 