import React from 'react';

export default function PricingMatrixEditor({ matrix = [], onChange }) {
  const handleAddRow = () => {
    onChange([
      ...matrix,
      { config: '', carpetArea: '', superArea: '', price: '', availability: 'Available' }
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
          <p className="text-xs text-slate-500">Detailed breakdown of available unit sizes and prices.</p>
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
        <p className="text-xs text-slate-400 italic">No pricing matrix rows added yet.</p>
      ) : (
        <div className="space-y-3">
          {matrix.map((row, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Config Name</label>
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
                <input
                  type="text"
                  value={row.carpetArea || ''}
                  onChange={(e) => handleRowChange(idx, 'carpetArea', e.target.value)}
                  placeholder="1,250 Sq. Ft."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Super Area</label>
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
                  placeholder="₹3.32 Cr*"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
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
                <button
                  type="button"
                  onClick={() => handleRemoveRow(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
