## 1. Stack y estructura
- Node, Express 5, Mongoose, React. ES modules.
- **Backend: monolito modular.** Una sola aplicación dividida en módulos por carpeta; frontend (React) y base de datos (MongoDB) son componentes separados.
- Módulos previstos: auth/usuarios, clientes, profesionales, horarios, categorías, servicios, citas, ingresos y reportes, configuración. *(Ajustar a los que existan.)*
- Estructura por módulo (ejemplo; **seguir la nomenclatura real del código que se esta llevando acabo, tener en cuenta que ESTO ES UN EJEMPLO, PERO POR FAVOR, VE SIGUIENDO LA ESTRUCTURA REAL QUE SE ESTA LLEVANDO ACABO, USANDO LA MISMA CONVENCION QUE ESTAS ENCONTRANDO EN CADA UNO DE LOS ARCHIVOS DEL BACKEND. CONVENCION EN ESPAÑOL Y CAMEL CASE PARA LAS VARIABLES, COMO TE DIGO TEN EN CUENTA LO QUE SE ESTA HACIENDO HASTA EL MOMENTO**):

        backend/src/
        ├── modules/
        │   └── citas/
        │       ├── cita.domain.js        reglas del objeto (sin importar mongoose)
        │       ├── cita.entity.js        esquema + loadClass + modelo
        │       ├── cita.repository.js    único que usa el modelo
        │       ├── cita.service.js       casos de uso
        │       ├── cita.controller.js    solo HTTP
        │       └── cita.routes.js        router del módulo
        ├── errors/  middlewares/  config/  utils/
        ├── app.routes.js                 instancia dependencias y monta rutas
        ├── app.js  server.js

- **Flujo:** ruta, validación, controlador, servicio, repositorio, entidad.
- **`app.routes.js`:** instancia repositorios, servicios y controladores, arma los routers y los monta bajo `/api`.
- Errores: `AppError` y sus hijas; `ErrorMiddleware` único.

## 2. Dominio, entidad y repositorio
- El dominio no importa mongoose. Se une a la entidad con `schema.loadClass(Clase)`.
- La entidad valida la **forma**; el dominio valida las **transiciones**. No dupliques una en la otra.
- Un método va en el dominio si solo usa los datos de su objeto. Si consulta otras colecciones o usa librerías externas, va en el servicio.
- El repositorio es el único con acceso al modelo y devuelve documentos de Mongoose (con los métodos del dominio). El servicio llama al método de dominio y luego `repositorio.guardar(documento)`.
- Los métodos de dominio modifican, **no guardan**.
- No uses `#` en clases cargadas con `loadClass` (se probó que falla). Los getters pasan a ser virtuales.
- Horas como texto `"HH:mm"` con cero a la izquierda, `fecha` normalizada a medianoche UTC, zona `America/Bogota` para reportes.
- **Pendiente (docente de ISOO):** si un monolito modular cumple "arquitectura distinta a la monolítica". En el SAD se describe con exactitud: tres componentes (React, API, MongoDB) con un backend en módulos.

## Estado de implementación *(el equipo completa)*
| Módulo | Dominio | Entidad | Repositorio | Servicio (casos de uso) | Controlador y rutas |
|---|---|---|---|---|---|
| citas | Hecho | Hecho | Hecho | Hecho | Hecho |
| clientes | Hecho | Hecho | Hecho | Hecho | Hecho |
| profesionales | Hecho | Hecho | Hecho | Hecho | Hecho |
| horarios | Hecho | Hecho | Hecho | Hecho | Hecho |
| categorías | Hecho | Hecho | Hecho | Hecho | Hecho |
| servicios | Hecho | Hecho | Hecho | Hecho | Hecho |
| auth / usuarios | Hecho | Hecho | Hecho | Hecho | Hecho |
| ingresos y reportes | No iniciado | No iniciado | No iniciado | No iniciado | No iniciado |
| configuración | No iniciado | No iniciado | No iniciado | No iniciado | No iniciado |

**Entidades actuales:** 7 (usuarios, clientes, profesionales, horarios, categorías, servicios, citas). El mínimo del docente es 10; faltan ingresos, configuración y una tercera entidad por definir con el equipo.
**Nota:** el módulo `auth` conserva archivos duplicados en inglés (`auth.controller.js`, `auth.service.js`) que no se importan; `app.routes.js` usa `auth.controlador.js`, `auth.servicio.js` y `auth.rutas.js`.

## Cuenta de la clienta e historial
- La cuenta es **opcional**: `POST /citas/publica` sigue funcionando para invitadas.
- Si la petición trae sesión de rol `cliente`, la cita se vincula a esa cuenta; el id de la clienta sale del token, nunca del cuerpo.
- **Vínculo cuenta ↔ historial:** se resuelve en el primer acceso autenticado (`GET /clientes/mi-perfil` o `GET /citas/mis-citas`). Si existe una clienta con el mismo teléfono y nombre normalizados y sin `idUsuario`, se vincula; si no existe, se crea con los datos de la cuenta.
- **Riesgo aceptado:** sin verificación por SMS o correo, alguien que conozca el teléfono y el nombre exactos podría reclamar ese historial. La verificación real queda fuera de esta entrega y, si se requiere, debe registrarse como funcionalidad nueva.
- **Limitación conocida:** como el vínculo usa teléfono + nombre y el índice es único, dos cuentas distintas con los mismos datos no pueden reclamar historiales separados; la segunda recibe un conflicto.
- **Perfil editable:** nombre completo, teléfono y correo. Rol, estado y contraseña no se cambian desde el perfil.
- **Rutas del frontend:** `/cuenta` es pública (login y registro) y `/cuenta/perfil` es privada con rol `cliente`, dentro del layout público con navbar y footer.
- **Detalle y cancelación desde la cuenta:** cada cita del historial enlaza a `/cuenta/citas/:id`. Esa vista usa `GET /api/citas/mis-citas/:id` y el botón de cancelar usa `PATCH /api/citas/mis-citas/:id/cancelar`, ambos con `soloCliente`. La cita se busca por `_id` + `idCliente` resuelto desde el token; no se reutiliza el enlace público porque el token original no se guarda, solo su hash.
- **Endpoints:** `GET/PUT /api/clientes/mi-perfil`, `GET /api/citas/mis-citas`, `GET /api/citas/mis-citas/:id` y `PATCH /api/citas/mis-citas/:id/cancelar`, todos con la guardia `soloCliente`.