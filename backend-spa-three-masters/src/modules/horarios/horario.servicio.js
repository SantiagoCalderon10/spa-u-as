import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { Hora } from '../../shared/utils/Hora.js';
import { Horario } from './models/domain/Horario.js';

export class HorarioServicio {
  constructor(horarioRepositorio) {
    this.horarioRepositorio = horarioRepositorio;
  }

  #validarHoras(horaInicio, horaFin) {
    if (!horaInicio || !horaFin) {
      throw new ValidationError('La hora de inicio y hora de fin son obligatorias');
    }
    if (!Hora.esValida(horaInicio) || !Hora.esValida(horaFin)) {
      throw new ValidationError('Las horas deben tener un formato HH:mm válido');
    }
    if (Hora.aMinutos(horaInicio) >= Hora.aMinutos(horaFin)) {
      throw new ValidationError('La hora de inicio debe ser anterior a la hora de fin');
    }
  }

  async crearHorario(datos) {
    if (!datos) {
      throw new ValidationError('Los datos del horario son requeridos');
    }
    this.#validarHoras(datos.horaInicio, datos.horaFin);

    if (datos.idProfesional && datos.diaSemana !== undefined) {
      const candidato = Object.assign(new Horario(), datos);
      const existentes = await this.horarioRepositorio.obtenerPorProfesional(datos.idProfesional);
      const solapado = (existentes || []).find((e) => {
        const otro = Object.assign(new Horario(), e.toObject ? e.toObject() : e);
        return candidato.seSolapaCon(otro);
      });
      if (solapado) {
        throw new ConflictError('El profesional ya tiene un horario asignado que se solapa en este mismo día');
      }
    }

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
    const horarioExistente = await this.obtenerHorarioPorId(id);

    const datosCombinados = {
      ...(horarioExistente.toObject ? horarioExistente.toObject() : horarioExistente),
      ...datos,
    };

    if (datos.horaInicio || datos.horaFin) {
      this.#validarHoras(datosCombinados.horaInicio, datosCombinados.horaFin);
    }

    if (datosCombinados.idProfesional && datosCombinados.diaSemana !== undefined) {
      const candidato = Object.assign(new Horario(), datosCombinados);
      const existentes = await this.horarioRepositorio.obtenerPorProfesional(datosCombinados.idProfesional);
      const solapado = (existentes || []).find((e) => {
        const idExistente = String(e._id || e.id);
        if (idExistente === String(id)) return false;
        const otro = Object.assign(new Horario(), e.toObject ? e.toObject() : e);
        return candidato.seSolapaCon(otro);
      });

      if (solapado) {
        throw new ConflictError('El horario actualizado se solapa con otro horario del profesional en este mismo día');
      }
    }

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
