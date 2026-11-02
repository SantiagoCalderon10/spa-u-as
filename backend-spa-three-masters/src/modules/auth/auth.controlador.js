export class AuthControlador {
  constructor(authServicio) {
    if (!authServicio) {
      throw new Error("AuthServicio es requerido para instanciar AuthControlador");
    }
    this.authServicio = authServicio;
  }

  async registrar(req, res) {
    const resultado = await this.authServicio.registrar(req.body);
    return res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      ...resultado,
    });
  }

  async iniciarSesion(req, res) {
    const { correo, contrasena } = req.body || {};
    const resultado = await this.authServicio.iniciarSesion(correo, contrasena);
    return res.status(200).json(resultado);
  }

  async obtenerPerfil(req, res) {
    return res.status(200).json(req.usuario);
  }
}
