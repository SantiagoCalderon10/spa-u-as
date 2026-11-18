# Artefactos Scrum — Three Masters Spa

> **Nota de honestidad documental.** Este conjunto es una **reconstrucción retrospectiva** del proceso. Las historias, las tareas y la evidencia corresponden a trabajo real visible en el repositorio; los puntos, las horas, el responsable y el día son **estimaciones documentadas después**, no datos extraídos de una herramienta de gestión. Está bien decirlo en la sustentación: Scrum ayudó a ordenar el trabajo, no fue grabado en vivo.

## Índice

| # | Documento | Para qué sirve |
|---|---|---|
| 01 | [`01-product-backlog.md`](01-product-backlog.md) | Las 34 historias con criterios, prioridad, puntos y sprint. |
| 02 | [`02-acuerdos-equipo.md`](02-acuerdos-equipo.md) | Escala de estimación, DoR, DoD, roles y capacidad. |
| 03 | [`03-sprint-1.md`](03-sprint-1.md) | Objetivo, planning y las 59 tareas del Sprint 1. |
| 04 | [`04-sprint-2.md`](04-sprint-2.md) | Objetivo, planning y las 61 tareas del Sprint 2. |
| 05 | [`05-burndown.md`](05-burndown.md) · [`05-burndown.csv`](05-burndown.csv) | Datos y gráficas de quemado de ambos sprints. |
| 06 | [`06-review-retrospectiva.md`](06-review-retrospectiva.md) | Revisiones, retrospectivas y compromisos encadenados. |

## Resumen numérico

| | Historias | Tareas | Puntos | Horas |
|---|---:|---:|---:|---:|
| Sprint 1 | 15 | 59 | 38 | 152 |
| Sprint 2 | 19 | 61 | 34 | 136 |
| **Total** | **34** | **120** | **72** | **288** |

- 72 puntos × 4 h = 288 h. Capacidad teórica: 2 personas × 10 días × 8 h × 2 sprints = 320 h. Ocupación ≈ 90 %.
- Velocidad: 38 → 34. La baja se explica en la retrospectiva del Sprint 2: desde el 10 de noviembre no se agregaron funciones nuevas (`docs/contexto/negocio-y-alcance.md`, §4) y el tiempo se fue a pruebas, documentación y cierre.
- Promedio de 3,5 tareas por historia, coherente con las 34 HUs entregadas.

## Supuestos y convenciones

1. **No se inventaron historias.** Se usan exactamente los 34 IDs entregados por el equipo. Las mejoras que aparecen en el código pero no tienen HU propia se listan al final del product backlog como *trabajo posterior a las 34 HUs*, sin puntos.
2. **Calendario.** Sprint 1: 26 oct – 6 nov de 2026 (semanas S2–S3 del calendario académico). Sprint 2: 9 – 19 nov de 2026 (S4 + cierre; exposición el 19). Los días de tarea se numeran `D1…D10` y `D1…D9` dentro de cada sprint.
3. **Criterio de reparto.** Sprint 1 contiene el núcleo funcional definido en `docs/contexto/negocio-y-alcance.md` §4 (login, roles, catálogos, profesionales, agendamiento público, enlace y panel de citas). Sprint 2 contiene la ampliación y el endurecimiento.
4. **Evidencia.** Columna con ruta real del repositorio. Donde no existe prueba automática se escribe `verificación manual` y el FN relacionado; no se finge un archivo de prueba.
5. **Roles.** `Dev 1` programa y además ejerce de PO a tiempo parcial; `Dev 2` lleva documentación y ejerce de SM a tiempo parcial. Es un patrón normal en equipos de dos y está descrito en `docs/contexto/negocio-y-alcance.md` §1.
6. **Estado.** Todas las tareas se cerraron en `Done`; por eso la columna de estado se declara una sola vez por sprint y no se repite en cada fila.
7. **Pendiente de verificación.** El entorno donde se generó esta documentación no pudo ejecutar `npm test`, `npm run lint` ni `npm run build` (el shell devolvía código 9 sin salida). La evidencia es estática: archivos, **14 suites escritas** (12 en `backend/test/`, 2 en `backend/tests/`) y documentos; por eso el badge del README dice “Escritas”, no “Passing”. Antes de la exposición conviene correr esos tres comandos y anotar el resultado aquí.
8. **Funcionalidades no cubiertas por las 34 HUs.** FN-16 y FN-17 siguen `Pendiente`: el panel `ResumenAdminPage.jsx` calcula ingresos derivados de citas completadas y ofrece filtros temporales, pero no persiste un ingreso ni genera el reporte histórico descartado por ADR-04. FN-23 sigue `Posterior`. La aclaración está en `docs/requisitos/funcionalidades.md` (2026-11-18).
