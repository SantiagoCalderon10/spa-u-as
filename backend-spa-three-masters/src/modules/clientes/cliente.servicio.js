import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { Cliente } from './models/domain/Cliente.js';

export class ClienteServicio {
  constructor(clienteRepositorio, usuarioServicio = null) {
    this.clienteRepositorio = clienteRepositorio;
    this.usuarioServicio = usuarioServicio;
  }

  async crearCliente(datos) {
    if (!datos) {
      throw new ValidationError('Los datos de la clienta son requeridos');
    }

    const nombre = Cliente.normalizarNombre(datos.nombre);
    const telefono = Cliente.normalizarTelefono(datos.telefono);

    const nuevoCliente = {
      nombre,
      nombreNormalizado: Cliente.claveNombre(datos.nombre),
      telefono,
      telefonoNormalizado: telefono,
    };

    if (datos.idUsuario) {
      nuevoCliente.idUsuario = datos.idUsuario;
    }

    return await this.clienteRepositorio.crearCliente(nuevoCliente);
  }

  async obtenerOCrearCliente(datos) {
    if (!datos) {
      throw new ValidationError('Los datos de la clienta son requeridos');
    }

    const nombreNormalizado = Cliente.claveNombre(datos.nombre);
    const telefonoNormalizado = Cliente.normalizarTelefono(datos.telefono);

    const existente = await this.clienteRepositorio.obtenerPorTelefonoYNombre(
      telefonoNormalizado,
      nombreNormalizado
    );

    if (existente) {
      return existente;
    }

    const datosNuevoCliente = {
      nombre: datos.nombre,
      telefono: datos.telefono,
    };

    try {
      return await this.crearCliente(datosNuevoCliente);
    } catch (error) {
      const reintento = await this.clienteRepositorio.obtenerPorTelefonoYNombre(
        telefonoNormalizado,
        nombreNormalizado
      );

      if (reintento) {
        return reintento;
      }

      throw error;
    }
  }

  async obtenerClientes() {
    return await this.clienteRepositorio.obtenerClientes();
  }

  async obtenerClientePorId(id) {
    const cliente = await this.clienteRepositorio.obtenerClientePorId(id);
    if (!cliente) throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  async actualizarCliente(id, datos) {
    if (!datos) {
      throw new ValidationError('Los datos de la clienta son requeridos');
    }

    const cambios = { ...datos };
    delete cambios.nombreNormalizado;
    delete cambios.telefonoNormalizado;

    if (datos.nombre !== undefined) {
      cambios.nombre = Cliente.normalizarNombre(datos.nombre);
      cambios.nombreNormalizado = Cliente.claveNombre(datos.nombre);
    }

    if (datos.telefono !== undefined) {
      cambios.telefono = Cliente.normalizarTelefono(datos.telefono);
      cambios.telefonoNormalizado = cambios.telefono;
    }

    const cliente = await this.clienteRepositorio.actualizarCliente(id, cambios);
    if (!cliente) throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  /**
   * Resuelve la clienta de la cuenta autenticada.
   * Si todavía no está vinculada, reclama el registro de invitada con el
   * mismo teléfono y nombre, o crea uno nuevo con los datos de la cuenta.
   */
  async obtenerMiCliente(idUsuario, usuario) {
    if (!idUsuario) {
      throw new ValidationError('La cuenta no está identificada');
    }

    const vinculado = await this.clienteRepositorio.obtenerPorUsuario(idUsuario);
    if (vinculado) return vinculado;

    if (!usuario) {
      throw new NotFoundError('No encontramos el perfil de la clienta');
    }

    const nombre = Cliente.normalizarNombre(usuario.nombrecompleto);
    const telefono = Cliente.normalizarTelefono(usuario.telefono);

    const existente = await this.clienteRepositorio.obtenerPorTelefonoYNombre(
      telefono,
      Cliente.claveNombre(nombre)
    );

    if (existente) {
      if (existente.idUsuario) {
        throw new ConflictError('Ya existe una cuenta vinculada a estos datos');
      }
      existente.vincularUsuario(idUsuario);
      return await this.clienteRepositorio.guardar(existente);
    }

    return await this.crearCliente({ nombre, telefono, idUsuario });
  }

  async obtenerMiPerfil(idUsuario, usuario) {
    return await this.obtenerMiCliente(idUsuario, usuario);
  }

  /**
   * Actualiza el perfil de la clienta: nombre completo, teléfono y correo.
   * El rol, el estado y la contraseña no se cambian por esta vía.
   */
  async actualizarMiPerfil(idUsuario, usuario, datos = {}) {
    if (!this.usuarioServicio) {
      throw new Error('UsuarioServicio es requerido para actualizar el perfil de la clienta');
    }

    const cliente = await this.obtenerMiCliente(idUsuario, usuario);

    const nombre =
      datos.nombrecompleto !== undefined
        ? Cliente.normalizarNombre(datos.nombrecompleto)
        : cliente.nombre;
    const telefono =
      datos.telefono !== undefined
        ? Cliente.normalizarTelefono(datos.telefono)
        : cliente.telefono;
    const nombreNormalizado = Cliente.claveNombre(nombre);

    const cambiosUsuario = {};
    if (datos.nombrecompleto !== undefined) cambiosUsuario.nombrecompleto = nombre;
    if (datos.telefono !== undefined) cambiosUsuario.telefono = Number(telefono);
    if (datos.correo !== undefined) cambiosUsuario.correo = datos.correo;

    if (Object.keys(cambiosUsuario).length === 0) {
      throw new ValidationError('No hay campos para actualizar');
    }

    // Se revisa el choque de datos antes de escribir, para no dejar
    // el usuario actualizado y la clienta sin actualizar.
    const otraClienta = await this.clienteRepositorio.obtenerPorTelefonoYNombre(
      telefono,
      nombreNormalizado
    );
    if (otraClienta && String(otraClienta._id) !== String(cliente._id)) {
      throw new ConflictError('Ya existe una clienta con ese teléfono y nombre');
    }

    const usuarioActualizado = await this.usuarioServicio.actualizarPerfilCliente(
      idUsuario,
      cambiosUsuario
    );

    const cambiosCliente = {};
    if (datos.nombrecompleto !== undefined) {
      cambiosCliente.nombre = nombre;
      cambiosCliente.nombreNormalizado = nombreNormalizado;
    }
    if (datos.telefono !== undefined) {
      cambiosCliente.telefono = telefono;
      cambiosCliente.telefonoNormalizado = telefono;
    }

    const clienteActualizado =
      Object.keys(cambiosCliente).length > 0
        ? await this.clienteRepositorio.actualizarCliente(cliente._id, cambiosCliente)
        : cliente;

    return { cliente: clienteActualizado, usuario: usuarioActualizado };
  }

  async eliminarCliente(id) {
    const cliente = await this.clienteRepositorio.eliminarCliente(id);
    if (!cliente) throw new NotFoundError(`Cliente con id ${id} no encontrado`);
    return cliente;
  }
}
