import { EstadoCita } from "../../shared/enums.js";
import { CitasModel } from "./models/entities/Cita.model.js";

export class CitaRepositorio {

    async crearCita(cita) {
        try {
            const citaCreada = await CitasModel.create(cita);
            return citaCreada;
        } catch (error) {
            throw new Error(`Error al crear la cita en el repositorio: ${error.message}`);
        }
    }

    async obtenerCitasConfirmadasPorProfesionalYFechaExacta(idProfesional, fecha) {
        try {
            const citas = await CitasModel.find({
                idProfesional,
                fecha,
                estado: EstadoCita.CONFIRMADA,
            });
            return citas || [];
        } catch (error) {
            throw new Error(`Error al obtener las citas del profesional: ${error.message}`);
        }
    }

    async obtenerCitaPorId(id) {
        try {
            const cita = await CitasModel.findById(id);
            return cita;
        } catch (error) {
            throw new Error(`Error al obtener la cita con id ${id}: ${error.message}`);
        }
    }

    async obtenerCitas() {
        try {
            const citas = await CitasModel.find();
            return citas || [];
        } catch (error) {
            throw new Error(`Error al obtener las citas: ${error.message}`);
        }
    }

    async obtenerCitasConfirmadasPorProfesionalYFecha(idProfesional, inicio, fin) {
        try {
            const citas = await CitasModel.find({
                idProfesional,
                fecha: { $gte: inicio, $lt: fin },
                estado: EstadoCita.CONFIRMADA,
            });
            return citas || [];
        } catch (error) {
            throw new Error(`Error al obtener las citas del profesional: ${error.message}`);
        }
    }

    async obtenerCitaPorTokenHash(tokenHash) {
        try {
            return await CitasModel.findOne({ tokenHash });
        } catch (error) {
            throw new Error(`Error al obtener la cita por enlace: ${error.message}`);
        }
    }

    async guardar(cita) {
        try {
            return await cita.save();
        } catch (error) {
            throw new Error(`Error al guardar la cita: ${error.message}`);
        }
    }

    async actualizarCita(id, datosActualizados) {
        try {
            const citaActualizada = await CitasModel.findByIdAndUpdate(
                id, 
                datosActualizados, 
                { new: true, runValidators: true }
            );
            return citaActualizada;
        } catch (error) {
            throw new Error(`Error al actualizar la cita con id ${id}: ${error.message}`);
        }
    }

    async eliminarCita(id) {
        try {
            const citaEliminada = await CitasModel.findByIdAndDelete(id);
            if (!citaEliminada) throw new Error(`Cita con id ${id} no encontrada`);
            return citaEliminada;
        } catch (error) {
            throw new Error(`Error al eliminar la cita con id ${id}: ${error.message}`);
        }
    }
}
