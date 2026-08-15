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
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoImg} alt="Quest Spaces Logo" className="w-8 h-8 object-contain transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-semibold text-[#0F172A] leading-none tracking-[0.02em] transition-colors group-hover:text-[#C9A35A]">
                Quest Spaces
              </span>
              <span className="text-[9px] tracking-[0.18em] text-[#6B7280] uppercase mt-1.5 font-sans font-semibold">
                Real Estate Advisory
              </span>
            </div>
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
                    <Link to="/properties?location=Hebbal" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Hebbal Corridor</Link>
                    <Link to="/properties?location=Yelahanka" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Yelahanka</Link>
                    <Link to="/properties?location=Manyata%20Tech%20Park" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Manyata Tech Park</Link>
                    <Link to="/properties?location=Devanahalli" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Devanahalli Belt</Link>
                    <Link to="/properties?location=Thanisandra" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Thanisandra Road</Link>

                    <div className="my-1 border-t border-outline-variant/20" />
                    
                    <div className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary">
                      Property Types
                    </div>
                    <Link to="/properties?type=Luxury Apartment" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Luxury Apartments</Link>
                    <Link to="/properties?type=Modern Villa" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Modern Villas</Link>
                    <Link to="/properties?type=Row House" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Luxury Row Houses</Link>
                    <Link to="/properties?type=Investment Plot" className="block px-5 py-1.5 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Investment Plots</Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/about" 
              className={`font-label-bold text-label-bold hover:text-primary transition-colors relative py-1 pb-0.5 ${
                isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
              }`}
            >
              About Us
            </Link>

            {/* More Dropdown */}
            <div 
              className="relative py-1"
              onMouseEnter={() => setServicesMega(true)}
              onMouseLeave={() => setServicesMega(false)}
            >
              <button 
                className={`font-label-bold text-label-bold hover:text-primary transition-colors flex items-center gap-1 pb-0.5 border-none bg-transparent cursor-pointer ${
                  isActive('/services') || isActive('/home-loan') || isActive('/insights') || isActive('/career') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'
                }`}
              >
                More <ChevronDown size={14} />
              </button>
              {servicesMega && (
                <div 
                  className="absolute top-full left-0 pt-2 z-50"
                  onClick={() => setServicesMega(false)}
                >
                  <div className="w-[220px] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2">
                    <Link to="/services" className="block px-5 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Advisory Services</Link>
                    <Link to="/home-loan" className="block px-5 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Home Loans & EMI</Link>
                    <Link to="/insights" className="block px-5 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Market Insights</Link>
                    <Link to="/career" className="block px-5 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">Careers</Link>
                  </div>
                </div>
              )}
            </div>



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
              onClick={() => onOpenVIPModal('List Your Property (Owner/Seller)')}
              className="hidden xl:flex items-center gap-1.5 text-primary text-xs font-bold px-3.5 py-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">add_business</span> List Property
            </button>

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
          <Link to="/home-loan" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/home-loan') ? 'text-secondary font-bold' : 'text-primary'}`}>Home Loans & EMI</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/about') ? 'text-secondary font-bold' : 'text-primary'}`}>About Us</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`font-label-bold text-sm uppercase ${isActive('/contact') ? 'text-secondary font-bold' : 'text-primary'}`}>Contact Us</Link>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onOpenVIPModal('List Your Property (Owner/Seller)'); }} 
            className="w-full bg-surface-container text-primary font-bold py-2.5 rounded-lg font-label-bold text-xs uppercase tracking-wider border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            + List Your Property (Owner)
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onOpenVIPModal(); }} 
            className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-widest hover:scale-95 transition-all duration-150 shadow-sm mt-1 cursor-pointer border-none"
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
