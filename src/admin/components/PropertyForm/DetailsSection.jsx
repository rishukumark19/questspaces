import React from 'react';

export default function DetailsSection({ formData, onChange, onBhkOptionsChange }) {
  const bhkChoices = ['1 BHK', '2 BHK', '3 BHK', '3.5 BHK', '4 BHK', '5+ BHK', 'Plots'];

  const handleBhkToggle = (option) => {
    const current = formData.bhk_options || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter(item => item !== option);
    } else {
      updated = [...current, option];
    }
    onBhkOptionsChange(updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Pricing & Specifications</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Display Starting Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.starting_price || ''}
            onChange={(e) => onChange('starting_price', e.target.value)}
            placeholder="e.g. ₹3.32 Cr*"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Raw Numeric Price (in ₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            value={formData.price_value || ''}
            onChange={(e) => onChange('price_value', parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 33200000"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">Used for price range filtering slider</span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Price Per Sq. Ft.
          </label>
          <input
            type="text"
            value={formData.price_per_sqft || ''}
            onChange={(e) => onChange('price_per_sqft', e.target.value)}
            placeholder="e.g. ₹17,950 / sq.ft"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Configurations String
          </label>
          <input
            type="text"
            value={formData.configurations || ''}
            onChange={(e) => onChange('configurations', e.target.value)}
            placeholder="e.g. 3 & 4 BHK Luxury Residences"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Possession Year / Status
          </label>
          <input
            type="text"
            value={formData.possession || ''}
            onChange={(e) => onChange('possession', e.target.value)}
            placeholder="e.g. 2029 or Ready / 2026"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      {/* BHK Options Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          BHK Options Available (for filtering)
        </label>
        <div className="flex flex-wrap gap-3">
          {bhkChoices.map((choice) => {
            const isChecked = (formData.bhk_options || []).includes(choice);
            return (
              <label
                key={choice}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                  isChecked
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBhkToggle(choice)}
                  className="hidden"
                />
                {choice}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Land Parcel Size
          </label>
          <input
            type="text"
            value={formData.land_parcel || ''}
            onChange={(e) => onChange('land_parcel', e.target.value)}
            placeholder="e.g. 10 Acres"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Total Units
          </label>
          <input
            type="number"
            value={formData.total_units || ''}
            onChange={(e) => onChange('total_units', parseInt(e.target.value, 10) || '')}
            placeholder="e.g. 630"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tower Height / Structure
          </label>
          <input
            type="text"
            value={formData.tower_height || ''}
            onChange={(e) => onChange('tower_height', e.target.value)}
            placeholder="e.g. G + 28 Floors"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
