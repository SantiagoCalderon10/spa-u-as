import { NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { Cliente } from './models/domain/Cliente.js';

export class ClienteServicio {
  constructor(clienteRepositorio) {
    this.clienteRepositorio = clienteRepositorio;
  }

  async crearCliente(datos) {
    if (!datos) {
      throw new ValidationError('Los datos de la clienta son requeridos');
    }

    const nombre = Cliente.normalizarNombre(datos.nombre);
    const telefono = Cliente.normalizarTelefono(datos.telefono);

    const nuevoCliente = {
      nombre,
      nombreNormalizado: Cliente.claveNombre(datos.nombre),
      telefono,
      telefonoNormalizado: telefono,
    };

    if (datos.idUsuario) {
      nuevoCliente.idUsuario = datos.idUsuario;
    }

    return await this.clienteRepositorio.crearCliente(nuevoCliente);
  }

  async obtenerOCrearCliente(datos) {
    if (!datos) {
      throw new ValidationError('Los datos de la clienta son requeridos');
    }

    const nombreNormalizado = Cliente.claveNombre(datos.nombre);
    const telefonoNormalizado = Cliente.normalizarTelefono(datos.telefono);

    const existente = await this.clienteRepositorio.obtenerPorTelefonoYNombre(
      telefonoNormalizado,
      nombreNormalizado
    );

    if (existente) {
      return existente;
    }

    const datosNuevoCliente = {
      nombre: datos.nombre,
      telefono: datos.telefono,
    };

    try {
      return await this.crearCliente(datosNuevoCliente);
    } catch (error) {
      const reintento = await this.clienteRepositorio.obtenerPorTelefonoYNombre(
        telefonoNormalizado,
        nombreNormalizado
      );

      if (reintento) {
        return reintento;
      }

      throw error;
    }
  }

  async obtenerClientes() {
    return await this.clienteRepositorio.obtenerClientes();
  }

  async obtenerClientePorId(id) {
    const cliente = await this.clienteRepositorio.obtenerClientePorId(id);
    if (!cliente) throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  async actualizarCliente(id, datos) {
    if (!datos) {
      throw new ValidationError('Los datos de la clienta son requeridos');
    }

    const cambios = { ...datos };
    delete cambios.nombreNormalizado;
    delete cambios.telefonoNormalizado;

    if (datos.nombre !== undefined) {
      cambios.nombre = Cliente.normalizarNombre(datos.nombre);
      cambios.nombreNormalizado = Cliente.claveNombre(datos.nombre);
    }

    if (datos.telefono !== undefined) {
      cambios.telefono = Cliente.normalizarTelefono(datos.telefono);
      cambios.telefonoNormalizado = cambios.telefono;
    }

    const cliente = await this.clienteRepositorio.actualizarCliente(id, cambios);
    if (!cliente) throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  async eliminarCliente(id) {
    const cliente = await this.clienteRepositorio.eliminarCliente(id);
    if (!cliente) throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    return cliente;
  }
}
