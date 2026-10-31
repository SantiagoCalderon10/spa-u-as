export class Profesional {


atiende(servicio) {
return this.especialidades.some((id) => id.equals(servicio.idCategoria));
  }


agregarEspecialidad(especialidad) {
    if(this.especialidades.some((id) => id.equals(especialidad.id))) {
      throw new Error('El profesional ya tiene esta especialidad');
    }

    if(!this.especialidades) {
      this.especialidades = [];
    }
    this.especialidades.push(especialidad);

}
quitarEspecialidad(especialidad) {
    if(!this.especialidades.some((id) => id.equals(especialidad.id))) {
      throw new Error('El profesional no tiene esta especialidad');
    }
    if(!this.especialidades) {
      this.especialidades = [];
    }
    this.especialidades = this.especialidades.filter((id) => !id.equals(especialidad.id));
}

}