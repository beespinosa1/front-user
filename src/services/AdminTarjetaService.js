import Service from "./service";

class AdminTarjetaService extends Service {
  constructor() {
    super('v1/tarjetas');
  }

  // Listar todas las tarjetas - endpoint ficticio para propósitos administrativos
  // En producción, esto podría requerir un endpoint especial o parámetros de paginación
  async listarTodasTarjetas(filtros = {}) {
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

  // Listar tarjetas por cliente específico
  async listarTarjetasPorCliente(clienteId) {
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

  // Listar tarjetas por cuenta
  async listarTarjetasPorCuenta(idCuentaTarjeta) {
    const endpoint = `${this.endpoint}/cuenta/${idCuentaTarjeta}`;

    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Obtener tarjeta por ID
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

  // Emitir nueva tarjeta para una cuenta
  async emitirTarjeta(idCuentaTarjeta) {
    const endpoint = `${this.endpoint}/cuenta/${idCuentaTarjeta}`;

    try {
      const response = await this.api.post(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Activar tarjeta
  async activarTarjeta(id) {
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

  // Inactivar tarjeta (equivalente a bloquear en el front)
  async inactivarTarjeta(id) {
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

  // Bloquear tarjeta (bloqueo por seguridad)
  async bloquearTarjeta(id) {
    const endpoint = `${this.endpoint}/${id}/bloquear`;

    try {
      const response = await this.api.put(endpoint);
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Método para procesar solicitudes de tarjetas (endpoint ficticio)
  // Este endpoint debería implementarse en el backend
  async procesarSolicitudTarjeta(idSolicitud, accion, motivo = null) {
    const endpoint = `${this.endpoint}/solicitudes/${idSolicitud}/${accion}`;
    
    try {
      const response = await this.api.put(endpoint, { motivo });
      return response.data;
    } catch (error) {
      if (!error.response) throw error;
      const { data, status } = error.response;
      throw { data, status };
    }
  }

  // Método para obtener transacciones de una tarjeta (endpoint ficticio)
  // Este endpoint debería implementarse en el backend
  async obtenerTransaccionesTarjeta(idTarjeta, filtros = {}) {
    let endpoint = `${this.endpoint}/${idTarjeta}/transacciones`;
    
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
}

const adminTarjetaService = new AdminTarjetaService();

export default adminTarjetaService; 