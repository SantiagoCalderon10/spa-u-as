# 03 · Sprint 1 — Núcleo funcional

**Fechas:** 26 oct – 6 nov de 2026 (D1–D10), semanas S2–S3 del calendario académico.
**Objetivo:** *Dejar operativo el núcleo: acceso por roles, catálogos, profesionales, horarios, agendamiento público, enlace único y agenda del administrador.*
**Capacidad:** 40 puntos (2 × 80 h). **Comprometido:** 38 puntos · 15 historias · 59 tareas · 152 h.
**Velocity esperada:** 38. **Velocity real:** 38 (todo el compromiso cerrado).

## Historias comprometidas

| ID | Pts | Dependencia observada |
|---|---:|---|
| HU-ACC-01 | 3 | Ninguna; abre el sprint. |
| HU-ACC-02 | 3 | Requiere HU-ACC-01. |
| HU-ADS-03 | 2 | Ninguna; la necesita HU-ADS-01. |
| HU-ADS-01 | 3 | Requiere HU-ADS-03 para la categoría. |
| HU-ADP-01 | 3 | Requiere HU-ACC-02. |
| HU-ADP-02 | 2 | Requiere HU-ADS-03 y HU-ADP-01. |
| HU-ADP-03 | 3 | Requiere HU-ADP-01. |
| HU-SER-01 | 2 | Requiere HU-ADS-01. |
| HU-DIS-01 | 4 | Requiere HU-ADP-02, HU-ADP-03 y HU-SER-01. |
| HU-AGE-01 | 5 | Requiere HU-DIS-01; es la historia crítica del sprint. |
| HU-CIT-03 | 2 | Requiere HU-AGE-01 (hash del enlace). |
| HU-CIT-04 | 2 | Requiere HU-CIT-03. |
| HU-ADC-01 | 1 | Requiere HU-ACC-02. |
| HU-ADC-02 | 1 | Requiere HU-ADC-01. |
| HU-ADC-03 | 2 | Requiere HU-ADC-02. |

## Sprint backlog

**Estado:** las 59 tareas se cerraron en `Done`. La evidencia con `verificación manual` se comprobó en navegador, no con un archivo de prueba. Las rutas `backend/tests/*.test.js` son pruebas de servicio (`auth`, `citas`); junto con las de `backend/test/` suman 14 suites escritas. No se ejecutaron en el entorno de documentación: el shell devolvía código 9 sin salida.

| ID | HU | Tarea | Resp. | h | Día | Evidencia |
|---|---|---|---|---:|---|---|
| S1-T01 | HU-ACC-01 | Esquema de usuario con rol y hash de contraseña | Dev 1 | 3 | D1 | `backend/src/modules/usuarios/models/entities/Usuarios.model.js` |
| S1-T02 | HU-ACC-01 | Endpoints de inicio y cierre de sesión con JWT | Dev 1 | 4 | D1 | `backend/src/modules/auth/auth.servicio.js`, `auth.rutas.js`, `shared/libs/jwt.js` |
| S1-T03 | HU-ACC-01 | Pantalla de inicio de sesión compartida | Dev 2 | 3 | D2 | `frontend/src/pages/admin/LoginPage.jsx`, `api/authService.js` |
| S1-T04 | HU-ACC-01 | Pruebas de credenciales inválidas y cierre de sesión | Dev 2 | 2 | D2 | `backend/test/UsuarioServicio.test.js`, `backend/tests/auth.test.js` |
| S1-T05 | HU-ACC-02 | Middleware de autenticación y verificación de rol | Dev 1 | 5 | D2 | `backend/src/shared/middlewares/autenticar.js`, `permitirRoles.js`, `autorizacion.js` |
| S1-T06 | HU-ACC-02 | Menú y rutas protegidas por rol | Dev 2 | 4 | D3 | `frontend/src/components/admin/RutaPrivada.jsx`, `layouts/AdminLayout.jsx`, `App.jsx` |
| S1-T07 | HU-ACC-02 | Prueba de acceso directo con rol no autorizado | Dev 2 | 3 | D3 | `backend/tests/auth.test.js` (unitario de `permitirRoles`) + verificación manual del acceso directo en navegador · FN-15 |
| S1-T08 | HU-ADS-03 | Esquema de categoría y repositorio | Dev 1 | 2 | D3 | `backend/src/modules/categorias/models/entities/Categorias.model.js`, `categoria.repositorio.js` |
| S1-T09 | HU-ADS-03 | Endpoint de creación con validaciones | Dev 1 | 2 | D4 | `backend/src/modules/categorias/categoria.servicio.js`, `categoria.controlador.js` |
| S1-T10 | HU-ADS-03 | Formulario de creación de categoría | Dev 2 | 2 | D4 | `frontend/src/components/admin/CategoriaFormulario.jsx` |
| S1-T11 | HU-ADS-03 | Pruebas de nombre vacío o repetido, con tildes y mayúsculas | Dev 2 | 2 | D4 | `backend/test/Categoria.test.js`, `CatalogoDuplicados.test.js`, `shared/utils/normalizarNombre.js` |
| S1-T12 | HU-ADS-01 | Esquema de servicio: nombre, descripción, precio, categoría, duración | Dev 1 | 3 | D4 | `backend/src/modules/servicios/models/entities/Servicios.model.js`, `models/domain/Servicio.js` |
| S1-T13 | HU-ADS-01 | Endpoint de creación con validación de precio | Dev 1 | 3 | D5 | `backend/src/modules/servicios/servicio.servicio.js` |
| S1-T14 | HU-ADS-01 | Formulario de creación con carga de imagen | Dev 2 | 3 | D5 | `frontend/src/components/admin/ServicioFormulario.jsx`, `CampoImagen.jsx`, `backend/src/modules/uploads/` |
| S1-T15 | HU-ADS-01 | Pruebas de campos vacíos, precio inválido y nombre duplicado | Dev 2 | 3 | D5 | `backend/test/Servicio.test.js`, `CatalogoDuplicados.test.js` |
| S1-T16 | HU-ADP-01 | Esquema de profesional asociado a su usuario | Dev 1 | 3 | D5 | `backend/src/modules/profesionales/models/entities/Profesionales.model.js` |
| S1-T17 | HU-ADP-01 | Endpoint de creación de cuenta (correo único) | Dev 1 | 3 | D6 | `backend/src/modules/profesionales/profesional.servicio.js`, `usuarios/usuario.servicio.js` |
| S1-T18 | HU-ADP-01 | Formulario de creación de profesional | Dev 2 | 3 | D6 | `frontend/src/components/admin/ProfesionalFormulario.jsx` |
| S1-T19 | HU-ADP-01 | Pruebas de correo duplicado y de permisos | Dev 2 | 3 | D6 | `backend/test/ProfesionalServicio.test.js`, `UsuarioServicio.test.js` |
| S1-T20 | HU-ADP-02 | Campo de especialidades (categorías) en el perfil | Dev 1 | 2 | D6 | `backend/src/modules/profesionales/models/entities/Profesionales.model.js` |
| S1-T21 | HU-ADP-02 | Endpoint para asignar y modificar especialidades | Dev 1 | 2 | D7 | `backend/src/modules/profesionales/profesional.servicio.js` |
| S1-T22 | HU-ADP-02 | Selector de especialidades en pantalla | Dev 2 | 2 | D7 | `frontend/src/components/admin/ProfesionalFormulario.jsx` |
| S1-T23 | HU-ADP-02 | Prueba de reflejo en la selección de profesional | Dev 2 | 2 | D7 | `backend/test/Profesional.test.js` |
| S1-T24 | HU-ADP-03 | Esquema de horario: día, hora de inicio y fin | Dev 1 | 3 | D7 | `backend/src/modules/horarios/models/entities/Horarios.model.js`, `models/domain/Horario.js` |
| S1-T25 | HU-ADP-03 | Endpoint de definir y modificar con validación de franja y solapes | Dev 1 | 4 | D8 | `backend/src/modules/horarios/horario.servicio.js` |
| S1-T26 | HU-ADP-03 | Pantalla por día y franja, con matriz semanal | Dev 2 | 3 | D8 | `frontend/src/pages/admin/HorariosAdminPage.jsx`, `components/admin/MatrizHorarios.jsx`, `HorarioFormulario.jsx` |
| S1-T27 | HU-ADP-03 | Pruebas de franja inválida y solapamiento | Dev 2 | 2 | D8 | `backend/test/Horario.test.js`, `Hora.test.js` |
| S1-T28 | HU-SER-01 | Endpoint de servicios agrupados por categoría | Dev 1 | 3 | D8 | `backend/src/modules/servicios/servicio.controlador.js`, `servicio.routes.js` |
| S1-T29 | HU-SER-01 | Pantalla de catálogo de servicios (C-01) | Dev 2 | 3 | D8 | `frontend/src/components/Catalogo/CatalogoSection.jsx`, `CategoriasSection.jsx` |
| S1-T30 | HU-SER-01 | Prueba de catálogo vacío | Dev 2 | 2 | D9 | verificación manual · FN-01 |
| S1-T31 | HU-DIS-01 | Endpoint de profesionales por servicio y especialidad | Dev 1 | 3 | D9 | `backend/src/modules/profesionales/profesional.controlador.js`, `profesional.routes.js` |
| S1-T32 | HU-DIS-01 | Cálculo de horarios libres: franja menos citas existentes | Dev 1 | 5 | D9 | `backend/src/modules/citas/cita.servicio.js`, `shared/utils/Hora.js`, `Fecha.js` |
| S1-T33 | HU-DIS-01 | Pantalla de profesional y horarios libres (C-02) | Dev 2 | 4 | D9 | `frontend/src/pages/publico/ReservaPage.jsx` |
| S1-T34 | HU-DIS-01 | Mensajes sin disponibilidad y cambio de servicio o profesional | Dev 2 | 2 | D9 | `frontend/src/pages/publico/ReservaPage.jsx` |
| S1-T35 | HU-DIS-01 | Pruebas con cita confirmada y cita cancelada | Dev 2 | 2 | D9 | `backend/test/Cita.test.js` |
| S1-T36 | HU-AGE-01 | Esquema de cita con snapshots de servicio y profesional, `idCliente` por referencia y hash del enlace | Dev 1 | 3 | D8 | `backend/src/modules/citas/models/entities/Cita.model.js` |
| S1-T37 | HU-AGE-01 | Módulo único de validación de cruces de horario | Dev 1 | 4 | D9 | `backend/src/modules/citas/models/domain/Cita.js`, `test/Cita.test.js` |
| S1-T38 | HU-AGE-01 | Respaldo en base de datos contra la doble reserva | Dev 1 | 3 | D9 | `backend/src/modules/citas/cita.repositorio.js` |
| S1-T39 | HU-AGE-01 | Endpoint de agendamiento con generación del enlace único | Dev 1 | 4 | D9 | `backend/src/modules/citas/cita.servicio.js`, `cita.controlador.js` |
| S1-T40 | HU-AGE-01 | Formulario de datos con validaciones (C-03) | Dev 2 | 3 | D10 | `frontend/src/pages/publico/ReservaPage.jsx`, `utils/validacion.js` |
| S1-T41 | HU-AGE-01 | Pantalla de resumen y enlace único (C-04) | Dev 2 | 2 | D10 | `frontend/src/pages/publico/DetalleCitaPage.jsx`, `utils/reserva.js` |
| S1-T42 | HU-AGE-01 | Pruebas de reservas simultáneas y de validaciones | Dev 2 | 1 | D10 | `backend/test/Cita.test.js`, `backend/tests/citas.test.js` |
| S1-T43 | HU-CIT-03 | Endpoint de consulta por enlace (búsqueda por hash) | Dev 1 | 2 | D9 | `backend/src/modules/citas/cita.servicio.js` |
| S1-T44 | HU-CIT-03 | Pantalla de detalle de la cita por enlace (C-05) | Dev 2 | 3 | D10 | `frontend/src/pages/publico/CitaTokenPage.jsx` |
| S1-T45 | HU-CIT-03 | Manejo de enlace inválido sin revelar datos | Dev 1 | 2 | D10 | `backend/src/modules/citas/cita.controlador.js` |
| S1-T46 | HU-CIT-03 | Pruebas de enlace válido e inválido | Dev 2 | 1 | D10 | `backend/test/Cita.test.js`, `backend/tests/citas.test.js` |
| S1-T47 | HU-CIT-04 | Endpoint de cancelación por enlace con validación de estado | Dev 1 | 3 | D10 | `backend/src/modules/citas/cita.servicio.js`, `cita.routes.js` |
| S1-T48 | HU-CIT-04 | Confirmación y botón de cancelar en C-05 | Dev 2 | 2 | D10 | `frontend/src/pages/publico/CitaTokenPage.jsx` |
| S1-T49 | HU-CIT-04 | Liberación del horario al cancelar | Dev 1 | 2 | D10 | `backend/src/modules/citas/cita.servicio.js` |
| S1-T50 | HU-CIT-04 | Pruebas de citas en estado final | Dev 2 | 1 | D10 | `backend/test/Cita.test.js` |
| S1-T51 | HU-ADC-01 | Endpoint de listado de todas las citas (solo administrador) | Dev 1 | 2 | D8 | `backend/src/modules/citas/cita.controlador.js`, `cita.routes.js` |
| S1-T52 | HU-ADC-01 | Pantalla A-02 con calendario y menú de acciones | Dev 2 | 1 | D9 | `frontend/src/pages/admin/CitasAdminPage.jsx`, `components/admin/CalendarioFiltroCitas.jsx`, `MenuAccionesCita.jsx` |
| S1-T53 | HU-ADC-01 | Pruebas de permisos y listado | Dev 2 | 1 | D9 | verificación manual · FN-08 |
| S1-T54 | HU-ADC-02 | Endpoint de detalle de cita | Dev 1 | 2 | D9 | `backend/src/modules/citas/cita.controlador.js` |
| S1-T55 | HU-ADC-02 | Pantalla de detalle de cita (A-03) | Dev 2 | 1 | D9 | `frontend/src/pages/admin/CitasAdminPage.jsx` |
| S1-T56 | HU-ADC-02 | Prueba de datos mostrados, incluida la justificación | Dev 2 | 1 | D9 | verificación manual · FN-11 |
| S1-T57 | HU-ADC-03 | Endpoint de cambio de estado con transiciones válidas | Dev 1 | 3 | D9 | `backend/src/modules/citas/models/domain/Cita.js`, `cita.servicio.js` |
| S1-T58 | HU-ADC-03 | Acciones completada y no asistió en A-03 | Dev 2 | 3 | D10 | `frontend/src/components/admin/MenuAccionesCita.jsx` |
| S1-T59 | HU-ADC-03 | Prueba de citas en estado final | Dev 2 | 2 | D10 | `backend/test/Cita.test.js` |

## Notas de Daily (solo días con impedimento)

- **D1:** sin avance en puntos. El equipo dedicó el día a dejar corriendo el entorno (Node, dependencias y MongoDB local) y a confirmar el alcance del corte del 6 de noviembre con la administradora.
- **D4:** línea plana en el burndown. Se esperó una decisión de alcance: si la carga de imágenes entraba en el alta de servicio o se difería. Se decidió incluirla (ADR del 4 nov en `AGENTS.md` no aplica; se registró como tarea S1-T14) y se reanudó el trabajo al día siguiente.
- **D8–D10:** sin impedimentos nuevos. Se concentraron las pruebas de reserva y el panel, con revisión cruzada antes de integrar.

## Cierre del sprint

- Objetivo cumplido: el flujo público completo (catálogo → disponibilidad → reserva → enlace → cancelación) quedó demostrable.
- 15 de 15 historias `Done`. Ninguna historia se sacó del sprint.
- Se acumularon dos observaciones para la retrospectiva: faltaba validar nombres duplicados de forma tolerante a tildes, y la baja de profesionales todavía no estaba resuelta. Ambas se transforman en trabajo del Sprint 2.
