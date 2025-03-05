/**
 * Servicio para gestionar las transacciones de tarjetas de crédito
 * Proporciona métodos para listar, buscar y registrar transacciones
 */
import Service from './Service';

class TarjetaTransaccionService extends Service {
  constructor() {
    super();
    this.baseEndpoint = '/v1/transacciones-tarjetas';
  }

  /**
   * Obtiene la lista de transacciones para una tarjeta específica
   * @param {number} idTarjeta - ID de la tarjeta para filtrar transacciones
   * @returns {Promise<Array>} Lista de transacciones
   */
  async listarTransaccionesPorTarjeta(idTarjeta) {
    try {
      return await this.get(`${this.baseEndpoint}/?idTarjeta=${idTarjeta}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca una transacción por su ID
   * @param {string} id - ID único de la transacción
   * @returns {Promise<Object>} Datos de la transacción
   */
  async obtenerTransaccionPorId(id) {
    try {
      return await this.get(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Registra una nueva transacción de tarjeta
   * @param {Object} datosTransaccion - Datos de la transacción a registrar
   * @param {boolean} diferido - Indica si la transacción es diferida
   * @param {number} cuotas - Número de cuotas (para transacciones diferidas)
   * @param {boolean} conIntereses - Indica si las cuotas incluyen intereses
   * @returns {Promise<Object>} Transacción registrada
   */
  async registrarTransaccion(datosTransaccion, diferido = false, cuotas = 0, conIntereses = false) {
    try {
      const payload = {
        ...datosTransaccion,
        diferido,
        cuotas,
        conIntereses
      };
      
      return await this.post(this.baseEndpoint + '/', payload);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default TarjetaTransaccionService; 