import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout & Modals
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyActionables from './components/StickyActionables';
import VIPBookingModal from './components/VIPBookingModal';
import SavedPropertiesDrawer from './components/SavedPropertiesDrawer';

// Data & Hooks
import { PROPERTIES } from './data/properties';
import { useProperties } from './hooks/useProperties';

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

// Admin Pages & Components
import AdminLayout from './admin/components/AdminLayout';
import RequireAuth from './admin/components/RequireAuth';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProperties from './admin/pages/AdminProperties';
import AdminPropertyNew from './admin/pages/AdminPropertyNew';
import AdminPropertyEdit from './admin/pages/AdminPropertyEdit';
import AdminPropertyPreview from './admin/pages/AdminPropertyPreview';
import AdminLeads from './admin/pages/AdminLeads';

// Scroll to top and Title updater helper
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Dynamic Document Title
    const routeTitles = {
      '/': 'Quest Spaces | Premium Real Estate Advisory in Bengaluru',
      '/properties': 'Explore Properties | Quest Spaces',
      '/about': 'About Us | Quest Spaces',
      '/services': 'Our Services | Quest Spaces',
      '/home-loan': 'Home Loan Calculator | Quest Spaces',
      '/career': 'Careers | Quest Spaces',
      '/contact': 'Contact Us | Quest Spaces',
      '/privacy-policy': 'Privacy Policy | Quest Spaces'
    };

    let title = 'Quest Spaces';
    if (pathname.startsWith('/property/')) {
      title = 'Property Details | Quest Spaces';
    } else {
      title = routeTitles[pathname] || title;
    }
    
    document.title = title;
  }, [pathname]);
  return null;
}

function PublicLayout({ children, savedIds, handleToggleSave, handleRemoveSaved, handleOpenVIPModal, isVIPModalOpen, vipPropertyTitle, setIsVIPModalOpen, isSavedDrawerOpen, setIsSavedDrawerOpen, savedPropertiesList }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar 
        savedCount={savedIds.length} 
        onOpenVIPModal={() => handleOpenVIPModal()}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <StickyActionables onOpenVIPModal={() => handleOpenVIPModal()} />
      <VIPBookingModal 
        isOpen={isVIPModalOpen} 
        onClose={() => setIsVIPModalOpen(false)}
        propertyTitle={vipPropertyTitle}
      />
      <SavedPropertiesDrawer 
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveSaved={handleRemoveSaved}
      />
    </div>
  );
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

  const { properties = [] } = useProperties();

  const handleOpenVIPModal = (propertyTitle = '') => {
    setVipPropertyTitle(propertyTitle);
    setIsVIPModalOpen(true);
  };

  const savedPropertiesList = (properties || []).filter(p => savedIds.includes(p.id) || savedIds.includes(p.slug));

  return (
    <Router basename="/questspaces">
      <RouteEffects />
      <Routes>
        {/* Admin Routes - No Public Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/new" element={<AdminPropertyNew />} />
          <Route path="properties/:id/edit" element={<AdminPropertyEdit />} />
          <Route path="properties/:id/preview" element={<AdminPropertyPreview />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>

        {/* Public Routes with Layout */}
        <Route path="*" element={
          <PublicLayout 
            savedIds={savedIds}
            handleToggleSave={handleToggleSave}
            handleRemoveSaved={handleRemoveSaved}
            handleOpenVIPModal={handleOpenVIPModal}
            isVIPModalOpen={isVIPModalOpen}
            vipPropertyTitle={vipPropertyTitle}
            setIsVIPModalOpen={setIsVIPModalOpen}
            isSavedDrawerOpen={isSavedDrawerOpen}
            setIsSavedDrawerOpen={setIsSavedDrawerOpen}
            savedPropertiesList={savedPropertiesList}
          >
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
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}
