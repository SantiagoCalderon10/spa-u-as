import { UsuarioModel } from './models/entities/Usuarios.model.js';

export class UsuarioRepositorio {
  async crearUsuario(usuario) {
    try {
      return await UsuarioModel.create(usuario);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async obtenerUsuarios() {
    try {
      return await UsuarioModel.find().select('-contrasenaHash');
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async obtenerUsuarioPorId(id) {
    try {
      return await UsuarioModel.findById(id).select('-contrasenaHash');
    } catch (error) {
      throw new Error(`Error al obtener usuario por id: ${error.message}`);
    }
  }

  async obtenerPorCorreo(correo, incluirContrasena = false) {
    try {
      const consulta = UsuarioModel.findOne({ correo });
      if (incluirContrasena) {
        consulta.select('+contrasenaHash');
      }
      return await consulta;
    } catch (error) {
      throw new Error(`Error al buscar usuario por correo: ${error.message}`);
    }
  }

  async actualizarUsuario(id, datos) {
    try {
      return await UsuarioModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true }).select('-contrasenaHash');
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async eliminarUsuario(id) {
    try {
      return await UsuarioModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}

