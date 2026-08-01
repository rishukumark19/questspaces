import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROPERTIES } from '../data/properties';
import { MICROMARKETS } from '../data/micromarkets';
import PropertyCard from '../components/PropertyCard';
import DeveloperStrip from '../components/DeveloperStrip';

export default function Home({ savedIds, onToggleSave, onOpenVIPModal }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('search', searchQuery);
    navigate(`/properties?${queryParams.toString()}`);
  };

  const featuredProperties = PROPERTIES.filter(p => p.featured).slice(0, 3);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative min-h-[80vh] flex items-center py-section-gap bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 10, 30, 0.7) 0%, rgba(0, 10, 30, 0.4) 50%, rgba(0, 10, 30, 0.85) 100%), url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80")`
        }}
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="max-w-[800px] mx-auto text-center">
            
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-5">
              Bengaluru Luxury Real Estate Advisory
            </span>

            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight mb-4">
              Curating Extraordinary <br />
              <span className="text-gold">Living Spaces in Bengaluru</span>
            </h1>

            <p className="font-body-lg text-body-lg text-white/95 max-w-[580px] mx-auto mb-8 leading-relaxed">
              Connecting discerning buyers with handpicked luxury residences across Bengaluru’s prime growth corridors.
            </p>

            {/* Clean Single Input Search Bar */}
            <div className="glass-panel rounded-xl p-2 max-w-[640px] mx-auto mb-10 text-left">
              <form onSubmit={handleSearch} className="bg-white rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 gap-2">
                <div className="flex items-center gap-2.5 flex-1 pl-1.5 sm:pl-3 w-full">
                  <span className="material-symbols-outlined text-gold text-lg">location_on</span>
                  <input 
                    type="text" 
                    placeholder="Search locality, project, or developer..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-none bg-transparent outline-none text-sm font-medium text-primary py-2 text-on-surface placeholder:text-on-surface-variant/60"
                  />
                </div>
                <button type="submit" className="bg-primary text-white px-5 py-3 sm:py-2.5 rounded-lg font-label-bold text-label-bold uppercase tracking-wider hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 border-none cursor-pointer w-full sm:w-auto shrink-0">
                  <span className="material-symbols-outlined text-[16px]">search</span> Search
                </button>
              </form>
            </div>

            {/* Clean Trust Indicators */}
            <div className="flex justify-center gap-10 flex-wrap">
              <div className="text-center">
                <div className="font-headline-md text-[24px] font-bold text-gold">15+ Years</div>
                <div className="text-[10px] text-white/90 uppercase tracking-wider font-semibold mt-1">In Bengaluru Market</div>
              </div>
              <div className="text-center">
                <div className="font-headline-md text-[24px] font-bold text-gold">2.5k+</div>
                <div className="text-[10px] text-white/90 uppercase tracking-wider font-semibold mt-1">Delighted Families</div>
              </div>
              <div className="text-center">
                <div className="font-headline-md text-[24px] font-bold text-gold flex items-center justify-center gap-1">
                  4.9 <span className="material-symbols-outlined text-[18px] text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div className="text-[10px] text-white/90 uppercase tracking-wider font-semibold mt-1">Google Rating</div>
              </div>
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
                  <div className="flex justify-between items-center border-t border-white/20 pt-3">
                    <span className="text-gold text-xs font-bold uppercase">{market.price}</span>
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
            {featuredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isSaved={savedIds.includes(property.id)}
                onToggleSave={onToggleSave}
                onOpenVIPModal={onOpenVIPModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-surface-container-lowest py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-10">
            <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">our promise</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Why Homebuyers Trust Questspaces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Verified RERA Listings", desc: "Every project undergoes 100-point legal title and structural verification.", icon: "verified_user" },
              { title: "Strategic Price Advantage", desc: "Direct developer relationships ensuring optimal price negotiations.", icon: "savings" },
              { title: "Bespoke Concierge Care", desc: "Private site visits in luxury transport with dedicated advisory care.", icon: "concierge" }
            ].map((pillar, i) => (
              <div key={i} className="bg-surface p-8 rounded-xl border border-outline-variant/20 flex flex-col items-start hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-secondary text-[36px] mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>{pillar.icon}</span>
                <h3 className="text-headline-sm font-bold text-primary mb-2">{pillar.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body-md">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEVELOPER PARTNERS STRIP */}
      <DeveloperStrip />

    </div>
  );
}
