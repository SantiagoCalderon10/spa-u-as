import { UsuarioModel } from './models/entities/Usuarios.model.js';

export class UsuarioRepositorio {
  async crearUsuario(usuario) {
    return await UsuarioModel.create(usuario);
  }

  async obtenerUsuarios() {
    return await UsuarioModel.find().select('-contrasenaHash');
  }

  async obtenerUsuarioPorId(id) {
    return await UsuarioModel.findById(id).select('-contrasenaHash');
  }

  async obtenerPorCorreo(correo, incluirContrasena = false) {
    const consulta = UsuarioModel.findOne({ correo });
    if (incluirContrasena) {
      consulta.select('+contrasenaHash');
    }
    return await consulta;
  }

  async actualizarUsuario(id, datos) {
    return await UsuarioModel.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true,
    }).select('-contrasenaHash');
  }

  async eliminarUsuario(id) {
    return await UsuarioModel.findByIdAndDelete(id).select('-contrasenaHash');
  }
}
