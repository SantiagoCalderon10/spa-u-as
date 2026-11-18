const CAMPOS_FRANJA = ['idProfesional', 'diaSemana', 'horaInicio', 'horaFin'];

export class HorarioControlador {
  constructor(horarioServicio) {
    this.horarioServicio = horarioServicio;
  }

  async crearHorario(req, res, next) {
    try {
      const nuevo = await this.horarioServicio.crearHorario(req.body);
      return res.status(201).json(nuevo);
    } catch (error) {
      next(error);
    }
  }

  async obtenerHorarios(req, res, next) {
    try {
      const { idProfesional } = req.query;
      const lista = idProfesional
        ? await this.horarioServicio.obtenerPorProfesional(idProfesional)
        : await this.horarioServicio.obtenerHorarios();
      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtenerHorarioPorId(req, res, next) {
    try {
      const horario = await this.horarioServicio.obtenerHorarioPorId(req.params.id);
      return res.status(200).json(horario);
    } catch (error) {
      next(error);
    }
  }

  // Consulta previa: permite advertir al administrador antes de confirmar una
  // edición o una baja. Va después del guardia de administrador en las rutas.
  async citasAfectadas(req, res, next) {
    try {
      const horario = await this.horarioServicio.obtenerHorarioPorId(req.params.id);
      const cambios = {};
      for (const campo of CAMPOS_FRANJA) {
        if (req.query[campo] !== undefined && req.query[campo] !== '') {
          cambios[campo] = req.query[campo];
        }
      }
      const afectadas = await this.horarioServicio.citasAfectadas(horario, cambios);
      return res.status(200).json(afectadas);
    } catch (error) {
      next(error);
    }
  }

  async actualizarHorario(req, res, next) {
    try {
      const { horario, citasAfectadas } = await this.horarioServicio.actualizarHorario(
        req.params.id,
        req.body
      );
      return res.status(200).json({ horario, citasAfectadas });
    } catch (error) {
      next(error);
    }
  }

  async eliminarHorario(req, res, next) {
    try {
      const { horario, citasAfectadas } = await this.horarioServicio.eliminarHorario(req.params.id);
      return res.status(200).json({ mensaje: 'Horario eliminado', horario, citasAfectadas });
    } catch (error) {
      next(error);
    }
  }
}
