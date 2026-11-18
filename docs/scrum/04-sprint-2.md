# 04 · Sprint 2 — Robustecimiento y cierre

**Fechas:** 9 – 19 nov de 2026 (D1–D9), semanas S4 + cierre del calendario académico. Exposición el 19.
**Objetivo:** *Cerrar la gestión de catálogos y profesionales, completar los paneles de cliente y profesional, y dejar trazabilidad con pruebas y documentación.*
**Capacidad:** 36 puntos (2 personas × 9 días × 8 h = 144 h), descontando el día de exposición. **Comprometido:** 34 puntos · 19 historias · 61 tareas · 136 h.
**Velocity esperada:** 34–38. **Velocity real:** 34.

> **Restricción del calendario académico:** desde el **10 de noviembre no se agregaron funciones nuevas** (`docs/contexto/negocio-y-alcance.md`, §4). Por eso este sprint se comporta más como cierre que como ampliación: las 19 historias ya estaban priorizadas y los últimos días se dedicaron a pruebas, ajustes y documentación. Esta es la explicación de la caída de velocidad 38 → 34.

## Historias comprometidas

| ID | Pts | Origen del compromiso |
|---|---:|---|
| HU-ADS-02 | 2 | Retro Sprint 1: validación de duplicados al editar servicio. |
| HU-ADP-04 | 2 | Retro Sprint 1: baja de franjas con citas confirmadas. |
| HU-ADP-05 | 2 | Núcleo: baja temporal sin perder historial. |
| HU-ADP-06 | 4 | Retro Sprint 1: baja definitiva con guardas. |
| HU-PRF-01 | 1 | Núcleo: agenda de la profesional. |
| HU-PRF-02 | 2 | Núcleo: cancelación justificada por la profesional. |
| HU-PRF-03 | 2 | ADR-01: aviso por WhatsApp sin API oficial. |
| HU-ADS-04 | 1 | Catálogo: listado previo a crear servicios. |
| HU-ADS-05 | 1 | Catálogo: corregir nombres. |
| HU-ADS-06 | 1 | Catálogo: baja con verificación de uso. |
| HU-ADS-07 | 1 | Catálogo: ocultar sin perder historial. |
| HU-ADS-08 | 2 | Catálogo: desactivar servicio reservable. |
| HU-ACC-03 | 2 | Ampliación #2: cuenta opcional. |
| HU-AGE-02 | 2 | Ampliación #2: reservas ligadas a la cuenta. |
| HU-AGE-03 | 1 | Ampliación #2: compartir enlace por WhatsApp. |
| HU-ACC-04 | 2 | Ampliación #2: perfil editable. |
| HU-CIT-01 | 2 | Ampliación #2: historial de citas. |
| HU-CIT-02 | 2 | FN-24: detalle y cancelación desde la cuenta. |
| HU-ADC-04 | 2 | Núcleo: reprogramación sin cancelar. |

## Sprint backlog

**Estado:** las 61 tareas se cerraron en `Done`. La evidencia con `verificación manual` se comprobó en navegador. Las 14 suites escritas en `backend/test/` y `backend/tests/` no se ejecutaron en el entorno de documentación (shell con código 9 sin salida); el badge del README dice “Escritas”, no “Passing”.

| ID | HU | Tarea | Resp. | h | Día | Evidencia |
|---|---|---|---|---:|---|---|
| S2-T01 | HU-ADS-02 | Endpoint de modificación con validaciones, incluido nombre duplicado | Dev 1 | 3 | D1 | `backend/src/modules/servicios/servicio.servicio.js`, `shared/utils/normalizarNombre.js` |
| S2-T02 | HU-ADS-02 | Formulario de edición de servicio | Dev 2 | 3 | D1 | `frontend/src/components/admin/ServicioFormulario.jsx` |
| S2-T03 | HU-ADS-02 | Verificación del reflejo en catálogo y en citas ya agendadas | Dev 2 | 2 | D2 | `frontend/src/components/Catalogo/CatalogoSection.jsx`, verificación manual · FN-12 |
| S2-T04 | HU-ADP-04 | Endpoint de eliminación de franja con verificación de citas confirmadas | Dev 1 | 3 | D2 | `backend/src/modules/horarios/horario.servicio.js`, `horario.controlador.js` |
| S2-T05 | HU-ADP-04 | Detección de citas afectadas y aviso con lista y enlace a Citas | Dev 2 | 3 | D2 | `frontend/src/components/admin/AvisoCitasAfectadas.jsx`, `backend/src/modules/horarios/horario.routes.js`, `frontend/src/api/horarioService.js` |
| S2-T06 | HU-ADP-04 | Pruebas de franja con y sin citas afectadas | Dev 2 | 2 | D3 | `backend/test/HorarioCitasAfectadas.test.js` |
| S2-T07 | HU-ADP-05 | Campo de estado activo en el perfil de la profesional | Dev 1 | 2 | D3 | `backend/src/modules/profesionales/models/entities/Profesionales.model.js` |
| S2-T08 | HU-ADP-05 | Endpoints de desactivación y reactivación | Dev 1 | 2 | D3 | `backend/src/modules/profesionales/profesional.servicio.js` |
| S2-T09 | HU-ADP-05 | Acción de desactivar y reactivar en pantalla | Dev 2 | 2 | D4 | `frontend/src/pages/admin/ProfesionalesAdminPage.jsx` |
| S2-T10 | HU-ADP-05 | Exclusión de profesionales inactivas en selección y horarios | Dev 2 | 2 | D4 | `backend/src/modules/profesionales/profesional.servicio.js`, `citas/cita.servicio.js` |
| S2-T11 | HU-ADP-06 | Resumen de baja y guardas de citas, horarios y cuenta | Dev 1 | 4 | D4 | `backend/src/modules/profesionales/profesional.servicio.js`, `profesional.routes.js` |
| S2-T12 | HU-ADP-06 | Cancelación de citas futuras con motivo y snapshot del nombre de la profesional | Dev 1 | 4 | D5 | `backend/src/modules/profesionales/profesional.servicio.js`, `citas/models/entities/Cita.model.js`, `scripts/backfill-profesional-citas.js` |
| S2-T13 | HU-ADP-06 | Borrado condicional de horarios y cuenta, con validaciones antes de borrar | Dev 1 | 3 | D5 | `backend/src/modules/profesionales/profesional.servicio.js` |
| S2-T14 | HU-ADP-06 | Confirmación irreversible y avisos por WhatsApp por clienta | Dev 2 | 3 | D6 | `frontend/src/components/admin/EliminarProfesionalFormulario.jsx`, `utils/reserva.js` |
| S2-T15 | HU-ADP-06 | Pruebas de eliminación con y sin citas pendientes | Dev 2 | 2 | D6 | `backend/test/ProfesionalServicio.test.js` |
| S2-T16 | HU-PRF-01 | Endpoint de citas de la profesional autenticada | Dev 1 | 2 | D5 | `backend/src/modules/citas/cita.controlador.js`, `cita.routes.js` |
| S2-T17 | HU-PRF-01 | Pantalla de mis citas (P-02) | Dev 2 | 1 | D6 | `frontend/src/pages/profesional/AgendaProfesionalPage.jsx`, `hooks/useCitasProfesional.js` |
| S2-T18 | HU-PRF-01 | Prueba de que no se ven citas de otras profesionales | Dev 2 | 1 | D6 | verificación manual · FN-14 |
| S2-T19 | HU-PRF-02 | Endpoint de cancelación con justificación obligatoria | Dev 1 | 3 | D6 | `backend/src/modules/citas/cita.servicio.js` |
| S2-T20 | HU-PRF-02 | Formulario de cancelación con justificación (P-03) | Dev 2 | 2 | D7 | `frontend/src/components/admin/CancelarCitaFormulario.jsx` |
| S2-T21 | HU-PRF-02 | Liberación del horario y registro del motivo | Dev 1 | 2 | D7 | `backend/src/modules/citas/models/domain/Cita.js` |
| S2-T22 | HU-PRF-02 | Pruebas de justificación vacía, citas ajenas y citas en estado final | Dev 2 | 1 | D7 | `backend/test/Cita.test.js` |
| S2-T23 | HU-PRF-03 | Armado del enlace `wa.me` con teléfono y mensaje prellenado | Dev 2 | 3 | D7 | `frontend/src/utils/reserva.js` |
| S2-T24 | HU-PRF-03 | Opción de avisar por WhatsApp sin cerrar el diálogo de cancelación | Dev 2 | 3 | D8 | `frontend/src/components/admin/CancelarCitaFormulario.jsx` |
| S2-T25 | HU-PRF-03 | Prueba de que la cancelación es válida aunque no se envíe el mensaje | Dev 1 | 2 | D8 | `backend/test/Cita.test.js`, ADR-01 en `AGENTS.md` |
| S2-T26 | HU-ADS-04 | Endpoint de listado de categorías | Dev 1 | 2 | D2 | `backend/src/modules/categorias/categoria.controlador.js`, `frontend/src/hooks/useCategorias.js` |
| S2-T27 | HU-ADS-04 | Pantalla de listado de categorías | Dev 2 | 2 | D3 | `frontend/src/pages/admin/CategoriasAdminPage.jsx` |
| S2-T28 | HU-ADS-05 | Endpoint de edición de categoría con validaciones | Dev 1 | 2 | D3 | `backend/src/modules/categorias/categoria.servicio.js` |
| S2-T29 | HU-ADS-05 | Formulario de edición de categoría | Dev 2 | 2 | D4 | `frontend/src/components/admin/CategoriaFormulario.jsx` |
| S2-T30 | HU-ADS-06 | Endpoint de eliminación con verificación de uso | Dev 1 | 2 | D4 | `backend/src/modules/categorias/categoria.servicio.js` |
| S2-T31 | HU-ADS-06 | Confirmación de eliminación en pantalla | Dev 2 | 1 | D4 | `frontend/src/pages/admin/CategoriasAdminPage.jsx` |
| S2-T32 | HU-ADS-06 | Pruebas de categoría en uso y sin uso | Dev 2 | 1 | D5 | `backend/test/Categoria.test.js` |
| S2-T33 | HU-ADS-07 | Campo de estado activo en la categoría | Dev 1 | 1 | D5 | `backend/src/modules/categorias/models/entities/Categorias.model.js`, `models/domain/Categoria.js` |
| S2-T34 | HU-ADS-07 | Endpoint de activación y desactivación de categoría | Dev 1 | 1 | D5 | `backend/src/modules/categorias/categoria.servicio.js` |
| S2-T35 | HU-ADS-07 | Interruptor de activar y desactivar en pantalla | Dev 2 | 1 | D6 | `frontend/src/components/admin/Interruptor.jsx`, `pages/admin/CategoriasAdminPage.jsx` |
| S2-T36 | HU-ADS-07 | Exclusión de categorías inactivas en servicios y especialidades | Dev 2 | 1 | D6 | `backend/src/modules/categorias/categoria.servicio.js` |
| S2-T37 | HU-ADS-08 | Campo de estado activo en el servicio | Dev 1 | 2 | D6 | `backend/src/modules/servicios/models/entities/Servicios.model.js`, `models/domain/Servicio.js` |
| S2-T38 | HU-ADS-08 | Endpoint de activación y desactivación de servicio | Dev 1 | 2 | D6 | `backend/src/modules/servicios/servicio.servicio.js` |
| S2-T39 | HU-ADS-08 | Interruptor de activar y desactivar en pantalla | Dev 2 | 2 | D7 | `frontend/src/components/admin/Interruptor.jsx`, `pages/admin/ServiciosAdminPage.jsx` |
| S2-T40 | HU-ADS-08 | Exclusión de servicios inactivos en el catálogo del cliente | Dev 2 | 2 | D7 | `backend/src/modules/servicios/servicio.servicio.js`, `frontend/src/components/Catalogo/CatalogoSection.jsx` |
| S2-T41 | HU-ACC-03 | Rol cliente y vínculo con el perfil de cliente | Dev 1 | 2 | D2 | `backend/src/modules/usuarios/models/entities/Usuarios.model.js`, `clientes/models/domain/Cliente.js` |
| S2-T42 | HU-ACC-03 | Endpoint de registro con correo único y hash de contraseña | Dev 1 | 2 | D2 | `backend/src/modules/usuarios/usuario.servicio.js`, `usuario.routes.js` |
| S2-T43 | HU-ACC-03 | Pantalla de registro | Dev 2 | 2 | D3 | `frontend/src/pages/publico/CuentaPage.jsx`, `api/usuarioService.js` |
| S2-T44 | HU-ACC-03 | Pruebas de correo duplicado y de agendar sin cuenta | Dev 2 | 2 | D3 | `backend/test/UsuarioServicio.test.js`, `backend/tests/auth.test.js`, `backend/tests/citas.test.js` |
| S2-T45 | HU-AGE-02 | Asociación de la cita a la cuenta y al perfil de cliente | Dev 1 | 3 | D4 | `backend/src/modules/citas/cita.servicio.js`, `models/entities/Cita.model.js` |
| S2-T46 | HU-AGE-02 | Ajuste del endpoint de agendamiento según haya sesión | Dev 1 | 3 | D4 | `backend/src/modules/citas/cita.servicio.js`, `shared/middlewares/autenticarOpcional.js` |
| S2-T47 | HU-AGE-02 | Pruebas de agendamiento con y sin sesión | Dev 2 | 2 | D5 | `backend/test/Cita.test.js`, `backend/tests/citas.test.js`, verificación manual · FN-19 |
| S2-T48 | HU-AGE-03 | Armado del enlace `wa.me` con el enlace único de la cita | Dev 2 | 2 | D5 | `frontend/src/utils/reserva.js` |
| S2-T49 | HU-AGE-03 | Botón de compartir en la pantalla de cita confirmada (C-04) | Dev 2 | 2 | D6 | `frontend/src/pages/publico/DetalleCitaPage.jsx` |
| S2-T50 | HU-ACC-04 | Endpoint de actualización de nombre, correo y teléfono | Dev 1 | 3 | D5 | `backend/src/modules/clientes/cliente.servicio.js` |
| S2-T51 | HU-ACC-04 | Pantalla de perfil de la clienta | Dev 2 | 3 | D6 | `frontend/src/pages/publico/PerfilClientePage.jsx` |
| S2-T52 | HU-ACC-04 | Validación de correo único y pruebas de permisos | Dev 2 | 2 | D7 | `backend/test/Cliente.test.js`, `frontend/src/utils/validacion.js` |
| S2-T53 | HU-CIT-01 | Endpoint de citas de la clienta autenticada | Dev 1 | 3 | D6 | `backend/src/modules/citas/cita.controlador.js`, `cita.routes.js` |
| S2-T54 | HU-CIT-01 | Pantalla de mis citas de la clienta | Dev 2 | 3 | D7 | `frontend/src/pages/publico/CuentaPage.jsx`, `hooks/useCitas.js` |
| S2-T55 | HU-CIT-01 | Prueba de que solo se ven las citas propias | Dev 2 | 2 | D7 | verificación manual · FN-19 |
| S2-T56 | HU-CIT-02 | Endpoint de detalle y cancelación autorizado por sesión y pertenencia | Dev 1 | 4 | D7 | `backend/src/modules/citas/cita.controlador.js`, `cita.servicio.js` |
| S2-T57 | HU-CIT-02 | Botón de detalle que abre la pantalla C-05 | Dev 2 | 2 | D8 | `frontend/src/pages/publico/DetalleCitaPage.jsx` |
| S2-T58 | HU-CIT-02 | Pruebas con citas de otra persona | Dev 2 | 2 | D8 | `backend/tests/citas.test.js` (FN-24: no expone ni cancela la cita ajena) + verificación manual · FN-24 |
| S2-T59 | HU-ADC-04 | Endpoint de reprogramación con validación de cruces | Dev 1 | 4 | D8 | `backend/src/modules/citas/cita.servicio.js`, `models/domain/Cita.js` |
| S2-T60 | HU-ADC-04 | Selector de nuevo horario libre en A-03 | Dev 2 | 2 | D9 | `frontend/src/components/admin/ReprogramarCitaFormulario.jsx` |
| S2-T61 | HU-ADC-04 | Pruebas de solapamiento y de citas en estado final | Dev 2 | 2 | D9 | `backend/test/Cita.test.js` |

## Notas de Daily (solo días con impedimento o decisión)

- **D2 (10 nov):** el equipo confirma la restricción del calendario: no se incorporan historias nuevas desde hoy. Las 19 ya comprometidas se mantienen; se reordena el trabajo para cerrar primero lo que afecta al panel administrativo.
- **D5:** línea plana en el burndown. Se dedicó el día a una decisión de negocio: al eliminar o editar una franja con citas confirmadas, **no se cancelan ni se reprograman automáticamente**; solo se advierte al administrador, que debe ir a `/admin/citas`. La regla quedó implementada en S2-T05, pero **falta registrar su ADR** (propuesto como ADR-05 en `AGENTS.md`; el equipo aún no lo confirmó).
- **D8–D9:** sin impedimentos. Regresión de roles, pruebas de baja de profesional y cierre de documentación para la exposición del 19.

## Cierre del sprint

- 19 de 19 historias `Done`, 34 de 34 puntos. Ninguna historia se sacó del sprint.
- Velocity 34, frente a 38 del Sprint 1. Promedio 36 puntos por sprint.
- Quedan dos compromisos documentales para después de la exposición: registrar la regla de citas afectadas como ADR-05 y resolver la discrepancia de FN-17 (reportes) entre `funcionalidades.md` y `ResumenAdminPage.jsx`.
