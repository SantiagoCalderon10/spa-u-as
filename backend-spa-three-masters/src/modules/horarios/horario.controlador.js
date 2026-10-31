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

  async actualizarHorario(req, res, next) {
    try {
      const actualizado = await this.horarioServicio.actualizarHorario(req.params.id, req.body);
      return res.status(200).json(actualizado);
    } catch (error) {
      next(error);
    }
  }

  async eliminarHorario(req, res, next) {
    try {
      const eliminado = await this.horarioServicio.eliminarHorario(req.params.id);
      return res.status(200).json({ mensaje: "Horario eliminado", horario: eliminado });
    } catch (error) {
      next(error);
    }
  }
}

