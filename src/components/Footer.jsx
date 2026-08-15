import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { submitLead } from '../lib/leads';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await submitLead({
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        phone: 'N/A',
        propertyTitle: 'Newsletter Subscription',
        leadType: 'Market Updates',
        message: 'Subscribed to Bengaluru Real Estate Insights'
      });
    } catch (err) {
      console.error('Newsletter submission warning:', err);
    }
    setNewsletterSubscribed(true);
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant pt-16 pb-[80px] lg:pb-8 mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Newsletter Section */}
        <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/30 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-left">
            <span className="text-[10px] tracking-[0.2em] font-bold text-secondary uppercase block mb-1">Market Intelligence</span>
            <h4 className="font-headline-sm text-lg md:text-xl font-bold text-primary mb-1">Get Bengaluru Real Estate Insights</h4>
            <p className="text-on-surface-variant text-xs md:text-sm">Receive curated off-market opportunities, price trend reports, and infrastructure updates directly in your inbox.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            {newsletterSubscribed ? (
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 py-2">
                <span className="material-symbols-outlined text-sm">check_circle</span> You're subscribed to Quest Spaces Market Intelligence.
              </div>
            ) : (
              <>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-surface border border-outline-variant/50 rounded-lg px-4 py-2.5 text-xs text-primary outline-none focus:border-primary transition-colors min-w-[240px]"
                />
                <button type="submit" className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none whitespace-nowrap">
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          
          {/* Column 1: Brand Narrative */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img src={logoImg} alt="Quest Spaces Logo" className="w-8 h-8 object-contain transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-semibold text-[#0F172A] leading-none tracking-[0.02em] transition-colors group-hover:text-[#C9A35A]">
                  Quest Spaces
                </span>
                <span className="text-[9px] tracking-[0.18em] text-[#6B7280] uppercase mt-1.5 font-sans font-semibold">
                  Real Estate Advisory
                </span>
              </div>
            </Link>

            <div className="flex gap-3">
              {/* Facebook */}
              <a href="https://facebook.com/questspacespvt.ltd/" target="_blank" rel="noreferrer" aria-label="Follow Quest Spaces on Facebook" className="group w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary transition-colors">
                <svg width="16" height="16" fill="currentColor" className="group-hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/questspaces/" target="_blank" rel="noreferrer" aria-label="Follow Quest Spaces on Instagram" className="group w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary transition-colors">
                <svg width="16" height="16" fill="currentColor" className="group-hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/questspaces-private-limited/" target="_blank" rel="noreferrer" aria-label="Follow Quest Spaces on LinkedIn" className="group w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary transition-colors">
                <svg width="16" height="16" fill="currentColor" className="group-hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.262-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@questspaces" target="_blank" rel="noreferrer" aria-label="Follow Quest Spaces on YouTube" className="group w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary transition-colors">
                <svg width="16" height="16" fill="currentColor" className="group-hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-5 font-bold">Navigation</h4>
            <ul className="space-y-2.5 font-body-md text-sm text-on-surface-variant">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Properties Directory</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Advisory Services</Link></li>
              <li><Link to="/home-loan" className="hover:text-primary transition-colors">Home Loans & Calculator</Link></li>
              <li><Link to="/insights" className="hover:text-primary transition-colors">Market Insights</Link></li>
              <li><Link to="/career" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Top Corridors */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-5 font-bold">Corridors</h4>
            <ul className="space-y-2.5 font-body-md text-sm text-on-surface-variant">
              <li><Link to="/properties?location=Hebbal" className="hover:text-primary transition-colors">North Bangalore (Hebbal)</Link></li>
              <li><Link to="/properties?location=Yelahanka" className="hover:text-primary transition-colors">Yelahanka Corridor</Link></li>
              <li><Link to="/properties?location=Manyata Tech Park" className="hover:text-primary transition-colors">Manyata Tech Park Zone</Link></li>
              <li><Link to="/properties?location=Devanahalli" className="hover:text-primary transition-colors">Devanahalli Airport Belt</Link></li>
              <li><Link to="/properties?location=Thanisandra" className="hover:text-primary transition-colors">Thanisandra Main Road</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-5 font-bold">Headquarters</h4>
            <div className="space-y-4 font-body-md text-sm text-on-surface-variant">
              <div className="flex gap-2">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <span>Embassy One, 8, Ground Floor, Bellary Road, Ganganagar, Bengaluru - 560032</span>
              </div>
              <div className="flex gap-2">
                <Phone size={16} className="text-secondary shrink-0" />
                <a href="tel:+917411736908" className="hover:text-primary transition-colors">+91 74117 36908</a>
              </div>
              <div className="flex gap-2">
                <Mail size={16} className="text-secondary shrink-0" />
                <a href="mailto:info@questspaces.in" className="hover:text-primary transition-colors">info@questspaces.in</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/30 pt-6 flex justify-between items-center flex-wrap gap-4 font-body-md text-xs text-on-surface-variant">
          <div>
            © 2024-{new Date().getFullYear()} Quest Spaces Pvt Ltd. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/privacy-policy#terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy#rera" className="hover:text-primary transition-colors">RERA Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
