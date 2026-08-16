import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPropertyById, updateProperty, publishProperty, unpublishProperty, generateSlug, validateForPublish } from '../../lib/properties';
import Step1_BasicDetails from '../components/PropertyForm/Step1_BasicDetails';
import Step2_UnitsAndPricing from '../components/PropertyForm/Step2_UnitsAndPricing';
import Step3_AmenitiesSection from '../components/PropertyForm/Step3_AmenitiesSection';
import Step5_AdvancedFeatures from '../components/PropertyForm/Step5_AdvancedFeatures';
import MediaSection from '../components/PropertyForm/MediaSection';
import PublishSection from '../components/PropertyForm/PublishSection';
import CompletionTracker from '../components/CompletionTracker';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from '../components/ConfirmDialog';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('step1');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [lastSavedData, setLastSavedData] = useState(null);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showPublishSettings, setShowPublishSettings] = useState(false);
  const toast = useToast();

  useDocumentTitle(formData?.title ? `Edit ${formData.title}` : 'Edit Property');

  // Modals for publish toggling
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const data = await getPropertyById(id);
      if (!data) throw new Error('No data found');
      setFormData(data);
      setLastSavedData(JSON.stringify(data));
      setLastSavedTime(new Date());
    } catch (err) {
      console.error('Failed to load property details:', err);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isDirty = lastSavedData && JSON.stringify(formData) !== lastSavedData;
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, lastSavedData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        updated.slug = generateSlug(value);
      }

      if (['title', 'property_type', 'location'].includes(field)) {
        if (!prev.seo_title) {
          const titlePart = updated.title || '';
          const typePart = updated.property_type || '';
          const locationPart = updated.location ? `in ${updated.location}` : '';
          updated.seo_title = [titlePart, typePart, locationPart].filter(Boolean).join(' | ');
        }
      }

      return updated;
    });
  };

  const handleSave = async (showToast = true, isAutoSave = false) => {
    if (isSaving || !formData) return;
    setIsSaving(true);
    try {
      await updateProperty(id, formData);
      if (showToast) toast.success('Property saved successfully!');
      
      setLastSavedData(JSON.stringify(formData));
      setLastSavedTime(new Date());
    } catch (err) {
      if (showToast) toast.error(err.message || 'Error saving property');
    } finally {
      setIsSaving(false);
    }
  };

  // 4.1 Auto-Save (60 seconds)
  useEffect(() => {
    if (isSaving || !formData?.title || !lastSavedData) return;
    const hasUnsavedChanges = lastSavedData !== JSON.stringify(formData);
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave(false, true); // silent auto-save
      toast.info('Auto-saved changes', { duration: 2000 });
    }, 60000);
    return () => clearTimeout(timer);
  }, [formData, lastSavedData, isSaving]);

  // 4.2 Keyboard Shortcut (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, lastSavedData]);

  const executePublish = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await publishProperty(id, formData);
      toast.success('Property is now live on the website!');
      await fetchProperty();
      setPublishModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error publishing property');
    } finally {
      setIsSaving(false);
    }
  };

  const executeUnpublish = async () => {
    setIsSaving(true);
    try {
      await unpublishProperty(id);
      toast.success('Property hidden and moved to drafts.');
      await fetchProperty();
      setUnpublishModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error unpublishing property');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'step1', label: '1. Basic Details', icon: 'info' },
    { id: 'step2', label: '2. Units & Pricing', icon: 'architecture' },
    { id: 'step3', label: '3. Amenities & Extras', icon: 'pool' },
    { id: 'step4', label: '4. Photos & Media', icon: 'image' },
    { id: 'step5', label: '5. Extra Details', icon: 'bolt' },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm text-slate-500 font-medium">Loading property data...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-12 text-center min-h-[50vh] flex flex-col items-center justify-center font-body-md">
        <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">error</span>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Property Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">Could not load details for ID/slug: <code className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">{id}</code></p>
        <Link to="/admin/properties" className="bg-primary text-gold px-6 py-2.5 rounded-xl font-bold text-sm shadow hover:scale-95 transition-transform flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Return to Properties
        </Link>
      </div>
    );
  }

  const validation = validateForPublish(formData);
  const hasUnsavedChanges = lastSavedData !== JSON.stringify(formData);
  const isPublished = formData.publish_state === 'published';

  return (
    <div className="p-8 max-w-7xl mx-auto font-body-md">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Link to="/admin/properties" className="hover:text-primary flex items-center gap-1">
              Properties
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-800">Edit Property</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-md font-bold text-3xl text-primary">Edit Property</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
              {isPublished ? 'Live' : 'Draft'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{formData.title} ({formData.slug})</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">warning</span> Unsaved changes
            </span>
          )}
          {lastSavedTime && !hasUnsavedChanges && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-1.5 hidden sm:flex">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Saved {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          
          {/* Advanced Settings Button */}
          <button
            type="button"
            onClick={() => setShowPublishSettings(true)}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span> Advanced Settings
          </button>

          {isPublished && (
            <Link
              to={`/property/${formData.slug || id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              title="View live property page"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span> View Live
            </Link>
          )}

          <Link
            to={`/admin/properties/${id}/preview`}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span> Preview
          </Link>
          
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-8 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {showPublishSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 sm:p-6 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Advanced Settings & SEO</h3>
                <p className="text-xs text-slate-500">Configure how this property appears on search engines.</p>
              </div>
              <button 
                onClick={() => setShowPublishSettings(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <PublishSection
                formData={formData}
                onChange={handleChange}
                isSaving={isSaving}
              />
            </div>
            
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex justify-end rounded-b-2xl">
              <button 
                onClick={() => { handleSave(true); setShowPublishSettings(false); }}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-black transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Tabs Header - Dropdown on mobile, horizontal scroll on desktop */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-outline-variant/30 mb-6 block sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-white px-4 py-2 text-sm font-bold text-slate-700 outline-none"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-2 shadow-sm border border-outline-variant/30 mb-6 hidden sm:flex overflow-x-auto gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-bold text-xs whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/30 min-h-[500px]">
            {activeTab === 'step1' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Step1_BasicDetails
                  formData={formData}
                  onChange={handleChange}
                  onHighlightsChange={(h) => handleChange('highlights', h)}
                  onBadgesChange={(b) => handleChange('badges', b)}
                  missingFields={validation.missing || []}
                />
              </div>
            )}

            {activeTab === 'step2' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Step2_UnitsAndPricing
                  formData={formData}
                  onChange={handleChange}
                  onBhkOptionsChange={(bhk) => handleChange('bhk_options', bhk)}
                  missingFields={validation.missing || []}
                />
              </div>
            )}

            {activeTab === 'step3' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Step3_AmenitiesSection formData={formData} onChange={handleChange} />
              </div>
            )}

            {activeTab === 'step4' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <MediaSection
                  propertyId={id}
                  coverImageUrl={formData.cover_image_url}
                  onCoverChange={fetchProperty}
                  formData={formData}
                  onFieldChange={handleChange}
                />
              </div>
            )}

            {activeTab === 'step5' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Step5_AdvancedFeatures formData={formData} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* New Publish Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            {isPublished && <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>}
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">public</span> Visibility & Status
            </h3>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <span className={`text-sm font-bold ${!isPublished ? 'text-slate-900' : 'text-slate-400'}`}>Draft</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (!validation.valid) {
                        toast.error('Cannot publish: Property is missing required fields.');
                        return;
                      }
                      setPublishModalOpen(true);
                    } else {
                      setUnpublishModalOpen(true);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <span className={`text-sm font-bold ${isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>Live</span>
            </div>
            
            <button
              type="button"
              onClick={() => setShowPublishSettings(true)}
              className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span> Advanced SEO Settings
            </button>
          </div>

          <CompletionTracker formData={formData} />
          
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-sm">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">lightbulb</span> 
              {activeTab === 'step1' && 'Basic Info Tips'}
              {activeTab === 'step2' && 'Pricing Tips'}
              {activeTab === 'step3' && 'Amenities Tips'}
              {activeTab === 'step4' && 'Media Tips'}
            </h4>
            <ul className="space-y-2 text-slate-600 text-xs">
              {activeTab === 'step1' && (
                <>
                  <li>• Keep titles under 60 characters for SEO.</li>
                  <li>• Use highly recognizable location names.</li>
                  <li>• Use an exact Google Maps link to plot precisely.</li>
                </>
              )}
              {activeTab === 'step2' && (
                <>
                  <li>• Always include a realistic starting price.</li>
                  <li>• Add multiple BHK configurations if available.</li>
                  <li>• Buyers search heavily by configuration size.</li>
                </>
              )}
              {activeTab === 'step3' && (
                <>
                  <li>• Highlight the top 5 premium amenities.</li>
                  <li>• Mention unique USPs (e.g., Infinity Pool).</li>
                </>
              )}
              {activeTab === 'step4' && (
                <>
                  <li>• Use bright, high-resolution cover photos.</li>
                  <li>• Horizontal landscape images convert best.</li>
                  <li>• Add a YouTube walkthrough for 30% more leads.</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-500 space-y-3">
             <div className="flex justify-between items-center pb-2 border-b border-slate-100">
               <span className="font-semibold text-slate-600">Created:</span>
               <span>{new Date(formData.created_at).toLocaleDateString()}</span>
             </div>
             <div className="flex justify-between items-center pb-2 border-b border-slate-100">
               <span className="font-semibold text-slate-600">Last Updated:</span>
               <span>{new Date(formData.updated_at).toLocaleDateString()}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="font-semibold text-slate-600">Leads Generated:</span>
               <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">{formData.leads_count || 0}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs for Publishing */}
      <ConfirmDialog
        isOpen={publishModalOpen}
        title="Go Live on Website"
        message={`Are you sure you want to publish "${formData.title}"? It will be visible to all visitors immediately.`}
        confirmText="Yes, Publish Now"
        isDangerous={false}
        isLoading={isSaving}
        onConfirm={executePublish}
        onClose={() => setPublishModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={unpublishModalOpen}
        title="Hide from Website"
        message={`Are you sure you want to unpublish "${formData.title}"? It will be hidden from visitors and moved back to drafts.`}
        confirmText="Hide Property"
        isDangerous={true}
        isLoading={isSaving}
        onConfirm={executeUnpublish}
        onClose={() => setUnpublishModalOpen(false)}
      />
    </div>
  );
}
