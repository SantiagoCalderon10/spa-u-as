import { RolUsuario } from "../enums.js";
import { crearAutenticar } from "./autenticar.js";
import { crearAutenticarOpcional } from "./autenticarOpcional.js";
import { permitirRoles } from "./permitirRoles.js";

/**
 * Arma las guardias que consumen las rutas de cada módulo.
 * Se crea una sola vez en app.routes.js y se inyecta en los routers.
 */
export function crearGuardia(authServicio) {
  const autenticar = crearAutenticar(authServicio);

  return Object.freeze({
    autenticar,
    autenticarOpcional: crearAutenticarOpcional(authServicio),
    soloAdministrador: [autenticar, permitirRoles(RolUsuario.ADMINISTRADOR)],
    soloProfesional: [autenticar, permitirRoles(RolUsuario.PROFESIONAL)],
    soloCliente: [autenticar, permitirRoles(RolUsuario.CLIENTE)],
    soloPersonal: [
      autenticar,
      permitirRoles(RolUsuario.ADMINISTRADOR, RolUsuario.PROFESIONAL),
    ],
  });
}
