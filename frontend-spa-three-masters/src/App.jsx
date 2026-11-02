import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RutaPrivada from './components/admin/RutaPrivada';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import CategoriasAdminPage from './pages/admin/CategoriasAdminPage';
import CitasAdminPage from './pages/admin/CitasAdminPage';
import HorariosAdminPage from './pages/admin/HorariosAdminPage';
import LoginPage from './pages/admin/LoginPage';
import ProfesionalesAdminPage from './pages/admin/ProfesionalesAdminPage';
import ServiciosAdminPage from './pages/admin/ServiciosAdminPage';
import LandingPage from './pages/LandingPage';
import CitaTokenPage from './pages/publico/CitaTokenPage';
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
          </Route>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<RutaPrivada />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="servicios" replace />} />
              <Route path="resumen" element={<Navigate to="citas" replace />} />
              <Route path="citas" element={<CitasAdminPage />} />
              <Route path="servicios" element={<ServiciosAdminPage />} />
              <Route path="categorias" element={<CategoriasAdminPage />} />
              <Route path="profesionales" element={<ProfesionalesAdminPage />} />
              <Route path="horarios" element={<HorariosAdminPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
