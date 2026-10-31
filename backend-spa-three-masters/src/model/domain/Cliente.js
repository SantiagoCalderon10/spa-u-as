

export class Cliente {
  get estaRegistrado() {
    return Boolean(this.idUsuario);
  }

  vincularUsuario(idUsuario) {
    if (this.estaRegistrado) throw new Error('Este cliente ya tiene una cuenta vinculada');
    this.idUsuario = idUsuario;
  }

}