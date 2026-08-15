import React, { useState } from 'react';
import { validateForPublish, generateSlug } from '../../../lib/properties';

export default function PublishSection({ formData, onChange, onSaveDraft, onPublish, isSaving }) {
  const [isAdvancedSEO, setIsAdvancedSEO] = useState(false);
  const statusOptions = ['New Launch', 'Under Construction', 'Ready to Move In', 'Pre-Launch'];
  const validation = validateForPublish(formData);

  const handleRegenerateSEO = () => {
    const titlePart = formData.title || '';
    const typePart = formData.property_type || '';
    const locationPart = formData.location ? `in ${formData.location}` : '';
    const newSeoTitle = [titlePart, typePart, locationPart].filter(Boolean).join(' | ');
    onChange('seo_title', newSeoTitle);
    onChange('slug', generateSlug(titlePart));
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-headline-sm font-bold text-slate-900 border-b pb-4">SEO & Visibility Settings</h3>
      
      {/* SEO Settings */}
      <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">search</span> Search Engine Optimization
          </h4>
          <button 
            type="button" 
            onClick={() => setIsAdvancedSEO(!isAdvancedSEO)}
            className="text-xs font-bold text-primary hover:underline"
          >
            {isAdvancedSEO ? 'Hide Advanced' : 'Manual Edit'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                <span>URL Slug (Permalink) <span className="text-red-500">*</span></span>
                {!isAdvancedSEO && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Auto-generated</span>}
              </label>
              <input
                type="text"
                required
                readOnly={!isAdvancedSEO}
                value={formData.slug || ''}
                onChange={(e) => onChange('slug', e.target.value)}
                placeholder="e.g. lt-realty-elara"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono text-xs ${!isAdvancedSEO ? 'bg-slate-100 border-transparent text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-primary'}`}
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                <span>SEO Title (Meta Title) <span className="text-red-500">*</span></span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${formData.seo_title?.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                    {formData.seo_title?.length || 0}/60
                  </span>
                  {!isAdvancedSEO && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Auto-generated</span>}
                </div>
              </label>
              <input
                type="text"
                required
                readOnly={!isAdvancedSEO}
                value={formData.seo_title || ''}
                onChange={(e) => onChange('seo_title', e.target.value)}
                placeholder="e.g. L&T Elara | Luxury 3 & 4 BHK in Mumbai"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${!isAdvancedSEO ? 'bg-slate-100 border-transparent text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-primary'}`}
              />
            </div>
            
            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                <span>SEO Description (Meta Description)</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${formData.seo_description?.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                    {formData.seo_description?.length || 0}/160
                  </span>
                </div>
              </label>
              <textarea
                rows={2}
                readOnly={!isAdvancedSEO}
                value={formData.seo_description || ''}
                onChange={(e) => onChange('seo_description', e.target.value)}
                placeholder="A short compelling description for search results..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none ${!isAdvancedSEO ? 'bg-slate-100 border-transparent text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-primary'}`}
              />
            </div>
          </div>

          {/* Google Search Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-fit">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">visibility</span> Google Search Preview
            </h5>
            <div className="font-sans">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-slate-500">apartment</span>
                </div>
                <div>
                  <div className="text-[12px] text-slate-800 line-clamp-1">QuestSpaces</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">https://questspaces.com/properties/{formData.slug || 'slug-preview'}</div>
                </div>
              </div>
              <div className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 break-all">
                {formData.seo_title || 'Your SEO Title Appears Here'}
              </div>
              <div className="text-[13px] text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                {formData.seo_description || 'Add a compelling meta description to encourage users to click on your property listing in search engine results.'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="button" 
            onClick={handleRegenerateSEO}
            className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span> Regenerate from Title
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
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
            Primary Enquiry CTA
          </label>
          <select
            value={formData.enquiry_cta || 'Request price sheet'}
            onChange={(e) => onChange('enquiry_cta', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
          >
            <option value="Request price sheet">Request price sheet</option>
            <option value="Book a site visit">Book a site visit</option>
            <option value="Download brochure">Download brochure</option>
            <option value="Talk to an advisor">Talk to an advisor</option>
          </select>
        </div>
      </div>

      {/* The original Publication state block was here but we moved it to the sidebar for a better UX. */}


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
      
      {formData.featured && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Featured Ranking / Priority Order
          </label>
          <input
            type="number"
            value={formData.featured_order || 0}
            onChange={(e) => onChange('featured_order', parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 1"
            className="w-full max-w-[200px] bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <p className="text-[11px] text-slate-500 mt-1">Lower numbers appear first in the featured slider (e.g., 1 appears before 2).</p>
        </div>
      )}

    </div>
  );
}
