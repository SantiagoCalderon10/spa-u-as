import { Router } from "express";

export function crearAuthRoutes(authControlador, guardia) {
  const router = Router();

  // Públicas
  router.post("/registro", authControlador.registrar.bind(authControlador));
  router.post("/login", authControlador.iniciarSesion.bind(authControlador));

  // Privadas
  router.get(
    "/perfil",
    guardia.autenticar,
    authControlador.obtenerPerfil.bind(authControlador)
  );

  return router;
}
