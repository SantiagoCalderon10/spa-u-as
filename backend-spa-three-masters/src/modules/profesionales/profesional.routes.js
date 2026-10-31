import { Router } from "express";

export function crearProfesionalRoutes(profesionalControlador) {
  const router = Router();

  router.get("/", profesionalControlador.obtenerProfesionales.bind(profesionalControlador));
  router.post("/", profesionalControlador.crearProfesional.bind(profesionalControlador));
  router.get("/:id", profesionalControlador.obtenerProfesionalPorId.bind(profesionalControlador));
  router.put("/:id", profesionalControlador.actualizarProfesional.bind(profesionalControlador));
  router.delete("/:id", profesionalControlador.eliminarProfesional.bind(profesionalControlador));

  return router;
}

