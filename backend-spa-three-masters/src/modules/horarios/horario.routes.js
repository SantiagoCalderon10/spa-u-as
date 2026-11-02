import { Router } from "express";

export function crearHorarioRoutes(horarioControlador, guardia) {
  const router = Router();

  // Los horarios se consultan en el agendamiento público
  router.get("/", horarioControlador.obtenerHorarios.bind(horarioControlador));
  router.get("/:id", horarioControlador.obtenerHorarioPorId.bind(horarioControlador));

  // Gestión: solo administración
  router.use(guardia.soloAdministrador);
  router.post("/", horarioControlador.crearHorario.bind(horarioControlador));
  router.put("/:id", horarioControlador.actualizarHorario.bind(horarioControlador));
  router.delete("/:id", horarioControlador.eliminarHorario.bind(horarioControlador));

  return router;
}
