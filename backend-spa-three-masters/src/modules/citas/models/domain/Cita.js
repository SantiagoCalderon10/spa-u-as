import { ConflictError, ValidationError } from '../../../../shared/errors/AppError.js';
import { EstadoCita, RolUsuario } from '../../../../shared/enums.js';
import { Fecha } from '../../../../shared/utils/Fecha.js';
import { Hora } from '../../../../shared/utils/Hora.js';

export class Cita {
    // --- Consultas de Estado ---

    esEditable() {
        return this.estado === EstadoCita.CONFIRMADA;
    }

    get estaConfirmada() {
        return this.estado === EstadoCita.CONFIRMADA;
    }

    get estaCancelada() {
        return this.estado === EstadoCita.CANCELADA;
    }

    get estaCompletada() {
        return this.estado === EstadoCita.COMPLETADA;
    }

    get duracionMinutos() {
        return Hora.aMinutos(this.horaFin) - Hora.aMinutos(this.horaInicio);
    }

    // --- Reglas de Horarios y Solapamiento ---

    /**
     * Determina si dos citas se traslapan en horario para la misma fecha.
     * Si ambas tienen profesional, solo se consideran solapadas cuando es el mismo.
     */
    seSolapaCon(otraCita) {
        if (!otraCita) return false;

        if (
            this.idProfesional &&
            otraCita.idProfesional &&
            String(this.idProfesional) !== String(otraCita.idProfesional)
        ) {
            return false;
        }

        if (
            this.fecha &&
            otraCita.fecha &&
            Fecha.clave(this.fecha) !== Fecha.clave(otraCita.fecha)
        ) {
            return false;
        }

        const inicioA = Hora.aMinutos(this.horaInicio);
        const finA = Hora.aMinutos(this.horaFin);
        const inicioB = Hora.aMinutos(otraCita.horaInicio);
        const finB = Hora.aMinutos(otraCita.horaFin);

        return inicioA < finB && finA > inicioB;
    }

    validarHorario() {
        if (!Hora.esValida(this.horaInicio) || !Hora.esValida(this.horaFin)) {
            throw new ValidationError('El formato de hora de inicio o fin es inválido (debe ser HH:mm)');
        }
        if (Hora.aMinutos(this.horaInicio) >= Hora.aMinutos(this.horaFin)) {
            throw new ValidationError('La hora de inicio debe ser menor que la hora de fin');
        }
    }

    // --- Transiciones de Estado y Reglas de Negocio ---

    /**
     * Cancela una cita aplicando las reglas:
     * 1. Solo se cancela si está confirmada.
     * 2. Si quien cancela no es el cliente (profesional/admin), el motivo es obligatorio.
     */
    cancelar(rolUsuario, motivo = '') {
        if (!this.esEditable()) {
            throw new ConflictError(`No se puede cancelar una cita en estado '${this.estado}'`);
        }

        const esCliente = rolUsuario === RolUsuario.CLIENTE;
        if (!esCliente && (!motivo || motivo.trim() === '')) {
            throw new ValidationError('Debe especificar un motivo de cancelación');
        }

        this.estado = EstadoCita.CANCELADA;
        this.canceladaPor = rolUsuario;
        this.motivoCancelacion = motivo?.trim() || 'Cancelada por el cliente';
        this.fechaCancelacion = new Date();
    }

    /**
     * Reprograma fecha y horas de la cita con validación mediante la utilidad Hora.
     */
    reprogramar(nuevaFecha, nuevaHoraInicio, nuevaHoraFin) {
        if (!this.esEditable()) {
            throw new ConflictError('Solo se puede reprogramar una cita confirmada');
        }

        if (!nuevaFecha || !nuevaHoraInicio || !nuevaHoraFin) {
            throw new ValidationError('Se requiere nueva fecha, hora de inicio y hora de fin para reprogramar');
        }

        if (!Hora.esValida(nuevaHoraInicio) || !Hora.esValida(nuevaHoraFin)) {
            throw new ValidationError('El formato de la nueva hora es inválido (debe ser HH:mm)');
        }

        if (Hora.aMinutos(nuevaHoraInicio) >= Hora.aMinutos(nuevaHoraFin)) {
            throw new ValidationError('La nueva hora de inicio debe ser menor que la hora de fin');
        }

        let fechaNormalizada;
        try {
            fechaNormalizada = Fecha.normalizar(nuevaFecha);
        } catch (error) {
            throw new ValidationError(error.message);
        }

        this.fecha = fechaNormalizada;
        this.horaInicio = nuevaHoraInicio;
        this.horaFin = nuevaHoraFin;
    }

    /**
     * Marca la cita como completada una vez atendida.
     */
    completar() {
        if (!this.esEditable()) {
            throw new ConflictError('Solo se completa una cita confirmada');
        }
        this.estado = EstadoCita.COMPLETADA;
    }

    /**
     * Registra la inasistencia del cliente.
     */
    marcarNoAsistida() {
        if (!this.esEditable()) {
            throw new ConflictError('Solo se puede marcar como no asistida una cita confirmada');
        }
        this.estado = EstadoCita.NO_ASISTIO;
    }
}
