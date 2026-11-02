import mongoose from 'mongoose';
import { RolUsuario } from '../../../../shared/enums.js';
import { Usuario } from '../domain/Usuario.js';

const { Schema } = mongoose;

const usuariosSchema = new Schema({
  nombreusuario: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contrasenaHash: { type: String, required: true, select: false },
  telefono: { type: Number, required: true },
  rol: {
    type: String,
    enum: Object.values(RolUsuario),
    default: RolUsuario.CLIENTE,
    required: true
  },
  nombrecompleto: { type: String, required: true },
  activo: { type: Boolean, required: true, default: true },
}, { timestamps: true });

usuariosSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('usuarios', usuariosSchema);

