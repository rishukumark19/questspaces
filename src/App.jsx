import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout & Modals
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyActionables from './components/StickyActionables';
import VIPBookingModal from './components/VIPBookingModal';
import SavedPropertiesDrawer from './components/SavedPropertiesDrawer';

// Data
import { PROPERTIES } from './data/properties';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import HomeLoan from './pages/HomeLoan';
import Career from './pages/Career';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const local = localStorage.getItem('questspaces_saved');
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  });

  const [isVIPModalOpen, setIsVIPModalOpen] = useState(false);
  const [vipPropertyTitle, setVipPropertyTitle] = useState('');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Toggle Save Property
  const handleToggleSave = (property) => {
    let updated;
    if (savedIds.includes(property.id)) {
      updated = savedIds.filter(id => id !== property.id);
    } else {
      updated = [...savedIds, property.id];
    }
    setSavedIds(updated);
    try {
      localStorage.setItem('questspaces_saved', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleRemoveSaved = (id) => {
    const updated = savedIds.filter(i => i !== id);
    setSavedIds(updated);
    try {
      localStorage.setItem('questspaces_saved', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleOpenVIPModal = (propertyTitle = '') => {
    setVipPropertyTitle(propertyTitle);
    setIsVIPModalOpen(true);
  };

  const savedPropertiesList = PROPERTIES.filter(p => savedIds.includes(p.id));

  return (
    <Router basename="/questspaces">
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar 
          savedCount={savedIds.length} 
          onOpenVIPModal={() => handleOpenVIPModal()}
          onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home savedIds={savedIds} onToggleSave={handleToggleSave} onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/properties" element={<Properties savedIds={savedIds} onToggleSave={handleToggleSave} onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/property/:id" element={<PropertyDetail savedIds={savedIds} onToggleSave={handleToggleSave} onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/about" element={<About onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/services" element={<Services onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/services/:slug" element={<ServiceDetail onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/home-loan" element={<HomeLoan onOpenVIPModal={handleOpenVIPModal} />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Actionables */}
        <StickyActionables onOpenVIPModal={() => handleOpenVIPModal()} />

        {/* VIP Booking Modal */}
        <VIPBookingModal 
          isOpen={isVIPModalOpen} 
          onClose={() => setIsVIPModalOpen(false)}
          propertyTitle={vipPropertyTitle}
        />

        {/* Saved Properties Drawer */}
        <SavedPropertiesDrawer 
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          savedProperties={savedPropertiesList}
          onRemoveSaved={handleRemoveSaved}
        />
      </div>
    </Router>
  );
}
