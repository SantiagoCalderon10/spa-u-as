# Negocio y alcance

*Última actualización: 28 de octubre de 2026. Exposición: 19 de noviembre de 2026.*

## 1. Contexto
- Proyecto académico de dos materias: **Ingeniería de Software OO** (documentación, POO, arquitectura no monolítica) y **Computación en el Cliente** (backend funcional con MERN; el docente pidió mínimo 10 entidades).
- Negocio real: un salón en Garzón (Huila). El sistema cubre **solo los servicios de uñas**. Los cortes los hacen dos barberos que manejan su agenda y su dinero por su cuenta.
- Equipo: una persona programa y gestiona el tablero; otra lleva la documentación. Ambos deben poder explicar todo.

## 2. Lo que dijo el negocio (entrevista del 6 de octubre)
- F1: agenda por WhatsApp, Facebook y llamadas. F2: anota en cuadernos y en el calendario del celular.
- F3: a veces olvida citas. F4: a veces asigna dos personas a la misma hora.
- F5: hay clientes que no llegan; no hay regla clara de cancelación.
- F6: la administradora también atiende uñas. F7: al agendar pide nombre, día, hora y un contacto.
- F8: quiere centralizar las citas y saber número de citas, servicios populares y control económico.
- F9: solo ella debería ver lo económico y cambiar precios y servicios.
- **Necesidad central:** centralizar las citas para no olvidar ni cruzar horarios.
- No se preguntó por la lista de precios ni por duraciones, y no se entrevistó a los barberos.

## 3. Roles y permisos
| Recurso | Cliente (cuenta opcional) | Profesional | Administrador |
|---|---|---|---|
| Servicios y horarios libres | Ver | Ver | Ver y gestionar |
| Agendar | Sí (sin cuenta o con ella) | No | Sí, a nombre de un cliente |
| Ver una cita | La suya (enlace o su historial) | Las suyas | Todas |
| Cancelar | Las suyas, sin límite de tiempo | Las suyas, con motivo | Cualquiera confirmada, con motivo |
| Editar y reprogramar | No | No | Sí (solo citas confirmadas) |
| Completar / no asistió | No | No | Sí |
| Profesionales, categorías, servicios | No | No | Gestionar |
| Ingresos y reportes | No | No | Ver |

- Las cuentas del personal las crea el administrador (el primero, un script de seed). **El registro público solo crea clientes.**
- La administradora también atiende: su usuario es administrador y además tiene un perfil de profesional.

## 4. Alcance
**Núcleo (se hace primero):** formulario público de agendamiento, enlace con token para ver y cancelar, evitar cruces, estados de la cita, panel del administrador (crear, editar, reprogramar, completar, cancelar), gestión de categorías, servicios y profesionales, vista del profesional, login del personal.

**Ampliación (en este orden, solo con el núcleo probado):**
1. Ingresos y reportes.
2. Cuenta opcional de cliente, con historial.
3. Descuento por fidelidad.
4. Opcionales: correo con enlace y recordatorio; anticipo simulado.

**Fuera del alcance:** cortes de cabello, tienda, inventario, pedidos, reseñas, cuentas de barberos, pagos reales, WhatsApp automático.

**Calendario:** S2 24 a 30 oct, S3 31 oct a 6 nov, S4 7 a 13 nov, cierre 14 a 19 nov. **Corte el 6 de noviembre**: si el núcleo no está probado, la ampliación se congela. Sin funciones nuevas desde el 10 de noviembre.

## 5. Decisiones vigentes
- La cita **nace confirmada**. La clienta cancela en cualquier momento (los 4 días hábiles quedan como mejora futura).
- El motivo de cancelación es obligatorio si cancela el profesional o el administrador, y opcional si cancela la clienta. La clienta lo ve en su enlace.
- La cita copia **nombre y precio del servicio**. Profesional y cliente van por referencia.
- Las especialidades de una profesional son **categorías**; atiende todos los servicios activos de ellas.
- Cliente sin cuenta: se identifica por **teléfono y nombre normalizados**. Mismo teléfono con otro nombre es otro cliente. El formulario público no autocompleta ni revela datos de otras clientas; solo se prellena con los datos de la cuenta que tiene sesión iniciada.
- Cuenta opcional: la clienta se liga al usuario por `idUsuario`. El vínculo inicial se resuelve una vez con **teléfono + nombre normalizados** para recuperar el historial de invitada; de ahí en adelante manda `idUsuario`.
- Descuento: tras N citas completadas, la siguiente tiene X% de descuento. N y X los configura el administrador. Se cuenta consultando citas completadas, sin contador guardado.
- Ingresos: un registro por cita completada, con el precio final. Los reportes se calculan sobre esos registros.

## 6. Decisiones pendientes
1. **Cuándo se cuenta el ingreso.** Recomendado: al marcar `completada`, y mostrar aparte los ingresos proyectados. *(Confirmar con el equipo.)*
2. Idioma de los nombres en el código (propuesta: dominio en español, infraestructura en inglés).
3. Si el docente de ISOO acepta funciones o exige clases (la arquitectura actual usa clases).
4. Qué cuenta como entidad en el mínimo de 10 (el docente de Computación en el Cliente).
5. Si el correo con recordatorio entra al MVP o queda como trabajo futuro.