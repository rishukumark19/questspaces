import React from 'react';
import { Link } from 'react-router-dom';

export default function SavedPropertiesDrawer({ isOpen, onClose, savedProperties, onRemoveSaved }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="bg-surface-container-lowest w-full max-w-[450px] h-screen border-l border-outline-variant/30 p-6 flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Saved Properties ({savedProperties.length})
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} style={{ position: 'static' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {savedProperties.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-30 mb-4 text-secondary">domain</span>
            <p className="font-body-md text-sm mb-6">You haven't saved any properties yet.</p>
            <Link to="/properties" onClick={onClose} className="bg-primary !text-white px-5 py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm">
              Browse Bengaluru Portfolio
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {savedProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-surface p-4 rounded-xl border border-outline-variant/20 flex gap-4 items-center"
              >
                <img 
                  src={property.heroImage} 
                  alt={property.title} 
                  className="w-20 h-16 object-cover rounded-lg shrink-0 border border-outline-variant/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-0.5">{property.developer}</div>
                  <h4 className="text-sm font-bold text-primary truncate mb-1">{property.title}</h4>
                  <div className="text-sm font-bold text-primary">{property.startingPrice}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    to={`/property/${property.slug}`} 
                    onClick={onClose}
                    className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                  <button 
                    onClick={() => onRemoveSaved(property.id)}
                    className="bg-red-500/10 text-red-500 border-none w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
