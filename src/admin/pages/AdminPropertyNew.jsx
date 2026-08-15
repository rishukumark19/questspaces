import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProperty, generateSlug } from '../../lib/properties';
import { useToast } from '../hooks/useToast';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminPropertyNew() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill template for new properties
  const defaultDescription = "A premium [configuration] residence by [developer] in [location], offering [main value proposition] from [price].";
  const defaultLongDescription = "Experience unparalleled luxury at [Property Name]. Located in the heart of [Location], this project offers world-class amenities including a modern clubhouse, landscaped gardens, and smart home features. Designed for the elite, it perfectly blends comfort and elegance.";

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    developer: '', // will be filled in Step 1
    location: '', // will be filled in Step 1
    property_type: 'Luxury Apartment',
    starting_price: '',
    description: defaultDescription,
    long_description: defaultLongDescription,
    publish_state: 'draft',
    status: 'New Launch',
    featured: false,
    bhk_options: ['3 BHK'],
    highlights: ["Near [landmark]", "Possession [date]", "RERA registered", "Clubhouse / pool / fitness centre"],
    badges: [],
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.title || formData.developer || formData.location) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData.title, formData.developer, formData.location]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('property_form_draft_new');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed && Object.keys(parsed).length > 0) {
          setFormData(parsed);
          setTimeout(() => toast.success("Recovered unsaved draft!"), 500);
        }
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (formData.title || formData.developer || formData.location) {
      const interval = setInterval(() => {
        localStorage.setItem('property_form_draft_new', JSON.stringify(formData));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') {
        updated.slug = generateSlug(value);
      }
      
      if (['title', 'property_type'].includes(field)) {
        if (!prev.seo_title) {
          const titlePart = updated.title || '';
          const typePart = updated.property_type || '';
          updated.seo_title = [titlePart, typePart].filter(Boolean).join(' | ');
        }
      }

      return updated;
    });
  };

  const handleCreateDraft = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.property_type || !formData.starting_price) {
      toast.error("Please fill in all core fields to create a draft.");
      return;
    }

    setIsSaving(true);
    try {
      const created = await createProperty(formData);
      localStorage.removeItem('property_form_draft_new');
      toast.success("Draft created successfully!");
      navigate(`/admin/properties/${created.id}/edit`);
    } catch (err) {
      toast.error(err.message || 'Error creating property draft');
      setIsSaving(false);
    }
  };

  const propertyTypes = ['Luxury Apartment', 'Modern Villa', 'Row House', 'Investment Plot'];

  useDocumentTitle('New Property');

  return (
    <div className="p-8 max-w-2xl mx-auto font-body-md min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full mb-4">
          <Link to="/admin/properties" className="hover:text-primary transition-colors flex items-center gap-1">
            Properties
          </Link>
          <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
          <span className="text-slate-900 font-extrabold">New Property</span>
        </div>
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 bg-primary text-gold rounded-2xl flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-3xl">real_estate_agent</span>
          </div>
        </div>
        <h1 className="font-headline-md font-bold text-3xl text-slate-900 mb-2">Create New Property</h1>
        <p className="text-sm text-slate-600 font-medium">Let's start with the basics. You'll add full details in the next step.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <form onSubmit={handleCreateDraft} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. L&T Realty Elara Celestia"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.property_type}
                onChange={(e) => handleChange('property_type', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Starting Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="text"
                  required
                  value={formData.starting_price}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val && !val.startsWith('₹')) val = '₹' + val;
                    handleChange('starting_price', val);
                  }}
                  placeholder="3.32 Cr*"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 max-w-xs">
              A hidden draft will be created immediately.
            </p>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-[#C5A059] hover:bg-[#D8B56F] hover:scale-95 text-black font-extrabold text-sm rounded-lg shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center gap-2 group cursor-pointer border-none"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-black font-extrabold">Creating...</span>
                </>
              ) : (
                <>
                  <span className="text-black font-extrabold">Create Draft & Continue</span>
                  <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-1 transition-transform font-bold">arrow_forward</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
