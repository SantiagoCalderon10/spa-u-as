import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { EQUIPO } from '../../content/landing';
import { useProfesionales } from '../../hooks/useProfesionales';
import { inicialesDe, nombreDeProfesional } from '../../utils/agenda';
import styles from './EquipoSection.module.css';

// Desplazamiento automático: lento y continuo (píxeles por segundo).
const VELOCIDAD = 32;
const DURACION_FLECHA = 420;
const PAUSA_TRAS_FLECHA = 1800;

function normalizar(posicion, anchoSet) {
  let valor = posicion;
  while (valor >= anchoSet * 2) valor -= anchoSet;
  while (valor < anchoSet) valor += anchoSet;
  return valor;
}

function tarjetasPorPantalla(ancho) {
  if (ancho > 1024) return 3;
  if (ancho > 640) return 2;
  return 1;
}

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

function TarjetaEquipo({ profesional, ariaHidden = false }) {
  const nombre = nombreDeProfesional(profesional);
  const especialidades = especialidadesDe(profesional);
  const anios = Number(profesional.anioExperiencia) || 0;

  return (
    <li className={styles.card} aria-hidden={ariaHidden || undefined}>
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
}

function Esqueleto() {
  return (
    <li className={styles.card} aria-hidden="true">
      <div className={`${styles.photo} ${styles.photoVacia}`} />
      <div className={styles.presentation}>
        <span className={styles.skeleton} />
        <span className={styles.skeletonCorta} />
      </div>
    </li>
  );
}

function IconoFlecha({ sentido }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {sentido === 'izquierda' ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

export default function EquipoSection() {
  const { profesionales, cargando, error } = useProfesionales();
  const total = profesionales.length;

  const [porPantalla, setPorPantalla] = useState(() =>
    typeof window === 'undefined' ? 3 : tarjetasPorPantalla(window.innerWidth)
  );
  const [copias, setCopias] = useState(3);
  const [movimientoReducido, setMovimientoReducido] = useState(false);

  const viewportRef = useRef(null);
  const pistaRef = useRef(null);
  const posicionRef = useRef(0);
  const anchoSetRef = useRef(0);
  const pasoRef = useRef(0);
  const pausadoRef = useRef(false);
  const pausaHastaRef = useRef(0);
  const animacionRef = useRef(0);
  const animandoRef = useRef(false);

  const desborda = total > porPantalla;

  const aplicarTransformacion = useCallback(() => {
    const anchoSet = anchoSetRef.current;
    const pista = pistaRef.current;
    if (!anchoSet || !pista) return;

    const posicion = normalizar(posicionRef.current, anchoSet);
    posicionRef.current = posicion;
    pista.style.transform = `translate3d(${-posicion}px, 0, 0)`;
  }, []);

  // Preferencia del sistema: si se reduce el movimiento, no hay autoplay.
  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const actualizar = () => setMovimientoReducido(consulta.matches);

    actualizar();
    consulta.addEventListener('change', actualizar);
    return () => consulta.removeEventListener('change', actualizar);
  }, []);

  useEffect(() => {
    const actualizar = () => setPorPantalla(tarjetasPorPantalla(window.innerWidth));
    actualizar();
    window.addEventListener('resize', actualizar);
    return () => window.removeEventListener('resize', actualizar);
  }, []);

  /**
   * Mide el ancho de una "vuelta" (una copia de toda la lista) para que el
   * desplazamiento pueda reiniciarse sin saltos visibles.
   */
  useLayoutEffect(() => {
    if (!desborda || total === 0) return undefined;

    const viewport = viewportRef.current;
    const pista = pistaRef.current;
    if (!viewport || !pista) return undefined;

    const medir = () => {
      const anchoVisible = viewport.clientWidth;
      const separacion = anchoVisible > 640 ? 28 : 20;
      const anchoTarjeta = Math.max(
        180,
        (anchoVisible - separacion * (porPantalla - 1)) / porPantalla
      );

      viewport.style.setProperty('--ancho-tarjeta', `${anchoTarjeta}px`);
      viewport.style.setProperty('--separacion', `${separacion}px`);

      const primera = pista.children[0];
      const segunda = pista.children[1];
      if (!primera || !segunda) return;

      const paso = segunda.offsetLeft - primera.offsetLeft;
      const anchoSet = paso * total;
      if (paso <= 0 || anchoSet <= 0) return;

      pasoRef.current = paso;
      anchoSetRef.current = anchoSet;

      // Copias suficientes para que la ventana nunca quede vacía al reiniciar.
      const necesarias = Math.max(3, Math.ceil(2 + anchoVisible / anchoSet));
      if (necesarias !== copias) {
        setCopias(necesarias);
        return;
      }

      if (posicionRef.current === 0) posicionRef.current = anchoSet;
      posicionRef.current = normalizar(posicionRef.current, anchoSet);
      aplicarTransformacion();
    };

    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(viewport);
    return () => observador.disconnect();
  }, [desborda, total, copias, porPantalla, aplicarTransformacion]);

  // Autoplay con requestAnimationFrame: se detiene al pasar el cursor o enfocar.
  useEffect(() => {
    if (!desborda || movimientoReducido) return undefined;

    let anterior = performance.now();
    let frame = 0;

    const avanzar = (ahora) => {
      const delta = Math.min(64, ahora - anterior);
      anterior = ahora;

      if (
        !pausadoRef.current &&
        !animandoRef.current &&
        ahora >= pausaHastaRef.current
      ) {
        posicionRef.current += (VELOCIDAD * delta) / 1000;
        aplicarTransformacion();
      }

      frame = requestAnimationFrame(avanzar);
    };

    frame = requestAnimationFrame(avanzar);
    return () => cancelAnimationFrame(frame);
  }, [desborda, movimientoReducido, aplicarTransformacion]);

  useEffect(() => () => cancelAnimationFrame(animacionRef.current), []);

  const mover = (direccion) => {
    const anchoSet = anchoSetRef.current;
    const paso = pasoRef.current;
    if (!anchoSet || !paso) return;

    cancelAnimationFrame(animacionRef.current);

    const inicio = posicionRef.current;
    const destino = inicio + direccion * paso;

    if (movimientoReducido) {
      posicionRef.current = destino;
      aplicarTransformacion();
      return;
    }

    animandoRef.current = true;
    const arranque = performance.now();

    const animar = (ahora) => {
      const avance = Math.min(1, (ahora - arranque) / DURACION_FLECHA);
      const suave = 1 - (1 - avance) ** 3;

      posicionRef.current = inicio + (destino - inicio) * suave;
      aplicarTransformacion();

      if (avance < 1) {
        animacionRef.current = requestAnimationFrame(animar);
      } else {
        animandoRef.current = false;
        pausaHastaRef.current = performance.now() + PAUSA_TRAS_FLECHA;
      }
    };

    animacionRef.current = requestAnimationFrame(animar);
  };

  const pausar = () => {
    pausadoRef.current = true;
  };

  const reanudar = () => {
    pausadoRef.current = false;
  };

  const soltarFoco = (evento) => {
    if (!evento.currentTarget.contains(evento.relatedTarget)) reanudar();
  };

  const hayProfesionales = !cargando && total > 0;

  return (
    <section id="equipo" className={styles.section} aria-labelledby="equipo-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{EQUIPO.antetitulo}</p>
          <h2 id="equipo-title" className={styles.title}>
            {EQUIPO.titulo}
          </h2>
        </header>

        {error && <p className={styles.aviso}>{error}</p>}

        {!error && !cargando && total === 0 && (
          <p className={styles.aviso}>Todavía no hay profesionales publicados.</p>
        )}

        {cargando && (
          <ul className={styles.grid}>
            {[0, 1, 2].map((indice) => (
              <Esqueleto key={`cargando-${indice}`} />
            ))}
          </ul>
        )}

        {hayProfesionales && !desborda && (
          <ul className={styles.grid}>
            {profesionales.map((profesional) => (
              <TarjetaEquipo key={profesional._id} profesional={profesional} />
            ))}
          </ul>
        )}

        {hayProfesionales && desborda && (
          <div
            className={styles.carrusel}
            role="region"
            aria-roledescription="carrusel"
            aria-label="Profesionales del equipo"
            onPointerEnter={pausar}
            onPointerLeave={reanudar}
            onTouchStart={pausar}
            onTouchEnd={reanudar}
            onTouchCancel={reanudar}
            onFocusCapture={pausar}
            onBlurCapture={soltarFoco}
          >
            <button
              type="button"
              className={`${styles.flecha} ${styles.flechaIzquierda}`}
              onClick={() => mover(-1)}
              aria-label="Ver profesionales anteriores"
            >
              <IconoFlecha sentido="izquierda" />
            </button>

            <div ref={viewportRef} className={styles.viewport}>
              <ul ref={pistaRef} className={styles.pista}>
                {Array.from({ length: copias }, (_, copia) =>
                  profesionales.map((profesional) => (
                    <TarjetaEquipo
                      key={`${profesional._id}-${copia}`}
                      profesional={profesional}
                      ariaHidden={copia > 0}
                    />
                  ))
                )}
              </ul>
            </div>

            <button
              type="button"
              className={`${styles.flecha} ${styles.flechaDerecha}`}
              onClick={() => mover(1)}
              aria-label="Ver siguientes profesionales"
            >
              <IconoFlecha sentido="derecha" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
