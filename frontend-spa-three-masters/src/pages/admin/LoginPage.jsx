import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Boton from '../../components/admin/Boton';
import Campo from '../../components/admin/Campo';
import { useAuth } from '../../context/AuthContext';
import { mensajeDeError } from '../../utils/catalogo';
import formulario from '../../components/admin/Formulario.module.css';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const PANEL_POR_ROL = {
    administrador: '/admin',
    profesional: '/profesional/agenda',
  };

  const destinoPara = (rol) => {
    const panel = PANEL_POR_ROL[rol];
    const solicitado = ubicacion.state?.desde?.pathname;
    return solicitado && solicitado.startsWith(panel) ? solicitado : panel;
  };

  const panelActual = usuario ? PANEL_POR_ROL[usuario.rol] : null;

  // Si ya hay una sesión con panel, el login no tiene sentido.
  if (panelActual) {
    return <Navigate to={destinoPara(usuario.rol)} replace />;
  }

  const validar = () => {
    const nuevos = {};

    if (!correo.trim()) {
      nuevos.correo = 'Escribe tu correo.';
    }

    if (!contrasena) {
      nuevos.contrasena = 'Escribe tu contraseña.';
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const alEnviar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');

    if (!validar()) return;

    setEnviando(true);

    try {
      const cuenta = await iniciarSesion(correo.trim(), contrasena);

      if (!cuenta || !PANEL_POR_ROL[cuenta.rol]) {
        cerrarSesion();
        setErrorGeneral('Esta cuenta no tiene acceso al panel de gestión.');
        return;
      }

      navegar(destinoPara(cuenta.rol), { replace: true });
    } catch (err) {
      setErrorGeneral(
        mensajeDeError(err, 'No pudimos iniciar sesión. Revisa tus datos e intenta de nuevo.')
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.pantalla}>
      <section className={styles.tarjeta} aria-labelledby="titulo-login">
        <Link to="/" className={styles.marca}>
          Three Masters
        </Link>

        <p className={styles.etiqueta}>Espacio de gestión</p>
        <h1 className={styles.titulo} id="titulo-login">
          Iniciar sesión
        </h1>
        <p className={styles.intro}>
          Ingresa con tu cuenta de administración o profesional para gestionar el atelier.
        </p>

        {errorGeneral && (
          <p className={styles.errorGeneral} role="alert">
            {errorGeneral}
          </p>
        )}

        <form className={formulario.formulario} onSubmit={alEnviar} noValidate>
          <Campo etiqueta="Correo" htmlFor="correo" error={errores.correo}>
            <input
              id="correo"
              name="correo"
              type="email"
              className={formulario.control}
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              autoComplete="username"
              placeholder="tu@correo.com"
              disabled={enviando}
              aria-invalid={errores.correo ? 'true' : undefined}
            />
          </Campo>

          <Campo etiqueta="Contraseña" htmlFor="contrasena" error={errores.contrasena}>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              className={formulario.control}
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              disabled={enviando}
              aria-invalid={errores.contrasena ? 'true' : undefined}
            />
          </Campo>

          <Boton tipo="submit" variante="primario" cargando={enviando} className={styles.accion}>
            {enviando ? 'Verificando…' : 'Entrar al panel'}
          </Boton>
        </form>

        <p className={styles.pie}>
          ¿Necesitas ver el sitio?{' '}
          <Link to="/" className={styles.enlace}>
            Volver a la página pública
          </Link>
        </p>
      </section>
    </main>
  );
}
