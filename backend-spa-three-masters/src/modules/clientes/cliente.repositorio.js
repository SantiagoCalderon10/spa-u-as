import { ClienteModel } from './models/entities/Clientes.model.js';

export class ClienteRepositorio {
  async crearCliente(cliente) {
    try {
      return await ClienteModel.create(cliente);
    } catch (error) {
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  async obtenerClientes() {
    try {
      return await ClienteModel.find().populate('idUsuario', 'correo nombreusuario');
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  async obtenerClientePorId(id) {
    try {
      return await ClienteModel.findById(id).populate('idUsuario', 'correo nombreusuario');
    } catch (error) {
      throw new Error(`Error al obtener cliente por id: ${error.message}`);
    }
  }

  async obtenerPorTelefonoYNombre(telefonoNormalizado, nombreNormalizado) {
    try {
      return await ClienteModel.findOne({ telefonoNormalizado, nombreNormalizado });
    } catch (error) {
      throw new Error(`Error al buscar cliente por teléfono y nombre: ${error.message}`);
    }
  }

  async actualizarCliente(id, datos) {
    try {
      return await ClienteModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  async eliminarCliente(id) {
    try {
      return await ClienteModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }
}

