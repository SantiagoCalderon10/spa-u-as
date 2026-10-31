import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCategorias } from '../../api/categoriaService';
import { getServicios } from '../../api/servicioService';
import { formatearDuracion, formatearPrecio, mensajeDeError } from '../../utils/catalogo';
import styles from './CatalogoSection.module.css';

// Datos de referencia cuando la base de datos o el backend no tienen registros cargados
const MOCK_CATEGORIAS = [
  { _id: 'cat-m1', nombre: 'Manicura Clínica & Rusa', descripcion: 'Tratamientos de alta precisión con torno y nivelación de lámina ungueal.' },
  { _id: 'cat-m2', nombre: 'Pedicura Terapéutica', descripcion: 'Protocolos de cuidado, desinfección y descanso podológico.' },
  { _id: 'cat-m3', nombre: 'Escultura & Extensiones', descripcion: 'Acrílico, polygel y tip con arquitectura estructural de autor.' },
  { _id: 'cat-m4', nombre: 'Arte & Alta Definición', descripcion: 'Diseño mano alzada, encapsulado en cuarzo y técnicas cromáticas.' },
];

const MOCK_SERVICIOS = [
  {
    _id: 'srv-m1',
    nombre: 'Manicura Rusa con Nivelación',
    descripcion: 'Técnica en seco con fresas diamantadas. Retiro milimétrico de eponiquio y esmaltado bajo cutícula de hasta 28 días.',
    precio: 55000,
    duracion: 60,
    idCategoria: 'cat-m1',
    activo: true,
  },
  {
    _id: 'srv-m2',
    nombre: 'Escultura en Acrílico Almond',
    descripcion: 'Construcción con molde sin tip. Curvatura C perfecta, balance de apex y acabado pulido espejo.',
    precio: 95000,
    duracion: 120,
    idCategoria: 'cat-m3',
    activo: true,
  },
  {
    _id: 'srv-m3',
    nombre: 'Pedicura Spa con Baño Herbal',
    descripcion: 'Inmersión en sales marinas, exfoliación con alfahidroxiácidos, remoción de hiperqueratosis y masaje circulatorio.',
    precio: 60000,
    duracion: 75,
    idCategoria: 'cat-m2',
    activo: true,
  },
  {
    _id: 'srv-m4',
    nombre: 'Kapping con Gel Fortalecedor',
    descripcion: 'Baño de gel de alta viscosidad que protege uñas naturales débiles, permitiendo un crecimiento continuo y saludable.',
    precio: 70000,
    duracion: 60,
    idCategoria: 'cat-m1',
    activo: true,
  },
  {
    _id: 'srv-m5',
    nombre: 'Nail Art Micro-Líneas & Foil',
    descripcion: 'Composición gráfica personalizada con pigmentos de alta densidad, hojilla de oro o degradé tonal.',
    precio: 35000,
    duracion: 45,
    idCategoria: 'cat-m4',
    activo: true,
  },
  {
    _id: 'srv-m6',
    nombre: 'Retiro Orgánico & Nutrición Profunda',
    descripcion: 'Extracción segura sin abrasión química violenta, sellado térmico con aceite de jojoba y queratina botánica.',
    precio: 28000,
    duracion: 35,
    idCategoria: 'cat-m1',
    activo: true,
  },
];

function IconoReloj() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function TarjetaServicio({ servicio, categoria }) {
  const [fotoFallida, setFotoFallida] = useState(false);
  const mostrarFoto = Boolean(servicio.urlFoto) && !fotoFallida;

  return (
    <article className={styles.card}>
      {mostrarFoto ? (
        <img
          className={styles.cardPhoto}
          src={servicio.urlFoto}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFotoFallida(true)}
        />
      ) : (
        <div className={styles.cardPhotoFallback} aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6" />
          </svg>
        </div>
      )}

      <div className={styles.cardInfo}>
        <span className={styles.cardCategory}>{categoria}</span>
        <h3 className={styles.cardTitle}>{servicio.nombre}</h3>
        <p className={styles.cardDescription}>
          {servicio.descripcion || 'Procedimiento profesional con garantía de acabado y bioseguridad.'}
        </p>
      </div>

      <div className={styles.cardMeta}>
        <span className={styles.cardDuration}>
          <IconoReloj />
          {formatearDuracion(servicio.duracion)}
        </span>
        <span className={styles.cardPrice}>{formatearPrecio(servicio.precio)}</span>
      </div>
    </article>
  );
}

export default function CatalogoSection() {
  const [categorias, setCategorias] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [cargando, setCargando] = useState(true);

  const cargarDatosReales = useCallback(async () => {
    setCargando(true);

    try {
      // Peticiones paralelas a los endpoints reales de Express
      const [resCategorias, resServicios] = await Promise.all([getCategorias(), getServicios()]);

      const categoriasValidas = Array.isArray(resCategorias) && resCategorias.length > 0;
      const serviciosValidos = Array.isArray(resServicios) && resServicios.length > 0;

      setCategorias(categoriasValidas ? resCategorias : MOCK_CATEGORIAS);
      setServicios(serviciosValidos ? resServicios : MOCK_SERVICIOS);
    } catch (err) {
      // Mensaje sin detalles técnicos ni URLs
      console.info('Catálogo con datos de referencia:', mensajeDeError(err));
      setCategorias(MOCK_CATEGORIAS);
      setServicios(MOCK_SERVICIOS);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosReales();
  }, [cargarDatosReales]);

  // Mapa de resolución rápida: idCategoria (ObjectId) -> nombre de categoría
  const categoriaMap = useMemo(() => {
    const mapa = {};
    categorias.forEach((c) => {
      if (c._id) mapa[c._id] = c.nombre;
    });
    return mapa;
  }, [categorias]);

  // Solo las categorías activas se ofrecen como filtros del catálogo
  const categoriasVisibles = useMemo(
    () => categorias.filter((categoria) => categoria.estado !== false),
    [categorias]
  );

  // Los servicios en pausa no se publican en el catálogo
  const serviciosVisibles = useMemo(
    () => servicios.filter((servicio) => servicio.activo !== false),
    [servicios]
  );

  // Filtrado de servicios según categoría seleccionada
  const serviciosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todas') return serviciosVisibles;
    return serviciosVisibles.filter((s) => {
      const idCat = typeof s.idCategoria === 'object' ? s.idCategoria?._id : s.idCategoria;
      return idCat === categoriaActiva;
    });
  }, [serviciosVisibles, categoriaActiva]);

  return (
    <section id="catalogo" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <div className={styles.introTitles}>
            <p className={styles.eyebrow}>Servicios</p>
            <h2 className={styles.title}>Un ritual para cada estilo.</h2>
          </div>
          <p className={styles.introDescription}>
            Desde un acabado natural hasta ese diseño que guardaste. Encuentra tu próximo favorito.
          </p>
        </div>

        {/* Filtros por categoría real */}
        <div className={styles.filters} role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={`${styles.filterPill} ${categoriaActiva === 'todas' ? styles.filterPillActive : ''}`}
            onClick={() => setCategoriaActiva('todas')}
            aria-pressed={categoriaActiva === 'todas'}
          >
            Todos los servicios
          </button>

          {categoriasVisibles.map((cat) => (
            <button
              key={cat._id}
              type="button"
              className={`${styles.filterPill} ${categoriaActiva === cat._id ? styles.filterPillActive : ''}`}
              onClick={() => setCategoriaActiva(cat._id)}
              aria-pressed={categoriaActiva === cat._id}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Grilla de servicios */}
        {cargando ? (
          <div className={styles.state} role="status">
            <h3 className={styles.stateTitle}>Consultando la agenda del salón…</h3>
            <p>Sincronizando el catálogo con el servidor de Three Masters.</p>
          </div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className={styles.state}>
            <h3 className={styles.stateTitle}>
              {categoriaActiva === 'todas'
                ? 'Sin procedimientos publicados'
                : 'Sin procedimientos en esta categoría'}
            </h3>
            <p>No se encontraron tratamientos activos bajo este filtro.</p>
            {categoriaActiva !== 'todas' && (
              <button
                type="button"
                className={styles.stateAction}
                onClick={() => setCategoriaActiva('todas')}
              >
                Ver todos los servicios
              </button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {serviciosFiltrados.map((servicio, index) => {
              const categoria =
                (typeof servicio.idCategoria === 'object' && servicio.idCategoria?.nombre) ||
                categoriaMap[servicio.idCategoria] ||
                'Tratamiento especializado';

              return (
                <TarjetaServicio
                  key={servicio._id ?? `${servicio.nombre}-${index}`}
                  servicio={servicio}
                  categoria={categoria}
                />
              );
            })}
          </div>
        )}

        <div className={styles.footer}>
          <a className={styles.advice} href="#contacto">
            ¿No sabes cuál elegir? Te asesoramos
            <IconoFlecha />
          </a>
        </div>
      </div>
    </section>
  );
}
