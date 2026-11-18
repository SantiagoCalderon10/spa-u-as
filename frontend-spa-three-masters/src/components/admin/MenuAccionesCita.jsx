import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MenuAccionesCita.module.css';

function IconoPuntos() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}

function IconoReprogramar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function IconoCompletar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function IconoNoAsistio() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4 20c0-3.2 2.7-5.4 6-5.4 1.2 0 2.3.3 3.2.8" />
      <path d="m16 16 5 5M21 16l-5 5" />
    </svg>
  );
}

function IconoCancelar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

/**
 * Menú de acciones de una cita. Se renderiza en un portal para que el
 * desplegable no quede recortado por el contenedor con scroll de la tabla.
 */
export default function MenuAccionesCita({
  nombre,
  ocupada = false,
  accion,
  onReprogramar,
  onCompletar,
  onNoAsistir,
  onCancelar,
}) {
  const [abierto, setAbierto] = useState(false);
  const [posicion, setPosicion] = useState(null);
  const idMenu = useId();
  const botonRef = useRef(null);
  const menuRef = useRef(null);
  const enfocarPrimeraOpcion = useRef(false);

  const completando = ocupada && accion?.tipo === 'completar';

  const cerrar = useCallback((devolverFoco = false) => {
    setAbierto(false);
    setPosicion(null);
    if (devolverFoco) botonRef.current?.focus();
  }, []);

  const ubicar = useCallback(() => {
    const boton = botonRef.current;
    const menu = menuRef.current;
    if (!boton || !menu) return;

    const rect = boton.getBoundingClientRect();
    const ancho = menu.offsetWidth;
    const alto = menu.offsetHeight;
    const margen = 8;
    const espacioAbajo = window.innerHeight - rect.bottom;
    const abrirArriba = espacioAbajo < alto + margen && rect.top > espacioAbajo;

    setPosicion({
      top: abrirArriba
        ? Math.max(margen, rect.top - alto - margen)
        : Math.min(rect.bottom + margen, Math.max(margen, window.innerHeight - alto - margen)),
      left: Math.max(margen, Math.min(rect.right - ancho, window.innerWidth - ancho - margen)),
    });
  }, []);

  useLayoutEffect(() => {
    if (!abierto) return undefined;

    ubicar();
    if (enfocarPrimeraOpcion.current) {
      menuRef.current?.querySelector('button:not(:disabled)')?.focus();
      enfocarPrimeraOpcion.current = false;
    }

    const alHacerClicFuera = (evento) => {
      if (botonRef.current?.contains(evento.target) || menuRef.current?.contains(evento.target)) {
        return;
      }
      cerrar();
    };

    const alTeclear = (evento) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        cerrar(true);
      }
    };

    document.addEventListener('pointerdown', alHacerClicFuera);
    document.addEventListener('keydown', alTeclear);
    window.addEventListener('resize', ubicar);
    window.addEventListener('scroll', ubicar, true);

    return () => {
      document.removeEventListener('pointerdown', alHacerClicFuera);
      document.removeEventListener('keydown', alTeclear);
      window.removeEventListener('resize', ubicar);
      window.removeEventListener('scroll', ubicar, true);
    };
  }, [abierto, cerrar, ubicar]);

  // Si la cita deja de estar disponible mientras el menú está abierto.
  useEffect(() => {
    if (ocupada) cerrar();
  }, [ocupada, cerrar]);

  const abrir = () => {
    enfocarPrimeraOpcion.current = true;
    setAbierto(true);
  };

  const alTeclearBoton = (evento) => {
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      abrir();
    }
  };

  const alTeclearMenu = (evento) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(evento.key)) return;

    const opciones = Array.from(menuRef.current?.querySelectorAll('button:not(:disabled)') ?? []);
    if (opciones.length === 0) return;

    evento.preventDefault();
    const actual = opciones.indexOf(document.activeElement);
    let siguiente;

    if (evento.key === 'Home') siguiente = 0;
    else if (evento.key === 'End') siguiente = opciones.length - 1;
    else if (evento.key === 'ArrowDown') siguiente = (actual + 1) % opciones.length;
    else siguiente = (actual - 1 + opciones.length) % opciones.length;

    opciones[siguiente]?.focus();
  };

  const ejecutar = (operacion) => () => {
    cerrar();
    operacion();
  };

  const items = [
    {
      clave: 'reprogramar',
      etiqueta: 'Reprogramar cita',
      descripcion: 'Elige otra fecha u hora',
      icono: <IconoReprogramar />,
      operacion: onReprogramar,
    },
    {
      clave: 'completar',
      etiqueta: 'Marcar como completada',
      descripcion: 'El servicio ya se realizó',
      icono: <IconoCompletar />,
      operacion: onCompletar,
      cargando: completando,
    },
    {
      clave: 'noAsistio',
      etiqueta: 'Marcar como no asistió',
      descripcion: 'La clienta no llegó a la cita',
      icono: <IconoNoAsistio />,
      operacion: onNoAsistir,
    },
    {
      clave: 'cancelar',
      etiqueta: 'Cancelar cita',
      descripcion: 'Registra el motivo y avisa a la clienta',
      icono: <IconoCancelar />,
      operacion: onCancelar,
      peligro: true,
    },
  ];

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        className={`${styles.disparador} ${abierto ? styles.disparadorAbierto : ''}`}
        onClick={() => (abierto ? cerrar() : abrir())}
        onKeyDown={alTeclearBoton}
        disabled={ocupada}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={idMenu}
        aria-label={`Acciones para la cita de ${nombre}`}
        title="Ver acciones de la cita"
      >
        {completando ? <span className={styles.girador} aria-hidden="true" /> : <IconoPuntos />}
      </button>

      {abierto &&
        createPortal(
          <div
            id={idMenu}
            ref={menuRef}
            role="menu"
            aria-label={`Acciones para la cita de ${nombre}`}
            className={styles.menu}
            style={{
              top: posicion?.top ?? 0,
              left: posicion?.left ?? 0,
              visibility: posicion ? 'visible' : 'hidden',
            }}
            onKeyDown={alTeclearMenu}
          >
            <p className={styles.titulo} role="presentation">
              Acciones de la cita
            </p>
            {items.map((item) => (
              <button
                key={item.clave}
                type="button"
                role="menuitem"
                className={`${styles.opcion} ${item.peligro ? styles.opcionPeligro : ''}`}
                onClick={ejecutar(item.operacion)}
                disabled={ocupada}
              >
                <span className={`${styles.icono} ${item.peligro ? styles.iconoPeligro : ''}`}>
                  {item.icono}
                </span>
                <span className={styles.texto}>
                  <span className={styles.etiqueta}>{item.etiqueta}</span>
                  <span className={styles.descripcion}>{item.descripcion}</span>
                </span>
                {item.cargando && <span className={styles.girador} aria-hidden="true" />}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
