import { Router } from "express";

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

const horRepo = new HorarioRepositorio();
const horServ = new HorarioServicio(horRepo);
const horCtrl = new HorarioControlador(horServ);
appRouter.use("/horarios", crearHorarioRoutes(horCtrl));
// Inyección y montaje de Servicios (repositorio compartido con Citas)
const servRepo = new ServicioRepositorio();
const servServ = new ServicioServicio(servRepo);
const servCtrl = new ServicioControlador(servServ);
appRouter.use("/servicios", crearServicioRoutes(servCtrl));

// Inyección y montaje de Clientes (se usa en el agendamiento público de citas)
const cliRepo = new ClienteRepositorio();
const cliServ = new ClienteServicio(cliRepo);
const cliCtrl = new ClienteControlador(cliServ);
appRouter.use("/clientes", crearClienteRoutes(cliCtrl));

// Inyección y montaje de Citas
const citaRepo = new CitaRepositorio();
const citaServ = new CitaServicio(citaRepo, servRepo, cliServ, horRepo);
const citaCtrl = new CitaControlador(citaServ);
appRouter.use("/citas", crearCitaRoutes(citaCtrl));

// Inyección y montaje de Categorías
const catRepo = new CategoriaRepositorio();
const catServ = new CategoriaServicio(catRepo);
const catCtrl = new CategoriaControlador(catServ);
appRouter.use("/categorias", crearCategoriaRoutes(catCtrl));

// Inyección y montaje de Usuarios
const usuRepo = new UsuarioRepositorio();
const usuServ = new UsuarioServicio(usuRepo);
const usuCtrl = new UsuarioControlador(usuServ);
appRouter.use("/usuarios", crearUsuarioRoutes(usuCtrl));

// Inyección y montaje de Profesionales
const profRepo = new ProfesionalRepositorio();
const profServ = new ProfesionalServicio(profRepo);
const profCtrl = new ProfesionalControlador(profServ);
appRouter.use("/profesionales", crearProfesionalRoutes(profCtrl));

// Inyección y montaje de Horarios


export default appRouter;

