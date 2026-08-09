import React from 'react';
import PricingMatrixEditor from './PricingMatrixEditor';
import ProximityEditor from './ProximityEditor';

export default function AmenitiesSection({ formData, onChange }) {
  const amenities = formData.amenities || [];

  const handleAddCategory = () => {
    onChange('amenities', [...amenities, { category: '', list: [''] }]);
  };

  const handleCategoryNameChange = (catIdx, name) => {
    const updated = [...amenities];
    updated[catIdx] = { ...updated[catIdx], category: name };
    onChange('amenities', updated);
  };

  const handleRemoveCategory = (catIdx) => {
    onChange('amenities', amenities.filter((_, i) => i !== catIdx));
  };

  const handleAddItem = (catIdx) => {
    const updated = [...amenities];
    const currentList = updated[catIdx].list || [];
    updated[catIdx] = { ...updated[catIdx], list: [...currentList, ''] };
    onChange('amenities', updated);
  };

  const handleItemChange = (catIdx, itemIdx, value) => {
    const updated = [...amenities];
    const currentList = [...(updated[catIdx].list || [])];
    currentList[itemIdx] = value;
    updated[catIdx] = { ...updated[catIdx], list: currentList };
    onChange('amenities', updated);
  };

  const handleRemoveItem = (catIdx, itemIdx) => {
    const updated = [...amenities];
    const currentList = (updated[catIdx].list || []).filter((_, i) => i !== itemIdx);
    updated[catIdx] = { ...updated[catIdx], list: currentList };
    onChange('amenities', updated);
  };

  return (
    <div className="space-y-8">
      {/* Amenities Categories */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-slate-900">Amenities & Lifestyle Features</h3>
          <button
            type="button"
            onClick={handleAddCategory}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add Amenity Category
          </button>
        </div>

        {amenities.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No amenity categories added yet.</p>
        ) : (
          <div className="space-y-6">
            {amenities.map((cat, catIdx) => (
              <div key={catIdx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={cat.category || ''}
                    onChange={(e) => handleCategoryNameChange(catIdx, e.target.value)}
                    placeholder="Category Name (e.g. Sports & Fitness, Leisure & Social)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(catIdx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  {(cat.list || []).map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleItemChange(catIdx, itemIdx, e.target.value)}
                        placeholder="e.g. Olympic Swimming Pool"
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(catIdx, itemIdx)}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddItem(catIdx)}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 mt-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-slate-200" />

      {/* Pricing Matrix */}
      <PricingMatrixEditor
        matrix={formData.pricing_matrix || []}
        onChange={(updated) => onChange('pricing_matrix', updated)}
      />

      <hr className="border-slate-200" />

      {/* Proximity / Landmarks */}
      <ProximityEditor
        proximity={formData.proximity || []}
        onChange={(updated) => onChange('proximity', updated)}
      />
    </div>
  );
}
