import { NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { Servicio } from './models/domain/Servicio.js';

export class ServicioServicio {
    constructor(servicioRepositorio) {
        this.servicioRepositorio = servicioRepositorio;
    }

    async obtenerServicios() {
        return await this.servicioRepositorio.obtenerServicios();
    }

    async crearServicio(servicio) {
        if (!servicio) {
            throw new ValidationError('Los datos del servicio son requeridos');
        }

        if (servicio.precio !== undefined) {
            const servicioDominio = new Servicio();
            try {
                servicioDominio.cambiarPrecio(Number(servicio.precio));
            } catch (err) {
                throw new ValidationError(err.message);
            }
        }

        return await this.servicioRepositorio.crearServicio(servicio);
    }

    async obtenerServicioPorId(id) {
        const servicio = await this.servicioRepositorio.obtenerServicioPorId(id);
        if (!servicio) {
            throw new NotFoundError(`Servicio con id ${id} no encontrado`);
        }
        return servicio;
    }

    async actualizarServicio(id, datosActualizados) {
        const servicioExistente = await this.obtenerServicioPorId(id);

        if (datosActualizados?.precio !== undefined) {
            try {
                servicioExistente.cambiarPrecio(Number(datosActualizados.precio));
                datosActualizados.precio = servicioExistente.precio;
            } catch (err) {
                throw new ValidationError(err.message);
            }
        }

        if (datosActualizados?.activo !== undefined) {
            if (datosActualizados.activo) {
                servicioExistente.activar();
            } else {
                servicioExistente.desactivar();
            }
            datosActualizados.activo = servicioExistente.activo;
        }

        const servicio = await this.servicioRepositorio.actualizarServicio(id, datosActualizados);
        if (!servicio) {
            throw new NotFoundError(`Servicio con id ${id} no encontrado`);
        }
        return servicio;
    }

    async eliminarServicio(id) {
        const servicio = await this.servicioRepositorio.eliminarServicio(id);
        if (!servicio) {
            throw new NotFoundError(`Servicio con id ${id} no encontrado`);
        }
        return servicio;
    }
}
