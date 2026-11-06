# AGENTS.md - Contexto, Arquitectura y Decisiones del Sistema
## Proyecto: Three Masters Spa (Spa de Uñas)
**Asignatura:** Ingeniería de Software Orientada a Objetos (6° Semestre - USCO)  
**Propósito:** Este documento define la arquitectura, lineamientos de diseño, decisiones formales de requerimientos (ADRs) y trazabilidad para guiar a cualquier agente o desarrollador que trabaje en el proyecto.

---

## 1. Visión General del Proyecto y Stack Tecnológico

Three Masters Spa es una solución de software orientada a la gestión y agendamiento de citas, catálogo de servicios, control de profesionales y administración de un salón de belleza y spa de uñas.

* **Backend (`backend-spa-three-masters/`):**
  - **Runtime & Entorno:** Node.js (ES Modules `"type": "module"`).
  - **Framework:** Express 5.3 (`app.js`, `app.routes.js`).
  - **Base de Datos & ORM/ODM:** MongoDB con Mongoose 9.
  - **Autenticación & Criptografía:** JWT (`jsonwebtoken`) con expiración configurable, `bcryptjs` para hashing de contraseñas (10 rondas), `crypto` para tokens opacos SHA-256 de citas públicas.
  - **Pruebas:** `node --test` (runner nativo de Node.js).

* **Frontend (`frontend-spa-three-masters/`):**
  - **Librería & Herramientas:** React 19, Vite 8, React Router v7.
  - **Estilos:** CSS Modules y variables CSS temáticas.
  - **Cliente HTTP:** Axios con instancia personalizada (`axiosClient.js`) e interceptores para inyección de token JWT y detección de expiración (401).

---

## 2. Arquitectura de Software y Principios POO

El sistema aplica estrictamente principios de **Ingeniería de Software Orientada a Objetos (ISOO)** y patrones de diseño reconocidos:

```mermaid
graph LR
    Controlador["Controlador (HTTP)"] --> Servicio["Servicio (Lógica de Negocio)"]
    Servicio --> Dominio["Modelo de Dominio (Entidades POO)"]
    Servicio --> Repositorio["Repositorio (Abstracción de Datos)"]
    Repositorio --> Mongoose["Mongoose Models / MongoDB"]
```

1. **Inyección de Dependencias (Manual):**
   - Configurada centralizadamente en `backend-spa-three-masters/src/app.routes.js`.
   - Los repositorios se instancian primero y se inyectan en los servicios; los servicios se inyectan en los controladores.
2. **Patrón Modelo de Dominio (*Domain Model*):**
   - La lógica pura de negocio reside en clases de dominio POO independientes de la base de datos (ej. `src/modules/citas/models/domain/Cita.js`, `Servicio.js`, `Cliente.js`, `Hora.js`, `Fecha.js`).
   - Mongoose integra estas clases mediante `schema.loadClass(EntidadDominio)`.
3. **Patrón Repositorio (*Repository Pattern*):**
   - Aísla las consultas de Mongoose del resto de la aplicación (ej. `CitaRepositorio`, `ServicioRepositorio`, etc.).
4. **Manejo Centralizado de Errores Operacionales:**
   - Jerarquía basada en `AppError` (`src/shared/errors/AppError.js`):
     - `ValidationError` (400)
     - `UnauthorizedError` (401)
     - `ForbiddenError` (403)
     - `NotFoundError` (404)
     - `ConflictError` (409)
   - Capturados de forma global por `src/shared/middlewares/error.middleware.js`.

---

## 3. Decisiones de Requerimientos y Diseño (ADRs)

> [!IMPORTANT]
> Estas decisiones han sido aprobadas y constituyen la línea base del proyecto. Cualquier agente posterior **debe respetarlas y no proponer alternativas descartadas**.

### ADR-01: Canal y Flujos de Notificaciones
* **Decisión:** El canal de comunicación con el cliente es **exclusivamente WhatsApp**. Se descarta el envío de correos electrónicos (Nodemailer/SMTP) o SMS para evitar sobrecostos y fricción con los usuarios.
* **Flujos Requeridos:**
  1. **Agendamiento de Cita (Público / Registrado):**
     - *Cliente:* Recibe confirmación vía WhatsApp con los detalles de su cita y su enlace único con token personal (`/cita/:token`).
     - *Profesional:* Se le notifica vía WhatsApp / enlace directo cuando una nueva cita queda confirmada en su agenda.
  2. **Cancelación de Cita (por Administrador o Profesional):**
     - Se notifica al cliente a su número de WhatsApp registrado, informando que su cita fue cancelada y especificando el **motivo obligatorio** de cancelación.
  3. **Cancelación de Cita (por Cliente o Profesional):**
     - Se notifica de inmediato al Administrador para permitir la liberación y reprogramación de la agenda del salón.

### ADR-02: Estrategia de Pruebas de Software (Requisito Docente USCO)
* **Requisito del Docente:** Se debe evidenciar formalmente la verificación y validación del sistema mediante pruebas estáticas y, como mínimo, **pruebas unitarias dinámicas**.
* **Decisión de Implementación:**
  1. **Pruebas Estáticas:** Linters (`oxlint` en frontend y verificación de formato).
  2. **Pruebas Unitarias Backend:** Implementadas con el runner nativo de Node.js (`node --test`), sin dependencias pesadas adicionales.
  3. **Alcance de Pruebas Obligatorio:**
     - `Cita.js`: Validación de solapamiento (`seSolapaCon`), coherencia de horarios inicio/fin (`validarHorario`), transiciones válidas e inválidas de estado (`cancelar` con/sin motivo según rol, `reprogramar`, `completar`, `marcarNoAsistida`).
     - `Hora.js` y `Fecha.js`: Normalización UTC, clave YYYY-MM-DD, conversión a minutos, adición de duración y detección de fin de día.
     - `CitaServicio.js`: Cálculo de slots de disponibilidad (`obtenerDisponibilidad`) con mocks de repositorios de horarios y citas previas.

### ADR-03: Analíticas, Métricas y Descarte de Reportes Externos
* **Decisión:** **NO se generarán reportes exportables a PDF ni a Excel/CSV.**
* **Alcance Aprobado:**
  - El sistema mantendrá un **módulo analítico integrado en la UI** del Administrador (`ResumenAdminPage.jsx`):
    - Tarjetas de KPIs (citas de hoy, citas activas, canceladas, completadas y no asistió).
    - Estimaciones monetarias e ingresos recaudados y proyectados.
    - Filtros temporales dinámicos por **Semana**, **Mes** y **Año**.
    - Nivel de ocupación y distribución de carga por profesional.

---

## 4. Estructura de Roles y Accesos

| Rol | Alcance y Vistas | Permisos Clave |
| :--- | :--- | :--- |
| **Público / Invitado** | `/`, `/reservar`, `/cita/:token`, `/cuenta` | Consulta catálogo, revisa disponibilidad en tiempo real, reserva sin cuenta, gestiona o cancela su cita por token seguro. |
| **Cliente** | `/cuenta/perfil`, `/cuenta/citas/:id` | Gestiona su perfil (nombre, teléfono, correo), historial de citas propias y cancelación directa autenticada. |
| **Profesional** | `/profesional/agenda` | Consulta su agenda del día y fechas futuras, visualiza clientas y servicios asignados, cancela citas justificando motivo. |
| **Administrador** | `/admin/*` (`resumen`, `citas`, `servicios`, `categorias`, `profesionales`, `horarios`) | Control total, CRUD de catálogos y personal, reprogramación de citas, estadísticas con filtros temporales. |

---

## 5. Trazabilidad y Pendientes Técnicos (Backlog de Cierre)

Estado de las prioridades técnicas de cierre:

1. **Pruebas Unitarias (Backend):** ✅ **COMPLETADO**
   - Suite formal de 6 archivos implementada con `node --test` y `node:assert/strict`:
     - [`Hora.test.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/backend-spa-three-masters/test/Hora.test.js): validación, conversión y aritmética de horas.
     - [`Fecha.test.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/backend-spa-three-masters/test/Fecha.test.js): normalización UTC y claves.
     - [`Cita.test.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/backend-spa-three-masters/test/Cita.test.js): solapamientos, reglas de negocio de cancelación y transiciones de estado.
     - [`Cliente.test.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/backend-spa-three-masters/test/Cliente.test.js): sanitización y vinculación de cuenta.
     - [`Horario.test.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/backend-spa-three-masters/test/Horario.test.js): cobertura de turnos y solapamiento laboral.
     - [`Servicio.test.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/backend-spa-three-masters/test/Servicio.test.js): cálculo de hora fin y precios.

2. **Filtros Temporales en Dashboard Admin:** ✅ **COMPLETADO**
   - Implementado en [`ResumenAdminPage.jsx`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/frontend-spa-three-masters/src/pages/admin/ResumenAdminPage.jsx) y [`ResumenAdmin.module.css`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/frontend-spa-three-masters/src/pages/admin/ResumenAdmin.module.css).
   - Selector reactivo segmentado: **Esta semana**, **Este mes**, **Este año** e **Histórico**.
   - Recalcula dinámicamente: KPIs superiores (citas del período, confirmadas, completadas, ingresos recaudados), distribución porcentual por estado y ranking de servicios más solicitados.

3. **Notificaciones WhatsApp (Pendiente de Cierre):**
   - Mantener y extender los generadores de enlaces de WhatsApp en el frontend / utilitarios para los flujos de:
     - Aviso de nueva cita a la profesional al agendar.
     - Aviso de cancelación con motivo a la clienta.
     - Aviso de cancelación al administrador.

4. **Calendario Interactivo en el Panel de Citas:** ✅ **COMPLETADO**
   - Implementado en [`CalendarioFiltroCitas.jsx`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/frontend-spa-three-masters/src/components/admin/CalendarioFiltroCitas.jsx).
   - Conserva el lenguaje visual del calendario de agendamiento público (días circulares, navegación mensual y acento vino) adaptado a los tokens del panel.
   - Se ubica a la izquierda del panel de citas; al elegir un día actúa como filtro (conmutador) y la tabla muestra ese día en orden cronológico. Sin selección se listan todas las citas, también en orden cronológico.
   - Marca con un punto los días con citas, muestra el total del mes y ofrece atajos **Hoy** y **Ver toda la agenda**. Convive con el buscador y los filtros de estado y fecha existentes.

5. **Subida de Imágenes del Catálogo y del Equipo:** ✅ **COMPLETADO**
   - Backend: módulo `src/modules/uploads/` con `multer` (memoria, máx. 5 MB, solo JPG/PNG/WEBP/AVIF) y `cloudinary` como almacenamiento persistente; ruta `POST /api/uploads` protegida con `guardia.soloAdministrador`. Devuelve `{ url }` y exige `carpeta` (`servicios` | `profesionales`).
   - Frontend: [`uploadService.js`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/frontend-spa-three-masters/src/api/uploadService.js) y [`CampoImagen.jsx`](file:///c:/Users/ASUS/Documents/USCO/6%20SEMESTRE/Ingenieria%20de%20Sotfware%20Orientada%20a%20Objetos/Proyecto%20Final/spa-uñas/frontend-spa-three-masters/src/components/admin/CampoImagen.jsx) con arrastrar-y-soltar, vista previa, progreso y validación en cliente.
   - Reemplaza los campos de URL en `ServicioFormulario.jsx` y `ProfesionalFormulario.jsx`; `urlFoto` sigue siendo un `String`, por lo que el catálogo, el equipo y las tablas del panel no requieren cambios.
   - Variables requeridas: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (documentadas en `backend-spa-three-masters/.env.example`).


