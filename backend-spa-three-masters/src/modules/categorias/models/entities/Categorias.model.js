import mongoose from 'mongoose';
import { Categoria } from '../domain/Categoria.js';

const { Schema } = mongoose;

const categoriasSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: Boolean, default: true }
}, { timestamps: true });

categoriasSchema.loadClass(Categoria);

export const CategoriasModel = mongoose.model('categorias', categoriasSchema);

