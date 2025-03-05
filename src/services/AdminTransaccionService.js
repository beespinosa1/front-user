import Service from "./Service";

class AdminTransaccionService extends Service {
  constructor() {
    super('v1/transacciones');
  }

  // Listar todas las transacciones - con filtros opcionales
  async listarTransacciones(filtros = {}) {
    let endpoint = this.endpoint;
    
    // Añadir filtros como parámetros de consulta
    if (Object.keys(filtros).length > 0) {
      const params = new URLSearchParams();
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      endpoint = `${endpoint}?${params.toString()}`;
    }

    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Obtener una transacción por su ID
  async obtenerTransaccion(id) {
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

  // Obtener transacciones de un cliente específico
  async obtenerTransaccionesCliente(clienteId, filtros = {}) {
    let endpoint = `${this.endpoint}/cliente/${clienteId}`;
    
    // Añadir filtros como parámetros de consulta
    if (Object.keys(filtros).length > 0) {
      const params = new URLSearchParams();
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      endpoint = `${endpoint}?${params.toString()}`;
    }

    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Obtener transacciones de una tarjeta específica
  async obtenerTransaccionesTarjeta(tarjetaId, filtros = {}) {
    let endpoint = `${this.endpoint}/tarjeta/${tarjetaId}`;
    
    // Añadir filtros como parámetros de consulta
    if (Object.keys(filtros).length > 0) {
      const params = new URLSearchParams();
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      endpoint = `${endpoint}?${params.toString()}`;
    }

    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Marcar una transacción como sospechosa
  async marcarComoSospechosa(id, motivo) {
    const endpoint = `${this.endpoint}/${id}/marcar-sospechosa`;

    try {
      const response = await this.api.put(endpoint, { motivo });
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Añadir una nota a una transacción
  async agregarNota(id, nota) {
    const endpoint = `${this.endpoint}/${id}/notas`;

    try {
      const response = await this.api.post(endpoint, { nota });
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Obtener el historial de eventos de una transacción
  async obtenerHistorialEventos(id) {
    const endpoint = `${this.endpoint}/${id}/eventos`;

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

const adminTransaccionService = new AdminTransaccionService();

export default adminTransaccionService; 