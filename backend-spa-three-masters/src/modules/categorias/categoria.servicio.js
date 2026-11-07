import { NotFoundError } from '../../shared/errors/AppError.js';

export class CategoriaServicio {
  constructor(categoriaRepositorio) {
    this.categoriaRepositorio = categoriaRepositorio;
  }

  async crearCategoria(datos) {
    return await this.categoriaRepositorio.crearCategoria(datos);
  }

  async obtenerCategorias() {
    return await this.categoriaRepositorio.obtenerCategorias();
  }

  async obtenerCategoriaPorId(id) {
    const categoria = await this.categoriaRepositorio.obtenerCategoriaPorId(id);
    if (!categoria) throw new NotFoundError(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async actualizarCategoria(id, datos) {
    const categoriaExistente = await this.obtenerCategoriaPorId(id);

    if (datos?.estado !== undefined) {
      if (datos.estado) {
        categoriaExistente.activar();
      } else {
        categoriaExistente.desactivar();
      }
      datos.estado = categoriaExistente.estado;
    }

    const categoria = await this.categoriaRepositorio.actualizarCategoria(id, datos);
    if (!categoria) throw new NotFoundError(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async eliminarCategoria(id) {
    const categoria = await this.categoriaRepositorio.eliminarCategoria(id);
    if (!categoria) throw new NotFoundError(`Categoría con id ${id} no encontrada`);
    return categoria;
  }
}
