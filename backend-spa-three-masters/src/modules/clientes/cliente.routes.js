import { Router } from "express";

export function crearClienteRoutes(clienteControlador, guardia) {
  const router = Router();

  // Los datos de clientas son sensibles: solo administración.
  // El alta pública de una clienta ocurre dentro de POST /citas/publica.
  router.use(guardia.soloAdministrador);

  router.get("/", clienteControlador.obtenerClientes.bind(clienteControlador));
  router.post("/", clienteControlador.crearCliente.bind(clienteControlador));
  router.get("/:id", clienteControlador.obtenerClientePorId.bind(clienteControlador));
  router.put("/:id", clienteControlador.actualizarCliente.bind(clienteControlador));
  router.delete("/:id", clienteControlador.eliminarCliente.bind(clienteControlador));

  return router;
}
