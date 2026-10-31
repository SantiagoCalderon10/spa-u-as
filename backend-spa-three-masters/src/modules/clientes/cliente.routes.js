import { Router } from "express";

export function crearClienteRoutes(clienteControlador) {
  const router = Router();

  router.get("/", clienteControlador.obtenerClientes.bind(clienteControlador));
  router.post("/", clienteControlador.crearCliente.bind(clienteControlador));
  router.get("/:id", clienteControlador.obtenerClientePorId.bind(clienteControlador));
  router.put("/:id", clienteControlador.actualizarCliente.bind(clienteControlador));
  router.delete("/:id", clienteControlador.eliminarCliente.bind(clienteControlador));

  return router;
}

