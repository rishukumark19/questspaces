import React from 'react';

export default function PricingMatrixEditor({ matrix = [], onChange }) {
  const handleAddRow = () => {
    onChange([
      ...matrix,
      { config: '', carpetArea: '', superArea: '', price: '', availability: 'Available', floorPlanImage: '' }
    ]);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...matrix];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    onChange(matrix.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Pricing & Configuration Matrix</h4>
          <p className="text-xs text-slate-500">
            Detailed breakdown of unit sizes, prices, and floor plans. Each row renders as a row in the Price List table on the property page.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span> Add Variant Row
        </button>
      </div>

      {matrix.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No pricing matrix rows added yet. Add at least one to populate the Price List and Floor Plans sections on the property page.</p>
      ) : (
        <div className="space-y-4">
          {matrix.map((row, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              {/* Row label */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Variant #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRow(idx)}
                  className="p-1 text-red-400 hover:bg-red-50 rounded-lg flex items-center gap-1 text-[10px] font-bold"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                </button>
              </div>

              {/* Main fields row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Unit Type</label>
                  <input
                    type="text"
                    value={row.config || ''}
                    onChange={(e) => handleRowChange(idx, 'config', e.target.value)}
                    placeholder="3 BHK Executive"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Carpet Area</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={row.carpetArea || ''}
                      onChange={(e) => handleRowChange(idx, 'carpetArea', e.target.value)}
                      placeholder="1,250"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary pr-[45px]"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">Sq.Ft.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Built-up Area</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={row.superArea || ''}
                      onChange={(e) => handleRowChange(idx, 'superArea', e.target.value)}
                      placeholder="1,850"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary pr-[45px]"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">Sq.Ft.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">₹</span>
                    <input
                      type="text"
                      value={row.price || ''}
                      onChange={(e) => handleRowChange(idx, 'price', e.target.value.replace(/^[?¿₹\s]+/, ''))}
                      placeholder="3.32 Cr*"
                      className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-3 py-1.5 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
                    Availability
                    <div className="relative group flex items-center">
                      <span className="flex items-center justify-center w-3 h-3 rounded-full border border-slate-300 text-slate-400 text-[8px] font-bold cursor-help hover:bg-slate-100 hover:text-slate-600 transition-colors">i</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-[220px] p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-10 whitespace-normal leading-relaxed text-center font-normal normal-case pointer-events-none">
                        Previous dropdown options:<br/>
                        <span className="font-bold text-amber-300">Available, Limited Units, Fast Selling, Sold Out</span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                      </div>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={row.availability || ''}
                    onChange={(e) => handleRowChange(idx, 'availability', e.target.value)}
                    placeholder="e.g. Available"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary mb-1.5"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['Available', 'Limited Units', 'Fast Selling', 'Sold Out'].map(sg => (
                      <button 
                        key={sg} 
                        type="button" 
                        onClick={() => handleRowChange(idx, 'availability', sg)} 
                        className="px-1.5 py-0.5 border border-slate-200 rounded text-[9px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors whitespace-nowrap"
                      >
                        + {sg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floor Plan Image — NEW */}
              <div className="border-t border-slate-200 pt-3">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">architecture</span>
                  Floor Plan Image URL (for this unit type)
                </label>
                <div className="flex gap-3 items-start">
                  <input
                    type="url"
                    value={row.floorPlanImage || ''}
                    onChange={(e) => handleRowChange(idx, 'floorPlanImage', e.target.value)}
                    placeholder="https://... paste image URL for this BHK floor plan"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                  {row.floorPlanImage && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img
                        src={row.floorPlanImage}
                        alt="Floor plan preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  This image will appear in the Floor Plans tab for "{row.config || 'this unit type'}" on the property page.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
