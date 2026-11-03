import { Router } from "express";
import { config } from "./config/config.js";
import { crearGuardia } from "./shared/middlewares/autorizacion.js";

// Auth
import { AuthServicio } from "./modules/auth/auth.servicio.js";
import { AuthControlador } from "./modules/auth/auth.controlador.js";
import { crearAuthRoutes } from "./modules/auth/auth.rutas.js";

// Citas
import { CitaRepositorio } from "./modules/citas/cita.repositorio.js";
import { CitaServicio } from "./modules/citas/cita.servicio.js";
import { CitaControlador } from "./modules/citas/cita.controlador.js";
import { crearCitaRoutes } from "./modules/citas/cita.routes.js";

// Servicios
import { ServicioRepositorio } from "./modules/servicios/servicio.repositorio.js";
import { ServicioServicio } from "./modules/servicios/servicio.servicio.js";
import { ServicioControlador } from "./modules/servicios/servicio.controller.js";
import { crearServicioRoutes } from "./modules/servicios/servicio.routes.js";

// Categorías
import { CategoriaRepositorio } from "./modules/categorias/categoria.repositorio.js";
import { CategoriaServicio } from "./modules/categorias/categoria.servicio.js";
import { CategoriaControlador } from "./modules/categorias/categoria.controlador.js";
import { crearCategoriaRoutes } from "./modules/categorias/categoria.routes.js";

// Usuarios
import { UsuarioRepositorio } from "./modules/usuarios/usuario.repositorio.js";
import { UsuarioServicio } from "./modules/usuarios/usuario.servicio.js";
import { UsuarioControlador } from "./modules/usuarios/usuario.controlador.js";
import { crearUsuarioRoutes } from "./modules/usuarios/usuario.routes.js";

// Profesionales
import { ProfesionalRepositorio } from "./modules/profesionales/profesional.repositorio.js";
import { ProfesionalServicio } from "./modules/profesionales/profesional.servicio.js";
import { ProfesionalControlador } from "./modules/profesionales/profesional.controlador.js";
import { crearProfesionalRoutes } from "./modules/profesionales/profesional.routes.js";

// Clientes
import { ClienteRepositorio } from "./modules/clientes/cliente.repositorio.js";
import { ClienteServicio } from "./modules/clientes/cliente.servicio.js";
import { ClienteControlador } from "./modules/clientes/cliente.controlador.js";
import { crearClienteRoutes } from "./modules/clientes/cliente.routes.js";

// Horarios
import { HorarioRepositorio } from "./modules/horarios/horario.repositorio.js";
import { HorarioServicio } from "./modules/horarios/horario.servicio.js";
import { HorarioControlador } from "./modules/horarios/horario.controlador.js";
import { crearHorarioRoutes } from "./modules/horarios/horario.routes.js";

const appRouter = Router();

// Repositorios compartidos
const horRepo = new HorarioRepositorio();
const servRepo = new ServicioRepositorio();
const cliRepo = new ClienteRepositorio();
const profRepo = new ProfesionalRepositorio();

// Servicios y controladores
const horServ = new HorarioServicio(horRepo);
const horCtrl = new HorarioControlador(horServ);

const servServ = new ServicioServicio(servRepo);
const servCtrl = new ServicioControlador(servServ);

const cliServ = new ClienteServicio(cliRepo);
const cliCtrl = new ClienteControlador(cliServ);

const citaRepo = new CitaRepositorio();
const citaServ = new CitaServicio(citaRepo, servRepo, cliServ, horRepo, profRepo);
const citaCtrl = new CitaControlador(citaServ);

const catRepo = new CategoriaRepositorio();
const catServ = new CategoriaServicio(catRepo);
const catCtrl = new CategoriaControlador(catServ);

const usuRepo = new UsuarioRepositorio();
const usuServ = new UsuarioServicio(usuRepo);
const usuCtrl = new UsuarioControlador(usuServ);

const profServ = new ProfesionalServicio(profRepo);
const profCtrl = new ProfesionalControlador(profServ);

// Autenticación y guardias por rol
const authServ = new AuthServicio(usuServ, {
  jwtSecret: config.jwtSecret,
  jwtExpira: config.jwtExpira,
});
const authCtrl = new AuthControlador(authServ);
const guardia = crearGuardia(authServ);

// Montaje de módulos bajo /api
appRouter.use("/auth", crearAuthRoutes(authCtrl, guardia));
appRouter.use("/horarios", crearHorarioRoutes(horCtrl, guardia));
appRouter.use("/servicios", crearServicioRoutes(servCtrl, guardia));
appRouter.use("/clientes", crearClienteRoutes(cliCtrl, guardia));
appRouter.use("/citas", crearCitaRoutes(citaCtrl, guardia));
appRouter.use("/categorias", crearCategoriaRoutes(catCtrl, guardia));
appRouter.use("/usuarios", crearUsuarioRoutes(usuCtrl, guardia));
appRouter.use("/profesionales", crearProfesionalRoutes(profCtrl, guardia));

export default appRouter;
