import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CategoriasAdminPage from './pages/admin/CategoriasAdminPage';
import HorariosAdminPage from './pages/admin/HorariosAdminPage';
import ProfesionalesAdminPage from './pages/admin/ProfesionalesAdminPage';
import ServiciosAdminPage from './pages/admin/ServiciosAdminPage';
import LandingPage from './pages/LandingPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="servicios" replace />} />
          <Route path="servicios" element={<ServiciosAdminPage />} />
          <Route path="categorias" element={<CategoriasAdminPage />} />
          <Route path="profesionales" element={<ProfesionalesAdminPage />} />
          <Route path="horarios" element={<HorariosAdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
