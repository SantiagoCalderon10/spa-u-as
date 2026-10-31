import { Router } from "express";

export function crearServicioRoutes(servicioControlador) {
    const router = Router();

    router.get("/", servicioControlador.obtenerServicios.bind(servicioControlador));
    router.post("/", servicioControlador.crearServicio.bind(servicioControlador));
    router.get("/:id", servicioControlador.obtenerServicioPorId.bind(servicioControlador));
    router.put("/:id", servicioControlador.actualizarServicio.bind(servicioControlador));
    router.delete("/:id", servicioControlador.eliminarServicio.bind(servicioControlador));

    return router;
}
