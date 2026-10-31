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

export default function LandingPage() {
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
