import { Router } from "express";

export function crearUsuarioRoutes(usuarioControlador) {
  const router = Router();

  router.get("/", usuarioControlador.obtenerUsuarios.bind(usuarioControlador));
  router.post("/", usuarioControlador.crearUsuario.bind(usuarioControlador));
  router.get("/:id", usuarioControlador.obtenerUsuarioPorId.bind(usuarioControlador));
  router.put("/:id", usuarioControlador.actualizarUsuario.bind(usuarioControlador));
  router.delete("/:id", usuarioControlador.eliminarUsuario.bind(usuarioControlador));

  return router;
}

