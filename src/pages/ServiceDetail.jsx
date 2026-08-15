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
        <div className="flex items-center font-label-sm text-label-sm text-on-surface-variant mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface font-label-bold">{service.title}</span>
        </div>
        <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">{service.subtitle}</span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-[44px] text-primary leading-tight mb-4">
          {service.title}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8">
          {service.description}
        </p>

        {/* Key Deliverables */}
        {service.deliverables && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              Key Deliverables & Advisory Scope
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">verified</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buyer Methodology */}
        {service.buyerMethodology && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              Buyer Advisory Framework ({service.buyerMethodology.length} Steps)
            </h2>
            <div className="space-y-3 font-body-md text-sm text-on-surface-variant">
              {service.buyerMethodology.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span> <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller Methodology */}
        {service.sellerMethodology && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              Seller Advisory Framework ({service.sellerMethodology.length} Steps)
            </h2>
            <div className="space-y-3 font-body-md text-sm text-on-surface-variant">
              {service.sellerMethodology.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span> <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Framework */}
        {service.framework && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              Strategic Execution Framework
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
