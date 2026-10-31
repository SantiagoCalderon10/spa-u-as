import mongoose from 'mongoose';
import { RolUsuario } from '../domain/enums.js';
import { Usuario } from '../domain/Usuario.js';

const { Schema } = mongoose;

const usuariosSchema = new Schema({
  nombreusuario: { type: String, required: true },
  correo: { type: String, required: true },
  contrasenaHash: { type: String, required: true },
  telefono: { type: Number, required: true },
  rol: { type: String, 
    enum: Object.values(RolUsuario),
    default: RolUsuario.CLIENTE,
    required: true },
  fechaCreacion: { type: Date },
  nombrecompleto: { type: String, required: true },
  activo: { type: Boolean, required: true, default: true },
}, { timestamps: true });

usuariosSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('usuarios', usuariosSchema);
