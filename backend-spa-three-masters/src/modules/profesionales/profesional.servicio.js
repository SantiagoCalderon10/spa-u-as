import { NotFoundError, ValidationError } from '../../shared/errors/AppError.js';

export class ProfesionalServicio {
  constructor(profesionalRepositorio) {
    this.profesionalRepositorio = profesionalRepositorio;
  }

  async crearProfesional(datos) {
    return await this.profesionalRepositorio.crearProfesional(datos);
  }

  async obtenerProfesionales() {
    return await this.profesionalRepositorio.obtenerProfesionales();
  }

  async obtenerProfesionalesAdmin() {
    return await this.profesionalRepositorio.obtenerProfesionales(true);
  }

  async obtenerProfesionalPorId(id) {
    const prof = await this.profesionalRepositorio.obtenerProfesionalPorId(id);
    if (!prof) throw new NotFoundError(`Profesional con id ${id} no encontrado`);
    return prof;
  }

  async obtenerMiPerfil(idUsuario) {
    if (!idUsuario) {
      throw new ValidationError('No se pudo identificar la cuenta autenticada');
    }

    const prof = await this.profesionalRepositorio.obtenerPorUsuario(idUsuario);
    if (!prof) {
      throw new NotFoundError('Esta cuenta no tiene un perfil profesional vinculado');
    }

    return prof;
  }

  async actualizarProfesional(id, datos) {
    const prof = await this.profesionalRepositorio.actualizarProfesional(id, datos);
    if (!prof) throw new NotFoundError(`Profesional con id ${id} no encontrado`);
    return prof;
  }

  async eliminarProfesional(id) {
    const prof = await this.profesionalRepositorio.eliminarProfesional(id);
    if (!prof) throw new NotFoundError(`Profesional con id ${id} no encontrado`);
    return prof;
  }
}
