import mongoose from 'mongoose';
import { Servicio } from '../domain/Servicio.js';

const { Schema } = mongoose;

const serviciosSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  idCategoria: {
    type: Schema.Types.ObjectId,
    ref: "categorias",

  },
  duracion: { type: Number, required: true },
  urlFoto: { type: String },
  activo: { type: Boolean, required: true, default: true },
}, { timestamps: true });

serviciosSchema.loadClass(Servicio);

export const ServicioModel = mongoose.model('servicios', serviciosSchema);
