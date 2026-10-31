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
| citas | | | | | |
| clientes | | | | | |
| profesionales | | | | | |
| horarios | | | | | |
| categorías | | | | | |
| servicios | | | | | |
| auth / usuarios | | | | | |
| ingresos y reportes | | | | | |
| configuración | | | | | |