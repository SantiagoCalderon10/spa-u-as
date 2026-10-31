export class Usuario {
  get estaActivo() {
    return this.activo === true;
  }

  tieneRol(rol) {
    return this.rol === rol;
  }

  desactivar() {
    this.activo = false;
  }

  activar() {
    this.activo = true;
  }
}

