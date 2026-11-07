import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { RolUsuario } from '../../shared/enums.js';
import { Fecha } from '../../shared/utils/Fecha.js';
import { Hora } from '../../shared/utils/Hora.js';

const MOTIVO_MINIMO = 3;

export class ProfesionalServicio {
  constructor(
    profesionalRepositorio,
    {
      citaRepositorio = null,
      horarioRepositorio = null,
      usuarioServicio = null,
      reloj = () => new Date(),
    } = {}
  ) {
    this.profesionalRepositorio = profesionalRepositorio;
    this.citaRepositorio = citaRepositorio;
    this.horarioRepositorio = horarioRepositorio;
    this.usuarioServicio = usuarioServicio;
    this.reloj = reloj;
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

  /**
   * Lo que verá administración antes de dar de baja a una profesional:
   * franjas de horario y citas confirmadas que todavía no se han atendido.
   */
  async resumenBaja(id) {
    const profesional = await this.obtenerProfesionalPorId(id);

    const [citas, horarios] = await Promise.all([
      this.#obtenerCitasFuturas(id),
      this.#obtenerHorarios(id),
    ]);

    return {
      profesional,
      horarios: horarios.length,
      citasFuturas: citas.map((cita) => this.#mapearCita(cita)),
    };
  }

  /**
   * Baja de una profesional.
   *
   * Reglas:
   * - Si hay citas confirmadas futuras, solo se elimina cuando se piden
   *   cancelar explícitamente y se envía un motivo (se conservan como
   *   canceladas para no perder el historial).
   * - Si hay horarios, se eliminan junto con el perfil previa confirmación.
   * - La cuenta de usuario solo se borra si se pide y tiene rol profesional.
   *
   * El orden es intencional: primero se validan todas las reglas, luego se
   * cancelan citas, se borran horarios, el perfil y por último la cuenta.
   */
  async eliminarProfesional(id, opciones = {}) {
    const {
      cancelarCitas = false,
      eliminarHorarios = false,
      eliminarCuenta = false,
      motivo = '',
    } = opciones;

    const profesional = await this.obtenerProfesionalPorId(id);

    const [citas, horarios, usuarioAEliminar] = await Promise.all([
      this.#obtenerCitasFuturas(id),
      this.#obtenerHorarios(id),
      eliminarCuenta ? this.#obtenerCuentaAEliminar(profesional) : Promise.resolve(null),
    ]);

    const textoMotivo = String(motivo ?? '').trim();

    if (citas.length > 0 && !cancelarCitas) {
      throw new ConflictError(
        `Esta profesional tiene ${citas.length} ${
          citas.length === 1 ? 'cita confirmada futura' : 'citas confirmadas futuras'
        }. Cancélalas o reasígnalas antes de eliminar el perfil.`
      );
    }

    if (citas.length > 0 && textoMotivo.length < MOTIVO_MINIMO) {
      throw new ValidationError(
        `Escribe el motivo de la cancelación (mínimo ${MOTIVO_MINIMO} caracteres).`
      );
    }

    if (horarios.length > 0 && !eliminarHorarios) {
      throw new ConflictError(
        `Esta profesional tiene ${horarios.length} ${
          horarios.length === 1 ? 'franja de horario' : 'franjas de horario'
        }. Confirma su eliminación para dar de baja el perfil.`
      );
    }

    const citasCanceladas = [];
    for (const cita of citas) {
      cita.cancelar(RolUsuario.ADMINISTRADOR, textoMotivo);
      const guardada = await this.citaRepositorio.guardar(cita);
      citasCanceladas.push(this.#mapearCita(guardada ?? cita));
    }

    if (horarios.length > 0) {
      await this.horarioRepositorio.eliminarPorProfesional(id);
    }

    await this.profesionalRepositorio.eliminarProfesional(id);

    let cuentaEliminada = false;
    if (usuarioAEliminar) {
      await this.usuarioServicio.eliminarUsuario(usuarioAEliminar._id);
      cuentaEliminada = true;
    }

    return {
      profesionalId: id,
      motivo: textoMotivo,
      horariosEliminados: horarios.length,
      citasCanceladas,
      cuentaEliminada,
    };
  }

  async #obtenerCitasFuturas(idProfesional) {
    if (!this.citaRepositorio) {
      throw new ValidationError(
        'CitaRepositorio es requerido para gestionar las citas de la profesional'
      );
    }

    const ahora = this.reloj();
    const inicioDeHoy = Fecha.normalizar(this.#claveLocal(ahora));
    const citas = await this.citaRepositorio.obtenerCitasConfirmadasDesdePorProfesional(
      idProfesional,
      inicioDeHoy
    );

    return (citas || []).filter((cita) => this.#esFutura(cita, ahora));
  }

  async #obtenerHorarios(idProfesional) {
    if (!this.horarioRepositorio) {
      throw new ValidationError(
        'HorarioRepositorio es requerido para gestionar los horarios de la profesional'
      );
    }

    return (await this.horarioRepositorio.obtenerPorProfesional(idProfesional)) || [];
  }

  async #obtenerCuentaAEliminar(profesional) {
    if (!this.usuarioServicio) {
      throw new ValidationError(
        'UsuarioServicio es requerido para eliminar la cuenta de acceso'
      );
    }

    const idUsuario = profesional.idUsuario?._id ?? profesional.idUsuario;
    if (!idUsuario) return null;

    let usuario;
    try {
      usuario = await this.usuarioServicio.obtenerUsuarioPorId(idUsuario);
    } catch (error) {
      if (error instanceof NotFoundError) return null;
      throw error;
    }

    if (!usuario) return null;

    if (usuario.rol !== RolUsuario.PROFESIONAL) {
      throw new ConflictError(
        'La cuenta vinculada no tiene rol profesional, así que no se eliminará automáticamente.'
      );
    }

    return usuario;
  }

  /**
   * Las fechas de las citas se guardan normalizadas a UTC, mientras que el
   * "hoy" del salón se calcula con la fecha local del servidor. Es la misma
   * convención que ya usa el frontend para los filtros de agenda.
   */
  #claveLocal(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  #esFutura(cita, ahora) {
    const claveCita = Fecha.clave(cita.fecha);
    const claveHoy = this.#claveLocal(ahora);

    if (claveCita > claveHoy) return true;
    if (claveCita < claveHoy) return false;

    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    return Hora.aMinutos(cita.horaFin) > minutosAhora;
  }

  #mapearCita(cita) {
    const cliente = cita.idCliente;
    const clientePoblado = cliente && typeof cliente === 'object' && '_id' in cliente;

    return {
      _id: cita._id,
      fecha: Fecha.clave(cita.fecha),
      horaInicio: cita.horaInicio,
      horaFin: cita.horaFin,
      servicio: cita.servicio?.name ?? '',
      precio: cita.servicio?.price ?? null,
      cliente: {
        _id: clientePoblado ? cliente._id : cliente ?? null,
        nombre: clientePoblado ? cliente.nombre ?? 'Clienta' : 'Clienta',
        telefono: clientePoblado ? cliente.telefono ?? null : null,
      },
    };
  }
}
