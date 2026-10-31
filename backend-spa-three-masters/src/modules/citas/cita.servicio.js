import { createHash, randomBytes } from 'crypto';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { EstadoCita, RolUsuario } from '../../shared/enums.js';
import { Fecha } from '../../shared/utils/Fecha.js';
import { Hora } from '../../shared/utils/Hora.js';
import { Cita } from './models/domain/Cita.js';

export class CitaServicio {
    constructor(citaRepositorio, servicioRepositorio, clienteServicio, horarioRepositorio) {
        if (!citaRepositorio) {
            throw new ValidationError("CitaRepositorio es requerido para instanciar CitaServicio");
        }
        if (!servicioRepositorio) {
            throw new ValidationError("ServicioRepositorio es requerido para instanciar CitaServicio");
        }
        if (!clienteServicio) {
            throw new ValidationError("ClienteServicio es requerido para instanciar CitaServicio");
        }
        this.citaRepositorio = citaRepositorio;
        this.servicioRepositorio = servicioRepositorio;
        this.clienteServicio = clienteServicio;
        this.horarioRepositorio = horarioRepositorio || null;
    }

    generarToken() {
        const token = randomBytes(32).toString('hex');
        const tokenHash = createHash('sha256').update(token).digest('hex');
        return { token, tokenHash };
    }

    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }

    validarMotivo(motivo) {
        if (motivo !== undefined && typeof motivo !== 'string') {
            throw new ValidationError("El motivo de cancelación debe ser texto");
        }
    }

    async crearCita(datosCita) {
        if (!datosCita) {
            throw new ValidationError("Los datos de la cita son requeridos");
        }

        const { idProfesional, idCliente, idServicio, fecha, horaInicio } = datosCita;

        if (!idProfesional || !idCliente || !idServicio || !fecha || !horaInicio) {
            throw new ValidationError("Profesional, cliente, servicio, fecha y hora de inicio son obligatorios");
        }

        if (!Hora.esValida(horaInicio)) {
            throw new ValidationError("La hora de inicio debe tener formato HH:mm");
        }

        const servicio = await this.servicioRepositorio.obtenerServicioPorId(idServicio);
        if (!servicio) {
            throw new NotFoundError(`Servicio con id ${idServicio} no encontrado`);
        }
        if (servicio.activo === false) {
            throw new ConflictError("El servicio no está activo");
        }

        let fechaNormalizada;
        try {
            fechaNormalizada = Fecha.normalizar(fecha);
        } catch (error) {
            throw new ValidationError(error.message);
        }

        let horaFin;
        try {
            horaFin = servicio.calcularHoraFin(horaInicio);
        } catch (error) {
            throw new ValidationError(error.message);
        }

        const datosNuevaCita = {
            fecha: fechaNormalizada,
            horaInicio,
            horaFin,
            idProfesional,
            idCliente,
            idServicio,
            servicio: {
                name: servicio.nombre,
                price: servicio.precio,
            },
            estado: EstadoCita.CONFIRMADA,
        };

        const citaCandidata = Object.assign(new Cita(), datosNuevaCita);
        citaCandidata.validarHorario();

        const citasDelDia = await this.citaRepositorio.obtenerCitasConfirmadasPorProfesionalYFecha(
            idProfesional,
            fechaNormalizada,
            Fecha.finDelDia(fecha)
        );

        const citaSolapada = citasDelDia.find((existente) => citaCandidata.seSolapaCon(existente));
        if (citaSolapada) {
            throw new ConflictError("El profesional ya tiene una cita confirmada en ese horario");
        }

        const { token, tokenHash } = this.generarToken();

        const citaCreada = await this.citaRepositorio.crearCita({
            ...datosNuevaCita,
            tokenHash,
        });

        const citaRespuesta = citaCreada.toObject ? citaCreada.toObject() : { ...citaCreada };
        delete citaRespuesta.tokenHash;

        return { cita: citaRespuesta, enlaceToken: token };
    }

    async crearCitaPublica(datosCita) {
        if (!datosCita || !datosCita.cliente) {
            throw new ValidationError("Los datos de la clienta son requeridos");
        }

        const cliente = await this.clienteServicio.obtenerOCrearCliente(datosCita.cliente);

        return await this.crearCita({
            idProfesional: datosCita.idProfesional,
            idCliente: cliente._id,
            idServicio: datosCita.idServicio,
            fecha: datosCita.fecha,
            horaInicio: datosCita.horaInicio,
        });
    }

    async obtenerDisponibilidad({ idProfesional, idServicio, fecha }) {
        if (!idProfesional) {
            throw new ValidationError("El id del profesional es requerido");
        }
        if (!idServicio) {
            throw new ValidationError("El id del servicio es requerido");
        }
        if (!fecha) {
            throw new ValidationError("La fecha es requerida");
        }

        if (!this.horarioRepositorio) {
            throw new ValidationError("HorarioRepositorio es requerido para obtener disponibilidad");
        }

        const servicio = await this.servicioRepositorio.obtenerServicioPorId(idServicio);
        if (!servicio) {
            throw new NotFoundError(`Servicio con id ${idServicio} no encontrado`);
        }
        if (servicio.activo === false) {
            throw new ConflictError("El servicio no está activo");
        }

        const duracionServicio = Number(servicio.duracion) || 0;
        if (duracionServicio <= 0) {
            throw new ValidationError("El servicio no tiene una duración válida");
        }

        let fechaNormalizada;
        try {
            fechaNormalizada = Fecha.normalizar(fecha);
        } catch (error) {
            throw new ValidationError(error.message);
        }

        const fechaClave = Fecha.clave(fechaNormalizada);
        const diaSemana = fechaNormalizada.getUTCDay();

        const horarios = await this.horarioRepositorio.obtenerPorProfesional(idProfesional);
        const horarioDelDia = (horarios || []).find((horario) => Number(horario.diaSemana) === Number(diaSemana));

        if (!horarioDelDia) {
            return {
                fecha: fechaClave,
                idProfesional,
                idServicio,
                duracionMinutos: duracionServicio,
                slots: [],
                mensaje: "El profesional no atiende este día",
            };
        }

        if (!Hora.esValida(horarioDelDia.horaInicio) || !Hora.esValida(horarioDelDia.horaFin)) {
            throw new ValidationError("El horario del profesional tiene horas inválidas");
        }

        const citasConfirmadas = await this.citaRepositorio.obtenerCitasConfirmadasPorProfesionalYFechaExacta(
            idProfesional,
            fechaNormalizada
        );

        const intervalos = 15;
        const inicioMinutos = Hora.aMinutos(horarioDelDia.horaInicio);
        const finMinutos = Hora.aMinutos(horarioDelDia.horaFin);
        const slots = [];

        for (let cursor = inicioMinutos; cursor + duracionServicio <= finMinutos; cursor += intervalos) {
            const horaInicioSlot = Hora.aTexto(cursor);
            const horaFinSlot = Hora.aTexto(cursor + duracionServicio);

            const citaCandidata = Object.assign(new Cita(), {
                fecha: fechaNormalizada,
                horaInicio: horaInicioSlot,
                horaFin: horaFinSlot,
                idProfesional,
            });

            const solapado = (citasConfirmadas || []).some((existente) => {
                const citaExistente = existente.toObject ? existente.toObject() : existente;
                const candidataComparable = {
                    fecha: fechaNormalizada,
                    horaInicio: horaInicioSlot,
                    horaFin: horaFinSlot,
                    idProfesional,
                };
                const existenteComparable = {
                    fecha: citaExistente.fecha,
                    horaInicio: citaExistente.horaInicio,
                    horaFin: citaExistente.horaFin,
                    idProfesional: citaExistente.idProfesional || idProfesional,
                };
                const a = Object.assign(new Cita(), candidataComparable);
                const b = Object.assign(new Cita(), existenteComparable);
                return a.seSolapaCon(b);
            });

            if (!solapado) {
                slots.push({
                    horaInicio: horaInicioSlot,
                    horaFin: horaFinSlot,
                    disponible: true,
                });
            }
        }

        return {
            fecha: fechaClave,
            idProfesional,
            idServicio,
            duracionMinutos: duracionServicio,
            horario: {
                horaInicio: horarioDelDia.horaInicio,
                horaFin: horarioDelDia.horaFin,
            },
            slots,
        };
    }

    async obtenerCitaPorId(id) {
        if (!id) {
            throw new ValidationError("El id de la cita es requerido");
        }

        const cita = await this.citaRepositorio.obtenerCitaPorId(id);
        if (!cita) {
            throw new NotFoundError(`Cita con id ${id} no encontrada`);
        }

        return cita;
    }

    async obtenerCitas() {
        return await this.citaRepositorio.obtenerCitas();
    }

    async obtenerCitaPorToken(token) {
        if (!token || typeof token !== 'string') {
            throw new ValidationError("El enlace de la cita es requerido");
        }

        const cita = await this.citaRepositorio.obtenerCitaPorTokenHash(this.hashToken(token));
        if (!cita) {
            throw new NotFoundError("Enlace de cita no válido");
        }

        return cita;
    }

    async cancelarCitaPorToken(token, motivo) {
        this.validarMotivo(motivo);
        const cita = await this.obtenerCitaPorToken(token);
        cita.cancelar(RolUsuario.CLIENTE, motivo);
        return await this.citaRepositorio.guardar(cita);
    }

    async actualizarCita(id, datosActualizados) {
        if (!id) {
            throw new ValidationError("El id de la cita es requerido");
        }
        if (!datosActualizados) {
            throw new ValidationError("Los datos de la cita son requeridos");
        }

        const citaExistente = await this.obtenerCitaPorId(id);
        if (!citaExistente.esEditable()) {
            throw new ConflictError("Solo se pueden actualizar citas en estado confirmada");
        }

        const camposPermitidos = ["fecha", "horaInicio", "horaFin"];
        const camposNoPermitidos = Object.keys(datosActualizados).filter(
            (campo) => !camposPermitidos.includes(campo)
        );

        if (camposNoPermitidos.length > 0) {
            throw new ValidationError(
                `Por ahora solo se puede reprogramar la cita. Campos no permitidos: ${camposNoPermitidos.join(", ")}`
            );
        }

        return await this.reprogramarCita(id, {
            nuevaFecha: datosActualizados.fecha,
            nuevaHoraInicio: datosActualizados.horaInicio,
            nuevaHoraFin: datosActualizados.horaFin,
        });
    }

    async eliminarCita(id) {
        if (!id) {
            throw new ValidationError("El id de la cita es requerido");
        }

        await this.obtenerCitaPorId(id);
        return await this.citaRepositorio.eliminarCita(id);
    }

    // --- Métodos que ejecutan reglas de negocio sobre el documento de dominio ---

    async cancelarCita(id, { rolUsuario, motivo } = {}) {
        if (!Object.values(RolUsuario).includes(rolUsuario)) {
            throw new ValidationError("El rol de quien cancela no es válido");
        }
        this.validarMotivo(motivo);

        const cita = await this.obtenerCitaPorId(id);

        cita.cancelar(rolUsuario, motivo);

        return await this.citaRepositorio.guardar(cita);
    }

    async reprogramarCita(id, { nuevaFecha, nuevaHoraInicio } = {}) {
        const cita = await this.obtenerCitaPorId(id);

        if (!nuevaFecha || !nuevaHoraInicio) {
            throw new ValidationError("Se requiere nueva fecha y hora de inicio para reprogramar");
        }

        if (!Hora.esValida(nuevaHoraInicio)) {
            throw new ValidationError("La nueva hora de inicio debe tener formato HH:mm");
        }

        const servicio = await this.servicioRepositorio.obtenerServicioPorId(cita.idServicio);
        if (!servicio) {
            throw new NotFoundError(`Servicio con id ${cita.idServicio} no encontrado`);
        }

        let nuevaHoraFin;
        try {
            nuevaHoraFin = servicio.calcularHoraFin(nuevaHoraInicio);
        } catch (error) {
            throw new ValidationError(error.message);
        }

        cita.reprogramar(nuevaFecha, nuevaHoraInicio, nuevaHoraFin);

        const citasDelDia = await this.citaRepositorio.obtenerCitasConfirmadasPorProfesionalYFecha(
            cita.idProfesional,
            cita.fecha,
            Fecha.finDelDia(nuevaFecha)
        );

        const citaSolapada = citasDelDia.find(
            (existente) =>
                String(existente._id) !== String(cita._id) &&
                cita.seSolapaCon(existente)
        );

        if (citaSolapada) {
            throw new ConflictError("El profesional ya tiene una cita confirmada en ese horario");
        }

        return await this.citaRepositorio.guardar(cita);
    }

    async completarCita(id) {
        const cita = await this.obtenerCitaPorId(id);

        cita.completar();

        return await this.citaRepositorio.guardar(cita);
    }

    async marcarNoAsistida(id) {
        const cita = await this.obtenerCitaPorId(id);

        cita.marcarNoAsistida();

        return await this.citaRepositorio.guardar(cita);
    }
}
