import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ 
  property, 
  isSaved, 
  onToggleSave, 
  onOpenVIPModal,
  isComparing = false,
  onToggleCompare,
  viewMode = 'grid'
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const allImages = [...new Set([property.heroImage, ...(property.images || [])])].filter(Boolean);

  const getWhatsappLink = () => {
    const text = encodeURIComponent(`Hi, I'm interested in ${property.title} located in ${property.location}. Please share more details.`);
    return `https://wa.me/919876543210?text=${text}`;
  };

  const getStatusColor = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('ready')) return 'bg-emerald-700 text-white';
    if (s.includes('under')) return 'bg-amber-600 text-white';
    if (s.includes('pre')) return 'bg-blue-600 text-white';
    if (s.includes('new')) return 'bg-purple-700 text-white';
    return 'bg-primary text-white';
  };

  useEffect(() => {
    let intervalId;
    if (isHovered && allImages.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
      }, 1500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, allImages.length]);

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const highestPrice = property.pricingMatrix && property.pricingMatrix.length > 1
    ? property.pricingMatrix[property.pricingMatrix.length - 1]?.price?.replace('*', '')
    : null;

  const displayPrice = highestPrice 
    ? `${property.startingPrice?.replace('*', '')} – ${highestPrice}`
    : property.startingPrice;

  // -------------------------------------------------------------
  // LIST VIEW LAYOUT
  // -------------------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div 
        className="property-card bg-surface border border-outline-variant/50 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col md:flex-row hover:shadow-xl hover:border-secondary/40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        {/* Left Side: Image Carousel */}
        <div className="relative md:w-80 lg:w-96 h-64 md:h-auto shrink-0 bg-surface-container-lowest overflow-hidden">
          <img 
            src={allImages[currentImageIndex] || '/questspaces/images/hero-bg.png'} 
            alt={`${property.title} — ${property.location}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {allImages.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-primary border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-primary border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </>
          )}

          {/* Status Badge */}
          <div className={`absolute top-4 left-4 ${getStatusColor(property.status)} font-label-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-sm`}>
            {property.status}
          </div>

          {/* Compare Checkbox */}
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(property);
              }}
              className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all z-10 border cursor-pointer ${
                isComparing 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : 'bg-white/90 text-slate-800 border-white/40 hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isComparing ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          )}
        </div>

        {/* Right Side: Detailed Specs & Actions */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-widest block mb-1">
                  {property.developer}
                </span>
                <Link to={`/property/${property.slug}`} className="hover:text-secondary transition-colors">
                  <h3 className="text-xl md:text-2xl font-bold text-primary leading-tight">
                    {property.title}
                  </h3>
                </Link>
              </div>

              {/* Heart bookmark */}
              <button 
                onClick={() => onToggleSave(property)}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors border-none cursor-pointer shrink-0"
                title={isSaved ? "Remove from saved" : "Save property"}
              >
                <span 
                  className={`material-symbols-outlined text-lg ${isSaved ? 'text-red-500' : 'text-primary'}`}
                  style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-medium text-xs md:text-sm mb-4">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
                <span>{property.location}</span>
              </div>
              {property.reraId && (
                <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> RERA: {property.reraId}
                </div>
              )}
            </div>

            <p className="text-xs md:text-sm text-on-surface-variant line-clamp-2 mb-6">
              {property.description}
            </p>

            {/* Spec Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-outline-variant/30 mb-6 bg-surface-container-lowest/50 rounded-xl px-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Configs</span>
                <span className="text-xs font-bold text-primary">{property.bhkOptions?.join(', ')}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Land Parcel</span>
                <span className="text-xs font-bold text-primary">{property.landParcel || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Possession</span>
                <span className="text-xs font-bold text-primary">{property.possession || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Price / Sq.Ft</span>
                <span className="text-xs font-bold text-primary">{property.pricePerSqFt || 'On Request'}</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block">Starting Price</span>
              <span className="text-xl md:text-2xl font-bold text-primary font-serif">
                {displayPrice}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => onOpenVIPModal && onOpenVIPModal(`${property.title} (Brochure Request)`)}
                className="px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">download</span> Brochure
              </button>
              <button 
                onClick={() => onOpenVIPModal && onOpenVIPModal(property.title)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer border-none"
              >
                Enquire
              </button>
              <Link 
                to={`/property/${property.slug}`} 
                className="px-5 py-2.5 rounded-xl bg-secondary-container hover:bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                Explore <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW LAYOUT (Default)
  // -------------------------------------------------------------
  return (
    <div 
      className="property-card bg-surface border border-outline-variant/50 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col h-full hover:shadow-xl hover:-translate-y-1 hover:border-secondary/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Banner */}
      <div className="relative h-64 overflow-hidden shrink-0 bg-surface-container-lowest">
        <img 
          src={allImages[currentImageIndex] || '/questspaces/images/hero-bg.png'} 
          alt={`${property.title} — ${property.location}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {allImages.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-primary border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-primary border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {allImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Price Badge over Image */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-primary border border-white/20 font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg z-10">
          {displayPrice}
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 ${getStatusColor(property.status)} font-label-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-sm`}>
          {property.status}
        </div>

        {/* Top Right Controls: Save + Compare */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(property);
              }}
              className={`h-9 px-2.5 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md transition-all shadow-md border cursor-pointer ${
                isComparing 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white/80 text-slate-800 border-white/40 hover:bg-white'
              }`}
              title={isComparing ? "Remove from comparison" : "Add to comparison"}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isComparing ? 'check_box' : 'compare_arrows'}
              </span>
              <span className="text-[10px] uppercase font-bold">{isComparing ? 'Compared' : 'Compare'}</span>
            </button>
          )}

          {/* Heart Bookmark Button */}
          <button 
            onClick={() => onToggleSave(property)}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors group/btn shadow-md border-none cursor-pointer"
            title={isSaved ? "Remove from saved" : "Save property"}
            aria-label={isSaved ? `Remove ${property.title} from saved properties` : `Save ${property.title} to your list`}
          >
            <span 
              className={`material-symbols-outlined text-sm ${isSaved ? 'text-red-500' : 'text-primary group-hover/btn:scale-110 transition-transform'}`}
              style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-3">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
              {property.developer}
            </span>
            <Link to={`/property/${property.slug}`} className="hover:text-secondary transition-colors">
              <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors leading-snug line-clamp-1">
                {property.title}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-on-surface-variant font-medium text-xs mb-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {property.reraId && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[14px]">verified</span> RERA Verified
            </div>
          )}

          {/* 3 Metrics Spec Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-outline-variant/30 mb-6 bg-surface-container-lowest/60 rounded-xl px-2">
            <div className="flex flex-col items-center justify-center text-center p-1.5">
              <span className="material-symbols-outlined text-secondary text-lg mb-1 opacity-80">bed</span>
              <span className="font-bold text-[10px] text-primary uppercase tracking-wide truncate max-w-full">
                {property.bhkOptions?.[0] || 'Units'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-1.5 border-x border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-lg mb-1 opacity-80">straighten</span>
              <span className="font-bold text-[10px] text-primary uppercase tracking-wide truncate max-w-full">
                {property.landParcel || 'Land'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-1.5">
              <span className="material-symbols-outlined text-secondary text-lg mb-1 opacity-80">schedule</span>
              <span className="font-bold text-[10px] text-primary uppercase tracking-wide truncate max-w-full">
                {property.possession || 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={() => onOpenVIPModal && onOpenVIPModal(property.title)}
              className="flex-1 border border-primary text-primary bg-transparent py-2.5 font-label-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary hover:text-white transition-colors cursor-pointer"
            >
              Enquire
            </button>
            <Link 
              to={`/property/${property.slug}`} 
              className="flex-1 bg-primary !text-white py-2.5 font-label-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-colors flex justify-center items-center"
            >
              Details
            </Link>
          </div>
          <button 
            onClick={() => onOpenVIPModal && onOpenVIPModal(`${property.title} (Brochure Request)`)}
            className="w-full bg-surface-container hover:bg-secondary-container text-primary font-label-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">download</span> Download Brochure
          </button>
        </div>

      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsQuickViewOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <span className="material-symbols-outlined text-black">close</span>
            </button>
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img src={property.heroImage} alt={property.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">
                {property.developer}
              </span>
              <h3 className="text-2xl font-bold text-primary mb-2 leading-tight">
                {property.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6">{property.location}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Price</span>
                  <span className="block text-lg font-bold text-slate-800">{displayPrice}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Configuration</span>
                  <span className="block text-lg font-bold text-slate-800">{property.bhkOptions?.[0]}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Link to={`/property/${property.slug}`} className="flex-1 bg-primary text-white text-center py-3 rounded-xl font-bold text-sm shadow-md hover:bg-primary-hover transition-colors">
                  View Full Details
                </Link>
                <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-xl shadow-md hover:bg-[#128C7E] transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
