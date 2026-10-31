import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors/AppError.js';
import bcrypt from 'bcryptjs'

export class UsuarioServicio {
  constructor(usuarioRepositorio) {
    this.usuarioRepositorio = usuarioRepositorio;
  }

  async crearUsuario(datos) {
    const { contrasena, ...restoDatos } = datos;

    if (!contrasena || contrasena.length < 6) {
      throw new ValidationError('La contraseña es requerida y debe tener al menos 6 caracteres');
    }

    const existe = await this.usuarioRepositorio.obtenerPorCorreo(restoDatos.correo);
    if (existe) {
      throw new ConflictError(`Ya existe un usuario con el correo ${restoDatos.correo}`);
    }

    // Generar hash seguro con salt de costo 10
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = await this.usuarioRepositorio.crearUsuario({
      ...restoDatos,
      contrasenaHash,
    });

    // Asegurar que la respuesta devuelta al controlador no contenga el hash
    const usuarioRespuesta = nuevoUsuario.toObject ? nuevoUsuario.toObject() : { ...nuevoUsuario };
    delete usuarioRespuesta.contrasenaHash;

    return usuarioRespuesta;
  }

  async obtenerUsuarios() {
    return await this.usuarioRepositorio.obtenerUsuarios();
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await this.usuarioRepositorio.obtenerUsuarioPorId(id);
    if (!usuario) throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  async actualizarUsuario(id, datos) {
    return await this.usuarioRepositorio.actualizarUsuario(id, datos);
  }

  async eliminarUsuario(id) {
    return await this.usuarioRepositorio.eliminarUsuario(id);
  }
}

