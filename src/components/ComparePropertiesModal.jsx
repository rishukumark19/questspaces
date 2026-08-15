import React from 'react';

export default function ComparePropertiesModal({ 
  isOpen, 
  onClose, 
  properties = [], 
  onRemoveProperty,
  onOpenVIPModal 
}) {
  if (!isOpen || properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div className="bg-surface rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase">Side-by-Side</span>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {properties.length} / 4 Selected
              </span>
            </div>
            <h2 className="font-headline-sm text-2xl font-bold text-primary mt-1">
              Compare Luxury Properties
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors border-none cursor-pointer"
            aria-label="Close comparison"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Table Scrollable Container */}
        <div className="overflow-x-auto flex-1 p-6">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="p-4 w-[180px] bg-surface-container-lowest text-xs font-bold uppercase tracking-wider text-on-surface-variant sticky left-0 z-10">
                  Property
                </th>
                {properties.map((p) => (
                  <th key={p.id} className="p-4 min-w-[240px] align-top">
                    <div className="relative group">
                      <button
                        onClick={() => onRemoveProperty(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10 border-none cursor-pointer"
                        title="Remove from comparison"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                      <img 
                        src={p.heroImage || (p.images && p.images[0])} 
                        alt={p.title} 
                        className="w-full h-36 object-cover rounded-xl mb-3 shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">{p.developer}</span>
                      <h4 className="font-bold text-base text-primary line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{p.location}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              
              {/* Starting Price */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Starting Price
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-bold text-primary text-base">
                    {p.startingPrice}
                  </td>
                ))}
              </tr>

              {/* Price / Sq. Ft. */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Price / Sq. Ft.
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-medium text-on-surface">
                    {p.pricePerSqFt || 'On Request'}
                  </td>
                ))}
              </tr>

              {/* Configurations */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Configurations
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-medium text-on-surface">
                    <div className="flex flex-wrap gap-1.5">
                      {(p.bhkOptions || []).map(b => (
                        <span key={b} className="px-2 py-0.5 bg-surface-container rounded-md text-xs font-semibold text-primary">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Property Type */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Property Type
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-medium text-on-surface">
                    {p.propertyType}
                  </td>
                ))}
              </tr>

              {/* Status & Possession */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Status & Possession
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-medium text-on-surface">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary mb-1">
                      {p.status}
                    </span>
                    <p className="text-xs text-on-surface-variant">Possession: {p.possession || 'Immediate'}</p>
                  </td>
                ))}
              </tr>

              {/* Land Parcel & Units */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Land Parcel & Density
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 font-medium text-on-surface text-xs space-y-1">
                    <p><span className="text-on-surface-variant">Land:</span> {p.landParcel || 'N/A'}</p>
                    <p><span className="text-on-surface-variant">Units:</span> {p.totalUnits || 'N/A'}</p>
                    <p><span className="text-on-surface-variant">Towers:</span> {p.towerHeight || 'N/A'}</p>
                  </td>
                ))}
              </tr>

              {/* RERA Verified */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  RERA Registration
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 text-xs font-mono text-emerald-700 bg-emerald-50/50">
                    {p.reraId ? (
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                        {p.reraId}
                      </span>
                    ) : 'Under Verification'}
                  </td>
                ))}
              </tr>

              {/* Key Amenities */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Top Amenities
                </td>
                {properties.map(p => {
                  const flatAmenities = Array.isArray(p.amenities)
                    ? p.amenities.flatMap(cat => Array.isArray(cat?.list) ? cat.list : [cat]).slice(0, 4)
                    : [];
                  return (
                    <td key={p.id} className="p-4 text-xs text-on-surface-variant">
                      <ul className="space-y-1">
                        {flatAmenities.map((a, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-secondary text-[14px]">check</span>
                            <span>{typeof a === 'string' ? a : a?.title || 'Amenity'}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>

              {/* Proximity Highlights */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Key Transit Proximity
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4 text-xs text-on-surface-variant">
                    <ul className="space-y-1">
                      {(p.proximity || []).slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.title}</span>
                          <span className="font-bold text-primary">{item.distance}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest sticky left-0 z-10">
                  Action
                </td>
                {properties.map(p => (
                  <td key={p.id} className="p-4">
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenVIPModal) onOpenVIPModal(p.title);
                      }}
                      className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-colors border-none cursor-pointer"
                    >
                      Enquire Now
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-on-surface-variant">
          <span>Need personalized portfolio comparison? Our senior advisory team offers custom financial viability reports.</span>
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high font-bold text-primary transition-colors border-none cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
