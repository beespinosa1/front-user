import Service from "./Service";

class AdminCuentaTarjetaService extends Service {
  constructor() {
    super('v1/cuentas-tarjetas');
  }

  /**
   * Obtiene todas las cuentas tarjeta registradas en el sistema
   * @returns {Promise<Array>} Lista de cuentas tarjeta
   */
  async listarTodos() {
    try {
      const response = await this.api.get(this.endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  /**
   * Obtiene una cuenta tarjeta por su ID
   * @param {number} id - ID de la cuenta tarjeta
   * @returns {Promise<Object>} Datos de la cuenta tarjeta
   */
  async obtenerPorId(id) {
    const endpoint = `${this.endpoint}/${id}`;
    
    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  /**
   * Crea una nueva cuenta tarjeta
   * @param {Object} cuentaTarjeta - Datos de la cuenta tarjeta a crear
   * @returns {Promise<Object>} Datos de la cuenta tarjeta creada
   */
  async crearCuentaTarjeta(cuentaTarjeta) {
    try {
      const response = await this.api.post(this.endpoint, cuentaTarjeta);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  /**
   * Activa una cuenta tarjeta
   * @param {number} id - ID de la cuenta tarjeta a activar
   * @returns {Promise<void>}
   */
  async activarCuenta(id) {
    const endpoint = `${this.endpoint}/${id}/activar`;
    
    try {
      const response = await this.api.put(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  /**
   * Inactiva una cuenta tarjeta
   * @param {number} id - ID de la cuenta tarjeta a inactivar
   * @returns {Promise<void>}
   */
  async inactivarCuenta(id) {
    const endpoint = `${this.endpoint}/${id}/inactivar`;
    
    try {
      const response = await this.api.put(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  /**
   * Busca cuentas tarjeta por cliente
   * Este es un método adicional que podría implementarse en el backend
   * @param {string} clienteId - ID del cliente
   * @returns {Promise<Array>} Lista de cuentas tarjeta del cliente
   */
  async buscarPorCliente(clienteId) {
    const endpoint = `${this.endpoint}/cliente/${clienteId}`;
    
    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  /**
   * Obtiene estadísticas de cuentas tarjeta
   * Este es un método adicional que podría implementarse en el backend
   * @returns {Promise<Object>} Estadísticas de cuentas tarjeta
   */
  async obtenerEstadisticas() {
    const endpoint = `${this.endpoint}/estadisticas`;
    
    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }
}

const adminCuentaTarjetaService = new AdminCuentaTarjetaService();

export default adminCuentaTarjetaService; 