import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, Menu, X, ChevronDown 
} from 'lucide-react';

import logoImg from '../assets/logo.png';

export default function Navbar({ savedCount, onOpenVIPModal, onOpenSavedDrawer }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [propertiesMega, setPropertiesMega] = useState(false);
  const [servicesMega, setServicesMega] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 w-full z-50 transition-all duration-300">
      
      {/* Main Navbar */}
      <div className={`w-full border-b border-outline-variant/10 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface/95 backdrop-blur-xl shadow-sm py-4.5' 
          : 'bg-surface/85 backdrop-blur-md py-5.5'
      }`}>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center">
          
          {/* Logo - Brand Image & Text */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="QuestSpaces Logo" width="28" height="28" className="w-[28px] h-[28px] object-contain transition-transform group-hover:scale-105" />
            <span className="font-display-lg text-[24px] tracking-tight text-primary font-extrabold header-anchor">
              QuestSpaces
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Properties Dropdown */}
            <div 
              className="relative py-1"
              onMouseEnter={() => setPropertiesMega(true)}
              onMouseLeave={() => setPropertiesMega(false)}
            >
              <Link 
                to="/properties" 
                className={`font-label-bold text-label-bold hover:text-primary transition-colors flex items-center gap-1 pb-0.5 ${
                  isActive('/properties') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
                }`}
              >
                Properties <ChevronDown size={14} />
              </Link>

              {propertiesMega && (
                <div 
                  className="absolute top-full left-0 pt-2 z-50"
                  onClick={() => setPropertiesMega(false)}
                >
                  <div className="w-[260px] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2">
                    <Link to="/properties" className="block px-5 py-2.5 text-sm text-primary font-bold hover:bg-surface-container-low transition-colors">
                      All Properties Directory
                    </Link>
                    <div className="my-1 border-t border-outline-variant/20" />
                    
                    <div className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary">
                      Top Corridors
                    </div>
                    <Link to="/properties?location=Whitefield" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Whitefield</Link>
                    <Link to="/properties?location=Sarjapur" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Sarjapur Road</Link>
                    <Link to="/properties?location=Hebbal" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Hebbal Corridor</Link>
                    <Link to="/properties?location=Indiranagar" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Indiranagar</Link>

                    <div className="my-1 border-t border-outline-variant/20" />
                    
                    <div className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary">
                      Property Types
                    </div>
                    <Link to="/properties?type=Luxury Apartment" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Luxury Apartments</Link>
                    <Link to="/properties?type=Modern Villa" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Signature Villas</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div 
              className="relative py-1"
              onMouseEnter={() => setServicesMega(true)}
              onMouseLeave={() => setServicesMega(false)}
            >
              <Link 
                to="/services" 
                className={`font-label-bold text-label-bold hover:text-primary transition-colors flex items-center gap-1 pb-0.5 ${
                  isActive('/services') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
                }`}
              >
                Services <ChevronDown size={14} />
              </Link>
              {servicesMega && (
                <div 
                  className="absolute top-full left-0 pt-2 z-50"
                  onClick={() => setServicesMega(false)}
                >
                  <div className="w-[240px] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2">
                    <Link to="/services/property-buying-selling" className="block px-5 py-2.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Buying & Selling Advisory</Link>
                    <Link to="/services/investment-consultation" className="block px-5 py-2.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Investment & Mandates</Link>
                    <Link to="/services/market-analysis" className="block px-5 py-2.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Market Feasibility Studies</Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/home-loan" 
              className={`font-label-bold text-label-bold hover:text-primary transition-colors relative py-1 pb-0.5 ${
                isActive('/home-loan') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
              }`}
            >
              Home Loans
            </Link>

            <Link 
              to="/about" 
              className={`font-label-bold text-label-bold hover:text-primary transition-colors relative py-1 pb-0.5 ${
                isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
              }`}
            >
              About Us
            </Link>

            <Link 
              to="/contact" 
              className={`font-label-bold text-label-bold hover:text-primary transition-colors relative py-1 pb-0.5 ${
                isActive('/contact') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Actionables */}
          <div className="flex items-center gap-3.5">
            <button 
              onClick={onOpenSavedDrawer}
              className="relative bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
              title="Saved Properties"
              aria-label="View saved properties"
            >
              <Heart size={18} className={savedCount > 0 ? 'text-red-500 fill-red-500 animate-pulse' : 'text-primary'} />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button 
              onClick={onOpenVIPModal} 
              className="hidden lg:block bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-lg font-label-bold text-label-bold hover:scale-95 hover:bg-secondary-fixed transition-all duration-150 shadow-sm cursor-pointer border-none font-bold"
            >
              Free Consultation
            </button>

            {/* Mobile Menu Hamburger */}
            <button 
              className="lg:hidden p-2 text-primary bg-transparent cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-primary p-6 flex flex-col gap-4 shadow-xl mobile-menu-animate max-h-[calc(100vh-80px)] overflow-y-auto">
          <Link to="/properties" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/properties') ? 'text-secondary font-bold' : 'text-primary'}`}>Properties Directory</Link>
          <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/services') ? 'text-secondary font-bold' : 'text-primary'}`}>Advisory Services</Link>
          <Link to="/home-loan" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/home-loan') ? 'text-secondary font-bold' : 'text-primary'}`}>Home Loans</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/about') ? 'text-secondary font-bold' : 'text-primary'}`}>About Us</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/contact') ? 'text-secondary font-bold' : 'text-primary'}`}>Contact Us</Link>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onOpenVIPModal(); }} 
            className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-widest hover:scale-95 transition-all duration-150 shadow-sm mt-2 cursor-pointer border-none"
          >
            Free Consultation
          </button>
        </div>
      )}
    </header>
      <div className="h-[80px] w-full shrink-0" aria-hidden="true" />
    </>
  );
}
