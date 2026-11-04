import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RutaPrivada from './components/admin/RutaPrivada';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import ProfesionalLayout from './layouts/ProfesionalLayout';
import PublicLayout from './layouts/PublicLayout';
import CategoriasAdminPage from './pages/admin/CategoriasAdminPage';
import CitasAdminPage from './pages/admin/CitasAdminPage';
import HorariosAdminPage from './pages/admin/HorariosAdminPage';
import LoginPage from './pages/admin/LoginPage';
import ProfesionalesAdminPage from './pages/admin/ProfesionalesAdminPage';
import ResumenAdminPage from './pages/admin/ResumenAdminPage';
import ServiciosAdminPage from './pages/admin/ServiciosAdminPage';
import AgendaProfesionalPage from './pages/profesional/AgendaProfesionalPage';
import LandingPage from './pages/LandingPage';
import CitaTokenPage from './pages/publico/CitaTokenPage';
import CuentaPage from './pages/publico/CuentaPage';
import DetalleCitaPage from './pages/publico/DetalleCitaPage';
import PerfilClientePage from './pages/publico/PerfilClientePage';
import ReservaPage from './pages/publico/ReservaPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicLayout />}>
            <Route path="reservar" element={<ReservaPage />} />
            <Route path="cita/:token" element={<CitaTokenPage />} />
            <Route path="cuenta" element={<CuentaPage />} />
            <Route element={<RutaPrivada roles={['cliente']} loginPath="/cuenta" />}>
              <Route path="cuenta/perfil" element={<PerfilClientePage />} />
              <Route path="cuenta/citas/:id" element={<DetalleCitaPage />} />
            </Route>
          </Route>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<RutaPrivada roles={['administrador']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="resumen" replace />} />
              <Route path="resumen" element={<ResumenAdminPage />} />
              <Route path="citas" element={<CitasAdminPage />} />
              <Route path="servicios" element={<ServiciosAdminPage />} />
              <Route path="categorias" element={<CategoriasAdminPage />} />
              <Route path="profesionales" element={<ProfesionalesAdminPage />} />
              <Route path="horarios" element={<HorariosAdminPage />} />
            </Route>
          </Route>
          <Route element={<RutaPrivada roles={['profesional']} />}>
            <Route path="/profesional" element={<ProfesionalLayout />}>
              <Route index element={<Navigate to="agenda" replace />} />
              <Route path="agenda" element={<AgendaProfesionalPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
