import React from 'react';

export default function Step5_AdvancedFeatures({ formData, onChange }) {
  // Helpers to update array fields in formData
  const updateField = (field, value) => {
    onChange(field, value);
  };

  // 1. Recent Updates
  const updates = formData.recent_updates || [];
  const addUpdate = () => updateField('recent_updates', [...updates, { date: '', title: '', description: '' }]);
  const removeUpdate = (idx) => updateField('recent_updates', updates.filter((_, i) => i !== idx));
  const updateUpdateRow = (idx, field, val) => {
    const newUpdates = [...updates];
    newUpdates[idx] = { ...newUpdates[idx], [field]: val };
    updateField('recent_updates', newUpdates);
  };

  // 2. Specifications
  const specs = formData.specifications || [];
  const addSpecCategory = () => updateField('specifications', [...specs, { category: '', items: [{ name: '', value: '' }] }]);
  const removeSpecCategory = (idx) => updateField('specifications', specs.filter((_, i) => i !== idx));
  const updateSpecCategory = (idx, val) => {
    const newSpecs = [...specs];
    newSpecs[idx] = { ...newSpecs[idx], category: val };
    updateField('specifications', newSpecs);
  };
  const addSpecItem = (catIdx) => {
    const newSpecs = [...specs];
    newSpecs[catIdx].items.push({ name: '', value: '' });
    updateField('specifications', newSpecs);
  };
  const removeSpecItem = (catIdx, itemIdx) => {
    const newSpecs = [...specs];
    newSpecs[catIdx].items = newSpecs[catIdx].items.filter((_, i) => i !== itemIdx);
    updateField('specifications', newSpecs);
  };
  const updateSpecItem = (catIdx, itemIdx, field, val) => {
    const newSpecs = [...specs];
    newSpecs[catIdx].items[itemIdx] = { ...newSpecs[catIdx].items[itemIdx], [field]: val };
    updateField('specifications', newSpecs);
  };

  // 3. Price Insights
  const insights = formData.price_insights || [];
  const addInsight = () => updateField('price_insights', [...insights, { label: '', value: '', trend: '' }]);
  const removeInsight = (idx) => updateField('price_insights', insights.filter((_, i) => i !== idx));
  const updateInsightRow = (idx, field, val) => {
    const newInsights = [...insights];
    newInsights[idx] = { ...newInsights[idx], [field]: val };
    updateField('price_insights', newInsights);
  };

  // 4. Buyer Personas
  const handlePersonasChange = (e) => {
    const val = e.target.value;
    const array = val.split(',').map(s => s.trim()).filter(Boolean);
    updateField('buyer_personas', array);
  };
  const personasString = (formData.buyer_personas || []).join(', ');

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Advanced Features & Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure Recent Updates, Specifications, Price Insights, and Buyer Personas for the property detail page.
        </p>
      </div>

      {/* --- Recent Updates Timeline --- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">update</span> Recent Updates Timeline
            </h3>
            <p className="text-xs text-slate-500">Show a timeline of construction progress or news.</p>
          </div>
          <button type="button" onClick={addUpdate} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Update
          </button>
        </div>
        
        {updates.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No updates added yet.</p>
        ) : (
          <div className="space-y-4">
            {updates.map((upd, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                <button type="button" onClick={() => removeUpdate(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date</label>
                    <input type="text" placeholder="e.g. Oct 2024" value={upd.date} onChange={(e) => updateUpdateRow(idx, 'date', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Title</label>
                    <input type="text" placeholder="e.g. Excavation Started" value={upd.title} onChange={(e) => updateUpdateRow(idx, 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
                    <textarea rows="2" placeholder="Brief details about this update..." value={upd.description} onChange={(e) => updateUpdateRow(idx, 'description', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Specifications --- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">handyman</span> Property Specifications
            </h3>
            <p className="text-xs text-slate-500">Grouped specifications (e.g., Flooring, Kitchen, Security).</p>
          </div>
          <button type="button" onClick={addSpecCategory} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Category
          </button>
        </div>

        {specs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No specifications added yet.</p>
        ) : (
          <div className="space-y-6">
            {specs.map((cat, catIdx) => (
              <div key={catIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Category Name (e.g. Flooring)" value={cat.category} onChange={(e) => updateSpecCategory(catIdx, e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-primary" />
                  <button type="button" onClick={() => removeSpecCategory(catIdx)} className="text-red-400 hover:text-red-600 p-2">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
                
                <div className="pl-4 border-l-2 border-slate-200 space-y-2">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2">
                      <input type="text" placeholder="Item (e.g. Living Room)" value={item.name} onChange={(e) => updateSpecItem(catIdx, itemIdx, 'name', e.target.value)} className="w-1/3 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                      <input type="text" placeholder="Value (e.g. Italian Marble)" value={item.value} onChange={(e) => updateSpecItem(catIdx, itemIdx, 'value', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                      <button type="button" onClick={() => removeSpecItem(catIdx, itemIdx)} className="text-slate-400 hover:text-red-500 p-1">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSpecItem(catIdx)} className="text-[10px] font-bold text-primary hover:underline mt-2 inline-block">
                    + Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Price Insights --- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">trending_up</span> Price & Market Insights
            </h3>
            <p className="text-xs text-slate-500">Add data points like average locality price and trends.</p>
          </div>
          <button type="button" onClick={addInsight} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">add</span> Add Insight
          </button>
        </div>

        {insights.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No insights added yet.</p>
        ) : (
          <div className="space-y-3">
            {insights.map((ins, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex-1">
                  <input type="text" placeholder="Label (e.g. Locality Avg)" value={ins.label} onChange={(e) => updateInsightRow(idx, 'label', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                </div>
                <div className="w-32">
                  <input type="text" placeholder="Value (e.g. ₹12,500/sqft)" value={ins.value} onChange={(e) => updateInsightRow(idx, 'value', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                </div>
                <div className="w-24">
                  <input type="text" placeholder="Trend (e.g. +5%)" value={ins.trend} onChange={(e) => updateInsightRow(idx, 'trend', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                </div>
                <button type="button" onClick={() => removeInsight(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Buyer Personas --- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">groups</span> Ideal Buyer Personas
          </h3>
          <p className="text-xs text-slate-500">Comma-separated tags indicating who this property is best for.</p>
        </div>
        
        <div>
          <input
            type="text"
            value={personasString}
            onChange={handlePersonasChange}
            placeholder="e.g. First-time buyers, High-yield Investors, IT Professionals"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:bg-white"
          />
          <div className="flex gap-2 flex-wrap mt-3">
            {(formData.buyer_personas || []).map((p, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
