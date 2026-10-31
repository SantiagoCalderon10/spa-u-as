import { useCallback, useEffect, useState } from 'react';
import {
  actualizarProfesional,
  crearProfesional,
  eliminarProfesional,
  getProfesionales,
} from '../api/profesionalService';
import { crearUsuario, eliminarUsuario } from '../api/usuarioService';
import { cuerpoCuentaProfesional, cuerpoPerfilProfesional } from '../utils/agenda';
import { mensajeDeError } from '../utils/catalogo';

export function useProfesionales() {
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError('');

    try {
      const datos = await getProfesionales({ signal });
      setProfesionales(Array.isArray(datos) ? datos : []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(mensajeDeError(err, 'No pudimos cargar los profesionales.'));
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  const recargar = useCallback(() => cargar(), [cargar]);

  /**
   * El perfil de profesional necesita una cuenta de usuario. En modo `nuevo`
   * se crea la cuenta y luego el perfil; si el perfil falla, se elimina la
   * cuenta recién creada para no dejarla huérfana.
   */
  const crear = useCallback(
    async (datos) => {
      if (datos.modo === 'nuevo') {
        const cuenta = await crearUsuario(cuerpoCuentaProfesional(datos));
        const idCuenta = cuenta?._id ?? cuenta?.id;

        try {
          await crearProfesional({
            ...cuerpoPerfilProfesional(datos),
            idUsuario: idCuenta,
          });
        } catch (err) {
          if (idCuenta) await eliminarUsuario(idCuenta).catch(() => {});
          throw err;
        }
      } else {
        await crearProfesional({
          ...cuerpoPerfilProfesional(datos),
          idUsuario: datos.idUsuario,
        });
      }

      await recargar();
    },
    [recargar]
  );

  const actualizar = useCallback(
    async (id, datos) => {
      await actualizarProfesional(id, cuerpoPerfilProfesional(datos));
      await recargar();
    },
    [recargar]
  );

  const eliminar = useCallback(
    async (id) => {
      await eliminarProfesional(id);
      await recargar();
    },
    [recargar]
  );

  return { profesionales, cargando, error, recargar, crear, actualizar, eliminar };
}
