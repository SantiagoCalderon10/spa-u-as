import { useEffect, useState } from 'react';
import { getCitasAfectadas } from '../api/horarioService';
import { mensajeDeError } from '../utils/catalogo';

/**
 * Consulta, sin modificar nada, las citas que dejarían de encajar en una
 * franja. `cambios` se usa para evaluar una edición antes de guardarla;
 * si no se envía, se evalúa la eliminación de la franja.
 */
export function useCitasAfectadas({ id, cambios = null, activo = true } = {}) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Clave estable: evita repetir la consulta cuando el padre renderiza con un
  // objeto literal equivalente.
  const clave = id ? JSON.stringify([id, cambios ?? {}]) : '';

  useEffect(() => {
    if (!activo || !id) {
      setCitas([]);
      setCargando(false);
      setError('');
      return undefined;
    }

    const control = new AbortController();
    setCargando(true);
    setError('');

    getCitasAfectadas(id, cambios, { signal: control.signal })
      .then((datos) => {
        if (!control.signal.aborted) setCitas(Array.isArray(datos) ? datos : []);
      })
      .catch((err) => {
        if (control.signal.aborted) return;
        setCitas([]);
        setError(mensajeDeError(err, 'No pudimos consultar las citas de esta franja.'));
      })
      .finally(() => {
        if (!control.signal.aborted) setCargando(false);
      });

    return () => control.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, clave, activo]);

  return { citas, cargando, error };
}
