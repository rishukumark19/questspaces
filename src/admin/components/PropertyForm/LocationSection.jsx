import React from 'react';

export default function LocationSection({ formData, onChange }) {
  const micromarkets = [
    { value: 'Hebbal', label: 'Hebbal Airport Corridor' },
    { value: 'Yelahanka', label: 'Yelahanka Serene Corridor' },
    { value: 'Manyata Tech Park', label: 'Tech Hub Walk-to-Work Zone' },
    { value: 'Thanisandra', label: 'Hennur-Thanisandra Belt' },
    { value: 'Devanahalli', label: 'Aerotropolis Growth Corridor' },
    { value: 'Whitefield', label: 'Whitefield IT & Residential Hub' },
    { value: 'Sarjapur', label: 'Sarjapur Tech & Educational Corridor' }
  ];

  const handleMicromarketSelect = (e) => {
    const val = e.target.value;
    const selected = micromarkets.find(m => m.value === val);
    onChange('micromarket', val);
    if (selected && !formData.micromarket_label) {
      onChange('micromarket_label', selected.label);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Location & Address</h3>

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
            Micromarket Sub-Label
          </label>
          <input
            type="text"
            value={formData.micromarket_label || ''}
            onChange={(e) => onChange('micromarket_label', e.target.value)}
            placeholder="e.g. Hebbal Airport Corridor"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>

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
    </div>
  );
}
