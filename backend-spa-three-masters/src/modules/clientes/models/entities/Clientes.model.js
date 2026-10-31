import mongoose from 'mongoose';
import { Cliente } from '../domain/Cliente.js';

const { Schema } = mongoose;

const clientesSchema = new Schema({
  nombre: { type: String, required: true },
  nombreNormalizado: { type: String, required: true },
  telefono: { type: String, required: true },
  telefonoNormalizado: { type: String, required: true },
  idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
}, { timestamps: true });

clientesSchema.index(
  { telefonoNormalizado: 1, nombreNormalizado: 1 },
  {
    unique: true,
    partialFilterExpression: {
      telefonoNormalizado: { $type: 'string' },
      nombreNormalizado: { $type: 'string' },
    },
  }
);

clientesSchema.loadClass(Cliente);

export const ClienteModel = mongoose.model('clientes', clientesSchema);

