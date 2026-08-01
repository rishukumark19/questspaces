import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center min-h-[60vh] flex flex-col items-center justify-center">
        
        <span className="material-symbols-outlined text-[80px] text-outline-variant/40 mb-6">explore_off</span>
        
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Page Not Found
        </h1>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. Let us help you find what you need.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/" 
            className="bg-primary text-white px-8 py-3.5 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">home</span> Back to Home
          </Link>
          <Link 
            to="/properties" 
            className="border border-primary text-primary px-8 py-3.5 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">domain</span> View Properties
          </Link>
          <Link 
            to="/contact" 
            className="border border-outline-variant text-on-surface-variant px-8 py-3.5 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span> Contact Us
          </Link>
        </div>

      </main>
    </div>
  );
}
