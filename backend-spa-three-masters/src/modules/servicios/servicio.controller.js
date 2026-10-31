export class ServicioControlador {

    constructor(servicioServicio) {
        this.servicioServicio = servicioServicio;
    }

    async obtenerServicios(req, res, next) {
        try {
            const servicios = await this.servicioServicio.obtenerServicios();
            return res.status(200).json(servicios);
        } catch (error) {
            next(error);
        }
    }

    async crearServicio(req, res, next) {
        try {
            const datosServicio = req.body;
            const servicio = await this.servicioServicio.crearServicio(datosServicio);
            return res.status(201).json(servicio);
        } catch (error) {
            next(error);
        }
    }

    async obtenerServicioPorId(req, res, next) {
        try {
            const { id } = req.params;
            const servicio = await this.servicioServicio.obtenerServicioPorId(id);
            return res.status(200).json(servicio);
        } catch (error) {
            next(error);
        }
    }

    async actualizarServicio(req, res, next) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;
            const servicioActualizado = await this.servicioServicio.actualizarServicio(id, datosActualizados);
            return res.status(200).json(servicioActualizado);
        } catch (error) {
            next(error);
        }
    }

    async eliminarServicio(req, res, next) {
        try {
            const { id } = req.params;
            const servicioEliminado = await this.servicioServicio.eliminarServicio(id);
            return res.status(200).json({
                mensaje: "Servicio eliminado",
                servicio: servicioEliminado
            });
        } catch (error) {
            next(error);
        }
    }
}
