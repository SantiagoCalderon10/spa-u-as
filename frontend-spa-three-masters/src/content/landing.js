/**
 * Texto de las secciones nuevas de la landing pública.
 *
 * Los estilos y las medidas salen de `CODECSS.md` (export del diseño de Figma).
 * El TEXTO sigue siendo PROVISIONAL: el MCP de Figma agotó la cuota del plan
 * Starter y no se pudo leer el contenido real de los nodos `3:12999`,
 * `3:13090`, `3:13115`, `3:13141` y `3:13163`. Lo que hay aquí sale de los
 * nombres de sección del diseño, de los servicios de ejemplo del catálogo y de
 * los pilares que ya existían en `FilosofiaSection`. Reemplazar por el texto
 * real antes de la exposición.
 */

export const SALON = {
  antetitulo: 'Nuestra filosofía',
  titulo: 'Un salón pensado para cuidar tus manos',
  descripcion:
    'Estudio especializado en el cuidado holístico, escultura contemporánea y salud de la uña natural. Compromiso innegociable con la bioseguridad.',
  fotoAlt: 'Interior del salón Three Masters',
};

export const GALERIA = {
  antetitulo: 'Portafolio',
  titulo: 'Galería de trabajos',
  instagram: { etiqueta: 'Instagram', url: 'https://www.instagram.com/' },
  trabajos: [
    { titulo: 'Manicura Rusa con Nivelación', fotoAlt: 'Manicura rusa con nivelación' },
    { titulo: 'Escultura en Acrílico Almond', fotoAlt: 'Escultura en acrílico almond' },
    { titulo: 'Nail Art Micro-Líneas & Foil', fotoAlt: 'Nail art con micro-líneas y foil' },
  ],
};

export const EQUIPO = {
  antetitulo: 'Quienes te acompañan',
  titulo: 'Nuestro equipo',
};

export const CUIDADO = {
  antetitulo: 'Nuestro cuidado',
  titulo: 'Cada servicio se ejecuta con rigor técnico y respeto por tu anatomía',
  fotoAlt: 'Detalle del protocolo de cuidado en Three Masters',
  beneficios: [
    {
      titulo: 'Bioseguridad clínica',
      descripcion:
        'Instrumental esterilizado en autoclave y abierto frente a ti.',
    },
    {
      titulo: 'Preservación de la lámina',
      descripcion:
        'Sin limados abrasivos ni químicos corrosivos sobre la uña natural.',
    },
    {
      titulo: 'Arquitectura y durabilidad',
      descripcion:
        'Ápice y laterales balanceados para resistir sin perder ligereza.',
    },
  ],
};

export const INVITACION = {
  etiqueta: 'Agenda hoy',
  mensaje:
    '¿Lista para tu próxima cita? Escríbenos y reservamos el momento que mejor te venga.',
  boton: 'Escríbenos por WhatsApp',
  url: 'https://wa.me/573184509821',
};

export const CONTACTO = {
  antetitulo: 'Contacto',
  titulo: 'Ponte en contacto',
  descripcion: 'Cuéntanos tu idea y te ayudamos a agendar la cita perfecta para ti.',
  telefono: { etiqueta: 'Teléfono', valor: '+57 318 450 9821' },
  correo: { etiqueta: 'Correo electrónico', valor: 'contacto@threemasters.com' },
};
