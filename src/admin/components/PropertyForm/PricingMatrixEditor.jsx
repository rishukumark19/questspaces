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
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Carpet Area (sq.ft.)</label>
                  <input
                    type="text"
                    value={row.carpetArea || ''}
                    onChange={(e) => handleRowChange(idx, 'carpetArea', e.target.value)}
                    placeholder="1,250 Sq. Ft."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Built-up Area (sq.ft.)</label>
                  <input
                    type="text"
                    value={row.superArea || ''}
                    onChange={(e) => handleRowChange(idx, 'superArea', e.target.value)}
                    placeholder="1,850 Sq. Ft."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Price</label>
                  <input
                    type="text"
                    value={row.price || ''}
                    onChange={(e) => handleRowChange(idx, 'price', e.target.value)}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !val.startsWith('₹')) {
                        handleRowChange(idx, 'price', `₹${val.replace(/^[?¿]+/, '')}`);
                      }
                    }}
                    placeholder="₹3.32 Cr*"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Availability</label>
                  <select
                    value={row.availability || 'Available'}
                    onChange={(e) => handleRowChange(idx, 'availability', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited Units">Limited Units</option>
                    <option value="Fast Selling">Fast Selling</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
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
