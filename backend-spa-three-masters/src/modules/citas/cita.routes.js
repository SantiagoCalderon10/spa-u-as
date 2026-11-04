import { Router } from "express";

export function crearCitaRoutes(citaControlador, guardia) {
    const router = Router();

    // Rutas públicas de agendamiento y enlace con token
    router.get("/disponibilidad", citaControlador.obtenerDisponibilidad.bind(citaControlador));
    router.post("/publica", guardia.autenticarOpcional, citaControlador.crearCitaPublica.bind(citaControlador));
    router.get("/enlace/:token", citaControlador.obtenerCitaPorToken.bind(citaControlador));
    router.patch("/enlace/:token/cancelar", citaControlador.cancelarCitaPorToken.bind(citaControlador));

    // Panel de la profesional. El id del perfil sale del token, no de la URL.
    // Debe ir antes del bloqueo de administración y de /:id.
    router.get("/mias", guardia.soloProfesional, citaControlador.obtenerMisCitas.bind(citaControlador));
    router.patch(
        "/mias/:id/cancelar",
        guardia.soloProfesional,
        citaControlador.cancelarMiCita.bind(citaControlador)
    );

    // Historial de la clienta autenticada. También va antes del bloqueo admin.
    router.get(
        "/mis-citas",
        guardia.soloCliente,
        citaControlador.obtenerMisCitasCliente.bind(citaControlador)
    );
    router.get(
        "/mis-citas/:id",
        guardia.soloCliente,
        citaControlador.obtenerMiCitaCliente.bind(citaControlador)
    );
    router.patch(
        "/mis-citas/:id/cancelar",
        guardia.soloCliente,
        citaControlador.cancelarMiCitaCliente.bind(citaControlador)
    );

    // A partir de aquí todo requiere sesión de administración.
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
