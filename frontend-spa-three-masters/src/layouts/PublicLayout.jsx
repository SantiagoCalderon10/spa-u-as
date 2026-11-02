import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './PublicLayout.module.css';

// Marco de las páginas públicas que no son la landing (reserva y enlace con
// token). Mantiene la barra de navegación y el pie del sitio.
export default function PublicLayout() {
  return (
    <div className={styles.layout}>
      <Navbar enLanding={false} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
