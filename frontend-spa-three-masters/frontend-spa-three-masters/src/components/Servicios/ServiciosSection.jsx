import { useState, useEffect } from 'react';
import { getServicios } from '../../api/servicioService';
import styles from './ServiciosSection.module.css';



export default function ServiciosSection({ categoriaSeleccionada, onClearCategoria }) {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarServicios() {
      try {
        setCargando(true);
        const data = await getServicios();
        if (Array.isArray(data) && data.length > 0) {
          setServicios(data);
        } else {
          setServicios(SERVICIOS_FALLBACK);
        }
      } catch (err) {
        console.warn('Backend no disponible para servicios, cargando datos locales:', err.message);
        setServicios(SERVICIOS_FALLBACK);
      } finally {
        setCargando(false);
      }
    }

    cargarServicios();
  }, []);


  const serviciosFiltrados = categoriaSeleccionada
    ? servicios.filter(
      (s) =>
        s.idCategoria === categoriaSeleccionada ||
        (typeof s.idCategoria === 'object' && s.idCategoria?._id === categoriaSeleccionada) ||
        s.categoriaNombre === categoriaSeleccionada
    )
    : servicios;

  const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <section id="servicios" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.tag}>Menú de Experiencias</span>
            <h2 className={styles.title}>Nuestros Servicios</h2>
            <p className={styles.subtitle}>
              Tratamientos diseñados para el cuidado, salud y estética de tus manos y pies.
            </p>
          </div>

          {categoriaSeleccionada && (
            <div className={styles.filterControls}>
              <span>Filtro activo</span>
              <button className={styles.clearFilterBtn} onClick={onClearCategoria}>
                ✕ Quitar filtro y ver todos
              </button>
            </div>
          )}
        </div>

        {cargando ? (
          <div className={styles.emptyState}>Cargando servicios del spa...</div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className={styles.emptyState}>
            No se encontraron servicios para esta categoría.{' '}
            <button className={styles.clearFilterBtn} onClick={onClearCategoria}>
              Ver todos
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {serviciosFiltrados.map((srv, index) => (
              <article key={srv._id || index} className={styles.card}>
                <div>
                  <div className={styles.cardTop}>
                    <span className={styles.categoryTag}>
                      {srv.categoriaNombre ||
                        (typeof srv.idCategoria === 'object' && srv.idCategoria?.nombre) ||
                        'Spa Care'}
                    </span>
                    <span className={styles.durationBadge}>
                      ⏱ {srv.duracion} min
                    </span>
                  </div>

                  <h3 className={styles.serviceTitle}>{srv.nombre}</h3>
                  <p className={styles.serviceDescription}>
                    {srv.descripcion || 'Tratamiento profesional de alta calidad para consentir tus uñas.'}
                  </p>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.price}>{formatearPrecio(srv.precio)}</span>
                  <button
                    className={styles.cardBtn}
                    onClick={() => {
                      alert(`Has seleccionado: ${srv.nombre}. En la siguiente fase conectaremos el módulo de reservas.`);
                    }}
                  >
                    Consultar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

