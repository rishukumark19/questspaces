import React, { useState } from 'react';
import ProximityEditor from './ProximityEditor';
import { AMENITY_PRESETS } from '../../data/amenityPresets';

export default function Step3_AmenitiesSection({ formData, onChange }) {
  const amenities = formData.amenities || [];

  // Helper to get list for a category, or empty if not present
  const getCategoryList = (catName) => {
    const cat = amenities.find(c => c.category === catName);
    return cat ? cat.list || [] : [];
  };

  const toggleAmenity = (catName, amenityName) => {
    const existingCatIdx = amenities.findIndex(c => c.category === catName);
    const updatedAmenities = [...amenities];

    if (existingCatIdx >= 0) {
      const cat = updatedAmenities[existingCatIdx];
      const list = cat.list || [];
      if (list.includes(amenityName)) {
        // Remove it
        cat.list = list.filter(a => a !== amenityName);
        if (cat.list.length === 0 && !cat.customMode && Object.keys(AMENITY_PRESETS).includes(catName)) {
           // We might not remove it if it's a preset category, but the old code did:
           // updatedAmenities.splice(existingCatIdx, 1);
           // Actually, it's safer to keep the empty category or let it clean up on save.
        }
      } else {
        // Add it
        cat.list = [...list, amenityName];
      }
    } else {
      // Create new category with this item
      updatedAmenities.push({ category: catName, list: [amenityName] });
    }
    onChange('amenities', updatedAmenities);
  };

  const addCustomAmenity = (catName, customValue) => {
    if (!customValue.trim()) return;
    const existingCatIdx = amenities.findIndex(c => c.category === catName);
    const updatedAmenities = [...amenities];

    if (existingCatIdx >= 0) {
      const cat = updatedAmenities[existingCatIdx];
      const list = cat.list || [];
      if (!list.includes(customValue)) {
        cat.list = [...list, customValue];
      }
    } else {
      updatedAmenities.push({ category: catName, list: [customValue], customMode: true });
    }
    onChange('amenities', updatedAmenities);
  };

  const [customInputs, setCustomInputs] = useState({});
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    
    // If it already exists, just clear
    if (amenities.some(a => a.category.toLowerCase() === trimmed.toLowerCase())) {
      setNewCategoryName('');
      return;
    }
    
    // Add empty category
    const updatedAmenities = [...amenities, { category: trimmed, list: [], customMode: true }];
    onChange('amenities', updatedAmenities);
    setNewCategoryName('');
  };

  const removeCategory = (catName) => {
    const updatedAmenities = amenities.filter(a => a.category !== catName);
    onChange('amenities', updatedAmenities);
  };

  const presetCategories = Object.keys(AMENITY_PRESETS);
  const customCategories = amenities
    .filter(a => !presetCategories.includes(a.category))
    .map(a => a.category);
  const allCategories = [...new Set([...presetCategories, ...customCategories])];

  return (
    <div className="space-y-8">
      {/* Amenities Categories */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 border-b pb-3">3. Amenities & Extras</h3>
          <p className="text-xs text-slate-500 mt-2">Select the amenities available in this property. You can also add custom categories and items.</p>
        </div>

        <div className="space-y-6">
          {allCategories.map((catName) => {
            const isCustomCategory = !presetCategories.includes(catName);
            const presetList = AMENITY_PRESETS[catName] || [];
            const selectedList = getCategoryList(catName);
            
            return (
              <div key={catName} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative">
                {isCustomCategory && (
                  <button 
                    onClick={() => removeCategory(catName)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove custom category"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  {catName}
                  {isCustomCategory && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">Custom</span>}
                </h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {presetList.map(amenity => {
                    const isSelected = selectedList.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(catName, amenity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected 
                            ? 'bg-primary text-white border-primary shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <span className="material-symbols-outlined text-[14px] align-middle mr-1 -ml-1">check</span>}
                        {amenity}
                      </button>
                    );
                  })}
                  
                  {/* Show custom ones that were added */}
                  {selectedList.filter(a => !presetList.includes(a)).map(customAmenity => (
                    <button
                      key={customAmenity}
                      type="button"
                      onClick={() => toggleAmenity(catName, customAmenity)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-primary text-white border-primary shadow-sm transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px] align-middle mr-1 -ml-1">check</span>
                      {customAmenity}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={customInputs[catName] || ''}
                    onChange={(e) => setCustomInputs({...customInputs, [catName]: e.target.value})}
                    placeholder={`Add custom amenity to ${catName}...`}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAmenity(catName, customInputs[catName]);
                        setCustomInputs({...customInputs, [catName]: ''});
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addCustomAmenity(catName, customInputs[catName]);
                      setCustomInputs({...customInputs, [catName]: ''});
                    }}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Category UI */}
          <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <h5 className="font-bold text-sm text-slate-800">Need a different section?</h5>
              <p className="text-xs text-slate-500">Create a custom amenity category.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Smart Home Features"
                className="flex-1 sm:w-56 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary focus:bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewCategory();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Create
              </button>
            </div>
          </div>

        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Proximity / Landmarks */}
      <ProximityEditor
        proximity={formData.proximity || []}
        onChange={(updated) => onChange('proximity', updated)}
      />
    </div>
  );
}
