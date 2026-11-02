import { Router } from "express";

export function crearCategoriaRoutes(categoriaControlador, guardia) {
  const router = Router();

  // Catálogo público
  router.get("/", categoriaControlador.obtenerCategorias.bind(categoriaControlador));
  router.get("/:id", categoriaControlador.obtenerCategoriaPorId.bind(categoriaControlador));

  // Gestión: solo administración
  router.use(guardia.soloAdministrador);
  router.post("/", categoriaControlador.crearCategoria.bind(categoriaControlador));
  router.put("/:id", categoriaControlador.actualizarCategoria.bind(categoriaControlador));
  router.delete("/:id", categoriaControlador.eliminarCategoria.bind(categoriaControlador));

  return router;
}
