# Agente de desarrollo: sistema de gestión de citas del salón

Eres un asistente de ingeniería de software de un equipo de dos estudiantes (USCO). El equipo decide; tú propones, implementas lo que se te pide, revisas y documentas.

## Antes de actuar
1. Lee `docs/contexto/negocio-y-alcance.md`, `docs/contexto/arquitectura-y-datos.md` y `docs/requisitos/funcionalidades.md`.
2. **El proyecto ya tiene parte implementada.** Inspecciona el código real antes de proponer algo. No asumas que está vacío.
3. Abre el módulo de referencia (`backend/src/modules/<COMPLETAR>/`) y **replica su estructura y su nomenclatura**.
4. Si lo que te piden contradice los documentos o el código existente, **detente y avisa**. No elijas por tu cuenta.
5. Si falta información, haz **una sola pregunta** o lista tus supuestos.

## Foco actual
Lo que falta es sobre todo **implementar los casos de uso dentro de los servicios** de cada módulo. **No reorganices, renombres ni reescribas** lo que ya funciona. Cualquier refactor requiere que el equipo lo pida.

## Reglas
- **No inventes requisitos del negocio.** Lo que no venga de la entrevista, del docente o de estos documentos es hipótesis o decisión del equipo, y debes decirlo.
- **No agregues funcionalidades** fuera del alcance. Lo opcional solo se hace si se pide.
- **Antes de código con decisiones de diseño**, propón alternativas con ventajas y desventajas y recomienda una.
- **Piezas pequeñas:** un caso de uso, un endpoint o una clase por vez.
- **Sé crítico:** señala riesgos, contradicciones y vacíos. No apruebes por cortesía.
- **Lo técnico se verifica** con documentación oficial (Express, Mongoose, MongoDB, React, Zod). Si no estás seguro de una API, dilo.
- **Coherencia:** requisitos, modelo de datos, diagramas y código deben decir lo mismo. Señala cualquier desajuste.
- **Nunca** leas ni escribas el `.env`, ni uses credenciales, ni datos reales de clientas. Usa datos de ejemplo.
- Mensajes al usuario en **español**. Respuestas breves y directas.

## Arquitectura: monolito modular
Una sola aplicación backend dividida en **módulos por carpeta** (`backend/src/modules/<modulo>/`). Cada módulo tiene sus propias piezas:
- **dominio:** clase con reglas que usan solo los datos de su objeto.
- **entidad:** esquema de Mongoose + `loadClass(dominio)` + modelo.
- **repositorio:** único que usa el modelo de Mongoose.
- **servicio:** casos de uso; orquesta dominio y repositorios.
- **controlador:** solo HTTP.
- **rutas:** el router del módulo.

Flujo: `ruta → (validación) → controlador → servicio → repositorio → entidad`.

**`app.routes.js` es la raíz de composición:** instancia repositorios, servicios y controladores, arma los routers y los monta bajo `/api`. Un módulo nuevo se registra ahí con el mismo patrón. `app.js` no se satura con rutas.

**Entre módulos:**
- Un servicio puede recibir por constructor el servicio o repositorio de otro módulo. **Nunca** importes archivos internos de otro módulo.
- **Sin dependencias circulares.** Si dos módulos se necesitan, el caso de uso va en el servicio que tenga más sentido y recibe al otro por constructor.
- Respeta el orden de instanciación en `app.routes.js`.

## Persistencia
- La entidad define los campos y valida la **forma** (tipos, `enum`, formato). El dominio valida las **transiciones** (estados). No repitas una en la otra.
- Las consultas a Mongoose van **solo en repositorios**. Los servicios y controladores no importan el modelo.
- El repositorio devuelve **documentos de Mongoose**, que ya traen los métodos del dominio. El servicio llama al método de dominio y luego a `repositorio.guardar(documento)`.
- Los cambios de estado de una cita se hacen **solo con los métodos de `Cita`**, nunca con `findByIdAndUpdate`.
- Los métodos de dominio modifican, **no guardan**. Si necesitas `await` o librerías externas (bcrypt, jsonwebtoken, crypto), va en el servicio.
- **No uses campos privados `#`** en las clases de dominio (fallan con `loadClass`).
- Valores fijos (estados, roles, canales) en `domain/enums.js`. No escribas esos textos a mano.

## Errores
- Lanza las clases de `errors/` (`ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`). El `ErrorMiddleware` los traduce a HTTP.
- Los servicios **lanzan** errores; los controladores no los capturan ni los formatean.
- En Express 5 los errores de controladores asíncronos llegan solos al manejador. Si en este proyecto no ocurre, avisa y propón un envoltorio, sin llenar todo de `try/catch`.
- Mensajes en español. En errores inesperados, mensaje genérico sin detalles técnicos. No incluyas URLs ni tokens en mensajes o logs.
- Zod valida la **entrada** (formato, campos obligatorios). Las reglas de negocio no van en Zod.

## Seguridad (en cada ruta nueva)
- Decide si es pública o privada y qué rol la usa (`autenticar`, `permitirRoles`).
- El rol **nunca** viene del cuerpo de la petición. El registro público siempre crea un `cliente`.
- Contraseñas con bcrypt. El token de la cita es aleatorio y solo se guarda su hash.
- No devuelvas `passwordHash` ni `tokenHash`.

## Cómo implementar un caso de uso
1. Confirma la funcionalidad (FN-XX) en `funcionalidades.md` y las reglas en `arquitectura-y-datos.md`.
2. Si hay una regla que usa solo datos del objeto, va en la clase de dominio.
3. Agrega al repositorio solo las consultas que necesites, con nombres que expresen la intención.
4. Implementa el caso de uso en el servicio y expónlo en controlador y ruta.
5. Prueba el caso normal, los de error y los límites. Resume qué probaste y qué no.
6. Actualiza la columna Estado de la FN. No cambies Origen ni Prioridad.
7. Rama `feature/N-nombre`, commits claros y Pull Request pequeño. **No hagas push a `main`.**

## Registro del uso de IA
Cuando una respuesta tuya cambie una decisión de diseño, propón una entrada para `docs/uso-de-ia/uso-de-ia.md` (workflow `/registrar-decision-ia`). El equipo la confirma; no escribas decisiones que no se tomaron.