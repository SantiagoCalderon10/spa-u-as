import { NotFoundError } from '../../shared/errors/AppError.js';
import { Categoria } from '../categorias/models/domain/Categoria.js';

export class ServicioServicio {
    constructor(servicioRepositorio) {
        this.servicioRepositorio = servicioRepositorio;
       
    }



    async obtenerServicios() {
        return await this.servicioRepositorio.obtenerServicios();
    }

   

    async crearServicio(servicio) {
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
