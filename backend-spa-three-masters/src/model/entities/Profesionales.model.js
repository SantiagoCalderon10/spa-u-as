import mongoose from 'mongoose';
import { Profesional } from '../domain/Profesional.js';

const { Schema } = mongoose;

const profesionalesSchema = new Schema({
  idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  urlFoto: { type: String },
  especialidades: [{ type: Schema.Types.ObjectId, ref: 'categorias', required: true }],
  anioExperiencia: { type: Number },
}, { timestamps: true });

profesionalesSchema.loadClass(Profesional);

export const ProfesionalesModel = mongoose.model('profesionales', profesionalesSchema);
