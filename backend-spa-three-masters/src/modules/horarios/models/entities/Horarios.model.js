import mongoose from 'mongoose';
import { Horario } from '../domain/Horario.js';

const { Schema } = mongoose;

const horariosSchema = new Schema({
  diaSemana: { type: Number, required: true }, // 0 = Domingo, 1 = Lunes, etc.
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  idProfesional: { type: Schema.Types.ObjectId, ref: 'profesionales', required: true },
}, { timestamps: true });

horariosSchema.loadClass(Horario);

export const HorariosModel = mongoose.model('horarios', horariosSchema);

