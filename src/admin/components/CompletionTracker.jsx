import React from 'react';

export default function CompletionTracker({ formData }) {
  if (!formData) return null;

  const steps = [
    {
      id: 'essentials',
      label: '1. Essentials',
      desc: 'Title, developer, type & cover',
      check: () => {
        return Boolean(formData.title && formData.developer && (formData.property_type || formData.propertyType) && (formData.starting_price || formData.price || formData.price_value));
      }
    },
    {
      id: 'location',
      label: '2. Location',
      desc: 'Address and location details',
      check: () => {
        return Boolean(formData.location && (formData.full_address || formData.micromarket || formData.location));
      }
    },
    {
      id: 'configurations',
      label: '3. Configurations',
      desc: 'Unit matrix and pricing',
      check: () => {
        return Boolean((formData.pricing_matrix && formData.pricing_matrix.length > 0) || (formData.bhk_options && formData.bhk_options.length > 0) || formData.configurations);
      }
    },
    {
      id: 'amenities',
      label: '4. Amenities',
      desc: 'Selected project amenities',
      check: () => {
        return Boolean(formData.amenities && formData.amenities.length > 0 && formData.amenities.some(cat => Array.isArray(cat.list) ? cat.list.length > 0 : true));
      }
    },
    {
      id: 'media',
      label: '5. Media',
      desc: 'Cover image and photos',
      check: () => {
        return Boolean(formData.cover_image_url || formData.heroImage || (formData.property_media && formData.property_media.length > 0) || (formData.images && formData.images.length > 0));
      }
    },
    {
      id: 'publish',
      label: '6. SEO & Publish',
      desc: 'Meta title and URL slug',
      check: () => {
        return Boolean(formData.slug && (formData.seo_title || formData.title));
      }
    },
  ];

  const completedSteps = steps.filter(s => s.check()).length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-primary">fact_check</span> 
        Completion Tracker
      </h3>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-headline-md font-bold text-slate-800">{progressPercent}%</span>
          <span className="text-xs font-bold text-slate-500 mb-1">{completedSteps} of {steps.length} Steps</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = step.check();
          return (
            <div key={step.id} className={`flex items-start gap-3 p-3 rounded-xl border ${isDone ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
              {isDone ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  {step.id === 'essentials' ? '1' : step.id === 'location' ? '2' : step.id === 'configurations' ? '3' : step.id === 'amenities' ? '4' : step.id === 'media' ? '5' : '6'}
                </div>
              )}
              
              <div>
                <p className={`text-xs font-bold ${isDone ? 'text-emerald-800' : 'text-slate-700'}`}>{step.label}</p>
                <p className={`text-[11px] leading-tight mt-0.5 ${isDone ? 'text-emerald-600/80' : 'text-slate-500'}`}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {progressPercent === 100 && (
        <div className="mt-6 p-3 bg-primary/10 border border-primary/20 rounded-xl text-center text-xs font-bold text-primary">
          Ready to Publish!
        </div>
      )}
    </div>
  );
}
