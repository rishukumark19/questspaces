import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPropertyById, updateProperty, publishProperty, generateSlug } from '../../lib/properties';
import BasicInfoSection from '../components/PropertyForm/BasicInfoSection';
import LocationSection from '../components/PropertyForm/LocationSection';
import DetailsSection from '../components/PropertyForm/DetailsSection';
import AmenitiesSection from '../components/PropertyForm/AmenitiesSection';
import MediaSection from '../components/PropertyForm/MediaSection';
import PublishSection from '../components/PropertyForm/PublishSection';

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const data = await getPropertyById(id);
      setFormData(data);
    } catch (err) {
      alert('Failed to load property details');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await updateProperty(id, formData);
      alert('Property updated successfully!');
      fetchProperty();
    } catch (err) {
      alert(err.message || 'Error updating property');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await publishProperty(id, formData);
      alert('Property published successfully!');
      navigate('/admin/properties');
    } catch (err) {
      alert(err.message || 'Error publishing property');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'info' },
    { id: 'location', label: 'Location', icon: 'location_on' },
    { id: 'details', label: 'Specs & Price', icon: 'sell' },
    { id: 'amenities', label: 'Amenities & Matrix', icon: 'pool' },
    { id: 'media', label: 'Photos & Media', icon: 'image' },
    { id: 'publish', label: 'Publishing', icon: 'publish' },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm text-slate-500 font-medium">Loading property data...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/properties" className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Properties
          </Link>
          <h1 className="font-headline-md font-bold text-3xl text-primary">Edit Property</h1>
          <p className="text-xs text-slate-500 mt-0.5">{formData.title} ({formData.slug})</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/properties/${id}/preview`}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span> Preview
          </Link>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-2 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-outline-variant/30 mb-6 flex overflow-x-auto gap-1">
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
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/30">
        {activeTab === 'basic' && (
          <BasicInfoSection
            formData={formData}
            onChange={handleChange}
            onHighlightsChange={(h) => handleChange('highlights', h)}
            onBadgesChange={(b) => handleChange('badges', b)}
          />
        )}

        {activeTab === 'location' && (
          <LocationSection formData={formData} onChange={handleChange} />
        )}

        {activeTab === 'details' && (
          <DetailsSection
            formData={formData}
            onChange={handleChange}
            onBhkOptionsChange={(bhk) => handleChange('bhk_options', bhk)}
          />
        )}

        {activeTab === 'amenities' && (
          <AmenitiesSection formData={formData} onChange={handleChange} />
        )}

        {activeTab === 'media' && (
          <MediaSection
            propertyId={id}
            coverImageUrl={formData.cover_image_url}
            onCoverChange={fetchProperty}
          />
        )}

        {activeTab === 'publish' && (
          <PublishSection
            formData={formData}
            onChange={handleChange}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
