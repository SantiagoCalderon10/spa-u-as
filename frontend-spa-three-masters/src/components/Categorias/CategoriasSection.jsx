import { useState, useEffect } from 'react';
import { getCategorias } from '../../api/categoriaService';
import styles from './CategoriasSection.module.css';

// Datos de respaldo por si el backend aún no tiene datos o no está levantado
const CATEGORIAS_FALLBACK = [
  {
    _id: 'cat-1',
    nombre: 'Manicura',
    descripcion: 'Diseño, limado, hidratación y esmaltados tradicionales o semipermanentes.',
    icono: '💅',
    estado: true,
  },
  {
    _id: 'cat-2',
    nombre: 'Pedicura Spa',
    descripcion: 'Exfoliación profunda, masajes relajantes y embellecimiento de pies.',
    icono: '🦶',
    estado: true,
  },
  {
    _id: 'cat-3',
    nombre: 'Uñas Acrílicas & Polygel',
    descripcion: 'Extensiones de alta durabilidad con técnicas modernas y diseños en tendencia.',
    icono: '✨',
    estado: true,
  },
  {
    _id: 'cat-4',
    nombre: 'Nail Art & Diseños',
    descripcion: 'Mano alzada, encapsulados, pedrería fina y efectos 3D personalizados.',
    icono: '🎨',
    estado: true,
  },
];

export default function CategoriasSection({ categoriaSeleccionada, onSelectCategoria }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [origenDatos, setOrigenDatos] = useState('cargando'); // 'api' | 'fallback'

  useEffect(() => {
    async function cargarCategorias() {
      try {
        setCargando(true);
        const data = await getCategorias();
        if (Array.isArray(data) && data.length > 0) {
          setCategorias(data);
          setOrigenDatos('api');
        } else {
          setCategorias(CATEGORIAS_FALLBACK);
          setOrigenDatos('fallback');
        }
      } catch (err) {
        console.warn('Backend no disponible para categorías, cargando datos locales:', err.message);
        setCategorias(CATEGORIAS_FALLBACK);
        setOrigenDatos('fallback');
      } finally {
        setCargando(false);
      }
    }

    cargarCategorias();
  }, []);

  return (
    <section id="categorias" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Nuestras Especialidades</span>
          <h2 className={styles.title}>Categorías de Servicios</h2>
          <p className={styles.subtitle}>
            Selecciona una categoría para filtrar los tratamientos disponibles o explora todas las opciones.
          </p>

          <div
            className={`${styles.statusNotice} ${
              origenDatos === 'api' ? styles.statusConnected : styles.statusFallback
            }`}
          >
            {origenDatos === 'api' ? (
              <>🟢 Conectado con API Backend (MongoDB)</>
            ) : (
              <>🟡 Modo Demo (Inicia el backend en el puerto 4000 para datos en vivo)</>
            )}
          </div>
        </div>

        {cargando ? (
          <div className={styles.loading}>Cargando categorías...</div>
        ) : (
          <div className={styles.grid}>
            {categorias.map((cat, index) => {
              const estaSeleccionada =
                categoriaSeleccionada === cat._id ||
                categoriaSeleccionada === cat.nombre;

              return (
                <div
                  key={cat._id || index}
                  className={`${styles.card} ${estaSeleccionada ? styles.cardActive : ''}`}
                  onClick={() =>
                    onSelectCategoria(estaSeleccionada ? null : cat._id || cat.nombre)
                  }
                >
                  <div className={styles.cardIcon}>
                    {cat.icono || '💅'}
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{cat.nombre}</h3>
                    <p className={styles.cardDescription}>{cat.descripcion}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span>{estaSeleccionada ? '✓ Filtro activo' : 'Filtrar servicios'}</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

