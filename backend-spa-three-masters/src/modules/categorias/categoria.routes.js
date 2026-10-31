import { Router } from "express";

export function crearCategoriaRoutes(categoriaControlador) {
  const router = Router();

  router.get("/", categoriaControlador.obtenerCategorias.bind(categoriaControlador));
  router.post("/", categoriaControlador.crearCategoria.bind(categoriaControlador));
  router.get("/:id", categoriaControlador.obtenerCategoriaPorId.bind(categoriaControlador));
  router.put("/:id", categoriaControlador.actualizarCategoria.bind(categoriaControlador));
  router.delete("/:id", categoriaControlador.eliminarCategoria.bind(categoriaControlador));

  return router;
}

