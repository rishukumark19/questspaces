import React from 'react';

export default function BasicInfoSection({ formData, onChange, onHighlightsChange, onBadgesChange }) {
  const propertyTypes = ['Luxury Apartment', 'Modern Villa', 'Row House', 'Investment Plot'];

  const handleAddHighlight = () => {
    onHighlightsChange([...(formData.highlights || []), '']);
  };

  const handleHighlightChange = (index, value) => {
    const updated = [...(formData.highlights || [])];
    updated[index] = value;
    onHighlightsChange(updated);
  };

  const handleRemoveHighlight = (index) => {
    const updated = (formData.highlights || []).filter((_, i) => i !== index);
    onHighlightsChange(updated);
  };

  const handleAddBadge = () => {
    onBadgesChange([...(formData.badges || []), '']);
  };

  const handleBadgeChange = (index, value) => {
    const updated = [...(formData.badges || [])];
    updated[index] = value;
    onBadgesChange(updated);
  };

  const handleRemoveBadge = (index) => {
    const updated = (formData.badges || []).filter((_, i) => i !== index);
    onBadgesChange(updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Basic Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Property Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="e.g. L&T Realty Elara Celestia"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Slug (URL Key) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="e.g. lt-realty-elara-celestia"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Developer / Builder <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.developer || ''}
            onChange={(e) => onChange('developer', e.target.value)}
            placeholder="e.g. L&T Realty"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.property_type || 'Luxury Apartment'}
            onChange={(e) => onChange('property_type', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          >
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          Short Overview Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Brief summary displayed on property cards and top overview..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          Detailed Property Description
        </label>
        <textarea
          rows={5}
          value={formData.long_description || ''}
          onChange={(e) => onChange('long_description', e.target.value)}
          placeholder="Comprehensive details about architecture, neighborhood, and luxury features..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
        />
      </div>

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Key Highlights & Features
          </label>
          <button
            type="button"
            onClick={handleAddHighlight}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add Highlight
          </button>
        </div>
        <div className="space-y-2">
          {(formData.highlights || []).map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleHighlightChange(index, e.target.value)}
                placeholder="e.g. Multi-level grand clubhouse with indoor heated pool"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlight(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
          {(formData.highlights || []).length === 0 && (
            <p className="text-xs text-slate-400 italic">No highlights added yet.</p>
          )}
        </div>
      </div>

      {/* Badges / Tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Feature Badges & Tags
          </label>
          <button
            type="button"
            onClick={handleAddBadge}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add Badge
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.badges || []).map((badge, index) => (
            <div key={index} className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1">
              <input
                type="text"
                value={badge}
                onChange={(e) => handleBadgeChange(index, e.target.value)}
                placeholder="e.g. Featured Luxury"
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none w-32"
              />
              <button
                type="button"
                onClick={() => handleRemoveBadge(index)}
                className="text-slate-400 hover:text-red-500"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
          {(formData.badges || []).length === 0 && (
            <p className="text-xs text-slate-400 italic">No badges added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
