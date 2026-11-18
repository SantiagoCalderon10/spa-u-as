# 06 · Sprint Review y Retrospectiva

## Sprint 1 · Review (6 nov de 2026)

**Demostración al PO (administradora del salón):**

1. Registro e inicio de sesión del personal; el menú muestra solo las opciones del rol.
2. Alta de categorías y servicios con precio y duración; el catálogo público los agrupa por categoría.
3. Alta de profesional con cuenta, especialidades y franjas horarias.
4. Flujo público completo: elegir servicio → ver profesional y horarios libres → reservar sin cuenta → abrir enlace único → cancelar.
5. Panel del administrador: listado de citas, detalle y cambios a completada / no asistió.

**Observaciones del PO:**

- Le pareció bien que la clienta no tenga que crear cuenta para reservar.
- Pidió que no se pudieran crear dos categorías o servicios con el mismo nombre aunque cambiaran tildes o mayúsculas. **Aceptada** → HU-ADS-01 / HU-ADS-03, tareas S1-T11 y S1-T15.
- Preguntó qué pasaba con las citas al quitar una franja horaria. Se anotó para el Sprint 2 → HU-ADP-04.
- Pidió poder retirar a una profesional que deja el salón sin borrar el historial → HU-ADP-05 y HU-ADP-06.

**Resultado:** 15 de 15 historias aceptadas. Sin trabajo nuevo dentro del sprint.

## Sprint 1 · Retrospectiva

| Pregunta | Respuesta concreta |
|---|---|
| ¿Qué funcionó? | La separación dominio / repositorio / servicio permitió probar reglas de negocio sin base de datos. El reparto backend–frontend por historia evitó cuellos de botella. |
| ¿Qué no funcionó? | El día 1 se perdió configurando el entorno. Se subestimó la validación de nombres duplicados y la baja de profesionales. |
| ¿Qué impedimento real hubo? | Decisión de alcance pendiente el D4 (si la carga de imágenes entraba en el alta de servicio). Se resolvió incluyéndola. |
| Compromiso para el Sprint 2 | "Todo alta o edición de catálogo debe rechazar duplicados normalizados, y la baja de profesionales debe tener guardas y conservar el historial." Se cumplió en S2-T01, S2-T11 a S2-T15. |

## Sprint 2 · Review (19 nov de 2026)

**Demostración:**

1. Edición de servicios y categorías con validación de nombres repetidos.
2. Activación y desactivación de categorías y servicios sin borrar historial.
3. Baja temporal y baja definitiva de profesionales, con motivo, conservación del nombre en las citas y botones de WhatsApp por clienta.
4. Eliminación de franjas con aviso de las citas que quedan fuera y enlace al panel de Citas.
5. Agenda de la profesional con cancelación justificada y aviso por WhatsApp.
6. Cuenta de clienta: registro, perfil editable, historial, detalle y cancelación propias.
7. Reprogramación de citas desde el panel sin cancelarlas.

**Observaciones del PO:**

- Aprobó que la cancelación por baja de profesional conserve el motivo visible para la clienta.
- Aprobó que las citas afectadas por un cambio de franja **no se cancelen automáticamente** y que ella decida desde Citas. Pidió que el aviso incluya nombre de la clienta, servicio, fecha y hora; quedó implementado en `AvisoCitasAfectadas.jsx`.
- Preguntó por los reportes económicos. Se le mostró el panel con filtros Semana/Mes/Año. Queda pendiente reconciliar el estado de FN-17 en `funcionalidades.md` (marcada como `Pendiente` aunque el panel existe).

**Resultado:** 19 de 19 historias aceptadas. Se entregan 34 de 34 historias del producto.

## Sprint 2 · Retrospectiva

| Pregunta | Respuesta concreta |
|---|---|
| ¿Qué funcionó? | La restricción "sin funciones nuevas desde el 10 de nov" obligó a priorizar cierre sobre ideas nuevas. Las pruebas del dominio (`Cita`, `Horario`, `ProfesionalServicio`) detectaron los casos límite antes de la demo. |
| ¿Qué no funcionó? | Quedó una decisión sin registrar formalmente: la regla de citas afectadas por cambios de franja. Está en el código y en el aviso, pero no tiene ADR. |
| ¿Qué impedimento real hubo? | D5 sin avance en puntos mientras se definía si las citas afectadas se cancelaban, se reprogramaban o solo se advertían. Se eligió solo advertir. |
| Compromiso final | "Registrar la regla de citas afectadas como ADR-05 y corregir el estado de FN-17 antes de la sustentación." **Pendiente**, no se ejecutó en este cierre. |
| Sobre el uso de IA | Se usó para borradores, revisiones y código repetitivo. Las decisiones de negocio, la arquitectura y los recortes de alcance (sin API de WhatsApp, sin PDF/Excel) los tomó el equipo. Bitácora en `docs/uso-de-ia/uso-de-ia.md`. |

## Compromisos encadenados entre sprints

| Compromiso de la retro 1 | Se convirtió en | Evidencia |
|---|---|---|
| Rechazar nombres duplicados normalizados | HU-ADS-01, HU-ADS-03 | `normalizarNombre.js`, `CatalogoDuplicados.test.js` |
| Avisar al quitar una franja con citas | HU-ADP-04 | `AvisoCitasAfectadas.jsx`, `HorarioCitasAfectadas.test.js` |
| Baja de profesional con guardas e historial | HU-ADP-05, HU-ADP-06 | `ProfesionalServicio.test.js`, `backfill-profesional-citas.js` |

## Coherencia del proceso para la sustentación

| Pregunta que puede hacer el docente | Respuesta corta con evidencia |
|---|---|
| ¿Por qué solo dos sprints? | El calendario académico da dos bloques útiles: S2–S3 y S4 + cierre (`docs/contexto/negocio-y-alcance.md` §4). 72 puntos × 4 h = 288 h, dentro de los 320 h disponibles para 2 personas. |
| ¿Por qué el Sprint 2 tiene menos puntos? | Tuvo 9 días en vez de 10 por la exposición del 19. La velocidad por día se mantuvo en 3,8 (`05-burndown.md`). |
| ¿De dónde salen las horas y los responsables? | Son estimaciones documentadas a posteriori a partir del código real; está declarado en `README.md`. No se presenta como telemetría de una herramienta. |
| ¿Cómo se sabe que una historia está terminada? | Por el DoD de `02-acuerdos-equipo.md`: código integrado, pruebas o verificación manual, permisos por rol y evidencia con ruta real. |
| ¿Qué decidieron no hacer? | API oficial de WhatsApp (ADR-01), reportes PDF/Excel (ADR-04), ingreso real y descuento por fidelidad (`funcionalidades.md`). |
| ¿Qué queda pendiente? | ADR-05, FN-17, ejecutar `npm test`, `npm run lint` y `npm run build` en un entorno funcional. |
