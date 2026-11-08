import bcrypt from 'bcryptjs';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { RolUsuario } from '../../shared/enums.js';

const CAMPOS_CREACION = [
  'nombreusuario',
  'correo',
  'telefono',
  'nombrecompleto',
  'rol',
  'activo',
];

const CAMPOS_ACTUALIZACION = [
  'nombreusuario',
  'correo',
  'telefono',
  'nombrecompleto',
  'rol',
  'activo',
  'contrasena',
];

const LONGITUD_MINIMA_CONTRASENA = 6;
const LONGITUD_TELEFONO = 10;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class UsuarioServicio {
  constructor(usuarioRepositorio) {
    this.usuarioRepositorio = usuarioRepositorio;
  }

  async crearUsuario(datos = {}) {
    const { contrasena, ...restoDatos } = datos || {};
    const campos = this.#seleccionar(restoDatos, CAMPOS_CREACION);

    this.#validarContrasena(contrasena);
    this.#validarRol(campos.rol);

    const correo = this.#normalizarCorreo(campos.correo);
    if (!correo) {
      throw new ValidationError('El correo es requerido');
    }
    this.#validarFormatoCorreo(correo);
    campos.correo = correo;
    campos.telefono = this.#normalizarTelefono(campos.telefono);

    const existe = await this.usuarioRepositorio.obtenerPorCorreo(correo);
    if (existe) {
      throw new ConflictError(`Ya existe un usuario con el correo ${correo}`);
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await this.usuarioRepositorio.crearUsuario({
      ...campos,
      contrasenaHash,
    });

    return this.#sinHash(nuevoUsuario);
  }

  async obtenerUsuarios() {
    return await this.usuarioRepositorio.obtenerUsuarios();
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await this.usuarioRepositorio.obtenerUsuarioPorId(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  /**
   * Solo lo usa AuthServicio para verificar credenciales.
   * Devuelve el documento con contrasenaHash incluido.
   */
  async obtenerPorCorreoConContrasena(correo) {
    const correoNormalizado = this.#normalizarCorreo(correo);
    if (!correoNormalizado) {
      return null;
    }
    return await this.usuarioRepositorio.obtenerPorCorreo(correoNormalizado, true);
  }

  async actualizarUsuario(id, datos = {}) {
    const cambios = this.#seleccionar(datos || {}, CAMPOS_ACTUALIZACION);

    if (Object.keys(cambios).length === 0) {
      throw new ValidationError('No hay campos para actualizar');
    }

    this.#validarRol(cambios.rol);

    if (cambios.correo !== undefined) {
      const correo = this.#normalizarCorreo(cambios.correo);
      if (!correo) {
        throw new ValidationError('El correo no puede estar vacío');
      }
      this.#validarFormatoCorreo(correo);

      const existente = await this.usuarioRepositorio.obtenerPorCorreo(correo);
      if (existente && String(existente._id) !== String(id)) {
        throw new ConflictError(`Ya existe un usuario con el correo ${correo}`);
      }

      cambios.correo = correo;
    }

    if (cambios.telefono !== undefined) {
      cambios.telefono = this.#normalizarTelefono(cambios.telefono);
    }

    if (cambios.contrasena !== undefined) {
      this.#validarContrasena(cambios.contrasena);
      cambios.contrasenaHash = await bcrypt.hash(cambios.contrasena, 10);
      delete cambios.contrasena;
    }

    const actualizado = await this.usuarioRepositorio.actualizarUsuario(id, cambios);
    if (!actualizado) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }

    return this.#sinHash(actualizado);
  }

  /**
   * Perfil de la clienta: solo sus datos de contacto.
   * El rol, el estado y la contraseña no se cambian desde aquí.
   */
  async actualizarPerfilCliente(id, datos = {}) {
    const cambios = this.#seleccionar(datos || {}, ['nombrecompleto', 'telefono', 'correo']);

    if (Object.keys(cambios).length === 0) {
      throw new ValidationError('No hay campos para actualizar');
    }

    if (cambios.nombrecompleto !== undefined) {
      const nombre = String(cambios.nombrecompleto).trim();
      if (!nombre) {
        throw new ValidationError('El nombre completo es requerido');
      }
      cambios.nombrecompleto = nombre;
    }

    if (cambios.telefono !== undefined) {
      cambios.telefono = this.#normalizarTelefono(cambios.telefono);
    }

    if (cambios.correo !== undefined) {
      const correo = this.#normalizarCorreo(cambios.correo);
      if (!correo) {
        throw new ValidationError('El correo no puede estar vacío');
      }
      this.#validarFormatoCorreo(correo);

      const existente = await this.usuarioRepositorio.obtenerPorCorreo(correo);
      if (existente && String(existente._id) !== String(id)) {
        throw new ConflictError(`Ya existe un usuario con el correo ${correo}`);
      }

      cambios.correo = correo;
    }

    const actualizado = await this.usuarioRepositorio.actualizarUsuario(id, cambios);
    if (!actualizado) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }

    return this.#sinHash(actualizado);
  }

  async eliminarUsuario(id) {
    const eliminado = await this.usuarioRepositorio.eliminarUsuario(id);
    if (!eliminado) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
    return this.#sinHash(eliminado);
  }

  #seleccionar(datos, camposPermitidos) {
    const resultado = {};
    for (const campo of camposPermitidos) {
      if (datos[campo] !== undefined) {
        resultado[campo] = datos[campo];
      }
    }
    return resultado;
  }

  #normalizarCorreo(correo) {
    return String(correo ?? '').toLowerCase().trim();
  }

  #validarFormatoCorreo(correo) {
    if (!PATRON_CORREO.test(correo)) {
      throw new ValidationError(
        'El correo no tiene un formato válido, por ejemplo nombre@correo.com'
      );
    }
  }

  /**
   * El teléfono se guarda como número de 10 dígitos. Acepta el indicativo de
   * Colombia (+57 …) al pegar, pero rechaza cualquier otra longitud.
   */
  #normalizarTelefono(telefono) {
    let digitos = String(telefono ?? '').replace(/\D/g, '');

    if (digitos.length > LONGITUD_TELEFONO && digitos.startsWith('57')) {
      digitos = digitos.slice(2);
    }

    if (digitos.length !== LONGITUD_TELEFONO) {
      throw new ValidationError(
        `El teléfono es requerido y debe tener exactamente ${LONGITUD_TELEFONO} dígitos`
      );
    }

    return Number(digitos);
  }

  #validarContrasena(contrasena) {
    if (typeof contrasena !== 'string' || contrasena.length < LONGITUD_MINIMA_CONTRASENA) {
      throw new ValidationError(
        `La contraseña es requerida y debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres`
      );
    }
  }

  #validarRol(rol) {
    if (rol === undefined) {
      return;
    }
    if (!Object.values(RolUsuario).includes(rol)) {
      throw new ValidationError('El rol enviado no es válido');
    }
  }

  #sinHash(usuario) {
    const obj = usuario.toObject ? usuario.toObject() : { ...usuario };
    delete obj.contrasenaHash;
    return obj;
  }
}
