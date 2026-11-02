import { Router } from "express";

export function crearCitaRoutes(citaControlador, guardia) {
    const router = Router();

    // Rutas públicas de agendamiento y enlace con token
    router.get("/disponibilidad", citaControlador.obtenerDisponibilidad.bind(citaControlador));
    router.post("/publica", citaControlador.crearCitaPublica.bind(citaControlador));
    router.get("/enlace/:token", citaControlador.obtenerCitaPorToken.bind(citaControlador));
    router.patch("/enlace/:token/cancelar", citaControlador.cancelarCitaPorToken.bind(citaControlador));

    // A partir de aquí todo requiere sesión de administración.
    // El rol del profesional se incorporará cuando exista su vista (FN-14).
    router.use(guardia.soloAdministrador);

    // Rutas CRUD base
    router.post("/", citaControlador.crearCita.bind(citaControlador));
    router.get("/", citaControlador.obtenerCitas.bind(citaControlador));
    router.get("/:id", citaControlador.obtenerCitaPorId.bind(citaControlador));
    router.put("/:id", citaControlador.actualizarCita.bind(citaControlador));
    router.delete("/:id", citaControlador.eliminarCita.bind(citaControlador));

    // Rutas de acciones de negocio
    router.patch("/:id/cancelar", citaControlador.cancelarCita.bind(citaControlador));
    router.patch("/:id/reprogramar", citaControlador.reprogramarCita.bind(citaControlador));
    router.patch("/:id/completar", citaControlador.completarCita.bind(citaControlador));
    router.patch("/:id/no-asistio", citaControlador.marcarNoAsistida.bind(citaControlador));

    return router;
}
