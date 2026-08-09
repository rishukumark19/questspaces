import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProperty, updateProperty, publishProperty, generateSlug } from '../../lib/properties';
import BasicInfoSection from '../components/PropertyForm/BasicInfoSection';
import LocationSection from '../components/PropertyForm/LocationSection';
import DetailsSection from '../components/PropertyForm/DetailsSection';
import AmenitiesSection from '../components/PropertyForm/AmenitiesSection';
import MediaSection from '../components/PropertyForm/MediaSection';
import PublishSection from '../components/PropertyForm/PublishSection';

export default function AdminPropertyNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [propertyId, setPropertyId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    developer: '',
    property_type: 'Luxury Apartment',
    status: 'New Launch',
    publish_state: 'draft',
    featured: false,
    description: '',
    long_description: '',
    configurations: '',
    bhk_options: ['3 BHK'],
    highlights: [],
    badges: [],
    starting_price: '',
    price_value: 0,
    price_per_sqft: '',
    land_parcel: '',
    total_units: 0,
    possession: '',
    tower_height: '',
    rera_id: '',
    micromarket: '',
    micromarket_label: '',
    location: '',
    full_address: '',
    cover_image_url: null,
    pricing_matrix: [],
    amenities: [],
    proximity: [],
  });

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
      if (propertyId) {
        await updateProperty(propertyId, { ...formData, publish_state: 'draft' });
        alert('Draft saved successfully!');
      } else {
        const created = await createProperty(formData);
        setPropertyId(created.id);
        alert('Property created as draft! You can now upload media.');
      }
    } catch (err) {
      alert(err.message || 'Error saving property draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let targetId = propertyId;
      if (!targetId) {
        const created = await createProperty(formData);
        targetId = created.id;
        setPropertyId(targetId);
      }
      await publishProperty(targetId, formData);
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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/properties" className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Properties
          </Link>
          <h1 className="font-headline-md font-bold text-3xl text-primary">Add New Property</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
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
            propertyId={propertyId}
            coverImageUrl={formData.cover_image_url}
            onCoverChange={() => {}}
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
