import React from 'react';
import { validateForPublish } from '../../../lib/properties';

export default function PublishSection({ formData, onChange, onSaveDraft, onPublish, isSaving }) {
  const statusOptions = ['New Launch', 'Under Construction', 'Ready to Move In', 'Pre-Launch'];
  const validation = validateForPublish(formData);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Publishing & Visibility</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Construction / Launch Status
          </label>
          <select
            value={formData.status || 'New Launch'}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Publication State
          </label>
          <select
            value={formData.publish_state || 'draft'}
            onChange={(e) => onChange('publish_state', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white capitalize font-semibold"
          >
            <option value="draft">Draft (Hidden from public)</option>
            <option value="published">Published (Visible on website)</option>
            <option value="archived">Archived (Hidden / Inactive)</option>
          </select>
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">star</span>
            Featured Luxury Listing
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Showcase this property in the top hero slider & home page featured section.</p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => onChange('featured', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Validation Banner */}
      {!validation.valid && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
          <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0">info</span>
          <div>
            <div className="font-bold mb-1">Items required before publishing live:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              {validation.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save as Draft'}
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isSaving}
          className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">publish</span>
          {isSaving ? 'Publishing...' : 'Publish to Website'}
        </button>
      </div>
    </div>
  );
}
