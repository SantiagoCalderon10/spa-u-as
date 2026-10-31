import { HorariosModel } from './models/entities/Horarios.model.js';

export class HorarioRepositorio {
  async crearHorario(horario) {
    try {
      return await HorariosModel.create(horario);
    } catch (error) {
      throw new Error(`Error al crear horario: ${error.message}`);
    }
  }

  async obtenerHorarios() {
    try {
      return await HorariosModel.find().populate('idProfesional');
    } catch (error) {
      throw new Error(`Error al obtener horarios: ${error.message}`);
    }
  }

  async obtenerPorProfesional(idProfesional) {
    try {
      return await HorariosModel.find({ idProfesional });
    } catch (error) {
      throw new Error(`Error al obtener horarios del profesional: ${error.message}`);
    }
  }

  async obtenerHorarioPorId(id) {
    try {
      return await HorariosModel.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener horario por id: ${error.message}`);
    }
  }

  async actualizarHorario(id, datos) {
    try {
      return await HorariosModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Error al actualizar horario: ${error.message}`);
    }
  }

  async eliminarHorario(id) {
    try {
      return await HorariosModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar horario: ${error.message}`);
    }
  }
}

