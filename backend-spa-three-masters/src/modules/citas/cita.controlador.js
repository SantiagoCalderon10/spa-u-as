export class CitaControlador {
    constructor(citaServicio) {
        if (!citaServicio) {
            throw new Error("CitaServicio es requerido para instanciar CitaControlador");
        }
        this.citaServicio = citaServicio;
    }

    async crearCita(req, res, next) {
        try {
            const datosCita = req.body;
            const { cita, enlaceToken } = await this.citaServicio.crearCita(datosCita);
            return res.status(201).json({
                mensaje: "Cita creada exitosamente",
                cita,
                enlaceToken
            });
        } catch (error) {
            next(error);
        }
    }

    async crearCitaPublica(req, res, next) {
        try {
            const datosCita = req.body || {};
            const { cita, enlaceToken } = await this.citaServicio.crearCitaPublica(datosCita);
            return res.status(201).json({
                mensaje: "Cita creada exitosamente",
                cita,
                enlaceToken
            });
        } catch (error) {
            next(error);
        }
    }

    async obtenerDisponibilidad(req, res, next) {
        try {
            const { idProfesional, idServicio, fecha } = req.query || {};
            const disponibilidad = await this.citaServicio.obtenerDisponibilidad({
                idProfesional,
                idServicio,
                fecha,
            });
            return res.status(200).json(disponibilidad);
        } catch (error) {
            next(error);
        }
    }

    async obtenerCitas(req, res, next) {
        try {
            const citas = await this.citaServicio.obtenerCitas();
            return res.status(200).json(citas);
        } catch (error) {
            next(error);
        }
    }

    // --- Panel de la profesional ---

    async obtenerMisCitas(req, res, next) {
        try {
            const citas = await this.citaServicio.obtenerCitasDeProfesional(req.usuario?._id);
            return res.status(200).json(citas);
        } catch (error) {
            next(error);
        }
    }

    async cancelarMiCita(req, res, next) {
        try {
            const { id } = req.params;
            const { motivo } = req.body || {};
            const citaCancelada = await this.citaServicio.cancelarCitaDeProfesional(
                id,
                req.usuario?._id,
                motivo
            );
            return res.status(200).json({
                mensaje: "Cita cancelada exitosamente",
                cita: citaCancelada
            });
        } catch (error) {
            next(error);
        }
    }

    async obtenerCitaPorId(req, res, next) {
        try {
            const { id } = req.params;
            const cita = await this.citaServicio.obtenerCitaPorId(id);
            return res.status(200).json(cita);
        } catch (error) {
            next(error);
        }
    }

    async obtenerCitaPorToken(req, res, next) {
        try {
            const { token } = req.params;
            const cita = await this.citaServicio.obtenerCitaPorToken(token);
            return res.status(200).json(cita);
        } catch (error) {
            next(error);
        }
    }

    async actualizarCita(req, res, next) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;
            const citaActualizada = await this.citaServicio.actualizarCita(id, datosActualizados);
            return res.status(200).json(citaActualizada);
        } catch (error) {
            next(error);
        }
    }

    async eliminarCita(req, res, next) {
        try {
            const { id } = req.params;
            const citaEliminada = await this.citaServicio.eliminarCita(id);
            return res.status(200).json({
                mensaje: "Cita eliminada correctamente",
                cita: citaEliminada
            });
        } catch (error) {
            next(error);
        }
    }

    // --- Endpoints de Negocio ---

    async cancelarCita(req, res, next) {
        try {
            const { id } = req.params;
            const { motivo } = req.body || {};
            // El rol nunca viene del cuerpo: sale del usuario autenticado.
            const rolUsuario = req.usuario?.rol;
            const citaCancelada = await this.citaServicio.cancelarCita(id, { rolUsuario, motivo });
            return res.status(200).json({
                mensaje: "Cita cancelada exitosamente",
                cita: citaCancelada
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelarCitaPorToken(req, res, next) {
        try {
            const { token } = req.params;
            const { motivo } = req.body || {};
            const citaCancelada = await this.citaServicio.cancelarCitaPorToken(token, motivo);
            return res.status(200).json({
                mensaje: "Cita cancelada exitosamente",
                cita: citaCancelada
            });
        } catch (error) {
            next(error);
        }
    }

    async reprogramarCita(req, res, next) {
        try {
            const { id } = req.params;
            const { nuevaFecha, nuevaHoraInicio, nuevaHoraFin } = req.body || {};
            const citaReprogramada = await this.citaServicio.reprogramarCita(id, {
                nuevaFecha,
                nuevaHoraInicio,
                nuevaHoraFin
            });
            return res.status(200).json({
                mensaje: "Cita reprogramada exitosamente",
                cita: citaReprogramada
            });
        } catch (error) {
            next(error);
        }
    }

    async completarCita(req, res, next) {
        try {
            const { id } = req.params;
            const citaCompletada = await this.citaServicio.completarCita(id);
            return res.status(200).json({
                mensaje: "Cita completada exitosamente",
                cita: citaCompletada
            });
        } catch (error) {
            next(error);
        }
    }

    async marcarNoAsistida(req, res, next) {
        try {
            const { id } = req.params;
            const citaActualizada = await this.citaServicio.marcarNoAsistida(id);
            return res.status(200).json({
                mensaje: "Cita marcada como no asistida",
                cita: citaActualizada
            });
        } catch (error) {
            next(error);
        }
    }
}

