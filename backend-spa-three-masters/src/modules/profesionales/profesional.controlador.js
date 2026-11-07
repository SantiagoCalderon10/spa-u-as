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

  async resumenBaja(req, res, next) {
    try {
      const resumen = await this.profesionalServicio.resumenBaja(req.params.id);
      return res.status(200).json(resumen);
    } catch (error) {
      next(error);
    }
  }

  async eliminarProfesional(req, res, next) {
    try {
      const opciones = {
        cancelarCitas: this.#aBooleano(req.body?.cancelarCitas),
        eliminarHorarios: this.#aBooleano(req.body?.eliminarHorarios),
        eliminarCuenta: this.#aBooleano(req.body?.eliminarCuenta),
        motivo: typeof req.body?.motivo === 'string' ? req.body.motivo : '',
      };

      const resultado = await this.profesionalServicio.eliminarProfesional(
        req.params.id,
        opciones
      );

      return res.status(200).json({ mensaje: "Profesional eliminado", ...resultado });
    } catch (error) {
      next(error);
    }
  }

  #aBooleano(valor) {
    return valor === true || valor === 'true' || valor === 1 || valor === '1';
  }
}

