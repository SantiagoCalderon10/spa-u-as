export class ClienteControlador {
  constructor(clienteServicio) {
    this.clienteServicio = clienteServicio;
  }

  async crearCliente(req, res, next) {
    try {
      const nuevo = await this.clienteServicio.crearCliente(req.body);
      return res.status(201).json(nuevo);
    } catch (error) {
      next(error);
    }
  }

  async obtenerClientes(req, res, next) {
    try {
      const lista = await this.clienteServicio.obtenerClientes();
      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtenerClientePorId(req, res, next) {
    try {
      const cliente = await this.clienteServicio.obtenerClientePorId(req.params.id);
      return res.status(200).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  async actualizarCliente(req, res, next) {
    try {
      const actualizado = await this.clienteServicio.actualizarCliente(req.params.id, req.body);
      return res.status(200).json(actualizado);
    } catch (error) {
      next(error);
    }
  }

  async eliminarCliente(req, res, next) {
    try {
      const eliminado = await this.clienteServicio.eliminarCliente(req.params.id);
      return res.status(200).json({ mensaje: "Cliente eliminado", cliente: eliminado });
    } catch (error) {
      next(error);
    }
  }
}

