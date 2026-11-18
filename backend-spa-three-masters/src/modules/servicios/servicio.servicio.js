import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { limpiarNombre, nombreDuplicado } from '../../shared/utils/normalizarNombre.js';
import { Servicio } from './models/domain/Servicio.js';

export class ServicioServicio {
    constructor(servicioRepositorio) {
        this.servicioRepositorio = servicioRepositorio;
    }

    /** Valida el nombre y devuelve la forma limpia que se guardará. */
    async validarNombre(nombre, idExcluido) {
        const limpio = limpiarNombre(nombre);
        if (!limpio) {
            throw new ValidationError('El nombre del servicio es obligatorio');
        }

        const servicios = await this.servicioRepositorio.obtenerServicios();
        if (nombreDuplicado(limpio, servicios, idExcluido)) {
            throw new ConflictError(`Ya existe un servicio llamado «${limpio}»`);
        }

        return limpio;
    }

    async obtenerServicios() {
        return await this.servicioRepositorio.obtenerServicios();
    }

    async crearServicio(servicio) {
        if (!servicio) {
            throw new ValidationError('Los datos del servicio son requeridos');
        }

        const nombre = await this.validarNombre(servicio.nombre);
        const datos = { ...servicio, nombre };

        if (datos.precio !== undefined) {
            const servicioDominio = new Servicio();
            try {
                servicioDominio.cambiarPrecio(Number(datos.precio));
            } catch (err) {
                throw new ValidationError(err.message);
            }
        }

        return await this.servicioRepositorio.crearServicio(datos);
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
        const cambios = { ...(datosActualizados ?? {}) };

        if (cambios.nombre !== undefined) {
            cambios.nombre = await this.validarNombre(cambios.nombre, id);
        }

        if (cambios.precio !== undefined) {
            try {
                servicioExistente.cambiarPrecio(Number(cambios.precio));
                cambios.precio = servicioExistente.precio;
            } catch (err) {
                throw new ValidationError(err.message);
            }
        }

        if (cambios.activo !== undefined) {
            if (cambios.activo) {
                servicioExistente.activar();
            } else {
                servicioExistente.desactivar();
            }
            cambios.activo = servicioExistente.activo;
        }

        const servicio = await this.servicioRepositorio.actualizarServicio(id, cambios);
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
