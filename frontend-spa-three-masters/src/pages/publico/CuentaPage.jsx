import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CampoContrasena from '../../components/CampoContrasena';
import { mensajeDeError } from '../../utils/catalogo';
import {
  EJEMPLO_TELEFONO,
  MAX_TELEFONO_FORMATEADO,
  MENSAJES,
  correoValido,
  digitosTelefono,
  formatearTelefono,
  normalizarCorreo,
  telefonoValido,
} from '../../utils/validacion';
import styles from './Cuenta.module.css';

const DESTINO_POR_ROL = {
  cliente: '/cuenta/perfil',
  administrador: '/admin',
  profesional: '/profesional/agenda',
};

const REGISTRO_INICIAL = {
  nombrecompleto: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmar: '',
};

export default function CuentaPage() {
  const { usuario, iniciarSesion, registrar } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [modo, setModo] = useState('login');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [registro, setRegistro] = useState(REGISTRO_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to={DESTINO_POR_ROL[usuario.rol] ?? '/'} replace />;
  }

  const destino = () => {
    const solicitado = ubicacion.state?.desde?.pathname;
    return solicitado && solicitado.startsWith('/cuenta') ? solicitado : '/cuenta/perfil';
  };

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setErrores({});
    setErrorGeneral('');
  };

  const validarLogin = () => {
    const nuevos = {};
    if (!correo.trim()) {
      nuevos.correo = 'Escribe tu correo.';
    } else if (!correoValido(correo)) {
      nuevos.correo = MENSAJES.correo;
    }
    if (!contrasena) nuevos.contrasena = 'Escribe tu contraseña.';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const validarRegistro = () => {
    const nuevos = {};

    if (registro.nombrecompleto.trim().length < 3) {
      nuevos.nombrecompleto = 'Escribe tu nombre completo.';
    }
    if (!correoValido(registro.correo)) {
      nuevos.correo = MENSAJES.correo;
    }
    if (!telefonoValido(registro.telefono)) {
      nuevos.telefono = MENSAJES.telefono;
    }
    if (registro.contrasena.length < 6) {
      nuevos.contrasena = 'Usa al menos 6 caracteres.';
    }
    if (registro.confirmar !== registro.contrasena) {
      nuevos.confirmar = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const alEntrar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');
    if (!validarLogin()) return;

    setEnviando(true);
    try {
      const cuenta = await iniciarSesion(normalizarCorreo(correo), contrasena);
      navegar(DESTINO_POR_ROL[cuenta?.rol] ?? destino(), { replace: true });
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos iniciar sesión. Revisa tus datos e intenta de nuevo.')
      );
    } finally {
      setEnviando(false);
    }
  };

  const alRegistrar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');
    if (!validarRegistro()) return;

    const correoNormalizado = normalizarCorreo(registro.correo);
    const telefono = digitosTelefono(registro.telefono);

    setEnviando(true);
    try {
      await registrar({
        nombreusuario: correoNormalizado.split('@')[0] || 'clienta',
        correo: correoNormalizado,
        telefono,
        nombrecompleto: registro.nombrecompleto.trim(),
        contrasena: registro.contrasena,
      });
      navegar('/cuenta/perfil', { replace: true });
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos crear tu cuenta. Revisa tus datos e intenta de nuevo.')
      );
    } finally {
      setEnviando(false);
    }
  };

  const campoRegistro = (nombre) => {
    const esTelefono = nombre === 'telefono';

    return {
      id: `registro-${nombre}`,
      name: nombre,
      value: registro[nombre],
      onChange: (evento) => {
        const valor = esTelefono
          ? formatearTelefono(evento.target.value)
          : evento.target.value;
        setRegistro((previo) => ({ ...previo, [nombre]: valor }));
      },
      'aria-invalid': Boolean(errores[nombre]),
      'aria-describedby': errores[nombre] ? `registro-${nombre}-error` : undefined,
      ...(esTelefono
        ? { maxLength: MAX_TELEFONO_FORMATEADO, placeholder: EJEMPLO_TELEFONO }
        : {}),
    };
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Tu espacio</span>
          <h1 className={styles.title}>Mi cuenta</h1>
          <p className={styles.subtitle}>
            Crea tu cuenta para reservar más rápido, revisar tus citas y mantener tus datos
            al día. La cuenta es opcional: también puedes reservar sin crearla.
          </p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.aside} aria-label="Qué puedes hacer con tu cuenta">
            <h2 className={styles.asideTitle}>Con tu cuenta puedes</h2>
            <ul className={styles.lista}>
              <li>Ver y actualizar tus datos de contacto.</li>
              <li>Consultar tus citas próximas y tu historial.</li>
              <li>Reservar sin volver a escribir tu información.</li>
            </ul>
            <p className={styles.asideNote}>
              ¿Solo quieres agendar?{' '}
              <Link to="/reservar" className={styles.textLink}>
                Reserva como invitada
              </Link>
              .
            </p>
          </aside>

          <section className={styles.card} aria-labelledby="cuenta-form-title">
            <div className={styles.tabs} role="tablist" aria-label="Entrar o crear cuenta">
              <button
                type="button"
                role="tab"
                aria-selected={modo === 'login'}
                className={`${styles.tab} ${modo === 'login' ? styles.tabActive : ''}`}
                onClick={() => cambiarModo('login')}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={modo === 'registro'}
                className={`${styles.tab} ${modo === 'registro' ? styles.tabActive : ''}`}
                onClick={() => cambiarModo('registro')}
              >
                Crear cuenta
              </button>
            </div>

            <h2 className={styles.cardTitle} id="cuenta-form-title">
              {modo === 'login' ? 'Bienvenida de nuevo' : 'Crea tu cuenta'}
            </h2>

            {errorGeneral && (
              <p className={styles.errorGeneral} role="alert">
                {errorGeneral}
              </p>
            )}

            {modo === 'login' ? (
              <form className={styles.form} onSubmit={alEntrar} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cuenta-correo">
                    Correo
                  </label>
                  <input
                    className={styles.input}
                    id="cuenta-correo"
                    name="correo"
                    type="email"
                    autoComplete="email"
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)}
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={errores.correo ? 'cuenta-correo-error' : undefined}
                  />
                  {errores.correo && (
                    <span className={styles.error} id="cuenta-correo-error" role="alert">
                      {errores.correo}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cuenta-contrasena">
                    Contraseña
                  </label>
                  <CampoContrasena
                    className={styles.input}
                    id="cuenta-contrasena"
                    name="contrasena"
                    autoComplete="current-password"
                    value={contrasena}
                    onChange={(evento) => setContrasena(evento.target.value)}
                    aria-invalid={Boolean(errores.contrasena)}
                    aria-describedby={
                      errores.contrasena ? 'cuenta-contrasena-error' : undefined
                    }
                  />
                  {errores.contrasena && (
                    <span className={styles.error} id="cuenta-contrasena-error" role="alert">
                      {errores.contrasena}
                    </span>
                  )}
                </div>

                <button className={styles.primary} type="submit" disabled={enviando}>
                  {enviando ? 'Entrando…' : 'Entrar'}
                </button>
              </form>
            ) : (
              <form className={styles.form} onSubmit={alRegistrar} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="registro-nombrecompleto">
                    Nombre completo
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    autoComplete="name"
                    {...campoRegistro('nombrecompleto')}
                  />
                  {errores.nombrecompleto && (
                    <span
                      className={styles.error}
                      id="registro-nombrecompleto-error"
                      role="alert"
                    >
                      {errores.nombrecompleto}
                    </span>
                  )}
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="registro-correo">
                      Correo
                    </label>
                    <input
                      className={styles.input}
                      type="email"
                      autoComplete="email"
                      {...campoRegistro('correo')}
                    />
                    {errores.correo && (
                      <span className={styles.error} id="registro-correo-error" role="alert">
                        {errores.correo}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="registro-telefono">
                      Teléfono
                    </label>
                    <input
                      className={styles.input}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      {...campoRegistro('telefono')}
                    />
                    {errores.telefono && (
                      <span className={styles.error} id="registro-telefono-error" role="alert">
                        {errores.telefono}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="registro-contrasena">
                      Contraseña
                    </label>
                    <CampoContrasena
                      className={styles.input}
                      autoComplete="new-password"
                      {...campoRegistro('contrasena')}
                    />
                    {errores.contrasena && (
                      <span
                        className={styles.error}
                        id="registro-contrasena-error"
                        role="alert"
                      >
                        {errores.contrasena}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="registro-confirmar">
                      Repite la contraseña
                    </label>
                    <CampoContrasena
                      className={styles.input}
                      autoComplete="new-password"
                      {...campoRegistro('confirmar')}
                    />
                    {errores.confirmar && (
                      <span
                        className={styles.error}
                        id="registro-confirmar-error"
                        role="alert"
                      >
                        {errores.confirmar}
                      </span>
                    )}
                  </div>
                </div>

                <p className={styles.hint}>
                  Usa el mismo nombre y teléfono con los que reservaste antes para ver tus
                  citas anteriores.
                </p>

                <button className={styles.primary} type="submit" disabled={enviando}>
                  {enviando ? 'Creando cuenta…' : 'Crear mi cuenta'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
