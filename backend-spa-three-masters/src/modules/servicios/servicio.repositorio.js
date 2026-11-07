
import { ServicioModel } from './models/entities/Servicios.model.js'

export class ServicioRepositorio {




    async crearServicio(servicio) {

        const servicioCreado = await ServicioModel.create(servicio)
        return servicioCreado
    }

    async obtenerServicios() {
        try {

            const servicios = await ServicioModel.find()
            return servicios

        } catch (Error) {
            throw new Error('Error al obtener los servicios desde el repositorio')
        }
    }

    async obtenerServicioPorId(id) {

        try {
            const servicio = await ServicioModel.findById(id)
            return servicio

        } catch (error) {
            throw new Error('Error al obtener el servicio por ID: ', error)
        }

    }

    async actualizarServicio(id, datosActualizados) {

        try {
            const servicio = await ServicioModel.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true });
            return servicio
        } catch (error) {
            throw new Error('Error al actualizar el servicio desde repositorio', error)
        }


    }



    async eliminarServicio(id, datosActualizados) {

        try {
            const servicioEliminado = await ServicioModel.findByIdAndDelete(id);
            if (!servicioEliminado)
                throw new Error(`No se encontró ningún servicio con el id ${id}`);
            return servicioEliminado

        } catch (error) {
            throw new Error('Error al actualizar el servicio desde repositorio', error)
        }


    }



}