export class UsuarioControlador {
  constructor(usuarioServicio) {
    this.usuarioServicio = usuarioServicio;
  }

  async crearUsuario(req, res, next) {
    try {
      const nuevo = await this.usuarioServicio.crearUsuario(req.body);
      return res.status(201).json(nuevo);
    } catch (error) {
      next(error);
    }
  }

  async obtenerUsuarios(req, res, next) {
    try {
      const lista = await this.usuarioServicio.obtenerUsuarios();
      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtenerUsuarioPorId(req, res, next) {
    try {
      const usuario = await this.usuarioServicio.obtenerUsuarioPorId(req.params.id);
      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async actualizarUsuario(req, res, next) {
    try {
      const actualizado = await this.usuarioServicio.actualizarUsuario(req.params.id, req.body);
      return res.status(200).json(actualizado);
    } catch (error) {
      next(error);
    }
  }

  async eliminarUsuario(req, res, next) {
    try {
      const eliminado = await this.usuarioServicio.eliminarUsuario(req.params.id);
      return res.status(200).json({ mensaje: "Usuario eliminado", usuario: eliminado });
    } catch (error) {
      next(error);
    }
  }
}

