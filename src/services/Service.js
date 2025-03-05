/**
 * Clase base para todos los servicios de la aplicación
 * Proporciona funcionalidad común como manejo de peticiones HTTP
 */
class Service {
  constructor() {
    // URL base de la API - puede ser configurada desde variables de entorno
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Configura los headers para incluir el token de autenticación
   * @returns {Object} Headers con token de autenticación
   */
  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      ...this.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Realiza una petición GET
   * @param {string} endpoint - Endpoint de la API
   * @param {boolean} requiresAuth - Indica si la petición requiere autenticación
   * @returns {Promise} Respuesta de la API
   */
  async get(endpoint, requiresAuth = true) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: requiresAuth ? this.getAuthHeaders() : this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición GET:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @param {boolean} requiresAuth - Indica si la petición requiere autenticación
   * @returns {Promise} Respuesta de la API
   */
  async post(endpoint, data, requiresAuth = true) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: requiresAuth ? this.getAuthHeaders() : this.headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición POST:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @param {boolean} requiresAuth - Indica si la petición requiere autenticación
   * @returns {Promise} Respuesta de la API
   */
  async put(endpoint, data, requiresAuth = true) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: requiresAuth ? this.getAuthHeaders() : this.headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición PUT:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición PATCH
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @param {boolean} requiresAuth - Indica si la petición requiere autenticación
   * @returns {Promise} Respuesta de la API
   */
  async patch(endpoint, data, requiresAuth = true) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: requiresAuth ? this.getAuthHeaders() : this.headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición PATCH:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   * @param {string} endpoint - Endpoint de la API
   * @param {boolean} requiresAuth - Indica si la petición requiere autenticación
   * @returns {Promise} Respuesta de la API
   */
  async delete(endpoint, requiresAuth = true) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: requiresAuth ? this.getAuthHeaders() : this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en la petición DELETE:', error);
      throw error;
    }
  }

  /**
   * Maneja errores de manera centralizada
   * @param {Error} error - Error a manejar
   * @throws {Error} Error procesado
   */
  handleError(error) {
    // Aquí se puede implementar lógica específica de manejo de errores
    // Por ejemplo, redirigir a login si hay error de autenticación
    if (error.message.includes('401')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    
    throw error;
  }
}

export default Service; 