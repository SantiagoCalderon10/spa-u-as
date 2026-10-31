export class Profesional {
  atiende(servicio) {
    if (!this.especialidades || !servicio?.idCategoria) return false;
    return this.especialidades.some((id) => id.toString() === servicio.idCategoria.toString());
  }

  agregarEspecialidad(idCategoria) {
    if (!this.especialidades) {
      this.especialidades = [];
    }
    const yaExiste = this.especialidades.some((id) => id.toString() === idCategoria.toString());
    if (yaExiste) {
      throw new Error('El profesional ya tiene esta especialidad');
    }
    this.especialidades.push(idCategoria);
  }

  quitarEspecialidad(idCategoria) {
    if (!this.especialidades) return;
    this.especialidades = this.especialidades.filter((id) => id.toString() !== idCategoria.toString());
  }
}

