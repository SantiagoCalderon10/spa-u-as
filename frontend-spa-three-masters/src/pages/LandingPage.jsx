import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import PilaresSection from '../components/Pilares/PilaresSection';
import SalonSection from '../components/Salon/SalonSection';
import CatalogoSection from '../components/Catalogo/CatalogoSection';
import GaleriaSection from '../components/Galeria/GaleriaSection';
import EquipoSection from '../components/Equipo/EquipoSection';
import CuidadoSection from '../components/Cuidado/CuidadoSection';
import InvitacionSection from '../components/Invitacion/InvitacionSection';
import ContactoSection from '../components/Contacto/ContactoSection';
import Footer from '../components/Footer/Footer';
import useScrollReveal from '../hooks/useScrollReveal';

export default function LandingPage() {
  // El hero tiene su propia entrada escalonada; el resto de secciones aparece
  // con un desplazamiento suave al entrar en el viewport.
  useScrollReveal('main > section:not(:first-child)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <PilaresSection />
        <SalonSection />
        <CatalogoSection />
        <GaleriaSection />
        <EquipoSection />
        <CuidadoSection />
        <InvitacionSection />
        <ContactoSection />
      </main>
      <Footer />
    </div>
  );
}
