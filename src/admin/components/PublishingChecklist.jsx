import React from 'react';

export default function PublishingChecklist({ validation }) {
  if (!validation) return null;

  const { valid, results } = validation;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
      <div className={`p-4 border-b flex items-center gap-3 ${valid ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
        <span className={`material-symbols-outlined text-[24px] ${valid ? 'text-emerald-600' : 'text-amber-600'}`}>
          {valid ? 'check_circle' : 'pending_actions'}
        </span>
        <div>
          <h3 className={`font-bold text-sm ${valid ? 'text-emerald-800' : 'text-amber-800'}`}>
            {valid ? 'Ready to Publish' : 'Publishing Checklist'}
          </h3>
          <p className={`text-xs ${valid ? 'text-emerald-600' : 'text-amber-700'}`}>
            {valid ? 'All required fields are complete.' : 'Complete these fields to go live.'}
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50">
        <ul className="space-y-3">
          {results && results.map((req, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm">
              {req.isPass ? (
                <span className="material-symbols-outlined text-[18px] text-emerald-500 bg-emerald-100 rounded-full w-6 h-6 flex items-center justify-center">done</span>
              ) : (
                <span className="material-symbols-outlined text-[18px] text-slate-300 bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center">close</span>
              )}
              <span className={`font-medium ${req.isPass ? 'text-slate-700' : 'text-slate-400'}`}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
