import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { Fecha } from '../../shared/utils/Fecha.js';
import { Hora } from '../../shared/utils/Hora.js';
import { Horario } from './models/domain/Horario.js';

const CAMPOS_FRANJA = ['idProfesional', 'diaSemana', 'horaInicio', 'horaFin'];

function aObjeto(documento) {
  if (!documento || typeof documento !== 'object') return {};
  return documento.toObject ? documento.toObject() : { ...documento };
}

export class HorarioServicio {
  constructor(horarioRepositorio, citaRepositorio = null, { reloj = () => new Date() } = {}) {
    this.horarioRepositorio = horarioRepositorio;
    this.citaRepositorio = citaRepositorio;
    this.reloj = reloj;
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

  #horasUtilizables(...horas) {
    return horas.every((hora) => Hora.esValida(hora));
  }

  // La cita afecta a la franja si comparten día y sus intervalos se solapan.
  #solapaFranja(franja, diaSemana, horaInicio, horaFin) {
    if (
      franja.diaSemana === undefined || franja.diaSemana === null ||
      !this.#horasUtilizables(franja.horaInicio, franja.horaFin, horaInicio, horaFin)
    ) {
      return false;
    }
    if (Number(franja.diaSemana) !== Number(diaSemana)) return false;

    return Hora.aMinutos(horaInicio) < Hora.aMinutos(franja.horaFin)
      && Hora.aMinutos(horaFin) > Hora.aMinutos(franja.horaInicio);
  }

  // Tras una edición solo seguimos afectando a la cita si la nueva franja ya
  // no la cubre por completo (por ejemplo, cambió de día o acortó el rango).
  #cubreFranja(franja, diaSemana, horaInicio, horaFin) {
    if (
      franja.diaSemana === undefined || franja.diaSemana === null ||
      !this.#horasUtilizables(franja.horaInicio, franja.horaFin, horaInicio, horaFin)
    ) {
      return false;
    }
    if (Number(franja.diaSemana) !== Number(diaSemana)) return false;

    return Hora.aMinutos(horaInicio) >= Hora.aMinutos(franja.horaInicio)
      && Hora.aMinutos(horaFin) <= Hora.aMinutos(franja.horaFin);
  }

  /**
   * Citas confirmadas de hoy en adelante que dejan de encajar en la franja.
   * Con `cambios` se evalúa una edición; sin él, una eliminación.
   * No modifica nada: solo informa para que el panel pueda advertir al admin.
   */
  async citasAfectadas(horario, cambios = {}) {
    if (!horario || !this.citaRepositorio) return [];

    const anterior = aObjeto(horario);
    const cambiosAplicables = CAMPOS_FRANJA.filter(
      (campo) => cambios?.[campo] !== undefined && cambios[campo] !== ''
    );
    const propuesto = cambiosAplicables.length > 0
      ? { ...anterior, ...Object.fromEntries(cambiosAplicables.map((campo) => [campo, cambios[campo]])) }
      : null;

    // Las citas pertenecen a la profesional dueña de la franja original,
    // aunque la edición termine moviendo la franja a otra profesional.
    const idProfesional = idDeProfesional(anterior);
    if (!idProfesional) return [];

    // Misma convención que la baja de profesionales: "hoy" es la fecha local
    // del salón, no la UTC, para no perder citas de la tarde/noche.
    const ahora = this.reloj();
    const claveLocal = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(
      ahora.getDate()
    ).padStart(2, '0')}`;
    const desde = Fecha.normalizar(claveLocal);
    const citas = await this.citaRepositorio.obtenerCitasConfirmadasDesdePorProfesional(
      idProfesional,
      desde
    ) || [];

    return citas
      .filter((citaDocumento) => {
        const cita = aObjeto(citaDocumento);
        if (!cita.fecha) return false;

        let diaSemana;
        try {
          diaSemana = Fecha.normalizar(cita.fecha).getUTCDay();
        } catch {
          return false;
        }

        if (!this.#solapaFranja(anterior, diaSemana, cita.horaInicio, cita.horaFin)) {
          return false;
        }

        return !(propuesto && this.#cubreFranja(propuesto, diaSemana, cita.horaInicio, cita.horaFin));
      })
      .map((citaDocumento) => {
        const cita = aObjeto(citaDocumento);
        const cliente = aObjeto(cita.idCliente);

        return {
          id: String(cita._id ?? ''),
          fecha: Fecha.clave(cita.fecha),
          horaInicio: cita.horaInicio,
          horaFin: cita.horaFin,
          servicio: cita.servicio?.name ?? '',
          cliente: cliente.nombre ?? cliente.nombrecompleto ?? '',
          telefono: cliente.telefono ?? '',
        };
      });
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

    const citasAfectadas = await this.citasAfectadas(horarioExistente, datos);
    const horario = await this.horarioRepositorio.actualizarHorario(id, datos);
    if (!horario) throw new NotFoundError(`Horario con id ${id} no encontrado`);
    return { horario, citasAfectadas };
  }

  async eliminarHorario(id) {
    const horario = await this.obtenerHorarioPorId(id);
    const citasAfectadas = await this.citasAfectadas(horario);

    const eliminado = await this.horarioRepositorio.eliminarHorario(id);
    if (!eliminado) throw new NotFoundError(`Horario con id ${id} no encontrado`);
    return { horario: eliminado, citasAfectadas };
  }
}

function idDeProfesional(horario) {
  const valor = horario?.idProfesional;
  if (!valor) return '';
  return typeof valor === 'object' ? String(valor._id ?? '') : String(valor);
}
