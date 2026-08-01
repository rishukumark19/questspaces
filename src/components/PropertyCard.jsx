import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property, isSaved, onToggleSave, onOpenVIPModal }) {
  return (
    <div className="property-card bg-surface border border-outline-variant rounded-lg overflow-hidden transition-all duration-300 group flex flex-col h-full">
      
      {/* Image Banner */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={property.heroImage} 
          alt={`${property.title} — ${property.location}`}
          loading="lazy"
          width="600"
          height="400"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-primary text-white font-label-sm text-label-sm px-3 py-1 rounded uppercase tracking-wider">
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
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors line-clamp-1">
              {property.title}
            </h3>
            <p className="font-headline-sm text-headline-sm text-secondary shrink-0">{property.startingPrice}</p>
          </div>

          <div className="flex items-center gap-1 text-on-surface-variant font-body-md text-sm mb-4">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* 3 Metrics Spec Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-y border-outline-variant mb-6 text-on-surface text-xs md:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-outline text-lg">bed</span>
              <span className="font-label-bold text-[11px] md:text-label-sm uppercase">{property.bhkOptions[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-outline text-lg">straighten</span>
              <span className="font-label-bold text-[11px] md:text-label-sm uppercase">{property.landParcel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-outline text-lg">schedule</span>
              <span className="font-label-bold text-[11px] md:text-label-sm uppercase">{property.possession}</span>
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
