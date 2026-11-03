import { Router } from "express";

export function crearProfesionalRoutes(profesionalControlador, guardia) {
  const router = Router();

  // Panel de administración: incluye correo y teléfono de la profesional.
  // Debe ir antes de /:id para que "admin" no se interprete como un id.
  router.get(
    "/admin",
    guardia.soloAdministrador,
    profesionalControlador.obtenerProfesionalesAdmin.bind(profesionalControlador)
  );

  // Panel de la profesional: su propio perfil, resuelto desde el token.
  // Debe ir antes de /:id para que "mi-perfil" no se interprete como un id.
  router.get(
    "/mi-perfil",
    guardia.soloProfesional,
    profesionalControlador.obtenerMiPerfil.bind(profesionalControlador)
  );

  // Catálogo público: solo datos visibles para la clienta
  router.get("/", profesionalControlador.obtenerProfesionales.bind(profesionalControlador));
  router.get("/:id", profesionalControlador.obtenerProfesionalPorId.bind(profesionalControlador));

  // Gestión: solo administración
  router.use(guardia.soloAdministrador);
  router.post("/", profesionalControlador.crearProfesional.bind(profesionalControlador));
  router.put("/:id", profesionalControlador.actualizarProfesional.bind(profesionalControlador));
  router.delete("/:id", profesionalControlador.eliminarProfesional.bind(profesionalControlador));

  return router;
}
