import { ProfesionalesModel } from './models/entities/Profesionales.model.js';

export class ProfesionalRepositorio {
  async crearProfesional(profesional) {
    try {
      return await ProfesionalesModel.create(profesional);
    } catch (error) {
      throw new Error(`Error al crear profesional: ${error.message}`);
    }
  }

  async obtenerProfesionales() {
    try {
      return await ProfesionalesModel.find()
        .populate('idUsuario', 'nombrecompleto correo telefono')
        .populate('especialidades', 'nombre');
    } catch (error) {
      throw new Error(`Error al obtener profesionales: ${error.message}`);
    }
  }

  async obtenerProfesionalPorId(id) {
    try {
      return await ProfesionalesModel.findById(id)
        .populate('idUsuario', 'nombrecompleto correo telefono')
        .populate('especialidades', 'nombre');
    } catch (error) {
      throw new Error(`Error al obtener profesional por id: ${error.message}`);
    }
  }

  async actualizarProfesional(id, datos) {
    try {
      return await ProfesionalesModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Error al actualizar profesional: ${error.message}`);
    }
  }

  async eliminarProfesional(id) {
    try {
      return await ProfesionalesModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar profesional: ${error.message}`);
    }
  }
}

