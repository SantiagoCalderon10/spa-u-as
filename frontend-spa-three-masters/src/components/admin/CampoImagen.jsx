import { useEffect, useRef, useState } from 'react';
import { subirImagen } from '../../api/uploadService';
import { mensajeDeError } from '../../utils/catalogo';
import styles from './Formulario.module.css';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const TAMANO_MAXIMO = 5 * 1024 * 1024;

function IconoImagen() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 15.5-4.5-4.5L7 20.5" />
    </svg>
  );
}

/**
 * Selector de imagen con arrastrar-y-soltar. Sube el archivo en el momento y
 * entrega la URL resultante al formulario; el campo `urlFoto` no cambia.
 */
export default function CampoImagen({
  id,
  valor,
  carpeta = 'servicios',
  descritoPor,
  onCambiar,
}) {
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState('');
  const [arrastrando, setArrastrando] = useState(false);
  const [imagenRota, setImagenRota] = useState(false);

  useEffect(() => {
    setImagenRota(false);
  }, [valor]);

  const subir = async (archivo) => {
    if (!archivo) return;

    setError('');

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      setError('Usa una imagen JPG, PNG, WEBP o AVIF.');
      return;
    }

    if (archivo.size > TAMANO_MAXIMO) {
      setError('La imagen no puede superar 5 MB.');
      return;
    }

    setSubiendo(true);
    setProgreso(0);

    try {
      const url = await subirImagen(archivo, { carpeta, onProgress: setProgreso });
      onCambiar(url);
    } catch (fallo) {
      setError(
        mensajeDeError(fallo, 'No pudimos subir la imagen. Intenta de nuevo.')
      );
    } finally {
      setSubiendo(false);
      setProgreso(0);
      // Permite volver a elegir el mismo archivo si algo falló.
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const soltar = (evento) => {
    evento.preventDefault();
    setArrastrando(false);
    subir(evento.dataTransfer.files?.[0]);
  };

  const salir = (evento) => {
    if (!evento.currentTarget.contains(evento.relatedTarget)) {
      setArrastrando(false);
    }
  };

  const mostrarImagen = Boolean(valor) && !imagenRota;
  const porcentaje = progreso > 0 ? ` ${progreso}%` : '';
  const ayuda = subiendo
    ? `Subiendo imagen…${porcentaje}`
    : 'Arrastra una foto o elige un archivo. JPG, PNG, WEBP o AVIF · máx. 5 MB.';

  return (
    <div
      className={`${styles.zonaImagen} ${arrastrando ? styles.zonaImagenActiva : ''}`}
      onDragEnter={(evento) => {
        evento.preventDefault();
        setArrastrando(true);
      }}
      onDragOver={(evento) => evento.preventDefault()}
      onDragLeave={salir}
      onDrop={soltar}
      aria-busy={subiendo}
    >
      <span className={styles.vistaPreviaImagen} aria-hidden="true">
        {mostrarImagen ? (
          <img src={valor} alt="" onError={() => setImagenRota(true)} />
        ) : (
          <IconoImagen />
        )}
      </span>

      <div className={styles.zonaTexto}>
        <p className={styles.zonaTitulo}>{valor ? 'Imagen cargada' : 'Sin imagen'}</p>
        <p className={styles.zonaAyuda}>{ayuda}</p>
      </div>

      <div className={styles.zonaAcciones}>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={TIPOS_PERMITIDOS.join(',')}
          className={styles.inputOculto}
          aria-describedby={descritoPor || undefined}
          onChange={(evento) => subir(evento.target.files?.[0])}
          disabled={subiendo}
        />
        <label htmlFor={id} className={styles.botonArchivo} aria-busy={subiendo}>
          {subiendo ? 'Subiendo…' : valor ? 'Cambiar foto' : 'Subir foto'}
        </label>

        {valor && !subiendo && (
          <button
            type="button"
            className={styles.quitarImagen}
            onClick={() => {
              setError('');
              onCambiar('');
            }}
          >
            Quitar
          </button>
        )}
      </div>

      {error && (
        <p className={`${styles.errorGrupo} ${styles.errorImagen}`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
