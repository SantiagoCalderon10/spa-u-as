import "dotenv/config";
import mongoose from "mongoose";

import { UsuarioRepositorio } from "../src/modules/usuarios/usuario.repositorio.js";
import { UsuarioServicio } from "../src/modules/usuarios/usuario.servicio.js";
import { RolUsuario } from "../src/shared/enums.js";

const {
  MONGO_URI = "mongodb://127.0.0.1:27017/three-masters",
  ADMIN_CORREO,
  ADMIN_CONTRASENA,
  ADMIN_NOMBREUSUARIO,
  ADMIN_NOMBRECOMPLETO,
  ADMIN_TELEFONO,
} = process.env;

function validarVariables() {
  const faltantes = [
    ["ADMIN_CORREO", ADMIN_CORREO],
    ["ADMIN_CONTRASENA", ADMIN_CONTRASENA],
    ["ADMIN_NOMBREUSUARIO", ADMIN_NOMBREUSUARIO],
    ["ADMIN_NOMBRECOMPLETO", ADMIN_NOMBRECOMPLETO],
    ["ADMIN_TELEFONO", ADMIN_TELEFONO],
  ]
    .filter(([, valor]) => !valor)
    .map(([nombre]) => nombre);

  if (faltantes.length > 0) {
    throw new Error(`Faltan variables de entorno: ${faltantes.join(", ")}`);
  }

  if (Number.isNaN(Number(ADMIN_TELEFONO))) {
    throw new Error("ADMIN_TELEFONO debe ser un número");
  }
}

async function crearAdministrador() {
  validarVariables();

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

  const correo = String(ADMIN_CORREO).toLowerCase().trim();
  const repositorio = new UsuarioRepositorio();
  const servicio = new UsuarioServicio(repositorio);

  const existente = await repositorio.obtenerPorCorreo(correo);
  if (existente) {
    console.log(`Ya existe un usuario con el correo ${correo}. No se creó nada.`);
    return;
  }

  await servicio.crearUsuario({
    nombreusuario: String(ADMIN_NOMBREUSUARIO).trim(),
    correo,
    contrasena: String(ADMIN_CONTRASENA),
    telefono: Number(ADMIN_TELEFONO),
    rol: RolUsuario.ADMINISTRADOR,
    nombrecompleto: String(ADMIN_NOMBRECOMPLETO).trim(),
  });

  console.log(`Administrador creado: ${correo}`);
}

crearAdministrador()
  .catch((error) => {
    console.error("No se pudo crear el administrador:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
