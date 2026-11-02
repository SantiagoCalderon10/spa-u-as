import bcrypt from "bcryptjs";
import { NotFoundError, UnauthorizedError } from "../../shared/errors/AppError.js";
import { RolUsuario } from "../../shared/enums.js";
import { firmarToken, verificarToken } from "../../shared/libs/jwt.js";

const CAMPOS_REGISTRO = [
  "nombreusuario",
  "correo",
  "contrasena",
  "telefono",
  "nombrecompleto",
];

export class AuthServicio {
  constructor(usuarioServicio, { jwtSecret, jwtExpira = "8h" } = {}) {
    if (!usuarioServicio) {
      throw new Error("UsuarioServicio es requerido para instanciar AuthServicio");
    }
    if (!jwtSecret) {
      throw new Error("Falta JWT_SECRET en las variables de entorno.");
    }

    this.usuarioServicio = usuarioServicio;
    this.jwtSecret = jwtSecret;
    this.jwtExpira = jwtExpira;
    // Hash falso para gastar el mismo tiempo cuando el correo no existe
    this.hashFalso = bcrypt.hashSync("contrasena-falsa", 10);
  }

  /**
   * Registro público: siempre crea un cliente, aunque el cuerpo envíe otro rol.
   */
  async registrar(datos = {}) {
    const entrada = datos || {};
    const datosRegistro = {};

    for (const campo of CAMPOS_REGISTRO) {
      if (entrada[campo] !== undefined) {
        datosRegistro[campo] = entrada[campo];
      }
    }

    datosRegistro.rol = RolUsuario.CLIENTE;

    const usuario = await this.usuarioServicio.crearUsuario(datosRegistro);

    return { usuario, token: this.firmarToken(usuario) };
  }

  async iniciarSesion(correo, contrasena) {
    const correoNormalizado = String(correo || "").toLowerCase().trim();
    const usuario = await this.usuarioServicio.obtenerPorCorreoConContrasena(
      correoNormalizado
    );

    const hash = usuario?.contrasenaHash ?? this.hashFalso;
    const coincide = await bcrypt.compare(String(contrasena || ""), hash);

    // Mismo mensaje en todos los casos para no revelar si el correo existe
    if (!usuario || !usuario.activo || !coincide) {
      throw new UnauthorizedError("Credenciales inválidas.");
    }

    return {
      usuario: this.#sinHash(usuario),
      token: this.firmarToken(usuario),
    };
  }

  firmarToken(usuario) {
    return firmarToken(
      { sub: String(usuario._id), rol: usuario.rol },
      this.jwtSecret,
      this.jwtExpira
    );
  }

  /**
   * Lo usa el middleware: token -> usuario vigente.
   * El rol se lee de la base de datos, no del token.
   */
  async autenticarToken(token) {
    if (!token) {
      throw new UnauthorizedError();
    }

    let payload;
    try {
      payload = verificarToken(token, this.jwtSecret);
    } catch {
      throw new UnauthorizedError("Token inválido o expirado.");
    }

    if (!payload?.sub) {
      throw new UnauthorizedError("Token inválido o expirado.");
    }

    let usuario;
    try {
      usuario = await this.usuarioServicio.obtenerUsuarioPorId(payload.sub);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError();
      }
      throw error;
    }

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedError();
    }

    return usuario;
  }

  #sinHash(usuario) {
    const obj = usuario.toObject ? usuario.toObject() : { ...usuario };
    delete obj.contrasenaHash;
    return obj;
  }
}
