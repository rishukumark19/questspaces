import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import { MICROMARKETS } from '../data/micromarkets';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import DeveloperStrip from '../components/DeveloperStrip';

export default function Home({ savedIds, onToggleSave, onOpenVIPModal }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { properties, loading } = useProperties();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('search', searchQuery);
    navigate(`/properties?${queryParams.toString()}`);
  };

  const featuredProperties = (properties || []).filter(p => p && p.featured).slice(0, 3);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-between py-8 overflow-hidden bg-brand-bg">
        {/* Background Image Overlay */}
        <div className="absolute -top-24 left-0 right-0 bottom-0 z-0 bg-[#f5f0ea]">
          <img 
            alt="City Skyline Background" 
            className="w-full h-full object-contain object-top opacity-85 mix-blend-multiply" 
            src="/questspaces/images/hero-bg.png"
          />
        </div>

        {/* Content Wrapper to sit above background */}
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex-grow flex flex-col justify-center">
          <div className="pt-6 pb-12 md:pt-10 md:pb-20 text-left">
            {/* Subheading Tag */}
            <div className="mb-6 flex flex-col items-start gap-3">
              <span className="text-secondary uppercase tracking-widest text-xs font-semibold">Exclusive Homes. Exceptional Living.</span>
              <div className="w-16 h-[2px] bg-secondary"></div>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[4.5rem] leading-[1.1] text-primary mb-6 max-w-4xl font-normal">
              Find Your Perfect Space.<br/>
              <span className="text-secondary italic font-medium">Live Your Best Life.</span>
            </h1>

            {/* Description */}
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed">
              Handpicked luxury properties in Bengaluru,<br className="hidden sm:inline" />
              curated for those who seek more.
            </p>

            {/* Search Bar Floating Container */}
            <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl shadow-black/5 max-w-3xl mb-12 border border-white/50">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-grow flex items-center gap-3 px-4 py-2">
                  <svg className="w-5 h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <input 
                    type="text"
                    placeholder="Search by locality, project, or developer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-primary placeholder-gray-400 text-base py-1 outline-none"
                  />
                </div>
                <button type="submit" className="bg-primary hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-md border-none cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  SEARCH
                </button>
              </form>
            </div>

            {/* Trust Statistics */}
            <div className="flex flex-wrap items-center gap-8 md:gap-16 pt-4">
              {/* Stat 1 */}
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="flex items-center gap-2 text-secondary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  </svg>
                  <span className="font-serif text-3xl font-semibold text-primary">15+</span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Years of Trust</span>
              </div>
              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-gray-300"></div>
              {/* Stat 2 */}
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="flex items-center gap-2 text-secondary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  </svg>
                  <span className="font-serif text-3xl font-semibold text-primary">2.5K+</span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Delighted Families</span>
              </div>
              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-gray-300"></div>
              {/* Stat 3 */}
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="flex items-center gap-2 text-secondary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  </svg>
                  <span className="font-serif text-3xl font-semibold text-primary">4.9</span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-on-surface-variant font-semibold">Google Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* FeatureBarFooter integrated at bottom of section */}
        <div className="relative z-10 w-full mt-8 flex justify-center px-margin-mobile md:px-margin-desktop">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/40 py-4 px-8 md:px-12 flex flex-wrap justify-between items-center gap-6 md:gap-12 max-w-6xl w-full">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              <span className="text-[10px] md:text-xs font-semibold tracking-wider text-primary uppercase">RERA Approved</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              <span className="text-[10px] md:text-xs font-semibold tracking-wider text-primary uppercase">Verified Properties</span>
            </div>
            <div className="hidden lg:block w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              <span className="text-[10px] md:text-xs font-semibold tracking-wider text-primary uppercase">Transparent Deals</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              <span className="text-[10px] md:text-xs font-semibold tracking-wider text-primary uppercase">End-to-End Support</span>
            </div>
          </div>
        </div>
      </section>


      {/* 2. FEATURED BENGALURU LOCATIONS (Mobile Swiper) */}
      <section className="bg-surface-container-lowest py-section-gap border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">prime corridors</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Explore Bengaluru Hubs
              </h2>
            </div>
            <Link to="/properties" className="font-label-bold text-label-bold text-primary hover:text-secondary transition-colors flex items-center gap-1">
              View All Locations <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MICROMARKETS.map((market) => (
              <Link 
                key={market.id} 
                to={`/properties?location=${market.shortName}`}
                className="group relative h-[380px] rounded-xl overflow-hidden cursor-pointer block shadow-sm border border-outline-variant/20"
              >
                <img 
                  loading="lazy"
                  src={market.image} 
                  alt={market.name} 
                  className="absolute inset-0 w-full !h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-5 text-left z-10 transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-white font-headline-md text-xl font-bold mb-1">{market.shortName}</h3>
                  <p className="text-white/80 text-xs mb-3 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {market.tagline}
                  </p>
                  <div className="border-t border-white/20 pt-3 mt-auto">
                    <span className="text-white/70 text-[10px] uppercase font-semibold">{market.projectCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE RESIDENCES */}
      <section className="py-section-gap bg-surface border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">featured portfolio</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Signature Residences
              </h2>
            </div>
            <Link to="/properties" className="px-5 py-3 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
              View All Properties <span className="material-symbols-outlined text-[16px]" style={{ color: '#ffffff' }}>arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {loading ? (
              [1, 2, 3].map(n => <PropertyCardSkeleton key={n} />)
            ) : (
              featuredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  isSaved={savedIds.includes(property.id)}
                  onToggleSave={onToggleSave}
                  onOpenVIPModal={onOpenVIPModal}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. INVESTMENT INSIGHTS & TESTIMONIALS */}
      <section className="py-section-gap bg-surface-container-low border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Investment */}
            <div>
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">Market Intelligence</span>
              <h2 className="font-headline-lg text-3xl font-bold text-primary mb-6">Bengaluru Investment Outlook</h2>
              <p className="text-on-surface-variant mb-6 leading-relaxed">
                Bengaluru continues to lead India's real estate growth, driven by IT expansion and infrastructure upgrades like the Metro Phase 2. Micro-markets like Hebbal and Devanahalli are showing up to 12-15% annual capital appreciation.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-600">trending_up</span>
                  <span className="text-sm text-on-surface-variant font-medium"><strong>High Rental Yields:</strong> Averages 4-5% in tech corridors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-600">domain_add</span>
                  <span className="text-sm text-on-surface-variant font-medium"><strong>Infrastructure Boost:</strong> Airport line driving North BLR value.</span>
                </li>
              </ul>
              <button onClick={() => navigate('/services')} className="bg-primary text-white px-6 py-3 rounded-lg font-label-bold text-xs uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm cursor-pointer border-none">
                Read Market Reports
              </button>
            </div>

            {/* Testimonial Snapshot */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-outline-variant/30 relative">
              <span className="material-symbols-outlined text-secondary/20 text-6xl absolute top-6 right-6">format_quote</span>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="font-headline-sm text-lg italic text-on-surface-variant mb-8 leading-relaxed">
                  "The market analysis and guidance provided by Quest Spaces was incredible. They helped me secure an off-market luxury apartment in Hebbal that fits my family perfectly and aligns with my investment goals."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg border border-outline-variant/40">
                    PS
                  </div>
                  <div>
                    <h4 className="font-label-bold text-primary font-bold">Priya Sharma</h4>
                    <p className="text-xs text-on-surface-variant">Tech Executive & Investor</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DEVELOPER PARTNERS STRIP */}
      <DeveloperStrip />

    </div>
  );
}
