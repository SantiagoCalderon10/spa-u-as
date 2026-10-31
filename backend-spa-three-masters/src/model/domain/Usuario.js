export class Usuario {
  get estaActivo() {
    return this.estado === true;
  }

  tieneRol(rol) {
    return this.rol === rol;
  }

  desactivar() {
    this.estado = false;
  }
}