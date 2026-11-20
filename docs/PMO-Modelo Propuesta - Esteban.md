**La oficina de proyectos PMO** 

# **Propuesta de servicios profesionales** 

**_Three Masters Fecha: dd/11/2026_** 

## **Tabla de contenido** 

|Historial de Versiones|3|
|---|---|
|Información del Proyecto|3|



La oficina de proyectos de informática 

Página 1 

**La oficina de proyectos PMO** 

|Resumen Ejecutivo|4|
|---|---|
|Nuestro entendimiento|5|
|Objetivos|6|
|Alcance|7|
|Entregables|8|
|Plan de trabajo|9|
|Personal y recursos|10|
|Premisas y consideraciones|11|
|Herramientas y metodologías|12|
|Capacidades técnicas|13|
|Honorarios|14|
|Acerca de la empresa|15|



## **Historial de versiones** 

|**Fecha**|**Versión**|**Autor**|**Organización**<br>**Descripción**|
|---|---|---|---|



## **Información del proyecto** 

La oficina de proyectos de informática 

Página 2 

**La oficina de proyectos PMO** 

|Empresa / Organización|Three Masters (Spa de uñas, peluquería y<br>barberia), Barrio Rodrigo Lara, Cl. 1 Sur #12-08,<br>Garzón, Huila|
|---|---|
|Proyecto|Sistema de gestión de citas web del salón de uñas<br>Three Masters.|
|Fecha de preparación|6 de octubre del 2026|
|Cliente|Three Masters, representado por su dueña y<br>administradora, Maryuri Cediel|
|Gerente / Líder de proyecto|Estudiante Santiago Calderón Almario|



## **Resumen ejecutivo** 

El presente documento es la propuesta que el equipo de desarrollo conformado por los estudiantes Santiago Calderón Almario y Carlos Esteban Anacona Gonzalez, del programa de Ingeniería de Software de la Universidad Surcolombiana, presenta a Three Masters, spa de uñas, peluquería y barbería ubicado en Garzón, Huila, representado por su dueña y administradora, Maryuri Cediel. La propuesta se emite en el marco del proyecto final de la asignatura 

La oficina de proyectos de informática 

Página 3 

**La oficina de proyectos PMO** 

Ingeniería de Software Orientada a Objetos, un trabajo académico construido a partir de un negocio real, cuyo resultado se expondrá en el evento INNOVASOFT IX el 19 de noviembre. 

La necesidad expresada en la entrevista realizada el 6 de octubre de 2026, la administradora explicó que hoy agenda las citas por WhatsApp, Facebook y llamadas, y las anota en cuadernos y en el calendario del celular. En días de alta demanda ha olvidado citas, no ha anotado otras y ha asignado a dos personas la misma hora; además, algunas clientas no llegan y se pierde el espacio. Su necesidad central es centralizar las citas y digitalizar el agendamiento, para no olvidarlas ni cruzar horarios. 

La propuesta propone el desarrollo de un sistema de gestión de citas web para los servicios de uñas (manicure y pedicure). Su objetivo es que el salón maneje todas sus citas en un solo lugar y que las clientas puedan agendar en línea. En su primera versión, un producto mínimo viable (MVP), el sistema permitirá que: 

- El cliente consulta los servicios y horarios libres, agenda sin crear cuenta y consulte o cancele su cita con un enlace único. 

- <mark>El profesional vea sus citas y pueda cancelarlas dejando una justificación.</mark> 

- ● El administrador vea todas las citas, las marque como completadas, no asistidas canceladas, y gestione servicios, precios y profesionales; 

- El sistema impida que se registren dos citas que se solapen para el mismo profesional. 

Quedan fuera del MVP los cortes de cabello, la tienda de productos, el inventario, los pedidos, las reseñas, las cuentas para barberos, los pagos reales y los mensajes automáticos por WhatsApp. Esta decisión obedece al tiempo disponible y no a un rechazo del negocio. La administradora también mencionó el interés en conocer cuántas citas hay, qué servicios son los más solicitados y tener un control económico, el cual actualmente no está incluido en el MVP. El equipo realizó el levantamiento de información directamente con la administradora, y separará en la documentación lo que el negocio pidió de lo que el equipo decidió. El sistema se construirá con el stack MERN (React, Node.js con Express y MongoDB), en una arquitectura distinta de la monolítica, con documentación y seguimiento en una plataforma colaborativa, según lo exige el proyecto. 



La oficina de proyectos de informática 

Página 4 

**La oficina de proyectos PMO** 



## **Nuestro entendimiento** 

#### **<mark>1. El negocio y su forma de trabajar</mark>** 

Three Masters es un spa de uñas, peluquería y barbería ubicado en el barrio Rodrigo Lara, en Garzón, Huila. Trabajan tres personas. La dueña y administradora, Maryuri Cediel, gestiona el negocio, atiende los servicios de manicure y pedicure, y además realiza cortes de cabello. Otros dos trabajadores se dedican exclusivamente a los cortes, cada uno en su propio espacio. 

Las ganancias no se centralizan, cada trabajador cobra el trabajo que hace, y los servicios de la administradora son únicamente de ella. Por eso, la gestión de citas de uñas depende de una sola persona, que además atiende clientas y clientes. 

#### **2. Cómo se gestionan hoy las citas** 

Según la entrevista del 6 de octubre de 2026, un día normal empieza cuando la administradora prepara su agenda, que está en libretas o en el calendario del celular. Las solicitudes llegan por WhatsApp, Facebook y llamadas. Al agendar pide el nombre, el día, la hora exacta y un dato de contacto para avisar de 

La oficina de proyectos de informática 

Página 5 

**La oficina de proyectos PMO** 

cualquier percance. También atiende a personas que llegan sin cita (si hay disponibilidad, se les atiende). 

En los cortes, los clientes de cada barbero lo llaman directamente. Quien tiene cita tiene prioridad sobre quien llega, y los demás se atienden por orden de llegada. 

#### **3. Problemas identificados** 

|**Problema**|**Lo expresado por la administradora**|
|---|---|
|Citas olvidadas o sin anotar|En días de alta demanda se le ha<br>olvidado alguna cita o no ha anotado<br>una que le habían hecho|
|Horarios cruzados|A veces le he asignado a dos personas<br>una cita a la misma hora, sobre todo en<br>fechas especiales o cuando hay<br>eventos cercanos|
|Inasistencias|Algunas clientas no llegan y se pierde<br>la posibilidad de ocupar ese espacio|
|Sin regla clara de cancelación|Si alguien cancela, se libera el espacio,<br>pero no hay una regla definida|
|Información dispersa|Cuadernos, calendarios y varios<br>canales de mensajería; no hay un lugar<br>único donde ver las citas|



#### **4. Cómo estructuramos la necesidad** 

Necesidad central expresada por la administradora. Centralizar la información de las citas y organizar mejor el agendamiento, para no olvidarlas ni cruzar horarios, sin depender de tantos canales independientes. 

|**Necesidad**|**Cómo lo atiende a propuesta**|
|---|---|
|Centralizar las citas en un solo medio<br>digital|Sistema web de gestión de citas|
|Evitar olvidos y cruces de horario|El sistema no permite dos citas solapadas<br>para la misma profesional|



La oficina de proyectos de informática 

Página 6 

**La oficina de proyectos PMO** 

|Pedir los datos que hoy solicita (nombre,<br>día, hora, contacto)|Formulario de agendamiento|
|---|---|
|Que solo ella (administradora) gestione<br>precios y servicios|Acceso restringido por rol|
|Reducir el trabajo de agendar por<br>mensajes|Agendamiento en línea por parte de la<br>clienta, sin cuenta|



#### **5. Interesados** 

|**Interesados**|**Relación con el sistema**|
|---|---|
|Maryuri Cediel (administradora)|Cliente del proyecto y usuaria con más<br>funciones|
|Profesionales de uñas|Usuarias con sesión; ven sus citas y<br>pueden cancelarlas|
|Clientes|Usuarios finales|
|Equipo de desarrollo|Responsable de analizar, diseñar y<br>construir la solución|
|Universidad Surcolombiana|Evalúa el trabajo y define las condiciones<br>del proyecto|



#### **6. Por qué estamos en buena posición para ayudar** 

Esta propuesta nace de una conversación directa con la administradora y de la observación de su operación actual, no de un supuesto imaginario. El equipo separó lo que el negocio pidió de lo que decidió por su cuenta, y delimitó un alcance realista para solucionar la necesidad debido al tiempo disponible. Lo que se construirá responde a los problemas que la administradora describió, con una primera versión pequeña pero completa y funcional que puede crecer con el tiempo. 

La oficina de proyectos de informática 

Página 7 

**La oficina de proyectos PMO** 

## **Objetivos** 

#### **Objetivo general** 

Desarrollar una aplicación web que centralice el agendamiento de citas del servicio de uñas de Three Masters, para que la administradora no olvide citas ni cruce horarios, y para que los clientes puedan agendar en línea con más facilidad y seguridad. 

#### **Objetivos específicos** 

#### **OE1. Centralizar el agendamiento de citas en un solo medio digital** 

- **Qué haremos:** Construiremos un flujo en el que la clienta consulte los servicios por categoría, elija una profesional y un horario libre, deje su nombre, teléfono y correo, y obtenga un enlace único para consultar o cancelar su cita. No tendrá que crear una cuenta. 

- **Beneficio:** Las citas dejan de repartirse entre WhatsApp, Facebook, llamadas, cuadernos y calendarios. La administradora ya no depende de atender cada solicitud mensaje por mensaje, y cada cita queda registrada con los datos que hoy pide: nombre, día, hora y contacto. 

- **Cómo sabremos que se logró:** Toda cita agendada en línea queda guardada con servicio, profesional, fecha, hora y datos de contacto, y la clienta puede volver a verla con su enlace. 

#### **OE2. Evitar los cruces de horario y las citas sin registrar** 

La oficina de proyectos de informática 

Página 8 

**La oficina de proyectos PMO** 

- **Qué haremos:** Aplicaremos una regla que impide registrar dos citas que se solapen para el mismo profesional. El sistema comprobará la disponibilidad en el momento de confirmar, incluso si dos clientas intentan reservar el mismo horario al mismo tiempo. 

- **Beneficio:** Desaparece la asignación de dos personas a la misma hora, un problema que la administradora vive en fechas especiales y de alta demanda. Además, una cita confirmada queda guardada, por lo que ya no depende de que se anote a mano. 

- **Cómo sabremos que se logró:** En las pruebas, el sistema rechaza toda reserva que se solape con otra de la misma profesional. 

#### **OE3. Dar a la administradora una vista completa y ordenada de las citas** 

- **Qué haremos:** Permitiremos al administrador ver todas las citas de todas los profesionales con su estado y marcarlas como completadas, canceladas o no asistidas. 

- **Beneficio:** Tendrá en un solo lugar la información de cada cita, sin revisar cuadernos. Además, quedará registro de las clientas que no llegaron, algo que hoy no se documenta. 

- **Cómo sabremos que se logró:** El administrador puede consultar cualquier cita y cambiar su estado desde el sistema. 

#### **OE4. Facilitar la actualización de servicios, precios y profesionales** 

- **Qué haremos:** Permitiremos al administrador gestionar los servicios (precio, descripción y categoría) y las profesionales (cuenta, servicios que realizan y horarios). 

- **Beneficio:** Solo la administradora controla los precios y servicios, como ella pidió, y puede actualizarlos cuando quiera. Los horarios de cada profesional determinan los espacios que se ofrecen a las clientas. 

- **Cómo sabremos que se logró:** Un cambio de precio o de horario hecho por el administrador se refleja de inmediato en lo que ve la clienta. 

#### **OE5. Apoyar a las profesionales y proteger la información según el rol** 

- **Qué haremos:** Daremos acceso con inicio de sesión a profesionales y administrador. Cada profesional verá solo sus citas y podrá cancelarlas dejando una justificación. 

- **Beneficio:** Cada persona ve únicamente lo que le corresponde, y las cancelaciones quedan justificadas y liberan el espacio para otra clienta. 

- **Cómo sabremos que se logró:** Una profesional no puede ver ni cancelar citas de otra, y las funciones de administración no están disponibles para quien no tenga ese rol. 

#### **Relación con las necesidades** 

La oficina de proyectos de informática 

Página 9 

**La oficina de proyectos PMO** 

|**Objetivo**|**Problema o**<br>**necesidad**|**Origen**|**Funcionalidades**|**Requerimientos**<br>**funcionales**|
|---|---|---|---|---|
|OE1|Información<br>dispersa,<br>centralizar las citas|Entrevista|1 a 5|7.1 a 7.4|
|OE2|Citas olvidadas y<br>horarios cruzados|Entrevista|14 y 15|7.3 y 7.10|
|OE3|Ver la información<br>de cada cita sin<br>depender de<br>varios canales|Entrevista|10 y 11|7.7|
|OE4|Solo ella<br>(administradora)<br>cambia precios y<br>servicios|Entrevista|12 y 13|7.8 y 7.9|
|OE5|Control de acceso,<br>cancelación con<br>justificación|Equipo de<br>desarrollo|6 a 8 y 16|7.5 y 7.6|



## **Alcance** 

El alcance de este proyecto es el producto mínimo viable (MVP) de un sistema de gestión de citas web para los servicios de uñas (manicure y pedicure) de Three Masters. Se organiza por los objetivos específicos de la propuesta. 

#### **1. Alcance por objetivo** 

1.1 OE1 centralizar el agendamiento de citas en un solo medio digital 

Se realizará: 

- Catálogo de servicios agrupados por categoría, con descripción y precio. 

- Consulta de profesionales por servicio y de sus horarios libres. 

- Agendamiento sin cuenta, con nombre y teléfono. 

- Enlace único por cita para consultarla y cancelarla. 

|**Indicador**|**Cantidad**|
|---|---|
|Funcionalidades|5 (de la 1 a la 5 de la sección 4 del|



La oficina de proyectos de informática 

Página 10 

**La oficina de proyectos PMO** 

||documento de requerimientos)|
|---|---|
|Pantallas|5 (C-01 a C-05)|
|Requerimientos funcionales|21 (bloques 7.1 a 7.4)|
|Clase de usuario atendida|Clientes, sin inicio de sesión|



1.2 OE2 evitar cruces de horario y citas sin registrar 

### **Se realizará:** 

- Regla que impide dos citas solapadas para un mismo profesional. 

- ● Verificación de disponibilidad al confirmar, incluso con reservas simultáneas. 

- Manejo de cuatro estados de cita (confirmada, completada, no asistió y cancelada) y de sus transiciones permitidas. 

|**Indicador**|**Cantidad**|
|---|---|
|Funcionalidades|2 (14 y 15)|
|Pantallas|5 (bloque 7.10)|
|Requerimientos funcionales|4|
|Clase de usuario atendida|0 (es una regla del servidor)|



1.3 OE3 dar a la administradora una vista completa de las citas 

### **Se realizará:** 

- Listado de todas las citas de todas las profesionales, con filtros. 

- Detalle de cada cita. 

- Cambio de estado a completada o no asistió. 

|**Indicador**|**Cantidad**|
|---|---|
|Funcionalidades|2 (10 y 11)|



La oficina de proyectos de informática 

Página 11 

**La oficina de proyectos PMO** 

|Pantallas|2 (A-02 y A-03)|
|---|---|
|Requerimientos funcionales|4 (bloque 7.7)|



1.4 OE4 facilitar la actualización de servicios, precios y profesionales 

Se realizará: 

- Alta, edición de servicios. 

- Alta y edición de profesionales: Cuenta, servicios que realizan y horarios. 

- Carga inicial de los servicios y precios tomados de las redes del salón. 

|**Indicador**|**Cantidad**|
|---|---|
|Funcionalidades|2 (12 y 13)|
|Pantallas|2 (A-04 y A-05)|
|Requerimientos funcionales|12 (bloques 7.8 y 7.9)|
|Servicios y categorías cargados|Por definir (depende de lo publicado en<br>las redes sociales)|



1.5 OE5 apoyar a los profesionales y proteger la información según el rol 

Se realizará: 

- Inicio y cierre de sesión para profesionales y administrador, con una sola pantalla de acceso. 

- Control de permisos por rol, verificado en el servidor. 

- Vista de citas propias para la profesional, con cancelación obligatoriamente justificada. 

|**Indicador**|**Cantidad**|
|---|---|
|Funcionalidades|2 (6, 7, 8, 9 y 16)|
|Pantallas|3 (A-01, P-01, P-02 y P-03)|
|Requerimientos funcionales|11 (bloques 7.5 y 7.6)|



La oficina de proyectos de informática 

Página 12 

**La oficina de proyectos PMO** 

|Roles con inicio de sesión|2 (profesional y administrador)|
|---|---|
|Cuentas de profesional|Por definir|



#### **2. Resumen cuantitativo del producto** 

|**Concepto**|**Cantidad**|
|---|---|
|Objetivos específicos|5|
|Clases de usuario|3|
|Funcionalidades|16|
|Pantallas distintas|13|
|Requerimientos funcionales|52|
|Reglas de negocio|22 (EN PROCESO LA 22)|
|Requerimientos no funcionales|23|
|Entidades de datos|7 (usuario, categoría, servicio,<br>profesional, cliente, horario y cita)|
|Componentes técnicos|3 (interfaz en React, servidor en<br>Node/Express y base de datos<br>MongoDB)|



#### **3. Alcance del trabajo de ingeniería y documentación** 

#### **Reuniones con el negocio:** 

|**Actividad**|**Realizado**|**Estado**|
|---|---|---|
|Entrevista de levantamiento con<br>la administradora|6 de octubre de 2026|Realizada|
|Reunión de validación del<br>entendimiento y de los<br>requisitos|(COMPLETAR)|Pendiente|
|Revisión del prototipo|(COMPLETAR)|Pendiente|



La oficina de proyectos de informática 

Página 13 

**La oficina de proyectos PMO** 

|Prueba de aceptación y|(COMPLETAR)|Pendiente|
|---|---|---|
|demostración con la|||
|administradora|||



#### **Entregables del proyecto (exigidos por el parcial):** 

|**Número**|**Entregable**|
|---|---|
|1|Documento del proceso de desarrollo|
|2|Prototipo en Figma|
|3|Propuesta|
|4|Documento de requerimientos|
|5|Historias de usuario|
|6|Pila del producto|
|7|Lista de tareas|
|8|Documento de arquitectura (SAD)|
|9|Cuatro diagramas UML: clases, secuencia, componentes y actividades|
|10|Documento explicativo de la lógica de los datos (MongoDB no es<br>relacional)|
|11|Apartado sobre el uso de inteligencia artificial, si el desarrollo se apoya en<br>ella|



#### **4. Puntos fuera del alcance** 

Excluidos por el tiempo disponible (no por rechazo del negocio) 

|**Tema**|**Fuente**|
|---|---|
|Cortes de cabello|Documento de contexto|
|Tienda de productos, inventario y pedidos|Documento de contexto|
|Reseñas|Documento de contexto|
|Cuentas para los barberos|Documento de contexto|
|Pagos reales|Documento de contexto|



La oficina de proyectos de informática 

Página 14 

**La oficina de proyectos PMO** 

|Mensajes automáticos por WhatsApp|Documento de contexto|
|---|---|



La oficina de proyectos de informática 

Página 15 

**La oficina de proyectos PMO** 

## **Plan de trabajo** 

#### **<mark>1. Enfoque</mark>** 

El trabajo se empieza a realizar desde el 6 de octubre, ejecutando la entrevista y se da paso al levantamiento de requerimientos. Se ejecuta la solución de los entregables del proyecto en cuatro semanas, del 22 de octubre al 19 de noviembre de 2026, con construcción incremental. Primero lo indispensable (prioridad alta del documento de requerimientos) y después lo complementario. El detalle del proceso de desarrollo se presenta en su entregable correspondientes ciclos semanales. Los responsables de cada actividad se asignan según los roles definidos por el equipo de desarrolladores, los estudiantes Santiago Calderón Almario y Carlos Esteban Anacona Gonzalez. 

#### **2. Fases** 

|**Fase**|**Propósito**|**Semanas**|
|---|---|---|
|1. Análisis y<br>planeación|Cerrar y validar requisitos, resolver decisiones<br>pendientes, organizar el trabajo|1|
|2. Diseño|Prototipo, arquitectura, diagramas y modelo de<br>datos|1 a 2|
|3. Construcción|Desarrollo de la interfaz, el servidor y la base<br>de datos|2 a 4|
|4. Pruebas y<br>ajustes|Verificar reglas críticas, corregir y validar con la<br>administradora|3 a 4|
|5. Cierre y<br>exposición|Documentación final, repaso y exposición en<br>INNOVASOFT IX|4|



#### **3. Plan semanal** 

##### **3.1 Semana 1,  Análisis y planeación (jueves 22 a miércoles 28 de octubre)** 

### **Actividades:** 

- Terminar la propuesta y el documento de requerimientos. 

- Resolver las decisiones pendientes: Reportes, registro manual de citas, momento del estado, duración de los servicios y número de profesionales. 

- <mark>Reunión de validación con la administradora.</mark> 

- <mark>Definir proceso de desarrollo, roles, repositorio y plataforma colaborativa.</mark> 

La oficina de proyectos de informática 

Página 16 

**La oficina de proyectos PMO** 

- <mark>Redactar historias de usuario y la pila del producto.</mark> 

- <mark>Ajustar el diagrama de clases.</mark> 

**Entregables:** Propuesta, documento de requerimientos, historias de usuario, pila del producto, documento del proceso (versión inicial) y repositorio configurado. 

**3.2 Semana 2, Diseño y arranque (jueves 29 de octubre a miércoles 4 de noviembre)** 

### **Actividades:** 

- Prototipo en Figma, empezando por el flujo del cliente. 

- Documento de arquitectura (SAD), diagramas UML (clases, secuencia, componentes y actividades) y documento de la lógica de los datos. 

- <mark>● Lista de tareas.</mark> 

- Preparación del entorno: Proyectos de interfaz y servidor, conexión a MongoDB y estructura base. 

- <mark>Revisión del prototipo con la administradora.</mark> 

**Entregables:** Prototipo, SAD, cuatro diagramas, lógica de datos y lista de tareas. 

**3.3 Semana 3, Construcción del núcleo (jueves 5 a miércoles 11 de noviembre)** 

### **Actividades, en este orden por dependencia:** 

1. Autenticación y roles. 

2. Gestión de profesionales y horarios _(sin esto no hay horarios libres que mostrar)_ y carga inicial de servicios. 

<mark>3. Catálogo, disponibilidad y agendamiento con control de cruces.</mark> 

<mark>4. Consulta y cancelación por enlace único.</mark> 

<mark>5. Listado y cambio de estado de citas del administrador.</mark> 

**Entregable:** Versión del sistema que permite agendar una cita de principio a fin. 

**3.4 Semana 4, Complemento, pruebas y cierre (jueves 12 a miércoles 18 de noviembre)** 

### **Actividades:** 

- Funciones de prioridad media: Citas del profesional, edición de servicios y precios. 

- Pruebas de las reglas críticas (cruces de horario y permisos por rol) y de los requerimientos de prioridad alta. 

- <mark>Prueba de aceptación y demostración con la administradora.</mark> 

- <mark>Correcciones.</mark> 

- Documentación final, incluido el apartado sobre el uso de inteligencia artificial, si aplica. 

- <mark>Repaso de la exposición.</mark> 

La oficina de proyectos de informática 

Página 17 

**La oficina de proyectos PMO** 

**<mark>Entregables:</mark>** <mark>Sistema probado, documentación final completa.</mark> 

#### **4. Vista general** 

|**Actividad**|**Semana 1**|**Semana 2**|**Semana  3**|**Semana 4**|
|---|---|---|---|---|
|Propuesta y<br>requisitos|X||||
|Reuniones<br>con la<br>administrador<br>a|X|X||X|
|Proceso, roles<br>y repositorio|X||||
|Historias y<br>pila del<br>producto|X||||
|Prototipo<br>(Figma)||X|||
|SAD, UML y<br>lógica de<br>datos||X|||
|Lista de<br>tareas||X|||
|Construcción<br>(inicio)||X|X||
|Construcción<br>(finalización)||||X|
|Pruebas y<br>ajustes|||X|X|
|Documentació<br>n final||||X|
|Repaso y<br>exposición||||X|



La oficina de proyectos de informática 

Página 18 

**La oficina de proyectos PMO** 



#### **5. Plan de hitos** 

|**Hito**|**Fecha**|**Verificación**|
|---|---|---|
|H1 requisitos validados|miércoles 28 de<br>octubre|La administradora confirmó el alcance;<br>decisiones pendientes resueltas; pila<br>del producto lista|
|H2 diseño aprobado|miércoles 4 de<br>noviembre|Prototipo revisado con la<br>administradora; SAD y diagramas<br>completos; entorno de desarrollo listo|
|H3 Inicio funcionando|miércoles 11 de<br>noviembre|Se puede agendar una cita de<br>principio a fin y el sistema rechaza los<br>cruces de horario|
|H4 MVP completo y<br>probado|martes 17 de<br>noviembre|Funciones de prioridad alta y media<br>terminadas; no se agregan<br>funcionalidades nuevas|
|H5 documentación y<br>ensayo|miércoles 18 de<br>noviembre|Los 11 entregables completos;<br>exposición repasada|
|H6 exposición|jueves 19 de<br>noviembre|INNOVASOFT IX|



#### **6. Entregables en el tiempo** 

|**Número**|**Entregable**|**Semana de entrega**|
|---|---|---|
|1|Documento del proceso de desarrollo|Semana 1 inicial y final<br>en semana 4|
|2|Prototipo (Figma)|Semana 2|
|3|Propuesta|Semana 1|
|4|Documento de requerimientos|Semana 1 (v1.0) y<br>ajustes hasta semana 4|
|5|Historias de usuario|Semana 1|



La oficina de proyectos de informática 

Página 19 

**La oficina de proyectos PMO** 

|6|Pila del producto|Semana 1 y se actualiza<br>cada semana|
|---|---|---|
|7|Lista de tareas|Semana 2 y se actualiza<br>cada semana|
|8|SAD|Semana 2|
|9|Diagramas UML (4)|Semana 2|
|10|Lógica de los datos|Semana 2|
|11|Apartado sobre IA (si aplica)|Se va registrando desde<br>semana 1 y final en<br>semana 4|





## **Personal y recursos** 

#### **<mark>1. Perfil del equipo</mark>** 

El proyecto lo desarrolla un equipo de dos estudiantes del Programa de Ingeniería de Software de la Universidad Surcolombiana. Los nombres y el semestre se detallan en la siguiente tabla. 

|**Integrante**|**Rol**|**Formación**|
|---|---|---|
|Santiago Calderón|Líder de Proyecto, líder de|Semestre 6|
|Almario|Análisis de negocio y||



La oficina de proyectos de informática 

Página 20 

**La oficina de proyectos PMO** 

||requerimientos, diseño de<br>interfaz y prototipo, desarrollo<br>(interfaz y servidor)||
|---|---|---|
|Carlos Esteban<br>Anacona Gonzalez|Arquitectura y datos, calidad y<br>pruebas, documentación y uso<br>de IA|Semestre 6|



#### **2. Roles del proyecto y su descripción** 

|**Rol**|**Descripción**|**Responsabilidades**|**Entregables**|
|---|---|---|---|
|Líder de<br>proyecto|Coordina el<br>trabajo, el tiempo<br>y la comunicación<br>con el docente|Plan de trabajo,<br>seguimiento de hitos,<br>gestión de riesgos y<br>preparación de la<br>exposición|Documento del<br>proceso y lista de<br>tareas|
|Líder de análisis<br>de negocio y<br>requisitos|Es el vínculo con<br>la administradora<br>y responsable del<br>entendimiento del<br>problema|Entrevistas y<br>reuniones de<br>validación, requisitos,<br>reglas de negocio,<br>historias de usuario y<br>pila del producto|Propuesta,<br>documento de<br>requerimientos,<br>historias de<br>usuario, pila del<br>producto|
|Diseño de<br>interfaz y<br>prototipo|Diseña la<br>experiencia de las<br>tres clases de<br>usuario|Prototipo en Figma,<br>guía de estilo, mapa<br>de navegación|Prototipo|
|Arquitectura y<br>datos|Define la<br>estructura técnica|SAD, diagramas UML,<br>modelo de datos, API|SAD, UML, lógica<br>de los datos|
|Desarrollo<br>(interfaz y<br>servidor)|Construye el<br>sistema|Programación en<br>React, Node/Express<br>y MongoDB, revisión<br>de código|Sistema|
|Calidad y<br>pruebas|Verifica que el<br>sistema cumpla lo<br>especificado|Casos de prueba,<br>pruebas de cruces de<br>horario y permisos,<br>pruebas de aceptación|Resultados de<br>pruebas|
|Documentación|Mantiene la|Control de versiones|Apartado sobre IA|



La oficina de proyectos de informática 

Página 21 

**La oficina de proyectos PMO** 



<!-- Start of picture text -->
y uso de IA documentación  de los documentos,<br>consistente glosario, trazabilidad,<br>registro del uso de IA<br><!-- End of picture text -->

#### **3. Organigrama de trabajo** 



<!-- Start of picture text -->
(evaluador)Docente Ceei<br>Lider de proyecto<br>la » la »<br>(Lider de andlisis y requisitos | (  Arquitecturay datos |<br>NS 7 XX 7<br>| Lider de andlisis y requisitos | { Documentacién )<br>\NN wy,) XK - y) (\ Desarrollo y)<br>a<br>(Calidad y pruebas )<br>\ yy<br><!-- End of picture text -->



#### **4. Modelo de relación con el cliente** 

|**Aspecto**|**Misión**|
|---|---|
|Interlocutor del equipo|El líder de análisis de negocio y requisitos, como<br>punto único de contacto|
|Interlocutor del negocio|Maryuri Cediel, dueña y administradora|
|Reuniones|Cuatro en total. La entrevista de levantamiento<br>del 6 de octubre de 2026 y 3 programadas en el<br>plan de trabajo (validación, revisión del prototipo<br>y prueba de aceptación)|



La oficina de proyectos de informática 

Página 22 

**La oficina de proyectos PMO** 

|Canal de comunicación para<br>consultas puntuales|Reuniones virtuales y comunicación vía<br>WhatsApp|
|---|---|
|Registro|Cada reunión deja constancia con fecha,<br>asuntos tratados y decisiones|
|Validación|La administradora confirma el entendimiento, el<br>alcance y las pruebas de aceptación|
|Decisiones|Las del negocio las toma la administradora; las<br>técnicas, el equipo. Cada propuesta o decisión<br>se documenta indicando quién la tomó|



#### **5. Recursos** 

##### **5.1 Recursos aportados por el equipo** 

|**Recurso**|**Uso**|
|---|---|
|Equipos de cómputo y conexión a<br>internet|Desarrollo, documentación y pruebas|
|React, Node.js, Express y MongoDB|Construcción del sistema (stack<br>MERN)|
|Figma|Prototipo|
|PlantUML|Diagramas UML (se usa en el<br>diagrama de clases)|
|Plataforma colaborativa para control de<br>versiones y seguimiento|Repositorio, pila del producto y tareas|
|Navegadores y dispositivos móviles|Pruebas de la interfaz|
|Servicio de alojamiento (hosting)|Demostración del sistema|
|Herramienta de inteligencia artificial|Apoyo al desarrollo, si se usa|



##### **5.2 Recursos que debe aportar el cliente** 

|**Recurso**|**Uso**|
|---|---|



La oficina de proyectos de informática 

Página 23 

**La oficina de proyectos PMO** 

|Tiempo de la administradora para<br>reuniones|Validar el entendimiento, el prototipo y<br>las pruebas|
|---|---|
|Lista de servicios, precios y categorías|Carga inicial del catálogo (según el<br>contexto se toman de las redes<br>sociales del salón)|
|Horarios de trabajo y servicios que<br>realiza cada profesional de uñas|Calcular la disponibilidad|
|Autorización para usar el nombre del<br>negocio, sus servicios y contenido de<br>sus redes sociales|Sistema y exposición|
|Datos de contacto de las profesionales<br>para crear sus cuentas|Pruebas y demostración|



#### **6. Supuestos sobre el personal y los recursos** **_[propuesta]_** 

1. El equipo mantiene la misma conformación durante todo el proyecto. 

<mark>2. Cada integrante dispone de equipo y conexión suficientes para trabajar.</mark> 

<mark>3. La administradora responde las consultas del equipo en un plazo razonable.</mark> 

<mark>4. Los datos del negocio se usan únicamente para el proyecto.</mark> 



## **Premisas y consideraciones** 

#### **<mark>1. Premisas generales</mark>** 

|**ID**|**Premisa**|
|---|---|
|PR-01|La fecha límite es el 19 de noviembre de 2026, día de la exposición<br>en INNOVASOFT IX. No es posible ampliarla|
|PR-02|El proyecto es académico y se desarrolla a partir de un negocio<br>real. El producto es un MVP y no incluye lo señalado como fuera<br>del alcance|
|PR-03|Los costos para el cliente no están definidos; el documento no<br>establece un presupuesto|



La oficina de proyectos de informática 

Página 24 

**La oficina de proyectos PMO** 

|PR-04|El equipo mantiene su conformación durante el proyecto|
|---|---|
|PR-05|El alcance es el descrito en la sección “Alcance” de esta propuesta.<br>Cualquier cambio sigue el procedimiento del apartado 4|



#### **2. Insumos que debe suministrar el cliente** 

|**ID**|**Insumo**|**Si no se cumple**|
|---|---|---|
|PR-06|Confirmación del alcance y<br>respuesta a las decisiones<br>pendientes|Se asumirá el alcance actual, sin<br>reportes ni registro manual, y no se<br>podrán reabrir esos puntos|
|PR-07|Autorización para usar el<br>nombre del negocio, sus<br>servicios, precios y contenido<br>de sus redes sociales|No se usará material del negocio; se<br>emplearán datos de ejemplo<br>identificados como tales|
|PR-08|Lista de servicios, precios y<br>categorías|Se usará una lista de ejemplo; la<br>carga real depende del tiempo<br>restante|
|PR-09|Profesionales de uñas:<br>nombres, servicios que<br>realizan y horarios de trabajo|Se crearán profesionales y horarios<br>de ejemplo para completar el<br>desarrollo|
|PR-10|Disponibilidad para las<br>reuniones previstas<br>(validación, revisión del<br>prototipo y prueba de<br>aceptación)|La reunión se reprograma dentro de<br>la misma semana; si no es posible,<br>se continúa con lo documentado y<br>se deja constancia|
|PR-11|Designación de una persona<br>de contacto del negocio con<br>capacidad de decidir (en<br>principio, la administradora)|Las decisiones quedan sin validar y<br>se registran como supuestos del<br>equipo|



#### **3. Plazos de revisión de entregables** 

|**ID**<br>**Premisa**|
|---|



La oficina de proyectos de informática 

Página 25 

**La oficina de proyectos PMO** 

|PR-12|La administradora responde las consultas puntuales en un máximo<br>de 2 días hábiles|
|---|---|
|PR-13|La revisión del prototipo ocurre en la semana 2 (29 de octubre al 4 de<br>noviembre); sus observaciones se entregan en la reunión o dentro de<br>2 días hábiles después|
|PR-14|La prueba de aceptación se hace entre el 17 y el 18 de noviembre.<br>Las correcciones posteriores se limitan a errores que impidan el uso<br>del sistema|
|PR-15|Si la administradora no responde en los plazos acordados, el equipo<br>continúa con la mejor interpretación disponible y lo registra como<br>supuesto|
|PR-16|Cada reunión deja una constancia breve con fecha, asuntos y<br>decisiones|





#### **4. Procedimiento para cambios de alcance** 

|**ID**|**Premisa**|
|---|---|
|PR-17|A partir del hito H3 (11 de noviembre) no se aceptan funcionalidades<br>nuevas, solo correcciones.|
|PR-18|Las mejoras opcionales (correo con recordatorio, cuenta de clienta,<br>descuento por fidelidad y anticipó simulado) sólo se abordan si el<br>MVP está terminado y probado|
|PR-19|No se asume ningún cambio no registrado por este procedimiento|



#### **5. Condiciones técnicas y de recursos** 

|**ID**|**Premisa**|
|---|---|



La oficina de proyectos de informática 

Página 26 

**La oficina de proyectos PMO** 

|PR-20|El sistema se construye con el stack MERN y una arquitectura distinta<br>de la monolítica|
|---|---|
|PR-21|El equipo dispone de equipos, conexión a internet y herramientas<br>(Figma, plataforma colaborativa, hosting para la demostración)<br>durante todo el proyecto|
|PR-22|El sistema se probará en los navegadores y dispositivos que el<br>equipo defina, la compatibilidad con otros no está garantizada|
|PR-23|Durante el desarrollo y las pruebas se usan datos de ejemplo. No se<br>cargan citas históricas anotadas en cuadernos o calendarios|
|PR-24|La exposición se realiza con el sistema desplegado o en un equipo<br>del equipo; se prepara una copia de respaldo de la demostración|



#### **6. Condiciones legales y de datos** 

|**ID**|**Premisa**|
|---|---|
|PR-25|La información del negocio se usa solo para este proyecto académico|
|PR-26|Si el desarrollo se apoya en inteligencia artificial, su uso se<br>documenta como exige el parcial|



#### **<mark>7. Condiciones después de la entrega</mark>** 

|**ID**|**Premisa**|
|---|---|
|PR-27|La entrega es la del proyecto académico. El soporte, el<br>mantenimiento y la puesta en producción real posteriores no forman<br>parte de este alcance, salvo que se acuerde expresamente|
|PR-28|El hosting definitivo y sus costos, si el negocio decide usar el sistema,<br>son responsabilidad del negocio|



#### **<mark>8. Consecuencia del incumplimiento</mark>** 

Si una premisa no se cumple, el equipo lo comunica a la administradora y al docente, y aplica un plan. Se recortan primero las funciones de prioridad media y se usan datos de ejemplo donde falten insumos reales. La fecha del 19 de noviembre no se mueve. 

La oficina de proyectos de informática 

Página 27 

**La oficina de proyectos PMO** 



La oficina de proyectos de informática 

Página 28 

**La oficina de proyectos PMO** 



## **Herramientas y metodologías** 

#### **<mark>1. Enfoque general</mark>** 

El proyecto se desarrolla con un enfoque ágil inspirado en Scrum, de manera iterativa e incremental. Se entregan versiones funcionales cada semana y se ajusta el rumbo según los resultados y la retroalimentación de la administradora. La gestión técnica se apoya en estándares reconocidos para requisitos, modelado, calidad, seguridad y accesibilidad. 

#### **1.1 ¿Qué significa para la administradora?** 

Verá avances reales en momentos acordados (en la revisión del prototipo y en la prueba de aceptación), podrá corregir el rumbo a tiempo, y el equipo le explicará siempre qué se hizo, qué sigue y qué decisiones necesita de ella. 

#### **2. Gestión del proyecto (enfoque inspirado en Scrum)** 

Scrum es un marco ligero que ayuda a generar valor mediante soluciones adaptativas a problemas complejos. Se basa en transparencia, inspección y adaptación. 

##### **2.1 Elementos que se adoptan y cómo se adaptan** 

|**Elemento de Scrum**|**Aplicación en el proyecto**|
|---|---|
|Sprint|4_sprints_semanales, de jueves a miércoles,<br>alineados con el plan de trabajo|
|Objetivo del producto|Centralizar el agendamiento de citas del<br>servicio de uñas, evitando olvidos y cruces<br>(objetivo general de la propuesta)|
|Pila del producto|Lista priorizada de historias de usuario y<br>requisitos; se actualiza cada semana|
|Pila del sprint|Selección de la pila para la semana más las<br>tareas para lograrla|
|Incremento|Versión del sistema o del documento que<br>cumple la definición de terminado|
|Planificación del sprint|Jueves, al inicio de cada semana|



La oficina de proyectos de informática 

Página 29 

**La oficina de proyectos PMO** 

|Revisión del sprint|Miércoles, al cierre, para mostrar lo hecho|
|---|---|
|Retrospectiva|Miércoles, tras la revisión|



### **<mark>2.2 Roles</mark>** 

|**Rol**|**Responsable**|**Aclaración**|
|---|---|---|
|Dueño del producto|El líder de análisis de<br>negocio y requisitos|El dueño del producto es una<br>persona y no un comité. Las<br>decisiones de negocio las válida<br>la administradora|
|Facilitador del<br>proceso|El líder de proyecto|Cuida que se cumplan los<br>eventos y se retiren obstáculos;<br>no gobierna al equipo|
|Desarrolladores|Todo el equipo|Cualquiera que construya el<br>incremento, también de<br>documentos o diseño|



##### **2.3 Los cuatro sprints** 

|Sprint|Fechas|Objetivo|Hito|
|---|---|---|---|
|1|Jueves 22 a miércoles 28 de<br>octubre|Requisitos validados y<br>trabajo organizado|H1|
|2|Jueves 29 de octubre a<br>miércoles 4 de noviembre|Diseño aprobado y<br>entorno listo|H2|
|3|Jueves 5 a miércoles 11 de<br>noviembre|Inicio del sistema<br>funcionando|H3|
|4|Jueves 12 a miércoles 18 de<br>noviembre|MVP completo, probado<br>y documentado|H4 Y H5|



##### **2.4 Forma de trabajo de cada sprint** 

|Paso|Actividades|
|---|---|



La oficina de proyectos de informática 

Página 30 

**La oficina de proyectos PMO** 

|1. Planificar<br>(jueves)|Revisar la pila del producto; fijar el objetivo del sprint; elegir los<br>elementos que caben; dividirlos en tareas pequeñas, idealmente<br>de un día o menos|
|---|---|
|2. Trabajar<br>(a diario)|Reunión de 15 minutos: qué se hizo, qué se hará, qué impide<br>avanzar; actualizar el tablero|
|3. Revisar<br>(miércoles)|Mostrar el incremento; recibir observaciones; actualizar la pila|
|4. Mejorar<br>(miércoles)|Conversar qué salió bien y qué cambiar la semana siguiente;<br>registrar acuerdos|



#### **3. Gestión técnica** 

##### **3.1 Ingeniería de requisitos** 

|**Paso**|**Actividades**|
|---|---|
|Obtener|Entrevista con la administradora (realizada el 6 de octubre de<br>2026); revisión de las redes del salón para los servicios|
|Analizar|Separar necesidades del negocio de decisiones del equipo;<br>detectar vacíos y conflictos|
|Especificar|Redactar funcionalidades, requerimientos funcionales y no<br>funcionales, reglas de negocio e interfaces con identificadores<br>únicos|
|Validar|Reuniones con la administradora y revisión del prototipo|
|Gestionar|Matriz de trazabilidad; control de cambios|





##### **3.2 Diseño y modelado** 

|**Práctica**|**Base**|**Actividades**|**Entregable**|
|---|---|---|---|



La oficina de proyectos de informática 

Página 31 

**La oficina de proyectos PMO** 

|Prototipado|Figma|Mapa de navegación,<br>wireframes, prototipo<br>navegable, revisión con<br>la administradora|Prototipo|
|---|---|---|---|
|Modelado<br>UML|lenguaje gráfico para<br>visualizar,<br>especificar, construir<br>y documentar<br>sistemas|Diagramas de clases,<br>secuencia,<br>componentes y<br>actividades, redactados<br>en PlantUML|4 diagramas|
|Arquitectura|Separación en tres<br>partes (interfaz,<br>servidor y base de<br>datos), distinta de la<br>monolítica|Decisiones<br>documentadas con su<br>justificación|SAD|
|Modelado de<br>datos|MongoDB, base de<br>datos no relacional|Colecciones, datos<br>embebidos, diccionario<br>de datos|Documento de<br>lógica de datos|



##### **3.3 Construcción** 

|**Práctica**|**Aplicación**|
|---|---|
|Stack MERN|React (interfaz), Node.js y Express (servidor) y<br>MongoDB (datos)|
|API|Comunicación entre la interfaz y el servidor mediante<br>una API (estilo REST con JSON, por confirmar en el<br>SAD)|
|Control de versiones|Repositorio en la plataforma colaborativa; ramas por<br>funcionalidad; integración a la rama principal solo tras<br>revisión|
|Seguridad|Contraseñas almacenadas como_hash_con un algoritmo<br>de contraseñas moderno; permisos verificados en el<br>servidor; configuración sensible fuera del código|
|Accesibilidad||



##### **3.4 Calidad y pruebas** 

La oficina de proyectos de informática 

Página 32 

**La oficina de proyectos PMO** 



|**Paso**|**Actividades**|
|---|---|
|Planear pruebas|Derivar casos de prueba de los requerimientos y las reglas<br>de negocio; escribir criterios de aceptación en la forma<br>“dado, cuando, entonces”|
|Probar|Pruebas funcionales de prioridad alta; pruebas de cruces de<br>horario (incluida la reserva simultánea) y de permisos por rol;<br>revisión de accesibilidad básica|
|Aceptar|Prueba de aceptación y demostración con la administradora|
|Corregir|Registrar fallos, corregir y volver a probar|



##### **3.5 Gestión de cambios, riesgos y documentación** 

|**Práctica**|**Aplicación**|
|---|---|
|Control de cambios|Procedimiento descrito en “Premisas y<br>consideraciones”|
|Riesgos|Registro semanal de riesgos y plan de<br>contingencia|
|Trazabilidad|Cada requisito se vincula con su origen, historia,<br>diagrama y prueba|
|Uso de inteligencia artificial|Si se emplea, se registra herramienta,<br>instrucciones, controles aplicados y revisión<br>humana|





#### **4. Herramientas** 

|**Categoría**|**Herramienta**|**Uso**|
|---|---|---|
|Interfaz|React|Pantallas|



La oficina de proyectos de informática 

Página 33 

**La oficina de proyectos PMO** 

|Servidor|Node.js y Express|Reglas de negocio y API|
|---|---|---|
|Base de datos|MongoDB|Almacenamiento|
|Prototipo|Figma|Diseño de pantallas|
|Diagramas|PlantUML|Diagramas UML|
|Colaboración y<br>seguimiento|GitHub|Repositorio, pila del<br>producto y tareas|
|Control de versiones|GitHub|Historial de cambios|
|Documentos|Procesador de texto y<br>hojas de cálculo|Entregables y matrices|
|Comunicación|Canal de mensajería y<br>reunión del equipo|Coordinación diaria|
|Pruebas|Herramientas de prueba<br>manual y automatizada|Verificación|
|Inteligencia artificial|Herramienta por definir|Apoyo al desarrollo, si se<br>usa|
|Alojamiento|Servicio por definir|Demostración|





## **Capacidades técnicas** 

#### **<mark>1. Perfil del equipo</mark>** 

El proyecto lo desarrolla un equipo de dos estudiantes del Programa de Ingeniería de Software de la Universidad Surcolombiana. Su respaldo es la formación 

La oficina de proyectos de informática 

Página 34 

**La oficina de proyectos PMO** 

universitaria en curso, los proyectos académicos previos y el uso de estándares y guías reconocidas, que se detallan a continuación. 

### **2. Capacidades del equipo según lo que el proyecto requiere** 

|**Necesidad del**<br>**proyecto**|**Capacidad**<br>**requerida**|**Respaldo**|
|---|---|---|
|Entender el negocio<br>y especificar<br>requisitos|Ingeniería de<br>requisitos|Entrevista realizada el 6 de<br>octubre de 2026; documento de<br>requerimientos con requisitos<br>funcionales, no funcionales, reglas<br>de negocio e interfaces;|
|Modelar el sistema|UML|Diagrama de clases en desarrollo,<br>redactado enPlantUML;|
|Diseñar la interfaz|Prototipado|Figma|
|Construir la interfaz|React|POR DEFINIR|
|Construir el servidor|Node.js y Express|POR DEFINIR|
|Gestionar los datos|MongoDB y<br>modelado no<br>relacional|POR DEFINIR|
|Organizar el trabajo|Metodologías ágiles|Enfoque inspirado en Scrum,<br>basado en la Scrum Guide 2020|
|Controlar versiones<br>y colaborar|GitHub y plataforma<br>colaborativa|POR DEFINIR|
|Asegurar la calidad|Pruebas y calidad de<br>software|Modelo ISO/IEC 25010 como<br>referencia|
|Proteger los datos y<br>las cuentas|Seguridad web<br>básica|Guías de OWASP como referencia|
|Hacer la interfaz<br>accesible|Accesibilidad web|Pautas WCAG 2.2 como referencia|
|Documentar el uso<br>de IA|Registro y control|Exigencia del proyecto|



La oficina de proyectos de informática 

Página 35 

**La oficina de proyectos PMO** 

#### **<mark>3. Perfiles individuales (COMPLETAR)</mark>** 

|**Integrante**|**Carrera y**<br>**semestre**|**Formación**<br>**relevante**|**Experiencia**|
|---|---|---|---|
|Santiago Calderón<br>Almario|Ingeniería de<br>Software, 6º<br>semestre,<br>Universidad<br>Surcolombiana|||
|Carlos Esteban<br>Anacona<br>Gonzalez|Ingeniería de<br>Software, 6º<br>semestre,<br>Universidad<br>Surcolombiana|Lenguajes para la<br>web, matemáticas,<br>economía y<br>desarrollo móvil|Desarrollo de una<br>aplicación web<br>con React y Vite<br>en el curso de<br>lenguajes para la<br>web|



#### **4. Conocimientos en estándares y metodologías (CONSULTAR PARA COMPLETAR O ELIMINAR)** 

El equipo ha consultado y aplicado como referencia, en la preparación de este proyecto: 

|**Área**|**Referencia**|
|---|---|
|Ingeniería de requisitos|ISO/IEC/IEEE 29148:2018|
|Modelado|UML 2.5.1 (Object Management Group)|
|Calidad del producto|ISO/IEC 25010:2023|
|Accesibilidad web|WCAG 2.2 (W3C)|
|Seguridad de aplicaciones|Guías de OWASP|
|Gestión ágil|The Scrum Guide (2020)|





La oficina de proyectos de informática 

Página 36 

**La oficina de proyectos PMO** 



La oficina de proyectos de informática 

Página 37 

**La oficina de proyectos PMO** 



## **Honorarios** 

#### **<mark>1. Modelo de honorarios</mark>** 

El proyecto se desarrolla en el marco de una asignatura de la Universidad Surcolombiana y no genera cobro al negocio. No obstante, para dimensionar el servicio y proteger el alcance, se presenta una estimación del esfuerzo. 

### **2. Estimación del esfuerzo (CALCULAR DATOS)** 

Se divide el trabajo en paquetes, se estima cada uno en horas-persona y se suma una reserva para imprevistos. El tamaño de referencia es el del propio proyecto: 16 funcionalidades, 13 pantallas, 52 requerimientos funcionales, 7 entidades de datos y 11 entregables. 

|**Paquete de trabajo**|**Perfil principal**|**Horas**|
|---|---|---|
|Análisis, propuesta,<br>requisitos, historias y pila<br>del producto|Análisis de requisitos||
|Reuniones con la<br>administradora (3, con<br>preparación)|Análisis de requisitos||
|Gestión del proyecto,<br>plan, proceso y<br>seguimiento|Líder de proyecto||
|Repaso y exposición|Líder de proyecto||
|Prototipo en Figma (13<br>pantallas)|Diseño de interfaz||
|SAD, 4 diagramas UML,<br>lógica de datos y lista de<br>tareas|Arquitectura y datos||
|Modelo de base de datos<br>y carga inicial|Arquitectura y datos||
|Entorno de desarrollo y<br>estructura base|Desarrollo||



La oficina de proyectos de informática 

Página 38 

**La oficina de proyectos PMO** 

|Servidor: Autenticación,<br>roles, API, cruces de<br>horario y estados|Desarrollo|
|---|---|
|Interfaz: 13 pantallas|Desarrollo|
|Pruebas y correcciones|Calidad y pruebas|
|Documentación final y<br>registro del uso de IA|Documentación|
|Subtotal||
|Reserva para imprevistos<br>(15 %)||
|Total estimado||





La oficina de proyectos de informática 

Página 39 

**La oficina de proyectos PMO** 

## **Acerca de la empresa** 

#### **<mark>1. Quiénes somos</mark>** 

Somos Santiago Calderón Almario y Carlos Esteban Anacona Gonzalez, un equipo de desarrollo conformado por dos  estudiantes del Programa de Ingeniería de Software de la Universidad Surcolombiana, en Colombia. Desarrollamos este proyecto como trabajo final de la asignatura Ingeniería de Software Orientada a Objetos, a partir de las necesidades de un negocio real, Three Masters, con el acompañamiento académico del docente Eduardo Martinez Vidal. 

Nuestro propósito en este proyecto es poner la ingeniería de software al servicio de un negocio local, entender cómo trabaja, qué problemas tiene y construir una solución pequeña, completa y útil. 

#### **2. Presencia y tamaño** 

|**Aspecto**|**Información**|
|---|---|
|País|Colombia|
|Sede del equipo|Garzón, Huila|
|Ubicación del cliente|Garzón, Huila|
|Integrantes|Santiago Calderón Almario y Carlos Esteban<br>Anacona Gonzalez|
|Organización|Equipo académico, sin personería jurídica|
|Respaldo institucional|Programa de Ingeniería de Software, Universidad<br>Surcolombiana|



#### **3. Áreas de trabajo** 

No contamos con divisiones formales. Nos organizamos por roles, que se describen en la sección “Personal y recursos” 

|**Área**|**Función**|
|---|---|
|Gestión del proyecto|Plan, seguimiento y comunicación|
|Análisis de negocio y requisitos|Entendimiento del cliente, requisitos y|



La oficina de proyectos de informática 

Página 40 

**La oficina de proyectos PMO** 

||validación|
|---|---|
|Diseño de interfaz|Prototipo y experiencia de usuario|
|Arquitectura y datos|Diseño técnico y modelado|
|Desarrollo|Construcción del sistema|
|Calidad y pruebas|Verificación del sistema|
|Documentación|Entregables y trazabilidad|



#### **4. Portafolio de servicios para este proyecto** 

|**Servicio**|**Qué incluye**|**Dónde se detalla**|
|---|---|---|
|Levantamiento y<br>especificación de requisitos|Entrevistas, requisitos<br>funcionales y no funcionales,<br>reglas de negocio, historias de<br>usuario|Documento de<br>requerimientos|
|Diseño de interfaces y<br>prototipado|Mapa de navegación,<br>wireframes y prototipo en<br>Figma|Prototipo|
|Arquitectura y modelado|SAD, diagramas UML y lógica<br>de datos|SAD y UML|
|Desarrollo de aplicaciones<br>web|Sistema de citas con React,<br>Node.js, Express y MongoDB|Alcance|
|Pruebas y aseguramiento<br>de calidad|Pruebas funcionales, de reglas<br>críticas y de aceptación|Herramientas y<br>metodologías|
|Gestión ágil del proyecto|Ciclos semanales, seguimiento<br>y control de cambios|Plan de trabajo|



La oficina de proyectos de informática 

Página 41 

**La oficina de proyectos PMO** 



#### **5. Clientes y proyectos** 

|**Cliente**|**Proyecto**|**Estado**|
|---|---|---|
|Three Masters (Garzón,<br>Huila)|Sistema de gestión de citas<br>web para el salón de uñas|En curso: entrevista de<br>levantamiento realizada el 6<br>de octubre de 2026 y<br>documentación en<br>elaboración|



#### **6. Casos de éxito** 

Este es nuestro primer proyecto con un cliente real y todavía no contamos con casos de éxito previos. Nuestro compromiso es que este proyecto lo sea. Se considerará logrado cuando la administradora confirme, en la prueba de aceptación, que el sistema cumple lo acordado. Esa constancia quedará anexa al proyecto. 

#### **7. Diagrama del equipo y sus servicios** 



<!-- Start of picture text -->
Estudiantes de Ingenieria de Software<br>Universidad Surcolombiana<br>Disefio y prototipo<br>|) 7{ Arquitectura y modelado<br>Servicios del proyecto<br>Equipo de desarrollo Desarrollo web (MERN)<br>\ Pruebas y calidad<br>Gestion agi<br>Three Masters, Garzén (Huila)<br>Estandares: ISO/MEC/IEEE 29148, UML, ISO/IEC 25010<br>Respaldo<br>Gulas: Scrum, WCAG 2.2, OWASP<br><!-- End of picture text -->

La oficina de proyectos de informática 

Página 42 

