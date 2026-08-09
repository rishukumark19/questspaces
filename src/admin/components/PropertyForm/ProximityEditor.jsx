import React from 'react';

export default function ProximityEditor({ proximity = [], onChange }) {
  const handleAddRow = () => {
    onChange([...proximity, { title: '', distance: '' }]);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...proximity];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    onChange(proximity.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Proximity & Nearby Landmarks</h4>
          <p className="text-xs text-slate-500">Important landmarks and travel times from the property.</p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span> Add Landmark
        </button>
      </div>

      {proximity.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No proximity landmarks added yet.</p>
      ) : (
        <div className="space-y-2">
          {proximity.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleRowChange(idx, 'title', e.target.value)}
                  placeholder="e.g. Manyata Tech Park"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <div className="w-36">
                <input
                  type="text"
                  value={item.distance || ''}
                  onChange={(e) => handleRowChange(idx, 'distance', e.target.value)}
                  placeholder="e.g. 10 Mins"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRow(idx)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
