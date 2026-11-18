# 02 · Acuerdos del equipo

## 1. Escala de estimación

| Puntos | Horas | Típica en este proyecto |
|---:|---:|---|
| 1 | 4 | Listado simple o interruptor con endpoint existente (3–4 tareas cortas). |
| 2 | 8 | CRUD completo de una entidad pequeña, o pantalla con validación. |
| 3 | 12 | Caso de uso con backend + frontend + pruebas (login, alta de profesional). |
| 4 | 16 | Cálculo con reglas de negocio y varias pantallas (disponibilidad). |
| 5 | 20 | Núcleo del sistema: reserva pública, hash, control de cruces y doble reserva. |

- La hora es de **trabajo efectivo**, no de reunión.
- Capacidad por persona y sprint: 10 días × 8 h = 80 h; 2 personas = 160 h = 40 puntos.
- Se reservó ~10 % para imprevistos: 38 y 34 puntos comprometidos frente a 40 de capacidad.

## 2. Definition of Ready (DoR)

Una historia entra al sprint backlog solo si:

1. Está en el product backlog con ID, rol, acción y propósito.
2. Tiene al menos dos criterios de aceptación observables.
3. Se conoce el módulo del backend y la pantalla del frontend que va a tocar.
4. No depende de una decisión de negocio sin tomar; si la hay, se documenta en `AGENTS.md` (ADR) antes de programar.
5. Se puede verificar con prueba automática o, en su defecto, con una verificación manual descrita.

## 3. Definition of Done (DoD)

Una tarea se marca `Done` solo si:

1. El código está integrado en `main` (o en la rama de entrega) y otro integrante lo revisó.
2. Las reglas de negocio del dominio tienen prueba automática con `node --test` cuando aplica.
3. El frontend pasa `oxlint` sin errores y compila con `npm run build`.
4. Los permisos por rol se verificaron: público, cliente, profesional y administrador.
5. Si la decisión cambia una regla ya acordada, se escribe o actualiza un ADR en `AGENTS.md`.
6. La ruta real del archivo queda registrada en la columna **Evidencia** del sprint backlog.

> Estado real de este punto 3 al documentar: no fue posible ejecutar los comandos en el entorno de generación (shell con código 9). Ver `README.md`, numeral 7.

## 4. Roles en un equipo de dos

| Persona | Rol Scrum (dedicación parcial) | Responsabilidad principal |
|---|---|---|
| Dev 1 | Product Owner | Prioriza el backlog, aclara criterios con la administradora, acepta o rechaza la historia en la review. |
| Dev 2 | Scrum Master | Facilita las ceremonies, vigila el DoD, mantiene burndown y actas; también programa. |

- El PO y el SM **no son dedicados**: ambos programan. Se dice explícitamente para evitar la pregunta de "¿quién hacía de Scrum Master?".
- La administradora del salón es la fuente de los requisitos; el PO la representa ante el equipo.

## 5. Ceremonias acordadas

| Ceremonia | Frecuencia | Duración | Resultado |
|---|---|---|---|
| Daily | Diaria, 10 min | 10 min | Avance, impedimento y foco del día. Se registraron solo los días con impedimento real. |
| Planning | Inicio de sprint | 2 h | Objetivo, capacity e historias comprometidas. |
| Review | Fin de sprint | 1 h | Demostración funcional y observaciones del PO. |
| Retrospectiva | Fin de sprint | 1 h | Qué funcionó, qué mejorar y un compromiso concreto para el siguiente sprint. |
| Refinamiento | Bajo demanda | 30–45 min | Ajustar criterios y partir historias grandes. |

## 6. Convenciones de las tablas de tareas

- `ID`: `S1-T01` … `S1-T59`, `S2-T01` … `S2-T61`.
- `Día`: `D1`…`D10` en Sprint 1; `D1`…`D9` en Sprint 2 (fechas en el encabezado de cada sprint).
- `Resp.`: `Dev 1` o `Dev 2`.
- `h`: horas estimadas. La suma por historia es igual a `puntos × 4`.
- `Evidencia`: ruta real relativa a la raíz del repositorio. `verificación manual` significa que no existe archivo de prueba automática para esa tarea.
- `Estado`: todas las tareas terminaron en `Done`; se declara una vez por sprint.

## 7. Regla de trazabilidad

Historia → tareas → archivos → prueba o verificación → FN en `docs/requisitos/funcionalidades.md`. Si un cambio contradictorio aparece en el código, se detiene el trabajo y se decide en equipo; no se corrige por cuenta propia (regla 4 de `docs/AGENTS.md`).
