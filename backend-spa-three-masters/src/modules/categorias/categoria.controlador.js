export class CategoriaControlador {
  constructor(categoriaServicio) {
    this.categoriaServicio = categoriaServicio;
  }

  async crearCategoria(req, res, next) {
    try {
      const nueva = await this.categoriaServicio.crearCategoria(req.body);
      return res.status(201).json(nueva);
    } catch (error) {
      next(error);
    }
  }

  async obtenerCategorias(req, res, next) {
    try {
      const lista = await this.categoriaServicio.obtenerCategorias();
      return res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtenerCategoriaPorId(req, res, next) {
    try {
      const categoria = await this.categoriaServicio.obtenerCategoriaPorId(req.params.id);
      return res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async actualizarCategoria(req, res, next) {
    try {
      const actualizada = await this.categoriaServicio.actualizarCategoria(req.params.id, req.body);
      return res.status(200).json(actualizada);
    } catch (error) {
      next(error);
    }
  }

  async eliminarCategoria(req, res, next) {
    try {
      const eliminada = await this.categoriaServicio.eliminarCategoria(req.params.id);
      return res.status(200).json({ mensaje: "Categoría eliminada", categoria: eliminada });
    } catch (error) {
      next(error);
    }
  }
}

