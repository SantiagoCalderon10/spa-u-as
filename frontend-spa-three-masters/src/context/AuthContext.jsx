import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { iniciarSesion as iniciarSesionApi, obtenerPerfil, registrar as registrarApi } from '../api/authService';
import {
  borrarSesion,
  guardarSesion,
  leerToken,
  leerUsuario,
} from '../utils/sesion';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() =>
    leerToken() ? leerUsuario() : null
  );
  const [cargando, setCargando] = useState(() => Boolean(leerToken()));

  // Al recargar, el token guardado se valida contra el backend.
  useEffect(() => {
    if (!leerToken()) {
      setCargando(false);
      return undefined;
    }

    let vigente = true;

    obtenerPerfil()
      .then((datos) => {
        if (!vigente) return;
        setUsuario(datos);
        guardarSesion({ token: leerToken(), usuario: datos });
      })
      .catch(() => {
        if (!vigente) return;
        borrarSesion();
        setUsuario(null);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  // El interceptor de axios avisa cuando el backend responde 401.
  useEffect(() => {
    const alExpirar = () => {
      borrarSesion();
      setUsuario(null);
    };

    window.addEventListener('tm:sesion-expirada', alExpirar);
    return () => window.removeEventListener('tm:sesion-expirada', alExpirar);
  }, []);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const datos = await iniciarSesionApi(correo, contrasena);
    guardarSesion(datos);
    setUsuario(datos.usuario);
    return datos.usuario;
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  const registrar = useCallback(async (datos) => {
    const respuesta = await registrarApi(datos);
    guardarSesion(respuesta);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  // Mantiene sincronizada la sesión cuando la clienta edita su perfil.
  const actualizarUsuario = useCallback((datos) => {
    if (!datos) return;
    setUsuario(datos);
    const token = leerToken();
    if (token) guardarSesion({ token, usuario: datos });
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      autenticado: Boolean(usuario),
      iniciarSesion,
      registrar,
      actualizarUsuario,
      cerrarSesion,
    }),
    [usuario, cargando, iniciarSesion, registrar, actualizarUsuario, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return contexto;
}
