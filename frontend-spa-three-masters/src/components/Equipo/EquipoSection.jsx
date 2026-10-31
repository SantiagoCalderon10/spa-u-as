import { useState } from 'react';
import { EQUIPO } from '../../content/landing';
import { useProfesionales } from '../../hooks/useProfesionales';
import { inicialesDe, nombreDeProfesional } from '../../utils/agenda';
import styles from './EquipoSection.module.css';

const MAXIMO_TARJETAS = 3;

function Foto({ profesional, nombre }) {
  const [fallo, setFallo] = useState(false);

  if (!profesional.urlFoto || fallo) {
    return (
      <div className={`${styles.photo} ${styles.photoVacia}`} aria-hidden="true">
        {inicialesDe(nombre)}
      </div>
    );
  }

  return (
    <img
      className={styles.photo}
      src={profesional.urlFoto}
      alt={`Retrato de ${nombre}`}
      onError={() => setFallo(true)}
    />
  );
}

function especialidadesDe(profesional) {
  return (profesional.especialidades ?? [])
    .map((especialidad) =>
      typeof especialidad === 'object' ? especialidad.nombre : ''
    )
    .filter(Boolean)
    .join(' · ');
}

export default function EquipoSection() {
  const { profesionales, cargando, error } = useProfesionales();
  const visibles = profesionales.slice(0, MAXIMO_TARJETAS);

  return (
    <section id="equipo" className={styles.section} aria-labelledby="equipo-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{EQUIPO.antetitulo}</p>
          <h2 id="equipo-title" className={styles.title}>{EQUIPO.titulo}</h2>
        </header>

        {error && <p className={styles.aviso}>{error}</p>}

        {!error && !cargando && visibles.length === 0 && (
          <p className={styles.aviso}>Todavía no hay profesionales publicados.</p>
        )}

        {(cargando || visibles.length > 0) && (
          <ul className={styles.grid}>
            {(cargando ? [null, null, null] : visibles).map((profesional, index) => {
              if (!profesional) {
                return (
                  <li key={`cargando-${index}`} className={styles.card} aria-hidden="true">
                    <div className={`${styles.photo} ${styles.photoVacia}`} />
                    <div className={styles.presentation}>
                      <span className={styles.skeleton} />
                      <span className={styles.skeletonCorta} />
                    </div>
                  </li>
                );
              }

              const nombre = nombreDeProfesional(profesional);
              const especialidades = especialidadesDe(profesional);
              const anios = Number(profesional.anioExperiencia) || 0;

              return (
                <li key={profesional._id} className={styles.card}>
                  <Foto profesional={profesional} nombre={nombre} />
                  <div className={styles.presentation}>
                    <h3 className={styles.name}>{nombre}</h3>
                    {especialidades && <p className={styles.specialties}>{especialidades}</p>}
                    <p className={styles.experience}>
                      {anios > 0
                        ? `${anios} ${anios === 1 ? 'año' : 'años'} de experiencia`
                        : 'Equipo Three Masters'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
