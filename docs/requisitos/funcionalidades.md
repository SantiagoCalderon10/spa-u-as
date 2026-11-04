# Funcionalidades

**Origen:** *Entrevista* (lo dijo la administradora) o *Equipo* (decisión nuestra). **Prioridad:** M debe, S debería, C podría.
Estado: `Pendiente`, `En curso`, `Hecho`, `Posterior`.

| ID | Funcionalidad | Rol | Origen | Prio | Estado |
|---|---|---|---|---|---|
| FN-01 | Ver servicios por categoría | Público | Equipo | M | Hecho |
| FN-02 | Ver profesionales que atienden un servicio y horarios libres | Público | Equipo | M | Hecho |
| FN-03 | Agendar con formulario sin cuenta | Público | Entrevista (F7) + Equipo | M | Hecho |
| FN-04 | Enlace único para ver y cancelar la cita | Público | Equipo | M | Hecho |

| FN-06 | Evitar citas que se solapen | Sistema | Entrevista (F4) | M | Hecho |
| FN-07 | Guardar los datos de la cita y calcular la hora de fin | Sistema | Entrevista (F3, F7) | M | Hecho |
| FN-08 | Ver todas las citas y su estado | Administrador | Entrevista (F1, F2, F8) | M | Hecho |

| FN-10 | Editar y reprogramar una cita confirmada | Administrador | Equipo | M | Hecho |
| FN-11 | Cancelar con motivo, completar o marcar no asistió | Administrador | Entrevista (F5) | M | Hecho |
| FN-12 | Gestionar categorías y servicios (precios, descripciones) | Administrador | Entrevista (F9) | M | Hecho |
| FN-13 | Gestionar profesionales (cuenta, especialidades, horarios) | Administrador | Equipo | M | Hecho |
| FN-14 | Ver sus citas y cancelar con justificación | Profesional | Equipo | M | Hecho |
| FN-15 | Login del personal con roles | Personal | Entrevista (F9, deducido) | M | Hecho |
| FN-16 | Registrar un ingreso al completar una cita | Sistema | Entrevista (F8) | S | Pendiente |
| FN-17 | Reportes: por día, número de citas, resumen financiero histórico | Administrador | Entrevista (F8) | S | Pendiente |
| FN-18 | Registro y login de clientes (cuenta opcional) | Cliente | Equipo | S | Hecho |
| FN-19 | Historial de citas y formulario prellenado | Cliente | Equipo | S | Hecho |
| FN-20 | Descuento por fidelidad configurable | Cliente / Admin | Equipo | C | Pendiente |
| FN-21 | Correo con el enlace y recordatorio | Sistema | Equipo | C | Posterior |
| FN-22 | Anticipo simulado | Cliente | Equipo | C | Posterior |
| FN-23 | Ingresos proyectados (citas confirmadas futuras) | Administrador | Equipo | C | Posterior |
| FN-24 | Ver el detalle y cancelar una cita desde la cuenta | Cliente | Equipo | S | Hecho |

**Fuera del alcance:** cortes, tienda, inventario, pedidos, reseñas, cuentas de barberos, pagos reales, WhatsApp automático.
**Regla:** el agente actualiza la columna Estado al terminar una funcionalidad, pero no cambia Origen ni Prioridad sin que el equipo lo pida.
**Actualización 2026-11-02:** FN-01 a FN-15 tienen implementación completa; queda pendiente la prueba manual de extremo a extremo.
**Actualización 2026-11-03:** FN-18 y FN-19 quedan implementadas (backend y UI). El historial se vincula por teléfono + nombre exactos al primer acceso autenticado; la verificación por SMS o correo queda fuera de esta entrega. Sigue pendiente la prueba manual en navegador y la reserva como invitada debe seguir funcionando.
**Actualización 2026-11-04:** FN-24 implementada. El detalle y la cancelación desde la cuenta se resuelven con el id de la cita y el `idCliente` del token, no con el enlace público: el token original no se guarda, solo su hash.