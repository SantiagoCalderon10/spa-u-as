import { Router } from "express";

export function crearServicioRoutes(servicioControlador, guardia) {
    const router = Router();

    // Catálogo público
    router.get("/", servicioControlador.obtenerServicios.bind(servicioControlador));
    router.get("/:id", servicioControlador.obtenerServicioPorId.bind(servicioControlador));

    // Gestión: solo administración
    router.use(guardia.soloAdministrador);
    router.post("/", servicioControlador.crearServicio.bind(servicioControlador));
    router.put("/:id", servicioControlador.actualizarServicio.bind(servicioControlador));
    router.delete("/:id", servicioControlador.eliminarServicio.bind(servicioControlador));

    return router;
}
