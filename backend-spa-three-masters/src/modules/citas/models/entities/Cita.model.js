

import { Cita } from '../domain/Cita.js';
import mongoose from 'mongoose';
import { EstadoCita, RolUsuario } from '../../../../shared/enums.js';

const { Schema } = mongoose;

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const citasSchema = new Schema({
    fecha: { type: Date, required: true },
    horaInicio: { type: String, required: true, match: HORA },
    horaFin: { type: String, required: true, match: HORA },
    idProfesional: { type: Schema.Types.ObjectId, ref: 'profesionales', required: true },
    servicio: {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
    },
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: "clientes",
        required: true
    },
    fechaCreacion: { type: Date },
    estado: {
        type: String,
        enum: Object.values(EstadoCita),
        default: EstadoCita.CONFIRMADA,
        required: true
    },
    tokenHash: { type: String, required: true, unique: true, select: false },
    idServicio: {
        type: Schema.Types.ObjectId,
        ref: "servicios",
        required: true
    },
    motivoCancelacion: { type: String, default: null },
    canceladaPor: {
        type: String,
        enum: [...Object.values(RolUsuario), null],
        default: null
    },
    fechaCancelacion: { type: Date, default: null },
}, { timestamps: true });

citasSchema.index({ idProfesional: 1, fecha: 1, horaInicio: 1 });
citasSchema.index({ idCliente: 1, fecha: 1 });

citasSchema.loadClass(Cita);

export const CitasModel = mongoose.model('citas', citasSchema);
