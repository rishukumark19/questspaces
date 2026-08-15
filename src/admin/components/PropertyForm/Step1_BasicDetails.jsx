import React, { useState } from 'react';

export default function Step1_BasicDetails({ formData, onChange, onHighlightsChange, onBadgesChange, missingFields = [] }) {
  const propertyTypes = ['Luxury Apartment', 'Modern Villa', 'Row House', 'Investment Plot'];
  
  const micromarkets = [
    { value: 'Hebbal', label: 'Hebbal Airport Corridor' },
    { value: 'Yelahanka', label: 'Yelahanka Serene Corridor' },
    { value: 'Manyata Tech Park', label: 'Tech Hub Walk-to-Work Zone' },
    { value: 'Thanisandra', label: 'Hennur-Thanisandra Belt' },
    { value: 'Devanahalli', label: 'Aerotropolis Growth Corridor' },
    { value: 'Whitefield', label: 'Whitefield IT & Residential Hub' },
    { value: 'Sarjapur', label: 'Sarjapur Tech & Educational Corridor' }
  ];

  const highlightSuggestions = ["Grand Clubhouse", "Metro Connectivity", "RERA Registered", "Green Building", "School Zone", "IT Hub Proximity"];
  const badgeSuggestions = ["New Launch", "Featured Luxury", "Price Drop", "Sold Out", "Limited Units"];

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleMicromarketSelect = (e) => {
    const val = e.target.value;
    const selected = micromarkets.find(m => m.value === val);
    onChange('micromarket', val);
    if (selected) {
      onChange('micromarket_label', selected.label);
    }
  };

  const handleMapLinkChange = (e) => {
    const val = e.target.value;
    onChange('map_link_input', val); // temporary field if needed
    const match = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      onChange('map_coordinates', `${match[1]}, ${match[2]}`);
    } else {
      // maybe check for other formats, or just leave it
    }
  };

  const handleAddHighlight = (val = '') => {
    const current = formData.highlights || [];
    if (val && current.includes(val)) return; // prevent exact duplicates easily
    onHighlightsChange([...current, val]);
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

  const handleAddBadge = (val = '') => {
    const current = formData.badges || [];
    if (val && current.includes(val)) return;
    onBadgesChange([...current, val]);
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
    <div className="space-y-8">
      {/* 1. Core Property Details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span> Basic Details
        </h3>
        
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
              className={`w-full bg-slate-50 border ${missingFields.includes('Property name') ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white`}
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
              className={`w-full bg-slate-50 border ${missingFields.includes('Developer/Builder') ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.property_type || 'Luxury Apartment'}
              onChange={(e) => onChange('property_type', e.target.value)}
              className={`w-full bg-slate-50 border ${missingFields.includes('Property type') ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white`}
            >
              {propertyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Display Starting Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.starting_price || ''}
              onChange={(e) => onChange('starting_price', e.target.value)}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val && !val.startsWith('₹')) {
                  onChange('starting_price', `₹${val.replace(/^[?¿]+/, '')}`);
                }
              }}
              placeholder="e.g. ₹3.32 Cr*"
              className={`w-full bg-slate-50 border ${missingFields.includes('Starting price') ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white font-semibold`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Short Overview Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-[10px] font-bold ${(formData.description || '').length > 150 ? 'text-red-500' : 'text-slate-400'}`}>
              {(formData.description || '').length} / 150
            </span>
          </div>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Brief summary displayed on property cards and top overview..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
          />
          <p className="text-[11px] text-slate-500 mt-1">Guidance: Mention configuration, size range, possession, standout amenity, and location advantage.</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Detailed Property Description
            </label>
            <span className={`text-[10px] font-bold ${(formData.long_description || '').length > 500 ? 'text-amber-500' : 'text-slate-400'}`}>
              {(formData.long_description || '').length} / 500
            </span>
          </div>
          <textarea
            rows={5}
            value={formData.long_description || ''}
            onChange={(e) => onChange('long_description', e.target.value)}
            placeholder="Comprehensive details about architecture, neighborhood, and luxury features..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Developer / Builder Profile */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">business_center</span> Developer / Builder Profile
        </h3>
        <p className="text-xs text-slate-500 -mt-2">Shown in the "About Builder" section on the property detail page.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Experience</label>
            <input
              type="text"
              value={formData.developer_experience || ''}
              onChange={(e) => onChange('developer_experience', e.target.value)}
              placeholder="e.g. 33+ Years"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">Shown as a stat badge on the detail page.</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Projects Delivered</label>
            <input
              type="text"
              value={formData.developer_projects_count || ''}
              onChange={(e) => onChange('developer_projects_count', e.target.value)}
              placeholder="e.g. 150+ Projects"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Developer Logo URL</label>
          <div className="flex gap-3 items-center">
            <input
              type="url"
              value={formData.developer_logo_url || ''}
              onChange={(e) => onChange('developer_logo_url', e.target.value)}
              placeholder="https://... paste logo image URL"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
            {formData.developer_logo_url && (
              <div className="w-12 h-12 border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-white flex items-center justify-center">
                <img src={formData.developer_logo_url} alt="Developer logo" className="max-w-full max-h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Developer Bio</label>
          <textarea
            rows={3}
            value={formData.developer_description || ''}
            onChange={(e) => onChange('developer_description', e.target.value)}
            placeholder="Brief 2-4 sentence description of the developer's track record, reputation, and key achievements..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* 2. Location & Map */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">location_on</span> Location Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Micromarket Hub <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.micromarket || ''}
              onChange={handleMicromarketSelect}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            >
              <option value="">Select Micromarket...</option>
              {micromarkets.map(m => (
                <option key={m.value} value={m.value}>{m.value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Short Location Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g. Hebbal, Bengaluru North"
              className={`w-full bg-slate-50 border ${missingFields.includes('Location') ? 'border-red-500 bg-red-50' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Full Postal Address
          </label>
          <textarea
            rows={2}
            value={formData.full_address || ''}
            onChange={(e) => onChange('full_address', e.target.value)}
            placeholder="e.g. Hebbal Flyover Junction, Bellary Road, Bengaluru North - 560032"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">pin_drop</span> Paste Google Maps Link
          </label>
          <input
            type="text"
            value={formData.map_link_input || ''}
            onChange={handleMapLinkChange}
            placeholder="Paste a Google Maps URL here to automatically extract coordinates..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white text-blue-600"
          />
          {formData.map_coordinates && (
            <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> 
              Coordinates extracted: {formData.map_coordinates}
            </p>
          )}
          {!formData.map_coordinates && (
            <p className="text-[11px] text-slate-500 mt-1">We will extract the exact latitude and longitude for the map preview pin.</p>
          )}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* 3. Advanced / Internal Details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3 cursor-pointer group" onClick={() => setShowAdvanced(!showAdvanced)}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span> Advanced / Legal Details
          </h3>
          <button type="button" className="text-slate-400 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined">{showAdvanced ? 'expand_less' : 'expand_more'}</span>
          </button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  RERA Registration ID
                </label>
                <input
                  type="text"
                  value={formData.rera_id || ''}
                  onChange={(e) => onChange('rera_id', e.target.value)}
                  placeholder="e.g. PRM/KA/RERA/1251/309/PR/241018/007142"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span> RERA Portal URL
                </label>
                <input
                  type="url"
                  value={formData.rera_portal_url || ''}
                  onChange={(e) => onChange('rera_portal_url', e.target.value)}
                  placeholder="e.g. https://rera.karnataka.gov.in/"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white text-blue-600 text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">Shown as a "Verify on RERA Portal" link on the detail page.</p>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span> Internal Notes (Not public)
              </label>
              <textarea
                rows={2}
                value={formData.internal_notes || ''}
                onChange={(e) => onChange('internal_notes', e.target.value)}
                placeholder="Private notes for the team, e.g. seller contact, negotiation margins..."
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-sm outline-none focus:border-amber-400 focus:bg-amber-50 text-amber-900 placeholder:text-amber-700/50"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
