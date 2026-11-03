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
            // La vista de administración necesita los nombres de la clienta y
            // de la profesional; los ObjectId solos no alcanzan para la tabla.
            const citas = await CitasModel.find()
                .populate('idCliente', 'nombre telefono')
                .populate({
                    path: 'idProfesional',
                    populate: { path: 'idUsuario', select: 'nombrecompleto' },
                })
                .sort({ fecha: -1, horaInicio: -1 });
            return citas || [];
        } catch (error) {
            throw new Error(`Error al obtener las citas: ${error.message}`);
        }
    }

    // Agenda de una profesional: solo sus citas, con los datos que necesita
    // para atender (clienta y servicio), nunca las de sus compañeras.
    async obtenerCitasPorProfesional(idProfesional) {
        try {
            const citas = await CitasModel.find({ idProfesional })
                .populate('idCliente', 'nombre telefono')
                .populate({
                    path: 'idProfesional',
                    populate: { path: 'idUsuario', select: 'nombrecompleto' },
                })
                .sort({ fecha: 1, horaInicio: 1 });
            return citas || [];
        } catch (error) {
            throw new Error(`Error al obtener las citas del profesional: ${error.message}`);
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
            // El enlace público muestra el nombre de la clienta y de la
            // profesional sin exponer el tokenHash (select: false en el modelo).
            return await CitasModel.findOne({ tokenHash })
                .populate('idCliente', 'nombre telefono')
                .populate({
                    path: 'idProfesional',
                    populate: { path: 'idUsuario', select: 'nombrecompleto' },
                });
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
