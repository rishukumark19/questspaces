import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property, isSaved, onToggleSave, onOpenVIPModal }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const allImages = [...new Set([property.heroImage, ...(property.images || [])])];

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('ready')) return 'bg-green-600';
    if (s.includes('under')) return 'bg-yellow-600';
    if (s.includes('pre')) return 'bg-blue-600';
    return 'bg-primary';
  };

  useEffect(() => {
    let intervalId;
    if (isHovered && allImages.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
      }, 1500); // Auto-scroll every 1.5 seconds while hovered
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

  return (
    <div 
      className="property-card bg-surface border border-outline-variant rounded-lg overflow-hidden transition-all duration-300 group flex flex-col h-full hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0); // Reset to main image when mouse leaves
      }}
    >
      
      {/* Image Banner */}
      <div className="relative h-64 overflow-hidden shrink-0 bg-surface-container-lowest">
        <img 
          src={allImages[currentImageIndex]} 
          alt={`${property.title} — ${property.location}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {allImages.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-primary border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-primary border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
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
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-primary border border-white/20 font-bold text-xs px-2.5 py-1 rounded-md shadow-lg z-10">
          {property.pricingMatrix?.length > 1 
            ? `${property.startingPrice.replace('*', '')} – ${property.pricingMatrix[property.pricingMatrix.length - 1].price.replace('*', '')}` 
            : property.startingPrice}
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 ${getStatusColor(property.status)} text-white font-label-sm text-label-sm px-3 py-1 rounded uppercase tracking-wider z-10 shadow-sm`}>
          {property.status}
        </div>

        {/* Heart Bookmark Button */}
        <button 
          onClick={() => onToggleSave(property)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors group/btn shadow-md border-none cursor-pointer"
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

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-bold text-primary group-hover:text-secondary transition-colors leading-snug line-clamp-2">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-on-surface-variant font-medium text-sm mb-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {property.reraId && (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider mb-5">
              <span className="material-symbols-outlined text-[14px]">verified</span> RERA Verified
            </div>
          )}

          {/* 3 Metrics Spec Bar */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-outline-variant/40 mb-6">
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary/30 transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl mb-1.5 opacity-80">bed</span>
              <span className="font-bold text-[10px] md:text-[11px] text-primary uppercase tracking-wide">{property.bhkOptions[0]}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary/30 transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl mb-1.5 opacity-80">straighten</span>
              <span className="font-bold text-[10px] md:text-[11px] text-primary uppercase tracking-wide">{property.landParcel}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary/30 transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl mb-1.5 opacity-80">schedule</span>
              <span className="font-bold text-[10px] md:text-[11px] text-primary uppercase tracking-wide">{property.possession}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onOpenVIPModal(property.title)}
            className="flex-1 border border-primary text-primary bg-transparent py-3 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            Enquire
          </button>
          <Link 
            to={`/property/${property.slug}`} 
            className="flex-1 bg-primary !text-white py-3 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-colors flex justify-center items-center"
          >
            View Details
          </Link>
        </div>

      </div>

    </div>
  );
}
