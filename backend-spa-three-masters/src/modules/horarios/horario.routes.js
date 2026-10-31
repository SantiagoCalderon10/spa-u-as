import { Router } from "express";

export function crearHorarioRoutes(horarioControlador) {
  const router = Router();

  router.get("/", horarioControlador.obtenerHorarios.bind(horarioControlador));
  router.post("/", horarioControlador.crearHorario.bind(horarioControlador));
  router.get("/:id", horarioControlador.obtenerHorarioPorId.bind(horarioControlador));
  router.put("/:id", horarioControlador.actualizarHorario.bind(horarioControlador));
  router.delete("/:id", horarioControlador.eliminarHorario.bind(horarioControlador));

  return router;
}

