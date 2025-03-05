import axios from 'axios';

// URL base de la API (cambia esto según tu configuración)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuración de axios con token de autorización
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Servicio de autenticación
const authService = {
  // Verificar si el usuario existe
  checkUser: async (username) => {
    try {
      const response = await axios.post(`${API_URL}/auth/check-user`, { username });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al verificar el usuario' };
    }
  },

  // Iniciar sesión con usuario y contraseña
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token, user } = response.data;
      
      // Establecer token en headers
      setAuthToken(token);
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Cerrar sesión
  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('user');
  },

  // Solicitar código para restablecer contraseña
  requestPasswordReset: async (username) => {
    try {
      const response = await axios.post(`${API_URL}/auth/request-reset`, { username });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al solicitar código de restablecimiento' };
    }
  },

  // Verificar código de restablecimiento
  verifyResetCode: async (username, code) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-code`, { username, code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al verificar código' };
    }
  },

  // Restablecer contraseña
  resetPassword: async (username, code, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        username, 
        code, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al restablecer contraseña' };
    }
  },

  // Cambiar contraseña (cuando el usuario está autenticado)
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al cambiar contraseña' };
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener token actual
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService; 