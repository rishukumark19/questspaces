import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES } from '../data/services';
import NotFound from './NotFound';

export default function ServiceDetail({ onOpenVIPModal }) {
  const { slug } = useParams();
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) {
    return <NotFound />;
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      <main className="max-w-[900px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        
        <Link to="/services" className="text-secondary font-label-bold text-label-bold flex items-center gap-1 mb-6 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to All Services
        </Link>
        
        <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">{service.subtitle}</span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-[44px] text-primary leading-tight mb-4">
          {service.title}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8">
          {service.description}
        </p>

        {/* Methodology */}
        {service.buyerMethodology && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              Buyer Advisory Framework (6 Steps)
            </h2>
            <div className="space-y-3 font-body-md text-sm text-on-surface-variant">
              {service.buyerMethodology.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span> <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.framework && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              Investment Curation Framework
            </h2>
            <div className="space-y-3 font-body-md text-sm text-on-surface-variant">
              {service.framework.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg">check_circle</span> <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <button 
            onClick={() => onOpenVIPModal()} 
            className="bg-primary text-white px-6 py-3.5 rounded-lg font-label-bold text-label-bold uppercase tracking-widest hover:bg-primary-container transition-colors shadow-md border-none cursor-pointer flex justify-center items-center gap-1.5 mx-auto"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span> Schedule Advisory Call for {service.title}
          </button>
        </div>

      </main>
    </div>
  );
}
