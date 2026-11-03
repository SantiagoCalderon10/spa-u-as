export class ProfesionalControlador {
  constructor(profesionalServicio) {
    this.profesionalServicio = profesionalServicio;
  }

  async crearProfesional(req, res, next) {
    try {
      const nuevo = await this.profesionalServicio.crearProfesional(req.body);
      return res.status(201).json(nuevo);
    } catch (error) {
      next(error);
    }
  }

  async obtenerProfesionales(req, res, next) {
    try {
      const lista = await this.profesionalServicio.obtenerProfesionales();
      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtenerProfesionalesAdmin(req, res, next) {
    try {
      const lista = await this.profesionalServicio.obtenerProfesionalesAdmin();
      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtenerMiPerfil(req, res, next) {
    try {
      const prof = await this.profesionalServicio.obtenerMiPerfil(req.usuario?._id);
      return res.status(200).json(prof);
    } catch (error) {
      next(error);
    }
  }

  async obtenerProfesionalPorId(req, res, next) {
    try {
      const prof = await this.profesionalServicio.obtenerProfesionalPorId(req.params.id);
      return res.status(200).json(prof);
    } catch (error) {
      next(error);
    }
  }

  async actualizarProfesional(req, res, next) {
    try {
      const actualizado = await this.profesionalServicio.actualizarProfesional(req.params.id, req.body);
      return res.status(200).json(actualizado);
    } catch (error) {
      next(error);
    }
  }

  async eliminarProfesional(req, res, next) {
    try {
      const eliminado = await this.profesionalServicio.eliminarProfesional(req.params.id);
      return res.status(200).json({ mensaje: "Profesional eliminado", profesional: eliminado });
    } catch (error) {
      next(error);
    }
  }
}

