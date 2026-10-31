import { NotFoundError } from '../../shared/errors/AppError.js';

export class HorarioServicio {
  constructor(horarioRepositorio) {
    this.horarioRepositorio = horarioRepositorio;
  }

  async crearHorario(datos) {
    return await this.horarioRepositorio.crearHorario(datos);
  }

  async obtenerHorarios() {
    return await this.horarioRepositorio.obtenerHorarios();
  }

  async obtenerPorProfesional(idProfesional) {
    return await this.horarioRepositorio.obtenerPorProfesional(idProfesional);
  }

  async obtenerHorarioPorId(id) {
    const horario = await this.horarioRepositorio.obtenerHorarioPorId(id);
    if (!horario) throw new NotFoundError(`Horario con id ${id} no encontrado`);
    return horario;
  }

  async actualizarHorario(id, datos) {
    const horario = await this.horarioRepositorio.actualizarHorario(id, datos);
    if (!horario) throw new NotFoundError(`Horario con id ${id} no encontrado`);
    return horario;
  }

  async eliminarHorario(id) {
    const horario = await this.horarioRepositorio.eliminarHorario(id);
    if (!horario) throw new NotFoundError(`Horario con id ${id} no encontrado`);
    return horario;
  }
}
