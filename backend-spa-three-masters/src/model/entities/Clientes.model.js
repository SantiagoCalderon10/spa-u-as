import mongoose from 'mongoose';
import { Cliente } from '../domain/Cliente.js';

const { Schema } = mongoose;

const clientesSchema = new Schema({
  nombre: { type: String, required: true },
  telefono: { type: Number, required: true },
  idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios'},
}, { timestamps: true });


clientesSchema.loadClass(Cliente);

export const ClienteModel = mongoose.model('clientes', clientesSchema);
